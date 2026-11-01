from fastapi import APIRouter
from typing import Dict, Any, List
import pandas as pd
from datetime import datetime, timedelta
from app.db.repository import db_store, compute_expiry_metrics

router = APIRouter()

@router.get("/sales")
async def get_sales_analytics():
    """
    Pandas-powered sales analysis combining online orders and offline POS transactions.
    """
    records = []

    # Online orders
    for o in db_store.orders:
        records.append({
            "id": o["id"],
            "channel": "Online Storefront",
            "revenue": float(o.get("total_amount", 0)),
            "subtotal": float(o.get("subtotal", 0)),
            "discount": float(o.get("discount_amount", 0)),
            "tax": float(o.get("tax_amount", 0)),
            "created_at": o.get("created_at")
        })

    # POS transactions
    for p in db_store.pos_transactions:
        records.append({
            "id": p["id"],
            "channel": "Flagship POS",
            "revenue": float(p.get("total_amount", 0)),
            "subtotal": float(p.get("subtotal", 0)),
            "discount": float(p.get("discount_amount", 0)),
            "tax": float(p.get("tax_amount", 0)),
            "created_at": p.get("created_at")
        })

    if not records:
        return {"total_revenue": 0.0, "total_orders": 0, "aov": 0.0, "by_channel": {}}

    df = pd.DataFrame(records)
    total_rev = round(df["revenue"].sum(), 2)
    total_orders = len(df)
    aov = round(df["revenue"].mean(), 2)

    channel_grp = df.groupby("channel")["revenue"].agg(["sum", "count"]).reset_index()
    by_channel = {}
    for _, row in channel_grp.iterrows():
        by_channel[row["channel"]] = {
            "revenue": round(float(row["sum"]), 2),
            "order_count": int(row["count"])
        }

    return {
        "total_revenue": total_rev,
        "total_transactions": total_orders,
        "average_order_value": aov,
        "channel_breakdown": by_channel,
        "total_discounts_given": round(float(df["discount"].sum()), 2),
        "total_tax_collected": round(float(df["tax"].sum()), 2)
    }

@router.get("/profit")
async def get_profit_analytics():
    """
    Pandas-based profit margins, COGS, and gross profit analysis.
    """
    items_sold = []

    # Map product cost prices
    cost_map = {p["id"]: p.get("cost_price", p["price"] * 0.4) for p in db_store.products}

    # Extract items from POS
    for p in db_store.pos_transactions:
        for it in p.get("items", []):
            prod_id = it.get("product_id", "")
            unit_price = float(it.get("unit_price", it.get("price", 0)))
            qty = int(it.get("quantity", 1))
            cost = cost_map.get(prod_id, unit_price * 0.4)
            items_sold.append({
                "product_id": prod_id,
                "product_name": it.get("product_name", "Product"),
                "quantity": qty,
                "sale_price": unit_price,
                "cost_price": cost,
                "revenue": unit_price * qty,
                "cogs": cost * qty
            })

    # Extract items from online orders
    for o in db_store.orders:
        for it in o.get("items", []):
            prod_id = it.get("product_id", "")
            unit_price = float(it.get("price", it.get("unit_price", 0)))
            qty = int(it.get("quantity", 1))
            cost = cost_map.get(prod_id, unit_price * 0.4)
            items_sold.append({
                "product_id": prod_id,
                "product_name": it.get("name", it.get("product_name", "Product")),
                "quantity": qty,
                "sale_price": unit_price,
                "cost_price": cost,
                "revenue": unit_price * qty,
                "cogs": cost * qty
            })

    if not items_sold:
        return {"gross_revenue": 0.0, "total_cogs": 0.0, "gross_profit": 0.0, "margin_percent": 0.0}

    df = pd.DataFrame(items_sold)
    total_rev = round(float(df["revenue"].sum()), 2)
    total_cogs = round(float(df["cogs"].sum()), 2)
    gross_profit = round(total_rev - total_cogs, 2)
    margin_pct = round((gross_profit / total_rev) * 100, 2) if total_rev > 0 else 0.0

    return {
        "gross_revenue": total_rev,
        "total_cogs": total_cogs,
        "gross_profit": gross_profit,
        "gross_margin_percentage": margin_pct,
        "total_units_sold": int(df["quantity"].sum())
    }

@router.get("/forecast")
async def get_demand_forecast():
    """
    Predictive demand forecast modeling 30-day velocity, run rates, and projected revenue.
    """
    prods = []
    for p in db_store.products:
        # Mock historical run rates
        daily_velocity = 2.4 if p.get("is_best_seller") else 0.8
        projected_30d = int(daily_velocity * 30)
        projected_rev = round(projected_30d * p["price"], 2)

        # Get current available stock
        batches = [b for b in db_store.inventory_batches if b["product_id"] == p["id"]]
        sellable = sum(b["quantity_available"] for b in batches)

        prods.append({
            "product_id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "current_sellable_stock": sellable,
            "daily_run_rate": daily_velocity,
            "projected_30d_demand": projected_30d,
            "projected_30d_revenue": projected_rev,
            "days_of_supply": round(sellable / daily_velocity, 1) if daily_velocity > 0 else 999
        })

    df = pd.DataFrame(prods)
    total_proj_rev = round(float(df["projected_30d_revenue"].sum()), 2)

    return {
        "forecast_window_days": 30,
        "total_projected_revenue": total_proj_rev,
        "product_forecasts": prods
    }

@router.get("/smart-reorder")
async def get_smart_reorder_recommendations():
    """
    Automated reordering recommendation engine:
    Flag items where Days of Supply < Supplier Lead Time (14 days) + Safety Buffer (7 days).
    """
    reorder_list = []
    lead_time_days = 14
    safety_stock_days = 7
    reorder_threshold_days = lead_time_days + safety_stock_days

    for p in db_store.products:
        daily_velocity = 2.4 if p.get("is_best_seller") else 0.8
        batches = [b for b in db_store.inventory_batches if b["product_id"] == p["id"]]
        sellable = sum(b["quantity_available"] for b in batches)
        days_of_supply = round(sellable / daily_velocity, 1) if daily_velocity > 0 else 999

        if days_of_supply <= reorder_threshold_days or sellable < 50:
            suggested_reorder_qty = int(daily_velocity * 45) # 45 days supply
            reorder_list.append({
                "product_id": p["id"],
                "product_name": p["name"],
                "sku": p["sku"],
                "brand": p["brand"],
                "current_stock": sellable,
                "days_of_supply": days_of_supply,
                "suggested_reorder_quantity": suggested_reorder_qty,
                "estimated_reorder_cost": round(suggested_reorder_qty * p.get("cost_price", p["price"] * 0.4), 2),
                "urgency": "URGENT" if days_of_supply < 10 else "MODERATE"
            })

    return {
        "lead_time_days": lead_time_days,
        "safety_buffer_days": safety_stock_days,
        "items_needing_reorder_count": len(reorder_list),
        "recommendations": reorder_list
    }
