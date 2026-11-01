from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.db.repository import db_store, compute_expiry_metrics, get_kolkata_today

router = APIRouter()

class ClearancePromoRequest(BaseModel):
    batch_id: str
    discount_percentage: float
    promotion_label: Optional[str] = "Flash Expiry Clearance"

@router.get("/batches")
async def get_expiry_batches(
    status: Optional[str] = Query(None, description="Filter by status: Normal, Upcoming, Warning, Critical, Urgent, Expired"),
    sellable_only: Optional[bool] = Query(False, description="Filter sellable only batches")
):
    """
    Returns batches with Asia/Kolkata real-time days remaining and strict classification.
    """
    batches = db_store.get_batches_with_status()

    if status:
        batches = [b for b in batches if b["expiry_status"].lower() == status.lower()]

    if sellable_only:
        batches = [b for b in batches if b["is_sellable"]]

    # Sort so most urgent/critical/expired items appear at top
    severity_order = {"Expired": 0, "Urgent": 1, "Critical": 2, "Warning": 3, "Upcoming": 4, "Normal": 5}
    batches.sort(key=lambda x: (severity_order.get(x["expiry_status"], 9), x["days_remaining"]))

    today = get_kolkata_today()

    return {
        "as_of_date_ist": str(today),
        "total": len(batches),
        "batches": batches
    }

@router.get("/alerts")
async def get_expiry_alerts():
    """
    Returns urgent alerts for inventory in Warning (<=30d), Critical (<=15d), Urgent (<=7d), and Expired (<=0d).
    """
    all_batches = db_store.get_batches_with_status()
    alerts = []

    for b in all_batches:
        st = b["expiry_status"]
        if st in ["Expired", "Urgent", "Critical", "Warning"]:
            alerts.append({
                "batch_id": b["id"],
                "batch_number": b["batch_number"],
                "product_id": b["product_id"],
                "product_name": b["product_name"],
                "product_sku": b["product_sku"],
                "quantity_available": b["quantity_available"],
                "expiry_date": b["expiry_date"],
                "days_remaining": b["days_remaining"],
                "status": st,
                "is_blocked_from_sales": not b["is_sellable"],
                "recommended_action": (
                    "QUARANTINED - Do not sell. Discard batch." if st == "Expired"
                    else "Urgent 50% clearance flash sale" if st == "Urgent"
                    else "Apply 30% promotional discount" if st == "Critical"
                    else "Monitor sales velocity & feature in storefront"
                )
            })

    return {
        "active_alerts_count": len(alerts),
        "alerts": alerts
    }

@router.get("/summary")
async def get_expiry_summary():
    batches = db_store.get_batches_with_status()
    counts = {
        "Normal": 0,
        "Upcoming": 0,
        "Warning": 0,
        "Critical": 0,
        "Urgent": 0,
        "Expired": 0
    }
    quarantined_units = 0

    for b in batches:
        st = b["expiry_status"]
        if st in counts:
            counts[st] += 1
        if st == "Expired":
            quarantined_units += b["quantity_available"]

    return {
        "status_distribution": counts,
        "total_batches_tracked": len(batches),
        "quarantined_expired_units": quarantined_units,
        "business_timezone": "Asia/Kolkata",
        "current_business_date": str(get_kolkata_today())
    }

@router.post("/clearance")
async def apply_clearance(promo: ClearancePromoRequest):
    batch = next((b for b in db_store.inventory_batches if b["id"] == promo.batch_id), None)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    exp_date = datetime.strptime(batch["expiry_date"], "%Y-%m-%d").date()
    metrics = compute_expiry_metrics(exp_date)

    if not metrics["is_sellable"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot apply clearance to an Expired batch. Expired items are strictly blocked from sale."
        )

    # Attach promotional tag to batch
    batch["clearance_discount"] = promo.discount_percentage
    batch["promotion_label"] = promo.promotion_label

    return {
        "success": True,
        "batch_id": batch["id"],
        "discount_applied": f"{promo.discount_percentage}%",
        "label": promo.promotion_label
    }
