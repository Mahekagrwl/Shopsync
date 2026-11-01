# ShopSync Supabase Database Schema

Contains the PostgreSQL schemas and migration files designed for Supabase.

## Schema Highlights

- **Categories & Products**: Omnichannel beauty catalog with SKU, Barcode, Pricing, and Ingredients.
- **Product Variants**: Shades, Volumes (ml/oz), and color swatches (`shade_hex`).
- **Unified Inventory**: Omnichannel stock tracking with audit trail (`inventory_logs`) for in-store POS and online storefront sync.
- **Customers & Loyalty**: Unified customer profile, tier (Bronze, Silver, Gold, VIP) and points.
- **Unified Orders**: Single order table capturing `channel = 'storefront'` or `channel = 'pos'`, payment breakdown, and cashier session.
- **POS Terminals & Sessions**: Cash drawer reconciliation, register sessions, and cashier attribution.

## Applying Migrations

### Via Supabase Web Dashboard:
1. Open your project on [database.new](https://database.new) or [supabase.com](https://supabase.com).
2. Go to **SQL Editor**.
3. Copy the contents of `database/migrations/001_initial_schema.sql` and click **Run**.

### Via Supabase CLI:
```bash
supabase db push
```
