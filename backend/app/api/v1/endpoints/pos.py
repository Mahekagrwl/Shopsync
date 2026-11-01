from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.db.repository import db_store, compute_expiry_metrics

router = APIRouter()

class POSItem(BaseModel):
    product_id: str
    product_name: str
    shade_id: Optional[str] = None
    shade_name: Optional[str] = None
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)

class POSTransactionCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: Optional[str] = "Walk-in Guest"
    customer_phone: Optional[str] = None
    items: List[POSItem]
    discount_percentage: float = 0.0
    discount_amount: float = 0.0
    tax_rate: float = 0.0825 # 8.25% default tax
    tender_type: str = "Credit Card (Terminal)" # Cash, Credit Card, Apple Pay, Split
    cashier_name: Optional[str] = "Victoria Vance (Store Director)"
    terminal_id: Optional[str] = "POS-01-FLAGSHIP"
    notes: Optional[str] = None

@router.get("/lookup")
async def pos_lookup(query: str = Query(..., description="Barcode, SKU, or product name")):
    """
    Looks up sellable products for the POS barcode scanner or search input.
    Validates that product has non-expired batches available.
    """
    q = query.strip().lower()
    matches = []

    for p in db_store.products:
        barcode_match = p.get("barcode", "").lower() == q
        sku_match = p.get("sku", "").lower() == q
        name_match = q in p.get("name", "").lower()

        if barcode_match or sku_match or name_match:
            # Check non-expired batch stock
            batches = [b for b in db_store.inventory_batches if b["product_id"] == p["id"]]
            sellable_qty = 0
            for b in batches:
                exp_date = datetime.strptime(b["expiry_date"], "%Y-%m-%d").date()
                metrics = compute_expiry_metrics(exp_date)
                if metrics["is_sellable"]:
                    sellable_qty += b["quantity_available"]

            matches.append({
                **p,
                "available_sellable_stock": sellable_qty,
                "is_available": sellable_qty > 0
            })

    return {
        "query": query,
        "results_count": len(matches),
        "products": matches
    }

@router.post("/checkout", status_code=status.HTTP_201_CREATED)
async def pos_checkout(tx: POSTransactionCreate):
    """
    Processes POS transaction:
    1. Validates inventory and blocks expired items.
    2. Allocates inventory via FEFO (First Expiring, First Out).
    3. Calculates accurate subtotal, discounts, taxes, and grand total.
    4. Generates unique invoice number (e.g. INV-2026-XXXX).
    5. Records POS transaction and creates invoice record.
    """
    if not tx.items:
        raise HTTPException(status_code=400, detail="Transaction contains no items.")

    # 1. Pre-validation: ensure all items have enough sellable, non-expired stock
    stock_deductions = []
    subtotal = 0.0

    for item in tx.items:
        prod = next((p for p in db_store.products if p["id"] == item.product_id), None)
        if not prod:
            raise HTTPException(status_code=404, detail=f"Product with ID '{item.product_id}' not found.")

        # Require shade selection for makeup products with shades
        if prod.get("shades") and len(prod["shades"]) > 0 and not item.shade_id:
            raise HTTPException(
                status_code=400,
                detail=f"Please select a shade for makeup product '{prod['name']}' before billing."
            )

        # Attempt FEFO deduction check
        deduction_result = db_store.deduct_inventory(
            product_id=item.product_id,
            quantity=item.quantity,
            shade_id=item.shade_id
        )

        if not deduction_result["success"]:
            raise HTTPException(
                status_code=400,
                detail=f"Stock allocation failed for '{prod['name']}': {deduction_result['error']}"
            )

        stock_deductions.append({
            "product_id": item.product_id,
            "allocated_batches": deduction_result["allocated_batches"]
        })

        subtotal += item.unit_price * item.quantity

    # 2. Financial calculation
    discount_val = tx.discount_amount
    if tx.discount_percentage > 0:
        discount_val = max(discount_val, subtotal * (tx.discount_percentage / 100.0))

    taxable_amount = max(0.0, subtotal - discount_val)
    tax_amount = round(taxable_amount * tx.tax_rate, 2)
    grand_total = round(taxable_amount + tax_amount, 2)

    # 3. Generate unique invoice number
    invoice_number = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"

    # 4. Construct transaction record
    tx_record = {
        "id": f"pos-tx-{uuid.uuid4().hex[:8]}",
        "invoice_number": invoice_number,
        "terminal_id": tx.terminal_id,
        "cashier_name": tx.cashier_name,
        "customer_id": tx.customer_id,
        "customer_name": tx.customer_name or "Walk-in Guest",
        "customer_phone": tx.customer_phone,
        "subtotal": round(subtotal, 2),
        "discount_amount": round(discount_val, 2),
        "discount_percentage": tx.discount_percentage,
        "tax_amount": tax_amount,
        "total_amount": grand_total,
        "tender_type": tx.tender_type,
        "status": "completed",
        "created_at": datetime.now().isoformat(),
        "items": [
            {
                "product_id": it.product_id,
                "product_name": it.product_name,
                "shade_id": it.shade_id,
                "shade_name": it.shade_name,
                "quantity": it.quantity,
                "unit_price": it.unit_price,
                "total_price": round(it.unit_price * it.quantity, 2)
            }
            for it in tx.items
        ],
        "batch_allocations": stock_deductions
    }

    db_store.pos_transactions.insert(0, tx_record)

    # If customer exists, update loyalty points (1 point per dollar spent)
    if tx.customer_id:
        cust = next((c for c in db_store.customers if c["id"] == tx.customer_id), None)
        if cust:
            cust["loyalty_points"] = cust.get("loyalty_points", 0) + int(grand_total)
            cust["lifetime_spend"] = cust.get("lifetime_spend", 0.0) + grand_total

    return {
        "success": True,
        "message": "POS Transaction completed and inventory updated via FEFO.",
        "invoice": tx_record
    }

@router.get("/invoices")
async def list_pos_invoices(limit: int = 50):
    return {
        "total": len(db_store.pos_transactions),
        "invoices": db_store.pos_transactions[:limit]
    }

@router.get("/invoices/{invoice_number}")
async def get_pos_invoice(invoice_number: str):
    inv = next((t for t in db_store.pos_transactions if t["invoice_number"].upper() == invoice_number.upper()), None)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    return inv
