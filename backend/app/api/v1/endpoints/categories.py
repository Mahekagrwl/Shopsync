from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import uuid
from app.db.repository import db_store

router = APIRouter()

class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    image_url: Optional[str] = None

@router.get("")
async def list_categories():
    return {
        "total": len(db_store.categories),
        "categories": db_store.categories
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_category(cat_in: CategoryCreate):
    if any(c["slug"].lower() == cat_in.slug.lower() for c in db_store.categories):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{cat_in.slug}' already exists."
        )

    new_cat = {
        "id": f"cat-{cat_in.slug.lower()}",
        "name": cat_in.name,
        "slug": cat_in.slug.lower(),
        "description": cat_in.description or "",
        "parent_id": cat_in.parent_id
    }
    db_store.categories.append(new_cat)
    return new_cat
