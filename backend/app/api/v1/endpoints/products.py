from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.db.repository import db_store, compute_expiry_metrics

router = APIRouter()

class ShadeItem(BaseModel):
    id: Optional[str] = None
    name: str
    code: str
    hex: str
    undertone: str = "neutral"
    finish: str = "natural"
    coverage: str = "medium"

class ProductCreateUpdate(BaseModel):
    name: str
    brand: str
    category: str
    subcategory: Optional[str] = None
    price: float
    compare_at_price: Optional[float] = None
    cost_price: Optional[float] = None
    sku: str
    barcode: Optional[str] = None
    description: str
    ingredients: str
    allergy_tags: Optional[List[str]] = []
    images: List[str] = []
    shades: Optional[List[ShadeItem]] = []
    is_active: bool = True
    is_best_seller: bool = False
    is_new_arrival: bool = False
    is_featured: bool = False

def get_product_stock_info(product_id: str) -> Dict[str, Any]:
    batches = db_store.inventory_batches
    sellable_stock = 0
    expired_stock = 0

    for b in batches:
        if b["product_id"] == product_id:
            exp_date = datetime.strptime(b["expiry_date"], "%Y-%m-%d").date()
            metrics = compute_expiry_metrics(exp_date)
            if metrics["is_sellable"]:
                sellable_stock += b["quantity_available"]
            else:
                expired_stock += b["quantity_available"]

    return {
        "stock": sellable_stock,
        "is_in_stock": sellable_stock > 0,
        "expired_quarantined": expired_stock
    }

@router.get("")
async def list_products(
    category: Optional[str] = Query(None, description="Category slug"),
    subcategory: Optional[str] = Query(None, description="Subcategory slug"),
    brand: Optional[str] = Query(None, description="Brand name"),
    search: Optional[str] = Query(None, description="Search keyword in name or description"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    sort: Optional[str] = Query(None, description="Sorting parameter: price_asc, price_desc, rating, newest")
):
    items = list(db_store.products)

    # 1. Filter by category
    if category:
        items = [p for p in items if p.get("category", "").lower() == category.lower()]

    # 2. Filter by subcategory
    if subcategory:
        items = [p for p in items if p.get("subcategory", "").lower() == subcategory.lower()]

    # 3. Filter by brand
    if brand:
        items = [p for p in items if p.get("brand", "").lower() == brand.lower()]

    # 4. Search query
    if search:
        s = search.lower()
        items = [
            p for p in items
            if s in p.get("name", "").lower()
            or s in p.get("description", "").lower()
            or s in p.get("sku", "").lower()
            or s in p.get("brand", "").lower()
        ]

    # 5. Price filter
    if min_price is not None:
        items = [p for p in items if p.get("price", 0) >= min_price]
    if max_price is not None:
        items = [p for p in items if p.get("price", 0) <= max_price]

    # 6. Sorting
    if sort == "price_asc":
        items.sort(key=lambda x: x.get("price", 0))
    elif sort == "price_desc":
        items.sort(key=lambda x: x.get("price", 0), reverse=True)
    elif sort == "rating":
        items.sort(key=lambda x: x.get("rating", 0), reverse=True)
    elif sort == "newest":
        items.sort(key=lambda x: x.get("is_new_arrival", False), reverse=True)

    # Enrich each product with live stock availability
    enriched = []
    for p in items:
        stock_info = get_product_stock_info(p["id"])
        enriched.append({
            **p,
            **stock_info
        })

    return {
        "total": len(enriched),
        "products": enriched
    }

@router.get("/{product_id}")
async def get_product(product_id: str):
    p = next((prod for prod in db_store.products if prod["id"] == product_id or prod.get("sku") == product_id), None)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    stock_info = get_product_stock_info(p["id"])
    
    # Get active sellable batches for this product
    active_batches = [
        b for b in db_store.inventory_batches
        if b["product_id"] == p["id"]
    ]

    return {
        **p,
        **stock_info,
        "batch_count": len(active_batches)
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(product_in: ProductCreateUpdate):
    # Check duplicate SKU
    if any(p["sku"].lower() == product_in.sku.lower() for p in db_store.products):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A product with SKU '{product_in.sku}' already exists."
        )

    new_id = f"prod-{uuid.uuid4().hex[:6]}"
    
    # Process shades with IDs
    shades_data = []
    for idx, sh in enumerate(product_in.shades or []):
        shades_data.append({
            "id": sh.id or f"sh-{new_id}-{idx+1}",
            "name": sh.name,
            "code": sh.code,
            "hex": sh.hex,
            "undertone": sh.undertone,
            "finish": sh.finish,
            "coverage": sh.coverage
        })

    new_prod = {
        "id": new_id,
        "name": product_in.name,
        "brand": product_in.brand,
        "category": product_in.category,
        "subcategory": product_in.subcategory or product_in.category,
        "price": product_in.price,
        "compare_at_price": product_in.compare_at_price,
        "cost_price": product_in.cost_price or (product_in.price * 0.4),
        "sku": product_in.sku,
        "barcode": product_in.barcode or f"89012345{new_id[-4:]}",
        "rating": 5.0,
        "reviews_count": 0,
        "is_active": product_in.is_active,
        "is_best_seller": product_in.is_best_seller,
        "is_new_arrival": product_in.is_new_arrival,
        "is_featured": product_in.is_featured,
        "images": product_in.images if product_in.images else ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"],
        "description": product_in.description,
        "ingredients": product_in.ingredients,
        "allergy_tags": product_in.allergy_tags or [],
        "shades": shades_data
    }

    db_store.products.append(new_prod)
    return new_prod

@router.put("/{product_id}")
async def update_product(product_id: str, product_in: ProductCreateUpdate):
    p = next((prod for prod in db_store.products if prod["id"] == product_id), None)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    p["name"] = product_in.name
    p["brand"] = product_in.brand
    p["category"] = product_in.category
    p["subcategory"] = product_in.subcategory or product_in.category
    p["price"] = product_in.price
    p["compare_at_price"] = product_in.compare_at_price
    p["cost_price"] = product_in.cost_price or p.get("cost_price", 0)
    p["sku"] = product_in.sku
    p["barcode"] = product_in.barcode or p.get("barcode")
    p["description"] = product_in.description
    p["ingredients"] = product_in.ingredients
    p["allergy_tags"] = product_in.allergy_tags or []
    if product_in.images:
        p["images"] = product_in.images
    if product_in.shades is not None:
        p["shades"] = [s.model_dump() for s in product_in.shades]
    p["is_active"] = product_in.is_active
    p["is_best_seller"] = product_in.is_best_seller
    p["is_new_arrival"] = product_in.is_new_arrival
    p["is_featured"] = product_in.is_featured

    return p

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    p = next((prod for prod in db_store.products if prod["id"] == product_id), None)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    db_store.products = [prod for prod in db_store.products if prod["id"] != product_id]
    return {"success": True, "message": f"Product '{p['name']}' has been removed."}
