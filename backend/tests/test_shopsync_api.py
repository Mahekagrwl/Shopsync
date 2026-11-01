import pytest
from fastapi.testclient import TestClient
from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

from app.main import app
from app.db.repository import db_store, compute_expiry_metrics, get_kolkata_today

client = TestClient(app)

def test_system_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "ShopSync" in data["service"]

def test_api_status():
    res = client.get("/api/v1/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "/products" in data["endpoints_loaded"]
    assert "/expiry" in data["endpoints_loaded"]
    assert "/pos" in data["endpoints_loaded"]

# --- AUTH TESTS ---
def test_customer_auth_flow():
    # 1. Register new customer
    email = f"test_{datetime.now().timestamp()}@example.com"
    reg_res = client.post("/api/v1/auth/register", json={
        "full_name": "Audrey Hepburn",
        "email": email,
        "password": "SecretPassword123!",
        "phone": "+1 555-0199"
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email

    # 2. Login with registered credentials
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "SecretPassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 3. Access /auth/me with token
    me_res = client.get(f"/api/v1/auth/me?token={token}")
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

def test_admin_login():
    res = client.post("/api/v1/auth/admin/login", json={
        "email": "admin@shopsync.beauty",
        "password": "Admin@ShopSync2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "admin"
    assert "access_token" in data

# --- PRODUCTS & SHADES ---
def test_products_list_and_filters():
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 4
    prods = data["products"]
    
    # Check foundation product has shades
    foundation = next((p for p in prods if p["id"] == "prod-001"), None)
    assert foundation is not None
    assert len(foundation["shades"]) >= 6
    assert foundation["is_in_stock"] is True

def test_product_detail_and_stock():
    res = client.get("/api/v1/products/prod-002")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Cellular Renewal Peptide Barrier Elixir"
    assert "stock" in data
    assert data["stock"] > 0

# --- INVENTORY & ASIA/KOLKATA EXPIRY RULES ---
def test_kolkata_expiry_calculation():
    today = get_kolkata_today()
    assert isinstance(today, date)

    # Test status bands:
    # > 50 days -> Normal
    m_normal = compute_expiry_metrics(today + timedelta(days=60))
    assert m_normal["expiry_status"] == "Normal"
    assert m_normal["is_sellable"] is True

    # <= 50 days -> Upcoming
    m_upcoming = compute_expiry_metrics(today + timedelta(days=45))
    assert m_upcoming["expiry_status"] == "Upcoming"
    assert m_upcoming["is_sellable"] is True

    # <= 30 days -> Warning
    m_warning = compute_expiry_metrics(today + timedelta(days=25))
    assert m_warning["expiry_status"] == "Warning"
    assert m_warning["is_sellable"] is True

    # <= 15 days -> Critical
    m_critical = compute_expiry_metrics(today + timedelta(days=12))
    assert m_critical["expiry_status"] == "Critical"
    assert m_critical["is_sellable"] is True

    # <= 7 days -> Urgent
    m_urgent = compute_expiry_metrics(today + timedelta(days=5))
    assert m_urgent["expiry_status"] == "Urgent"
    assert m_urgent["is_sellable"] is True

    # <= 0 days -> Expired (strictly unsellable)
    m_expired = compute_expiry_metrics(today - timedelta(days=2))
    assert m_expired["expiry_status"] == "Expired"
    assert m_expired["is_sellable"] is False

def test_expiry_batches_endpoint():
    res = client.get("/api/v1/expiry/batches")
    assert res.status_code == 200
    data = res.json()
    assert "as_of_date_ist" in data
    assert len(data["batches"]) >= 4

    # Verify expired batch LOT-2026-SPF04-EXP is marked Expired and is_sellable False
    expired_batch = next((b for b in data["batches"] if b["batch_number"] == "LOT-2026-SPF04-EXP"), None)
    assert expired_batch is not None
    assert expired_batch["expiry_status"] == "Expired"
    assert expired_batch["is_sellable"] is False
    assert expired_batch["days_remaining"] <= 0

def test_expiry_alerts_endpoint():
    res = client.get("/api/v1/expiry/alerts")
    assert res.status_code == 200
    data = res.json()
    assert data["active_alerts_count"] >= 1
    # Check that expired batch is flagged with blocked notice
    expired_alert = next((a for a in data["alerts"] if a["status"] == "Expired"), None)
    assert expired_alert is not None
    assert expired_alert["is_blocked_from_sales"] is True

# --- POS BILLING & STRICT EXPIRED INVENTORY BLOCKING ---
def test_pos_lookup():
    res = client.get("/api/v1/pos/lookup?query=890123450012")
    assert res.status_code == 200
    data = res.json()
    assert data["results_count"] >= 1
    assert data["products"][0]["id"] == "prod-001"

def test_pos_billing_fefo_checkout():
    # Successful checkout of foundation with shade
    tx_payload = {
        "customer_name": "Sarah Jenkins",
        "terminal_id": "POS-01-FLAGSHIP",
        "tender_type": "Credit Card",
        "discount_percentage": 10.0,
        "items": [
            {
                "product_id": "prod-001",
                "product_name": "Silk Radiance Flawless Luminous Foundation",
                "shade_id": "sh-01",
                "shade_name": "Porcelain Light 100W",
                "quantity": 1,
                "unit_price": 48.00
            }
        ]
    }
    res = client.post("/api/v1/pos/checkout", json=tx_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    inv = data["invoice"]
    assert inv["invoice_number"].startswith("INV-2026-")
    assert inv["subtotal"] == 48.00
    assert inv["discount_amount"] == 4.80
    assert inv["total_amount"] > 0
    assert len(inv["batch_allocations"]) == 1

def test_pos_blocks_expired_product():
    # Attempting to checkout the expired SPF batch (prod-004 has ONLY an expired batch in seed data)
    tx_payload = {
        "customer_name": "Test Customer",
        "items": [
            {
                "product_id": "prod-004",
                "product_name": "Mineral Silk Fluid Broad Spectrum SPF 50+",
                "quantity": 1,
                "unit_price": 42.00
            }
        ]
    }
    res = client.post("/api/v1/pos/checkout", json=tx_payload)
    # Must fail because only expired batches exist for prod-004
    assert res.status_code == 400
    detail = res.json()["detail"]
    assert "Stock allocation failed" in detail or "Insufficient non-expired inventory" in detail

# --- ONLINE ORDERS ---
def test_create_online_order():
    payload = {
        "customer_name": "Camille Laurent",
        "customer_email": "camille.laurent@example.com",
        "shipping_address": "742 Evergreen Terrace",
        "shipping_city": "San Francisco",
        "shipping_state": "CA",
        "shipping_zip": "94107",
        "payment_method": "Credit Card (Test Mode)",
        "items": [
            {
                "product_id": "prod-002",
                "product_name": "Cellular Renewal Peptide Barrier Elixir",
                "quantity": 1,
                "unit_price": 72.00
            }
        ]
    }
    res = client.post("/api/v1/orders", json=payload)
    assert res.status_code == 201
    order = res.json()["order"]
    assert order["order_number"].startswith("SS-")
    assert order["tracking_number"].startswith("TRK-")
    assert order["status"] == "Processing"

    # Test tracking
    track_res = client.get(f"/api/v1/orders/track/{order['order_number']}")
    assert track_res.status_code == 200
    assert track_res.json()["status"] == "Processing"

# --- SKINSAFE ALLERGY CHECKER ---
def test_skinsafe_allergy_scan():
    # Check product ingredients with fragrance allergy
    res = client.post("/api/v1/skinsafe/check", json={
        "custom_ingredient_text": "Aqua, Dimethicone, Parfum / Synthetic Fragrance, Glycerin",
        "user_allergies": ["Fragrance"]
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_safe"] is False
    assert data["status"] in ["WARNING", "DANGER"]
    assert len(data["flagged_ingredients"]) >= 1
    assert "Parfum / Synthetic Fragrance" in [f["ingredient"] for f in data["flagged_ingredients"]]

# --- AI RECOMMENDATIONS & ROUTINE ---
def test_ai_skin_analysis_and_recommendations():
    # 1. Skin analysis
    analysis_res = client.post("/api/v1/ai/skin-analysis", json={
        "user_consent_granted": True,
        "skin_type": "Sensitive",
        "primary_concerns": ["Redness / Rosacea", "Dehydration"]
    })
    assert analysis_res.status_code == 200
    data = analysis_res.json()
    assert data["status"] == "completed"
    assert "disclaimer" in data
    assert len(data["recommended_routine"]) >= 1

    # 2. Allergy-aware recommendations
    rec_res = client.post("/api/v1/ai/recommendations", json={
        "skin_type": "Dry",
        "concerns": ["Dehydration"],
        "allergies": ["Synthetic Fragrance"]
    })
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["total_recommendations"] >= 1

# --- PANDAS ANALYTICS ---
def test_pandas_analytics():
    # Sales
    sales_res = client.get("/api/v1/analytics/sales")
    assert sales_res.status_code == 200
    sales_data = sales_res.json()
    assert "total_revenue" in sales_data
    assert "channel_breakdown" in sales_data

    # Profit
    profit_res = client.get("/api/v1/analytics/profit")
    assert profit_res.status_code == 200
    profit_data = profit_res.json()
    assert "gross_margin_percentage" in profit_data

    # Forecast
    forecast_res = client.get("/api/v1/analytics/forecast")
    assert forecast_res.status_code == 200
    assert "total_projected_revenue" in forecast_res.json()

    # Smart reorder
    reorder_res = client.get("/api/v1/analytics/smart-reorder")
    assert reorder_res.status_code == 200
    assert "recommendations" in reorder_res.json()
