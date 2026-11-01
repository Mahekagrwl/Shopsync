-- ==============================================================================
-- ShopSync: Initial PostgreSQL Schema for Supabase
-- Omnichannel Beauty E-Commerce & In-Store Smart POS Platform
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table (Omnichannel catalog)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sku VARCHAR(64) UNIQUE NOT NULL,
    barcode VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(120) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT,
    ingredients TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(10, 2) CHECK (compare_at_price >= price),
    cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants (Shades, Volumes, Sizes)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    barcode VARCHAR(64) UNIQUE,
    variant_name VARCHAR(120) NOT NULL, -- e.g. "Shade 04 Warm Almond" or "50ml"
    shade_hex VARCHAR(7),               -- e.g. "#D99B7D" for makeup/foundation swatches
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customers & Loyalty Accounts
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id UUID UNIQUE,       -- Links to Supabase Auth user if registered
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(32) UNIQUE,
    loyalty_tier VARCHAR(32) DEFAULT 'Bronze', -- Bronze, Silver, Gold, VIP
    loyalty_points INT DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POS Terminals & Cashier Register Sessions
CREATE TABLE IF NOT EXISTS pos_terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. "TERM-01"
    store_location VARCHAR(120) NOT NULL DEFAULT 'Main Boutique',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_id UUID NOT NULL REFERENCES pos_terminals(id) ON DELETE CASCADE,
    opened_by UUID REFERENCES customers(id), -- Cashier ID
    opening_balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    closing_balance DECIMAL(10, 2),
    status VARCHAR(24) DEFAULT 'open',       -- 'open', 'closed'
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 7. Orders (Unified E-Commerce & In-Store POS Orders)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('storefront', 'pos')),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    pos_session_id UUID REFERENCES pos_sessions(id) ON DELETE SET NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL, -- 'card', 'cash', 'upi', 'gift_card', 'split'
    payment_status VARCHAR(24) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    order_status VARCHAR(24) DEFAULT 'completed',   -- 'placed', 'processing', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Real-Time Inventory Audit Log (Tracks every stock adjustment)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    change_type VARCHAR(32) NOT NULL, -- 'pos_sale', 'ecommerce_sale', 'restock', 'return', 'manual_adjustment'
    quantity_changed INT NOT NULL,
    remaining_quantity INT NOT NULL,
    reference_id UUID,                -- order_id or transfer_id
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON inventory_logs(product_id);
