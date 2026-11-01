from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import uuid
from app.db.repository import db_store

router = APIRouter()

class NotificationCreate(BaseModel):
    type: str # low_stock, expiry_warning, expired_blocked, pos_sale
    title: str
    message: str
    severity: str = "warning" # info, warning, critical

@router.get("")
async def list_notifications():
    unread_count = sum(1 for n in db_store.notifications if not n.get("is_read", False))
    return {
        "unread_count": unread_count,
        "total": len(db_store.notifications),
        "notifications": db_store.notifications
    }

@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    notif = next((n for n in db_store.notifications if n["id"] == notification_id), None)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")

    notif["is_read"] = True
    return {"success": True, "notification": notif}

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_notification(notif_in: NotificationCreate):
    new_notif = {
        "id": f"notif-{uuid.uuid4().hex[:6]}",
        "type": notif_in.type,
        "title": notif_in.title,
        "message": notif_in.message,
        "severity": notif_in.severity,
        "is_read": False,
        "created_at": "Just now"
    }
    db_store.notifications.insert(0, new_notif)
    return new_notif
