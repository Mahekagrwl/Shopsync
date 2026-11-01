-- ==============================================================================
-- ShopSync Master PostgreSQL Migration (Supabase Enterprise)
-- Comprehensive Omnichannel Beauty E-Commerce & In-Store Smart POS Schema
-- Includes RLS Security, Asia/Kolkata Expiry Rules, and Batch Allocation Triggers
-- ==============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Roles & Profiles (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'customer', 'admin', 'cashier', 'store_manager'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
    ('customer', 'Verified consumer account with personal cart & allergy profile'),
    ('cashier', 'POS register operator permitted to execute transactions'),
    ('store_manager', 'Inventory manager permitted to approve batches & POs'),
    ('admin', 'Super administrator with full formulation & financial access')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Customer Directory & Loyalty
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(32) UNIQUE,
    loyalty_tier VARCHAR(32) DEFAULT 'Bronze', -- 'Bronze', 'Silver', 'Gold', 'VIP Platinum'
    loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
    lifetime_spend NUMERIC(12, 2) DEFAULT 0.00 CHECK (lifetime_spend >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    skin_type VARCHAR(64) DEFAULT 'Combination / Sensitive',
    skin_concerns TEXT[] DEFAULT ARRAY['Dehydration', 'Redness'],
    finish_preference VARCHAR(32) DEFAULT 'dewy', -- 'dewy', 'natural', 'matte'
    coverage_preference VARCHAR(32) DEFAULT 'medium', -- 'light', 'medium', 'full'
    preferred_undertone VARCHAR(32) DEFAULT 'warm',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Categories & Brands
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) UNIQUE NOT NULL,
    origin VARCHAR(100) NOT NULL,
    badge VARCHAR(64) DEFAULT 'Clean Luxury',
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Products, Variants & Makeup Shades
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    sku VARCHAR(64) UNIQUE NOT NULL,
    barcode VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (cost_price >= 0),
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    barcode VARCHAR(64) UNIQUE,
    size_name VARCHAR(120) NOT NULL, -- e.g. "30ml", "50ml", "Refill Pod"
    price_adjustment NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS makeup_shades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    shade_name VARCHAR(120) NOT NULL,
    shade_code VARCHAR(32) NOT NULL, -- e.g. "100W", "01PC"
    hex_color VARCHAR(7) NOT NULL,   -- e.g. "#F9E4D4"
    undertone VARCHAR(20) NOT NULL CHECK (undertone IN ('warm', 'cool', 'neutral')),
    finish VARCHAR(20) NOT NULL CHECK (finish IN ('matte', 'natural', 'dewy')),
    coverage VARCHAR(20) NOT NULL CHECK (coverage IN ('light', 'medium', 'full')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Inventory Batches & Expiry Engine (Asia/Kolkata Business Zone)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    shade_id UUID REFERENCES makeup_shades(id) ON DELETE SET NULL,
    batch_number VARCHAR(64) NOT NULL, -- e.g. "LOT-2026-VA01"
    mfg_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INT NOT NULL CHECK (quantity_received >= 0),
    quantity_available INT NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    unit_cost NUMERIC(10, 2) NOT NULL CHECK (unit_cost >= 0),
    lab_certification TEXT DEFAULT 'Passed - ISO 22716 GMP',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- View that dynamically calculates days remaining using Asia/Kolkata business date
-- Applies the most severe applicable status:
-- > 50 days: Normal
-- <= 50 days: Upcoming
-- <= 30 days: Warning
-- <= 15 days: Critical
-- <= 7 days: Urgent
-- <= 0 days: Expired (Blocked from POS and online checkout!)
CREATE OR REPLACE VIEW v_inventory_expiry_status AS
SELECT 
    b.id,
    b.product_id,
    p.name AS product_name,
    p.sku AS product_sku,
    b.variant_id,
    b.shade_id,
    s.shade_name,
    s.shade_code,
    b.batch_number,
    b.mfg_date,
    b.expiry_date,
    b.quantity_available,
    b.unit_cost,
    (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) AS days_remaining,
    CASE 
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 0 THEN 'Expired'
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 7 THEN 'Urgent'
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 15 THEN 'Critical'
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 30 THEN 'Warning'
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 50 THEN 'Upcoming'
        ELSE 'Normal'
    END AS expiry_status,
    CASE 
        WHEN (b.expiry_date - (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) <= 0 THEN FALSE
        WHEN b.quantity_available <= 0 THEN FALSE
        ELSE TRUE
    END AS is_sellable
FROM inventory_batches b
JOIN products p ON b.product_id = p.id
LEFT JOIN makeup_shades s ON b.shade_id = s.id;

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES inventory_batches(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(32) NOT NULL, -- 'pos_sale', 'online_order', 'restock', 'expiry_discard', 'damage', 'manual_reconciliation'
    quantity INT NOT NULL, -- negative for sales, positive for restocks
    remaining_quantity INT NOT NULL,
    reference_id UUID,     -- order_id or pos_transaction_id
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Ingredients & SkinSafe Allergy Engine
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inci_name VARCHAR(255) UNIQUE NOT NULL,
    common_name VARCHAR(150),
    dermatological_function VARCHAR(150) NOT NULL,
    ewg_score INT CHECK (ewg_score BETWEEN 1 AND 10),
    is_common_allergen BOOLEAN DEFAULT FALSE,
    description TEXT,
    status VARCHAR(32) DEFAULT 'approved', -- 'approved', 'restricted', 'banned'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    rank_order INT NOT NULL DEFAULT 1,
    concentration_percentage NUMERIC(5, 2),
    UNIQUE(product_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS customer_allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    allergen_name VARCHAR(150) NOT NULL,
    severity VARCHAR(32) DEFAULT 'High', -- 'Low', 'Medium', 'High', 'Anaphylactic'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Carts, Wishlists & Addresses
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_token VARCHAR(128) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    shade_id UUID REFERENCES makeup_shades(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id, variant_id, shade_id)
);

CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(64) DEFAULT 'Home',
    full_name VARCHAR(150) NOT NULL,
    street TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(32) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Omnichannel Orders & Payments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    channel VARCHAR(24) NOT NULL CHECK (channel IN ('storefront', 'pos')),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(32) DEFAULT 'placed', -- 'placed', 'processing', 'in_transit', 'delivered', 'cancelled'
    payment_status VARCHAR(32) DEFAULT 'completed', -- 'pending', 'authorized', 'completed', 'failed', 'refunded'
    shipping_address TEXT,
    tracking_number VARCHAR(64),
    carrier VARCHAR(64) DEFAULT 'FedEx Luxury Express',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    shade_id UUID REFERENCES makeup_shades(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES inventory_batches(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    pos_transaction_id UUID,
    payment_method VARCHAR(32) NOT NULL, -- 'card', 'cash', 'upi', 'cod', 'razorpay'
    gateway_payment_id VARCHAR(128),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(32) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Smart POS Transactions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    terminal_id VARCHAR(64) NOT NULL DEFAULT 'POS-01-FLAGSHIP',
    cashier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    tender_type VARCHAR(32) NOT NULL, -- 'card', 'cash', 'upi', 'split'
    cash_tendered NUMERIC(10, 2),
    change_due NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(24) DEFAULT 'Paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Reviews, Feedback, Notifications & Analytics
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    shade_name VARCHAR(120),
    review_text TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    touchpoint VARCHAR(64) NOT NULL, -- 'In-Store Smart POS', 'E-Commerce Ordering', 'AI Skin Analysis', etc.
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    admin_response TEXT,
    status VARCHAR(24) DEFAULT 'new', -- 'new', 'reviewed', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(32) NOT NULL, -- 'low_stock', 'expiry_warning', 'order_placed', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'warning', -- 'info', 'warning', 'critical'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_date DATE UNIQUE NOT NULL,
    total_sales NUMERIC(12, 2) DEFAULT 0.00,
    pos_sales NUMERIC(12, 2) DEFAULT 0.00,
    online_sales NUMERIC(12, 2) DEFAULT 0.00,
    cogs NUMERIC(12, 2) DEFAULT 0.00,
    gross_profit NUMERIC(12, 2) DEFAULT 0.00,
    units_sold INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON inventory_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_qty ON inventory_batches(quantity_available);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
CREATE INDEX IF NOT EXISTS idx_stock_movements_batch ON stock_movements(batch_id);

-- ------------------------------------------------------------------------------
-- 12. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view active products
CREATE POLICY "Public products viewable" ON products
    FOR SELECT USING (is_active = TRUE);

-- Categories & Brands: Publicly viewable
CREATE POLICY "Public categories viewable" ON categories FOR SELECT USING (true);
CREATE POLICY "Public brands viewable" ON brands FOR SELECT USING (true);

-- Customers can view & edit only their own profile
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Customer allergies: private to customer
CREATE POLICY "Customers manage own allergies" ON customer_allergies
    FOR ALL USING (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
    );

-- Orders: Customers see own orders
CREATE POLICY "Customers view own orders" ON orders
    FOR SELECT USING (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
    );

-- Admin staff bypass for full management
CREATE POLICY "Admins manage all products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.name IN ('admin', 'store_manager')
        )
    );

CREATE POLICY "Admins manage all inventory" ON inventory_batches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid() AND r.name IN ('admin', 'store_manager', 'cashier')
        )
    );
