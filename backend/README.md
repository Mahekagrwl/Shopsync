# ShopSync Backend (FastAPI + Supabase)

High-performance, asynchronous REST API backend powering the ShopSync omnichannel platform (Storefront & In-Store Smart POS).

## Architecture Overview

```
backend/
├── app/
│   ├── api/             # API routing & versioning (/api/v1)
│   │   └── v1/
│   │       ├── endpoints/ # Feature routers (auth, products, pos, etc.)
│   │       └── api.py    # Main v1 APIRouter aggregator
│   ├── core/            # App settings (Pydantic), security & JWT helpers
│   ├── db/              # Supabase client / PostgreSQL engine session
│   ├── models/          # Relational entities & ORM models
│   ├── schemas/         # Pydantic request & response models
│   ├── services/        # Domain business logic
│   └── main.py          # FastAPI application factory & health endpoints
├── requirements.txt     # Python production dependencies
└── .env.example         # Environment template
```

## Getting Started

### 1. Create a Python Virtual Environment
```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

- Interactive OpenAPI Swagger Docs: `http://localhost:8000/api/v1/docs`
- Health check: `http://localhost:8000/health`
