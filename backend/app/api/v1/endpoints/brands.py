from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import uuid
from app.db.repository import db_store

router = APIRouter()

class BrandCreate(BaseModel):
    name: str
    origin: Optional[str] = "Paris, France"
    badge: Optional[str] = "Luxury"
    description: Optional[str] = None
    logo_url: Optional[str] = None

@router.get("")
async def list_brands():
    return {
        "total": len(db_store.brands),
        "brands": db_store.brands
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_brand(brand_in: BrandCreate):
    if any(b["name"].lower() == brand_in.name.lower() for b in db_store.brands):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Brand '{brand_in.name}' already exists."
        )

    new_brand = {
        "id": f"brand-{uuid.uuid4().hex[:6]}",
        "name": brand_in.name,
        "origin": brand_in.origin,
        "badge": brand_in.badge,
        "description": brand_in.description or ""
    }
    db_store.brands.append(new_brand)
    return new_brand
