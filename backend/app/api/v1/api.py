from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    products,
    categories,
    brands,
    inventory,
    expiry,
    pos,
    orders,
    skinsafe,
    ai,
    reviews,
    feedback,
    analytics,
    notifications
)

api_router = APIRouter()

# Register modular routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(brands.router, prefix="/brands", tags=["brands"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(expiry.router, prefix="/expiry", tags=["expiry"])
api_router.include_router(pos.router, prefix="/pos", tags=["pos"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(skinsafe.router, prefix="/skinsafe", tags=["skinsafe"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

@api_router.get("/status", tags=["system"])
async def api_status():
    return {
        "status": "online",
        "api_version": "v1",
        "service": "ShopSync Core API",
        "endpoints_loaded": [
            "/auth", "/products", "/categories", "/brands",
            "/inventory", "/expiry", "/pos", "/orders",
            "/skinsafe", "/ai", "/reviews", "/feedback",
            "/analytics", "/notifications"
        ]
    }
