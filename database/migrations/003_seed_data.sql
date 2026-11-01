-- ==============================================================================
-- ShopSync Master Seed Script
-- Populates initial categories, brands, products, shades, batches, ingredients,
-- and sample orders for immediate local development and Supabase deployment.
-- ==============================================================================

-- 1. Categories
INSERT INTO categories (id, name, slug, description) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Skincare', 'skincare', 'Clinically proven serums, moisturizers & barrier repair'),
    ('11111111-1111-1111-1111-111111111102', 'Makeup', 'makeup', 'Complexion perfecting, velvety eyes & couture lips'),
    ('11111111-1111-1111-1111-111111111103', 'Face Makeup', 'face-makeup', 'Foundations, concealers, blushes & setting powders'),
    ('11111111-1111-1111-1111-111111111104', 'Eye Makeup', 'eye-makeup', 'Pigmented eyeshadow palettes, precise liners & mascaras'),
    ('11111111-1111-1111-1111-111111111105', 'Lip Makeup', 'lip-makeup', 'Hydrating lip oils, satin lipsticks & precision liners'),
    ('11111111-1111-1111-1111-111111111106', 'Haircare', 'haircare', 'Bond-repairing masks, clarifying shampoos & elixirs'),
    ('11111111-1111-1111-1111-111111111107', 'Body Care', 'body-care', 'Botanical body oils, restorative creams & gentle polishes'),
    ('11111111-1111-1111-1111-111111111108', 'Sunscreen', 'sunscreen', 'Broad spectrum SPF 50+, invisible mineral & chemical shields'),
    ('11111111-1111-1111-1111-111111111109', 'Beauty Accessories', 'accessories', 'Precision tools, rose quartz rollers & vegan brushes')
ON CONFLICT (slug) DO NOTHING;

-- 2. Brands
INSERT INTO brands (id, name, origin, badge) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Velour Atelier', 'Milan, Italy', 'High Pigment'),
    ('22222222-2222-2222-2222-222222222202', 'AuraDerm Labs', 'Seoul, Korea', 'Clinical AI'),
    ('22222222-2222-2222-2222-222222222203', 'Sol Botanica', 'Sydney, Australia', 'Mineral SPF'),
    ('22222222-2222-2222-2222-222222222204', 'Celestial Glow', 'Tokyo, Japan', 'Bio-Fermented'),
    ('22222222-2222-2222-2222-222222222205', 'Lumina Botanics', 'Paris, France', 'Clean Luxury')
ON CONFLICT (name) DO NOTHING;

-- 3. Products
INSERT INTO products (id, category_id, brand_id, sku, barcode, name, slug, description, price, compare_at_price, cost_price, images, is_best_seller, is_new_arrival, is_featured) VALUES
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222201', 'VA-FND-001', '890123450012', 'Silk Radiance Flawless Luminous Foundation', 'silk-radiance-foundation', 'Breathable 24-hour weightless foundation with radiant coverage and hyaluronic acid.', 48.00, 58.00, 16.50, '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"]'::jsonb, true, false, true),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'AD-ELX-002', '890123450029', 'Cellular Renewal Peptide Barrier Elixir', 'cellular-renewal-elixir', 'Biomimetic serum with 5 ceramides and copper peptides for rapid barrier restoration.', 72.00, 85.00, 22.00, '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"]'::jsonb, true, false, true),
    ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222201', 'VA-LIP-003', '890123450036', 'Velvet Cloud Cashmere Matte Lipstick', 'velvet-cloud-lipstick', 'Petal-soft blur matte lipstick with meadowfoam seed oil.', 32.00, 38.00, 11.00, '["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800"]'::jsonb, true, true, true),
    ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111108', '22222222-2222-2222-2222-222222222203', 'SB-SPF-004', '890123450043', 'Mineral Silk Fluid Broad Spectrum SPF 50+', 'mineral-silk-spf50', 'Non-nano zinc oxide mineral shield with zero white cast and blue light defense.', 42.00, 48.00, 14.50, '["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"]'::jsonb, false, true, true)
ON CONFLICT (sku) DO NOTHING;

-- 4. Makeup Shades
INSERT INTO makeup_shades (id, product_id, shade_name, shade_code, hex_color, undertone, finish, coverage) VALUES
    ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Porcelain Light', '100W', '#F9E4D4', 'warm', 'dewy', 'medium'),
    ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'Ivory Petal', '110C', '#F5DAC8', 'cool', 'dewy', 'medium'),
    ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'Golden Sand', '210W', '#EAC3A2', 'warm', 'dewy', 'medium'),
    ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333303', 'Plum Couture', '01PC', '#542B43', 'cool', 'matte', 'full'),
    ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333303', 'Dusty Petal Rose', '02DR', '#D9A6AC', 'neutral', 'natural', 'medium')
ON CONFLICT DO NOTHING;

-- 5. Inventory Batches (Including different expiry horizons calibrated to Asia/Kolkata date)
-- Normal (>50 days), Warning (<=30 days), Urgent (<=7 days), Expired (<=0 days)
INSERT INTO inventory_batches (id, product_id, shade_id, batch_number, mfg_date, expiry_date, quantity_received, quantity_available, unit_cost, lab_certification) VALUES
    ('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', '44444444-4444-4444-4444-444444444401', 'LOT-2026-FND01', '2026-08-01', ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '180 days'), 100, 84, 16.50, 'Passed - ISO 22716 GMP'),
    ('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333302', NULL, 'LOT-2026-ELX02', '2026-09-01', ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '240 days'), 60, 42, 22.00, 'Passed - Clinical Bio-Assay'),
    ('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333303', '44444444-4444-4444-4444-444444444404', 'LOT-2026-LIP03', '2026-07-15', ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '28 days'), 80, 24, 11.00, 'Warning - 28 Days Remaining'),
    ('55555555-5555-5555-5555-555555555504', '33333333-3333-3333-3333-333333333304', NULL, 'LOT-2026-SPF04', '2026-06-01', ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date - INTERVAL '5 days'), 50, 0, 14.50, 'Expired - Blocked from Billing')
ON CONFLICT DO NOTHING;

-- 6. Ingredients
INSERT INTO ingredients (id, inci_name, common_name, dermatological_function, ewg_score, is_common_allergen, status) VALUES
    ('66666666-6666-6666-6666-666666666601', 'Sodium Hyaluronate', 'Hyaluronic Acid', 'Deep Moisture Humectant', 1, false, 'approved'),
    ('66666666-6666-6666-6666-666666666602', 'Copper Tripeptide-1', 'GHK-Cu Peptide', 'Collagen & Barrier Repair', 1, false, 'approved'),
    ('66666666-6666-6666-6666-666666666603', 'Ceramide NP', 'Ceramide 3', 'Lipid Barrier Shield', 1, false, 'approved'),
    ('66666666-6666-6666-6666-666666666604', 'Zinc Oxide', 'Zinc Oxide (Non-Nano)', 'Broad Spectrum UV Filter', 2, false, 'approved'),
    ('66666666-6666-6666-6666-666666666605', 'Parfum / Fragrance', 'Synthetic Fragrance', 'Sensitizing Aroma Compound', 8, true, 'restricted'),
    ('66666666-6666-6666-6666-666666666606', 'Prunus Amygdalus Dulcis Oil', 'Sweet Almond Nut Oil', 'Emollient Nut Lipid', 1, true, 'approved')
ON CONFLICT (inci_name) DO NOTHING;
