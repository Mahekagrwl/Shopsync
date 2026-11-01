from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from app.db.repository import db_store

router = APIRouter()

class FeedbackCreate(BaseModel):
    touchpoint: str = "Online Storefront" # POS, Online Storefront, SkinSafe Checker, Customer Support
    author: str
    email: str
    rating: int = Field(ge=1, le=5)
    subject: str
    message: str

@router.get("")
async def list_feedback():
    return {
        "total": len(db_store.feedback),
        "feedback": db_store.feedback
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_feedback(fb_in: FeedbackCreate):
    new_fb = {
        "id": f"fb-{uuid.uuid4().hex[:6]}",
        "touchpoint": fb_in.touchpoint,
        "author": fb_in.author,
        "email": fb_in.email,
        "rating": fb_in.rating,
        "subject": fb_in.subject,
        "message": fb_in.message,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    db_store.feedback.insert(0, new_fb)
    return {
        "success": True,
        "message": "Thank you for your feedback! Our client experience team has received it.",
        "feedback": new_fb
    }
