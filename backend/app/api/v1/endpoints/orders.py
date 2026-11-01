from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.db.repository import db_store

router = APIRouter()

class OrderItemInput(BaseModel):
    product_id: str
    product_name: str
    shade_id: Optional[str] = None
    shade_name: Optional[str] = None
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)

class OrderCreateRequest(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    shipping_city: Optional[str] = "San Francisco"
    shipping_state: Optional[str] = "CA"
    shipping_zip: Optional[str] = "94107"
    payment_method: str = "Credit Card (Test Mode)" # or "Cash on Delivery (COD)"
    items: List[OrderItemInput]
    discount_amount: float = 0.0
    shipping_amount: float = 0.0

class OrderStatusUpdate(BaseModel):
    status: str # Processing, Shipped, In Transit, Delivered, Cancelled
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None

@router.get("")
async def list_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    customer_email: Optional[str] = Query(None, description="Filter by customer email"),
    limit: int = 50
):
    orders = list(db_store.orders)
    if status:
        orders = [o for o in orders if o.get("status", "").lower() == status.lower()]
    if customer_email:
        orders = [o for o in orders if o.get("customer_email", "").lower() == customer_email.lower()]

    return {
        "total": len(orders),
        "orders": orders[:limit]
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_online_order(order_in: OrderCreateRequest):
    """
    Creates an online storefront order:
    1. Validates available non-expired inventory across unified batch store.
    2. Atomically allocates batches via FEFO (blocking expired batches).
    3. Calculates taxes and total.
    4. Generates tracking number and order confirmation.
    """
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot create an empty order.")

    allocated_records = []
    subtotal = 0.0

    # Unified inventory deduction
    for item in order_in.items:
        prod = next((p for p in db_store.products if p["id"] == item.product_id), None)
        if not prod:
            raise HTTPException(status_code=404, detail=f"Product '{item.product_id}' not found.")

        # Require shade selection for makeup products with shades
        if prod.get("shades") and len(prod["shades"]) > 0 and not item.shade_id:
            raise HTTPException(
                status_code=400,
                detail=f"Please select a shade for '{prod['name']}'."
            )

        # Attempt FEFO allocation
        deduct_res = db_store.deduct_inventory(
            product_id=item.product_id,
            quantity=item.quantity,
            shade_id=item.shade_id
        )

        if not deduct_res["success"]:
            raise HTTPException(
                status_code=400,
                detail=f"Stock unavailable for '{prod['name']}': {deduct_res['error']}"
            )

        allocated_records.append({
            "product_id": item.product_id,
            "allocated_batches": deduct_res["allocated_batches"]
        })
        subtotal += item.unit_price * item.quantity

    tax_amount = round((subtotal - order_in.discount_amount) * 0.0825, 2)
    total_amount = round(subtotal - order_in.discount_amount + tax_amount + order_in.shipping_amount, 2)

    order_number = f"SS-{uuid.uuid4().hex[:6].upper()}"
    tracking_number = f"TRK-{uuid.uuid4().hex[:8].upper()}-EXP"

    new_order = {
        "id": f"ord-{uuid.uuid4().hex[:8]}",
        "order_number": order_number,
        "channel": "online_storefront",
        "customer_id": order_in.customer_id,
        "customer_name": order_in.customer_name,
        "customer_email": order_in.customer_email,
        "customer_phone": order_in.customer_phone,
        "status": "Processing",
        "payment_status": "completed" if "COD" not in order_in.payment_method else "pending_delivery",
        "payment_method": order_in.payment_method,
        "subtotal": round(subtotal, 2),
        "discount_amount": round(order_in.discount_amount, 2),
        "tax_amount": tax_amount,
        "shipping_amount": round(order_in.shipping_amount, 2),
        "total_amount": total_amount,
        "shipping_address": f"{order_in.shipping_address}, {order_in.shipping_city}, {order_in.shipping_state} {order_in.shipping_zip}",
        "tracking_number": tracking_number,
        "carrier": "FedEx Luxury Express",
        "created_at": datetime.now().isoformat(),
        "items": [
            {
                "product_id": it.product_id,
                "name": it.product_name,
                "shade_id": it.shade_id,
                "shade_name": it.shade_name,
                "quantity": it.quantity,
                "price": it.unit_price
            }
            for it in order_in.items
        ],
        "batch_allocations": allocated_records
    }

    db_store.orders.insert(0, new_order)

    return {
        "success": True,
        "order": new_order
    }

@router.get("/track/{order_number}")
async def track_order(order_number: str):
    ord_match = next(
        (o for o in db_store.orders if o["order_number"].upper() == order_number.upper() or o.get("tracking_number", "").upper() == order_number.upper()),
        None
    )
    if not ord_match:
        raise HTTPException(status_code=404, detail="Order or tracking number not found.")

    return {
        "order_number": ord_match["order_number"],
        "status": ord_match["status"],
        "carrier": ord_match.get("carrier", "FedEx Luxury Express"),
        "tracking_number": ord_match.get("tracking_number"),
        "destination": ord_match.get("shipping_address"),
        "created_at": ord_match.get("created_at"),
        "estimated_delivery": "Within 2-3 business days",
        "items": ord_match.get("items", [])
    }

@router.get("/{order_id}")
async def get_order_by_id(order_id: str):
    ord_match = next((o for o in db_store.orders if o["id"] == order_id or o["order_number"] == order_id), None)
    if not ord_match:
        raise HTTPException(status_code=404, detail="Order not found.")
    return ord_match

@router.patch("/{order_id}/status")
async def update_order_status(order_id: str, status_in: OrderStatusUpdate):
    ord_match = next((o for o in db_store.orders if o["id"] == order_id), None)
    if not ord_match:
        raise HTTPException(status_code=404, detail="Order not found.")

    ord_match["status"] = status_in.status
    if status_in.tracking_number:
        ord_match["tracking_number"] = status_in.tracking_number
    if status_in.carrier:
        ord_match["carrier"] = status_in.carrier

    return {
        "success": True,
        "order": ord_match
    }
