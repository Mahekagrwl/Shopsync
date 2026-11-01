from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from app.db.repository import db_store

router = APIRouter()

class ReviewCreate(BaseModel):
    product_id: str
    author_name: str
    rating: int = Field(ge=1, le=5)
    review_text: str
    shade_name: Optional[str] = None
    is_verified_purchase: bool = True

@router.get("")
async def list_reviews(product_id: Optional[str] = Query(None)):
    reviews = db_store.reviews
    if product_id:
        reviews = [r for r in reviews if r.get("product_id") == product_id]

    return {
        "total": len(reviews),
        "reviews": reviews
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_review(rev_in: ReviewCreate):
    prod = next((p for p in db_store.products if p["id"] == rev_in.product_id), None)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found.")

    new_rev = {
        "id": f"rev-{uuid.uuid4().hex[:6]}",
        "product_id": rev_in.product_id,
        "product_name": prod["name"],
        "author_name": rev_in.author_name,
        "rating": rev_in.rating,
        "shade_name": rev_in.shade_name,
        "review_text": rev_in.review_text,
        "is_verified_purchase": rev_in.is_verified_purchase,
        "created_at": datetime.now().strftime("%B %d, %Y")
    }

    db_store.reviews.insert(0, new_rev)

    # Recalculate product rating
    p_reviews = [r for r in db_store.reviews if r.get("product_id") == rev_in.product_id]
    if p_reviews:
        prod["rating"] = round(sum(r["rating"] for r in p_reviews) / len(p_reviews), 2)
        prod["reviews_count"] = len(p_reviews)

    return new_rev
