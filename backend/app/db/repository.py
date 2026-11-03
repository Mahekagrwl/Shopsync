from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo
from typing import Dict, List, Optional, Any
import uuid

# Asia/Kolkata Business Zone as explicitly required
KOLKATA_TZ = ZoneInfo("Asia/Kolkata")

def get_kolkata_today() -> date:
    return datetime.now(KOLKATA_TZ).date()

def compute_expiry_metrics(expiry_date: date) -> Dict[str, Any]:
    today = get_kolkata_today()
    days_remaining = (expiry_date - today).days

    if days_remaining <= 0:
        status = "Expired"
        is_sellable = False
    elif days_remaining <= 7:
        status = "Urgent"
        is_sellable = True
    elif days_remaining <= 15:
        status = "Critical"
        is_sellable = True
    elif days_remaining <= 30:
        status = "Warning"
        is_sellable = True
    elif days_remaining <= 50:
        status = "Upcoming"
        is_sellable = True
    else:
        status = "Normal"
        is_sellable = True

    return {
        "days_remaining": days_remaining,
        "expiry_status": status,
        "is_sellable": is_sellable
    }

class MasterDataStore:
    def __init__(self):
        self._init_data()

    def _init_data(self):
        today = get_kolkata_today()

        # 1. Categories
        self.categories = [
            {"id": "cat-skincare", "name": "Skincare", "slug": "skincare", "description": "Clinically proven serums, moisturizers & barrier repair"},
            {"id": "cat-makeup", "name": "Makeup", "slug": "makeup", "description": "Complexion perfecting, velvety eyes & couture lips"},
            {"id": "cat-face-makeup", "name": "Face Makeup", "slug": "face-makeup", "description": "Foundations, concealers, blushes & setting powders", "parent_id": "cat-makeup"},
            {"id": "cat-eye-makeup", "name": "Eye Makeup", "slug": "eye-makeup", "description": "Pigmented eyeshadow palettes, precise liners & mascaras", "parent_id": "cat-makeup"},
            {"id": "cat-lip-makeup", "name": "Lip Makeup", "slug": "lip-makeup", "description": "Hydrating lip oils, satin lipsticks & precision liners", "parent_id": "cat-makeup"},
            {"id": "cat-haircare", "name": "Haircare", "slug": "haircare", "description": "Bond-repairing masks, clarifying shampoos & elixirs"},
            {"id": "cat-body-care", "name": "Body Care", "slug": "body-care", "description": "Botanical body oils, restorative creams & gentle polishes"},
            {"id": "cat-sunscreen", "name": "Sunscreen", "slug": "sunscreen", "description": "Broad spectrum SPF 50+, invisible mineral & chemical shields"},
            {"id": "cat-accessories", "name": "Beauty Accessories", "slug": "accessories", "description": "Precision tools, rose quartz rollers & vegan brushes"},
        ]

        # 2. Brands
        self.brands = [
            {"id": "brand-velour", "name": "Velour Atelier", "origin": "Milan, Italy", "badge": "High Pigment"},
            {"id": "brand-auraderm", "name": "AuraDerm Labs", "origin": "Seoul, Korea", "badge": "Clinical AI"},
            {"id": "brand-sol", "name": "Sol Botanica", "origin": "Sydney, Australia", "badge": "Mineral SPF"},
            {"id": "brand-celestial", "name": "Celestial Glow", "origin": "Tokyo, Japan", "badge": "Bio-Fermented"},
            {"id": "brand-lumina", "name": "Lumina Botanics", "origin": "Paris, France", "badge": "Clean Luxury"},
        ]

        # 3. Products
        self.products = [
            {
                "id": "prod-001",
                "name": "Silk Radiance Flawless Luminous Foundation",
                "brand": "Velour Atelier",
                "category": "makeup",
                "subcategory": "face-makeup",
                "price": 48.00,
                "compare_at_price": 58.00,
                "cost_price": 16.50,
                "sku": "VA-FND-001",
                "barcode": "890123450012",
                "rating": 4.9,
                "reviews_count": 342,
                "is_active": True,
                "is_best_seller": True,
                "is_new_arrival": False,
                "is_featured": True,
                "images": ["https://images.unsplash.com/photo-1557205465-f3762edea6d3?w=800"],
                "description": "Breathable 24-hour weightless foundation that delivers customizable medium-to-full radiant coverage. Infused with micro-pearls and hyaluronic acid.",
                "ingredients": "Aqua/Water/Eau, Cyclopentasiloxane, Dimethicone, Glycerin, Sodium Hyaluronate, Niacinamide, Camellia Sinensis Leaf Extract, Titanium Dioxide, Iron Oxides.",
                "allergy_tags": ["Paraben-Free", "Fragrance-Free", "Cruelty-Free", "Vegan", "Non-Comedogenic"],
                "shades": [
                    {"id": "sh-01", "name": "Porcelain Light", "code": "100W", "hex": "#F9E4D4", "undertone": "warm", "finish": "dewy", "coverage": "medium"},
                    {"id": "sh-02", "name": "Ivory Petal", "code": "110C", "hex": "#F5DAC8", "undertone": "cool", "finish": "dewy", "coverage": "medium"},
                    {"id": "sh-03", "name": "Golden Sand", "code": "210W", "hex": "#EAC3A2", "undertone": "warm", "finish": "dewy", "coverage": "medium"},
                    {"id": "sh-04", "name": "Neutral Almond", "code": "230N", "hex": "#D8A880", "undertone": "neutral", "finish": "natural", "coverage": "medium"},
                    {"id": "sh-05", "name": "Honey Amber", "code": "320W", "hex": "#BE8358", "undertone": "warm", "finish": "natural", "coverage": "full"},
                    {"id": "sh-06", "name": "Espresso Velvet", "code": "450N", "hex": "#633B26", "undertone": "neutral", "finish": "matte", "coverage": "full"},
                ]
            },
            {
                "id": "prod-002",
                "name": "Cellular Renewal Peptide Barrier Elixir",
                "brand": "AuraDerm Labs",
                "category": "skincare",
                "subcategory": "skincare",
                "price": 72.00,
                "compare_at_price": 85.00,
                "cost_price": 22.00,
                "sku": "AD-ELX-002",
                "barcode": "890123450029",
                "rating": 4.95,
                "reviews_count": 512,
                "is_active": True,
                "is_best_seller": True,
                "is_new_arrival": False,
                "is_featured": True,
                "images": ["https://images.unsplash.com/photo-1629732047847-50219e9c5aef?w=800"],
                "description": "Biomimetic restorative elixir formulated with 5 multi-weight ceramides, copper tripeptide-1, and snow mushroom ferment.",
                "ingredients": "Centella Asiatica Leaf Water, Ceramide NP, Ceramide AP, Copper Tripeptide-1, Tremella Fuciformis Sporocarp Extract, Panthenol, Beta-Glucan, Squalane.",
                "allergy_tags": ["Fragrance-Free", "Essential Oil-Free", "Gluten-Free", "Sulfate-Free", "Hypoallergenic"],
                "shades": []
            },
            {
                "id": "prod-003",
                "name": "Velvet Cloud Cashmere Matte Lipstick",
                "brand": "Velour Atelier",
                "category": "makeup",
                "subcategory": "lip-makeup",
                "price": 32.00,
                "compare_at_price": 38.00,
                "cost_price": 11.00,
                "sku": "VA-LIP-003",
                "barcode": "890123450036",
                "rating": 4.8,
                "reviews_count": 189,
                "is_active": True,
                "is_best_seller": True,
                "is_new_arrival": True,
                "is_featured": True,
                "images": ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800"],
                "description": "Ultra-comfortable blur-matte lipstick formulated with meadowfoam seed oil and smoothing microspheres for petal-soft pigmentation.",
                "ingredients": "Dimethicone, Polyglyceryl-2 Triisostearate, Limnanthes Alba (Meadowfoam) Seed Oil, Butyrospermum Parkii Butter, Mica, Red 7 Lake, Iron Oxides.",
                "allergy_tags": ["Cruelty-Free", "Paraben-Free", "Mineral Oil-Free"],
                "shades": [
                    {"id": "lip-01", "name": "Plum Couture", "code": "01PC", "hex": "#542B43", "undertone": "cool", "finish": "matte", "coverage": "full"},
                    {"id": "lip-02", "name": "Dusty Petal Rose", "code": "02DR", "hex": "#D9A6AC", "undertone": "neutral", "finish": "natural", "coverage": "medium"},
                    {"id": "lip-03", "name": "Nude Cashmere", "code": "03NC", "hex": "#C2897A", "undertone": "warm", "finish": "matte", "coverage": "full"},
                    {"id": "lip-04", "name": "French Scarlet", "code": "04FS", "hex": "#A31D24", "undertone": "warm", "finish": "matte", "coverage": "full"},
                ]
            },
            {
                "id": "prod-004",
                "name": "Mineral Silk Fluid Broad Spectrum SPF 50+",
                "brand": "Sol Botanica",
                "category": "sunscreen",
                "subcategory": "sunscreen",
                "price": 42.00,
                "compare_at_price": 48.00,
                "cost_price": 14.50,
                "sku": "SB-SPF-004",
                "barcode": "890123450043",
                "rating": 4.88,
                "reviews_count": 278,
                "is_active": True,
                "is_best_seller": False,
                "is_new_arrival": True,
                "is_featured": True,
                "images": ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800"],
                "description": "100% non-nano zinc oxide mineral shield leaving zero white cast, velvety satin touch, and invisible blue light defense.",
                "ingredients": "Zinc Oxide 12.5%, Water/Aqua, Caprylic/Capric Triglyceride, Squalane, Ectoin, Niacinamide, Camellia Sinensis Seed Oil, Bisabolol, Silica.",
                "allergy_tags": ["Reef-Safe", "Fragrance-Free", "Non-Nano", "Chemical-Filter-Free"],
                "shades": []
            }
        ]

        # 4. Inventory Batches (Calibrated to Asia/Kolkata date)
        self.inventory_batches = [
            {
                "id": "batch-1",
                "product_id": "prod-001",
                "shade_id": "sh-01",
                "batch_number": "LOT-2026-FND01",
                "mfg_date": str(today - timedelta(days=90)),
                "expiry_date": str(today + timedelta(days=180)),
                "quantity_received": 100,
                "quantity_available": 84,
                "unit_cost": 16.50,
                "lab_certification": "Passed - ISO 22716 GMP"
            },
            {
                "id": "batch-2",
                "product_id": "prod-002",
                "shade_id": None,
                "batch_number": "LOT-2026-ELX02",
                "mfg_date": str(today - timedelta(days=60)),
                "expiry_date": str(today + timedelta(days=240)),
                "quantity_received": 60,
                "quantity_available": 42,
                "unit_cost": 22.00,
                "lab_certification": "Passed - Clinical Bio-Assay"
            },
            {
                "id": "batch-3",
                "product_id": "prod-003",
                "shade_id": "lip-01",
                "batch_number": "LOT-2026-LIP03",
                "mfg_date": str(today - timedelta(days=120)),
                "expiry_date": str(today + timedelta(days=28)), # Warning: <= 30 days!
                "quantity_received": 80,
                "quantity_available": 24,
                "unit_cost": 11.00,
                "lab_certification": "Warning - 28 Days Remaining"
            },
            {
                "id": "batch-4",
                "product_id": "prod-004",
                "shade_id": None,
                "batch_number": "LOT-2026-SPF04-EXP",
                "mfg_date": str(today - timedelta(days=365)),
                "expiry_date": str(today - timedelta(days=4)), # EXPIRED: <= 0 days! Must be BLOCKED!
                "quantity_received": 50,
                "quantity_available": 12,
                "unit_cost": 14.50,
                "lab_certification": "Expired - Discard Blocked"
            }
        ]

        # 5. Stock Movements Log
        self.stock_movements = [
            {
                "id": "mov-1",
                "batch_id": "batch-1",
                "product_id": "prod-001",
                "movement_type": "restock",
                "quantity": 100,
                "remaining_quantity": 100,
                "notes": "Initial factory shipment from Milan",
                "created_at": str(datetime.now())
            }
        ]

        # 6. INCI Ingredients Master
        self.ingredients = [
            {"id": "ing-1", "inci_name": "Sodium Hyaluronate", "function": "Deep Moisture Humectant", "ewg_score": 1, "is_allergen": False, "status": "approved"},
            {"id": "ing-2", "inci_name": "Copper Tripeptide-1", "function": "Cellular Barrier Peptide", "ewg_score": 1, "is_allergen": False, "status": "approved"},
            {"id": "ing-3", "inci_name": "Ceramide NP", "function": "Stratum Corneum Lipid", "ewg_score": 1, "is_allergen": False, "status": "approved"},
            {"id": "ing-4", "inci_name": "Zinc Oxide", "function": "Mineral Physical UV Shield", "ewg_score": 2, "is_allergen": False, "status": "approved"},
            {"id": "ing-5", "inci_name": "Parfum / Synthetic Fragrance", "function": "Scent / Allergen Compound", "ewg_score": 8, "is_allergen": True, "status": "restricted"},
            {"id": "ing-6", "inci_name": "Prunus Amygdalus Dulcis Oil", "function": "Tree Nut Lipid", "ewg_score": 1, "is_allergen": True, "status": "approved"}
        ]

        # 7. Customer Profiles & Users
        self.customers = [
            {
                "id": "cust-8901",
                "full_name": "Camille Laurent",
                "email": "camille.laurent@example.com",
                "phone": "+1 (555) 234-5678",
                "loyalty_tier": "Gold Member",
                "loyalty_points": 1250,
                "lifetime_spend": 1420.50,
                "allergies": ["Synthetic Fragrance", "Tree Nut Oils"],
                "skin_profile": {
                    "skin_type": "Combination / Sensitive",
                    "skin_concerns": ["Redness / Rosacea", "Dehydration"]
                }
            }
        ]

        # 8. POS Transactions
        self.pos_transactions = [
            {
                "id": "pos-tx-1",
                "invoice_number": "INV-2026-0891",
                "terminal_id": "POS-01-FLAGSHIP",
                "cashier_name": "Victoria Vance",
                "customer_name": "Sarah Jenkins",
                "subtotal": 80.00,
                "discount_amount": 8.00,
                "tax_amount": 5.94,
                "total_amount": 77.94,
                "tender_type": "Credit Card (Terminal EMV)",
                "created_at": str(datetime.now() - timedelta(hours=3)),
                "items": [
                    {"product_id": "prod-001", "product_name": "Silk Radiance Foundation (100W)", "quantity": 1, "unit_price": 48.00, "price": 48.00},
                    {"product_id": "prod-003", "product_name": "Velvet Cloud Cashmere Lipstick (01PC)", "quantity": 1, "unit_price": 32.00, "price": 32.00}
                ]
            }
        ]

        # 9. Orders
        self.orders = [
            {
                "id": "ord-1",
                "order_number": "SS-984210",
                "channel": "storefront",
                "customer_name": "Camille Laurent",
                "customer_email": "camille.laurent@example.com",
                "status": "In Transit",
                "payment_status": "completed",
                "payment_method": "Apple Pay (ending in 8841)",
                "subtotal": 72.00,
                "discount_amount": 10.80,
                "tax_amount": 5.05,
                "shipping_amount": 0.00,
                "total_amount": 66.25,
                "shipping_address": "742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107",
                "tracking_number": "TRK-9842881-US",
                "carrier": "FedEx Luxury Express",
                "created_at": str(datetime.now() - timedelta(days=2)),
                "items": [
                    {"name": "Cellular Renewal Peptide Barrier Elixir", "quantity": 1, "price": 72.00, "shade": None}
                ]
            }
        ]

        # 10. Reviews & Feedback
        self.reviews = [
            {
                "id": "rev-1",
                "product_id": "prod-001",
                "product_name": "Silk Radiance Flawless Luminous Foundation",
                "author_name": "Elena Rostova",
                "rating": 5,
                "shade_name": "Porcelain Light 100W",
                "review_text": "The shade match from the AI recommendation was shockingly accurate. No oxidation during a 14-hour shift, and my skin felt calm all day.",
                "is_verified_purchase": True,
                "created_at": "October 24, 2026"
            }
        ]

        self.feedback = [
            {
                "id": "fb-1",
                "touchpoint": "In-Store Smart POS",
                "author": "Elena Rostova",
                "email": "elena.r@example.com",
                "rating": 5,
                "subject": "Fast barcode and immediate shade match",
                "message": "The cashier terminal looked up my shade preference instantly and applied my loyalty points.",
                "created_at": "Yesterday"
            }
        ]

        # 11. System Notifications
        self.notifications = [
            {
                "id": "notif-1",
                "type": "low_stock",
                "title": "Stock Alert: Peptide Barrier Elixir",
                "message": "Only 42 units remain across boutique floor and central reserve.",
                "severity": "warning",
                "is_read": False,
                "created_at": "10 mins ago"
            },
            {
                "id": "notif-2",
                "type": "expiry_warning",
                "title": "Batch LOT-2026-LIP03 Approaching Expiry",
                "message": "24 units of Velvet Cloud Lipstick expire in 28 days. Recommended to apply 30% clearance promo.",
                "severity": "warning",
                "is_read": False,
                "created_at": "1 hour ago"
            },
            {
                "id": "notif-3",
                "type": "expired_blocked",
                "title": "Expired Batch Blocked from POS",
                "message": "Batch LOT-2026-SPF04-EXP has passed expiry date. Automatically quarantined from all checkout registers.",
                "severity": "critical",
                "is_read": False,
                "created_at": "Today"
            }
        ]

    # --- INVENTORY & EXPIRY ENGINE ---
    def get_batches_with_status(self) -> List[Dict[str, Any]]:
        result = []
        for b in self.inventory_batches:
            exp_date = datetime.strptime(b["expiry_date"], "%Y-%m-%d").date()
            metrics = compute_expiry_metrics(exp_date)
            prod = next((p for p in self.products if p["id"] == b["product_id"]), None)

            result.append({
                **b,
                "product_name": prod["name"] if prod else "Unknown Product",
                "product_sku": prod["sku"] if prod else "",
                "days_remaining": metrics["days_remaining"],
                "expiry_status": metrics["expiry_status"],
                "is_sellable": metrics["is_sellable"] and b["quantity_available"] > 0
            })
        return result

    def deduct_inventory(self, product_id: str, quantity: int, shade_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Atomically allocates and deducts inventory from sellable batches.
        Prioritizes earlier expiry batches (FEFO).
        STRICTLY BLOCKS EXPIRED BATCHES (days_remaining <= 0).
        """
        batches = [
            b for b in self.inventory_batches
            if b["product_id"] == product_id and (shade_id is None or b["shade_id"] == shade_id or b["shade_id"] is None)
        ]

        # Calculate live days remaining and filter out expired
        valid_batches = []
        for b in batches:
            exp_date = datetime.strptime(b["expiry_date"], "%Y-%m-%d").date()
            metrics = compute_expiry_metrics(exp_date)
            if metrics["is_sellable"] and b["quantity_available"] > 0:
                valid_batches.append((b, metrics["days_remaining"]))

        # Sort by days_remaining ascending (FEFO: First Expiring, First Out)
        valid_batches.sort(key=lambda x: x[1])

        total_available = sum(b[0]["quantity_available"] for b in valid_batches)
        if total_available < quantity:
            return {
                "success": False,
                "error": f"Insufficient non-expired inventory. Requested: {quantity}, Available: {total_available}"
            }

        remaining_to_deduct = quantity
        allocated_batches = []

        for b, days_left in valid_batches:
            if remaining_to_deduct <= 0:
                break
            deduct_amount = min(b["quantity_available"], remaining_to_deduct)
            b["quantity_available"] -= deduct_amount
            remaining_to_deduct -= deduct_amount
            allocated_batches.append({"batch_number": b["batch_number"], "deducted": deduct_amount})

            # Record stock movement
            self.stock_movements.append({
                "id": str(uuid.uuid4()),
                "batch_id": b["id"],
                "product_id": product_id,
                "movement_type": "sale_deduction",
                "quantity": -deduct_amount,
                "remaining_quantity": b["quantity_available"],
                "notes": f"FEFO allocation for {deduct_amount} units",
                "created_at": str(datetime.now())
            })

        return {
            "success": True,
            "allocated_batches": allocated_batches
        }

db_store = MasterDataStore()
