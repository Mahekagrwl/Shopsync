# ShopSync — Premium Beauty E-Commerce & Smart POS Platform

ShopSync is a complete, omnichannel commerce platform designed for luxury beauty brands, clinical skincare laboratories, and retail boutiques. It unifies a customer storefront, smart retail POS register, batch-level inventory tracking with strict Asia/Kolkata expiry business logic, SkinSafe allergy detection, AI skin diagnostics, and predictive Pandas analytics.

---

## 🏛 System Architecture

```
sharkforce/
├── frontend/               # React 19 + Vite + Tailwind CSS v4 + Motion + Lucide
│   ├── src/
│   │   ├── components/     # CustomCursor, ProductCard, UI buttons, badges, modals
│   │   ├── context/        # AuthContext, CartContext, POSContext, SkinSafeContext, WishlistContext
│   │   ├── data/           # Mock beauty data, shades, categories & INCI ingredients
│   │   ├── layouts/        # CustomerLayout (storefront), AdminLayout (collapsible SaaS dashboard)
│   │   ├── pages/
│   │   │   ├── customer/   # 30 Completed Customer Storefront Pages
│   │   │   └── admin/      # 25 Completed Admin Management & Analytics Pages
│   │   ├── routes/         # Centralized React Router v7 configuration (AppRoutes.jsx)
│   │   ├── services/       # Integrated API Client (api.js) connecting to FastAPI
│   │   └── index.css       # Luxury color palette & typography tokens
│   ├── vercel.json         # Vercel SPA routing rewrite rules
│   └── package.json
│
├── backend/                # Python FastAPI Backend Architecture
│   ├── app/
│   │   ├── api/v1/         # 14 REST Router Modules
│   │   │   ├── endpoints/  # auth, products, categories, brands, inventory,
│   │   │   │               # expiry, pos, orders, skinsafe, ai, reviews, feedback,
│   │   │   │               # analytics (Pandas), notifications
│   │   │   └── api.py      # Master v1 API aggregator
│   │   ├── core/           # Security (bcrypt, JWT tokens) and Pydantic settings
│   │   ├── db/             # MasterDataStore, repository, and Supabase integration
│   │   └── main.py         # FastAPI application entry, CORS & health checks
│   ├── tests/              # Pytest integration test suite (16 tests, 100% passing)
│   ├── requirements.txt    # Python production dependencies
│   ├── Dockerfile          # Production container setup
│   ├── Procfile            # Deployment runner
│   └── venv/               # Dedicated Python virtual environment
│
├── database/               # Supabase PostgreSQL Infrastructure
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_complete_shopsync_schema.sql  # 26 tables, RLS policies, Asia/Kolkata view
│   │   └── 003_seed_data.sql                # Categories, brands, products, shades, batches
│   └── README.md
│
├── render.yaml             # Render cloud hosting blueprint
├── vercel.json             # Root Vercel SPA configuration
└── package.json            # Unified workspace scripts
```

---

## 🎨 Luxury Brand Design System

| Token | Hex Code | Purpose |
|---|---|---|
| **Warm Cream** | `#F8F3EE` | Storefront primary canvas background |
| **Deep Plum** | `#542B43` | Primary brand accent, navigation, badges & luxury buttons |
| **Dusty Rose** | `#D9A6AC` | Soft borders, hover highlights, glowing cursor ring |
| **Soft Beige** | `#E9DED5` | Card backgrounds, banner containers, dropdown surfaces |
| **Charcoal** | `#282426` | High-contrast typography & headings |
| **Pure White** | `#FFFFFF` | Product cards, modals & POS ticket panels |

### Typography & Animations
- **Headings**: `Playfair Display` serif for selected couture headings.
- **Body & Controls**: `Inter` sans-serif for crystal clarity.
- **Microinteractions**: Custom animated trailing cursor (rose core dot + plum outer ring, hides on touch devices, respects `prefers-reduced-motion`), floating cosmetic hero sparkles, product zoom, animated wishlist heart, add-to-cart feedback, and live AI dermal scanning progress.

---

## 📅 Inventory & Expiry Management (Asia/Kolkata Business Date)

ShopSync maintains inventory strictly at the **batch and variant level**.
- **Timezone**: Evaluated dynamically using `ZoneInfo("Asia/Kolkata")`. Days remaining is calculated automatically from the business date—store staff never manually enter remaining days.
- **Expiry Severity Bands**:
  1. `Normal`: > 50 days remaining.
  2. `Upcoming`: 50 days or less.
  3. `Warning`: 30 days or less.
  4. `Critical`: 15 days or less.
  5. `Urgent`: 7 days or less.
  6. `Expired`: 0 days or less (Strictly unsellable).
- **Strict Sale Blocking**: Expired batches are automatically quarantined and strictly rejected from both online checkout and physical POS registers.
- **FEFO Allocation**: First-Expiring, First-Out algorithm prioritizes batches with the closest valid expiry date to minimize cosmetic spoilage.

---

## 🛒 Smart POS Billing Register

- **Barcode & SKU Lookup**: Instant scanner simulation and text search.
- **Makeup Shade Selection**: Compulsory shade selection for pigmented products (undertone, finish, coverage).
- **Customer Loyalty**: Guest walk-in or customer profile search with 1 pt per $1 spent.
- **Invoice Generation**: Automated calculation of discounts, taxes (8.25%), tender type (Cash, Card, Digital), and immediate thermal invoice printing.

---

## 🌿 SkinSafe Allergy Checker & AI Engine

- **SkinSafe**: Analyzes product INCI formulations against customer sensitivities (Synthetic Fragrance, Tree Nut Oils, Parabens, Sulfates, Silicones, Essential Oils, Chemical UV Filters). Outputs clear `SAFE`, `WARNING`, or `DANGER` ratings with EWG ingredient safety scores.
- **AI Skin Diagnostics**: Multi-parameter dermal assessment (Hydration, Barrier Integrity, Sensitivity Index, Cellular Radiance) with a clinical 3-step targeted regimen.
- **Personalized Recommendations**: Machine learning recommendation engine that automatically filters out products containing any customer-flagged allergens.

---

## 📊 Pandas Business Intelligence & Forecasting

- **Sales Velocity**: Multi-channel revenue aggregation (Storefront vs. POS), transaction volume, and Average Order Value (AOV).
- **Profit Analytics**: COGS tracking, gross profit calculation, and gross margin percentage.
- **Demand Forecasting**: 30-day velocity run rates by category and days of supply projection.
- **Smart Reordering**: Automated purchase order recommendations based on 14-day supplier lead time and 7-day safety stock buffers.

---

## ⚡ Running ShopSync Locally

### 1. Start the React Frontend (Port 5173)
```powershell
npm run dev
```
Accessible at: `http://localhost:5173/`
- Customer Storefront: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin/dashboard`
- POS Billing Terminal: `http://localhost:5173/admin/pos`

### 2. Start the FastAPI Backend (Port 8000)
```powershell
$env:PYTHONPATH="backend"
& "backend\venv\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs (Swagger UI): `http://127.0.0.1:8000/api/v1/docs`
- Health Endpoint: `http://127.0.0.1:8000/health`
- Expiry Batches: `http://127.0.0.1:8000/api/v1/expiry/batches`

### 3. Run Automated Integration Tests (16 Tests)
```powershell
$env:PYTHONPATH="backend"
& "backend\venv\Scripts\pytest.exe" backend/tests/ -v
```

---

## 🚀 Deployment

- **Frontend (Vercel)**: Configured with `vercel.json` for client-side React Router routing. Deploy with `vercel --prod` or connect GitHub repository to Vercel.
- **Backend (Render / Railway / Docker)**: Configured with `render.yaml`, `Procfile`, and `backend/Dockerfile`. Set environment variables `SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY`.
