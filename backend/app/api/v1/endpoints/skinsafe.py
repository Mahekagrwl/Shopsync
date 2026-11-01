from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.db.repository import db_store

router = APIRouter()

COMMON_ALLERGENS = [
    {"name": "Synthetic Fragrance / Parfum", "category": "Sensitizer", "severity": "High", "description": "Common cause of contact dermatitis and skin flare-ups"},
    {"name": "Tree Nut Oils (Almond, Macadamia)", "category": "Food/Nut Allergen", "severity": "High", "description": "Risk for individuals with severe tree nut allergies"},
    {"name": "Parabens (Methyl/Propyl/Butyl)", "category": "Preservative", "severity": "Medium", "description": "Endocrine disruptor concern and contact allergy"},
    {"name": "Sulfates (SLS / SLES)", "category": "Surfactant", "severity": "Medium", "description": "Harsh detergent known to strip lipids and cause irritation"},
    {"name": "Essential Oils (Linalool, Limonene)", "category": "Botanical Allergen", "severity": "Medium", "description": "Oxidizes upon air exposure, leading to allergic contact dermatitis"},
    {"name": "Silicones (Dimethicone / Cyclopentasiloxane)", "category": "Occlusive Sensitivity", "severity": "Low", "description": "Can trap sebum or cause congestion for acne-prone skin"},
    {"name": "Chemical UV Filters (Oxybenzone, Avobenzone)", "category": "Sunscreen Filter", "severity": "Medium", "description": "Can trigger photo-allergic reactions in sensitive skin"}
]

class IngredientCheckRequest(BaseModel):
    product_id: Optional[str] = None
    custom_ingredient_text: Optional[str] = None
    user_allergies: List[str]

class UserAllergyUpdate(BaseModel):
    allergies: List[str]

@router.get("/allergens")
async def get_common_allergens():
    return {
        "common_allergens": COMMON_ALLERGENS
    }

@router.get("/ingredients")
async def list_inci_ingredients():
    return {
        "total": len(db_store.ingredients),
        "ingredients": db_store.ingredients
    }

@router.post("/check")
async def check_ingredients(req: IngredientCheckRequest):
    """
    Checks product or custom ingredient text against customer allergy list.
    Returns matched allergens, risk level (SAFE, WARNING, DANGER), and EWG score breakdowns.
    """
    ingredients_str = ""
    product_name = "Custom Formulation"

    if req.product_id:
        prod = next((p for p in db_store.products if p["id"] == req.product_id), None)
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found.")
        ingredients_str = prod.get("ingredients", "")
        product_name = prod.get("name", "")
    elif req.custom_ingredient_text:
        ingredients_str = req.custom_ingredient_text
    else:
        raise HTTPException(status_code=400, detail="Must provide either product_id or custom_ingredient_text.")

    # Parse individual ingredients
    parsed_ingredients = [ing.strip() for ing in ingredients_str.replace(";", ",").split(",") if ing.strip()]

    flagged_matches = []
    normalized_user_allergies = [a.lower().strip() for a in req.user_allergies]

    # Map allergens keywords
    keyword_map = {
        "fragrance": ["fragrance", "parfum", "perfume", "aroma"],
        "tree nut": ["prunus amygdalus", "almond", "macadamia", "walnut", "hazelnut"],
        "paraben": ["paraben", "methylparaben", "propylparaben", "butylparaben"],
        "sulfate": ["sulfate", "sodium lauryl sulfate", "sls", "sles"],
        "silicone": ["dimethicone", "cyclopentasiloxane", "siloxane"],
        "essential oil": ["linalool", "limonene", "geraniol", "citronellol", "eucalyptus", "lavender"],
        "chemical filter": ["oxybenzone", "avobenzone", "octinoxate", "homosalate"]
    }

    for ing in parsed_ingredients:
        ing_lower = ing.lower()
        matched_trigger = None

        for allergen in normalized_user_allergies:
            # direct name check
            if allergen in ing_lower:
                matched_trigger = allergen
                break

            # mapped keywords check
            for group, terms in keyword_map.items():
                if group in allergen:
                    for term in terms:
                        if term in ing_lower:
                            matched_trigger = f"{allergen} (matches '{ing}')"
                            break
                if matched_trigger:
                    break
            if matched_trigger:
                break

        if matched_trigger:
            flagged_matches.append({
                "ingredient": ing,
                "matched_allergy": matched_trigger,
                "severity": "High" if "nut" in ing_lower or "fragrance" in ing_lower else "Medium"
            })

    # Determine overall safety rating
    if len(flagged_matches) > 0:
        overall_status = "WARNING" if all(f["severity"] == "Medium" for f in flagged_matches) else "DANGER"
        is_safe = False
    else:
        overall_status = "SAFE"
        is_safe = True

    return {
        "product_name": product_name,
        "is_safe": is_safe,
        "status": overall_status,
        "total_ingredients_scanned": len(parsed_ingredients),
        "flagged_count": len(flagged_matches),
        "flagged_ingredients": flagged_matches,
        "ingredients_breakdown": [
            {
                "name": ing,
                "is_flagged": any(f["ingredient"] == ing for f in flagged_matches),
                "ewg_rating": 1 if "water" in ing.lower() or "ceramide" in ing.lower() or "hyaluronate" in ing.lower() else (7 if "parfum" in ing.lower() else 2)
            }
            for ing in parsed_ingredients
        ]
    }

@router.get("/customer-allergies")
async def get_customer_allergies(customer_id: Optional[str] = "cust-8901"):
    cust = next((c for c in db_store.customers if c["id"] == customer_id), db_store.customers[0])
    return {
        "customer_id": cust["id"],
        "allergies": cust.get("allergies", [])
    }

@router.post("/customer-allergies")
async def update_customer_allergies(req: UserAllergyUpdate, customer_id: Optional[str] = "cust-8901"):
    cust = next((c for c in db_store.customers if c["id"] == customer_id), db_store.customers[0])
    cust["allergies"] = req.allergies
    return {
        "success": True,
        "customer_id": cust["id"],
        "allergies": cust["allergies"]
    }
