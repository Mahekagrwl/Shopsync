from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid
from app.db.repository import db_store, compute_expiry_metrics, get_kolkata_today

router = APIRouter()

class BatchCreate(BaseModel):
    product_id: str
    shade_id: Optional[str] = None
    batch_number: str
    mfg_date: str
    expiry_date: str # YYYY-MM-DD
    quantity: int = Field(gt=0)
    unit_cost: float = Field(ge=0)
    lab_certification: Optional[str] = "Standard Batch Release"

class StockAdjustment(BaseModel):
    batch_id: str
    adjustment_type: str # restock, damage_write_off, audit_correction, transfer
    quantity_delta: int # positive to add, negative to reduce
    notes: Optional[str] = None

@router.get("")
async def get_inventory_summary():
    """
    Returns inventory items with aggregate stock, batch details, and low stock warnings.
    """
    batches_with_status = db_store.get_batches_with_status()
    summary = []

    for p in db_store.products:
        p_batches = [b for b in batches_with_status if b["product_id"] == p["id"]]
        sellable_qty = sum(b["quantity_available"] for b in p_batches if b["is_sellable"])
        expired_qty = sum(b["quantity_available"] for b in p_batches if not b["is_sellable"])

        summary.append({
            "product_id": p["id"],
            "product_name": p["name"],
            "sku": p["sku"],
            "brand": p["brand"],
            "category": p["category"],
            "price": p["price"],
            "total_sellable_stock": sellable_qty,
            "expired_quarantined_stock": expired_qty,
            "is_low_stock": sellable_qty < 30,
            "batches_count": len(p_batches),
            "batches": p_batches
        })

    return {
        "total_products": len(summary),
        "inventory": summary
    }

@router.post("/batches", status_code=status.HTTP_201_CREATED)
async def create_batch(batch_in: BatchCreate):
    # Check if product exists
    prod = next((p for p in db_store.products if p["id"] == batch_in.product_id), None)
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target product not found.")

    # Validate expiry date format
    try:
        exp_date = datetime.strptime(batch_in.expiry_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expiry date must be in YYYY-MM-DD format."
        )

    # Calculate status using Asia/Kolkata
    metrics = compute_expiry_metrics(exp_date)

    batch_id = f"batch-{uuid.uuid4().hex[:6]}"
    new_batch = {
        "id": batch_id,
        "product_id": batch_in.product_id,
        "shade_id": batch_in.shade_id,
        "batch_number": batch_in.batch_number.upper(),
        "mfg_date": batch_in.mfg_date,
        "expiry_date": batch_in.expiry_date,
        "quantity_received": batch_in.quantity,
        "quantity_available": batch_in.quantity,
        "unit_cost": batch_in.unit_cost,
        "lab_certification": batch_in.lab_certification
    }

    db_store.inventory_batches.append(new_batch)

    # Record initial restock movement
    db_store.stock_movements.append({
        "id": str(uuid.uuid4()),
        "batch_id": batch_id,
        "product_id": batch_in.product_id,
        "movement_type": "initial_intake",
        "quantity": batch_in.quantity,
        "remaining_quantity": batch_in.quantity,
        "notes": f"Batch {batch_in.batch_number} intake for {prod['name']}",
        "created_at": str(datetime.now())
    })

    return {
        **new_batch,
        "days_remaining": metrics["days_remaining"],
        "expiry_status": metrics["expiry_status"],
        "is_sellable": metrics["is_sellable"]
    }

@router.post("/adjust")
async def adjust_stock(adj: StockAdjustment):
    batch = next((b for b in db_store.inventory_batches if b["id"] == adj.batch_id), None)
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found.")

    new_qty = batch["quantity_available"] + adj.quantity_delta
    if new_qty < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adjustment would result in negative inventory ({new_qty}). Available: {batch['quantity_available']}"
        )

    batch["quantity_available"] = new_qty

    # Record audit log
    db_store.stock_movements.append({
        "id": str(uuid.uuid4()),
        "batch_id": batch["id"],
        "product_id": batch["product_id"],
        "movement_type": adj.adjustment_type,
        "quantity": adj.quantity_delta,
        "remaining_quantity": new_qty,
        "notes": adj.notes or f"Manual adjustment: {adj.adjustment_type}",
        "created_at": str(datetime.now())
    })

    return {
        "success": True,
        "batch_id": batch["id"],
        "new_quantity": new_qty,
        "movement_type": adj.adjustment_type
    }

@router.get("/movements")
async def list_stock_movements(limit: int = 50):
    sorted_movs = sorted(db_store.stock_movements, key=lambda x: x.get("created_at", ""), reverse=True)
    return {
        "total": len(sorted_movs),
        "movements": sorted_movs[:limit]
    }
