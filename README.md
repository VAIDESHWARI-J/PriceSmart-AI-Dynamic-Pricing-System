# PriceSmart AI - Dynamic Pricing System

An AI/ML-powered dynamic pricing platform for e-commerce. It analyzes demand,
competitor pricing, inventory, seasonality and sales history to recommend the
optimal selling price for every product — using a Random Forest regression
model served through a FastAPI backend and visualized in a React dashboard.

---

## 1. Project Overview

PriceSmart AI helps online retailers stop guessing at prices. The ML model
looks at:

- Customer demand
- Competitor pricing
- Inventory availability
- Seasonal trends
- Historical sales data
- Market/traffic trends

...and outputs an AI-recommended price, the expected profit/revenue impact,
and a plain-English explanation of *why* the price changed.

## 2. Features

- 🔐 JWT-based admin login
- 📊 AI Pricing Control Center dashboard (revenue, profit, AI updates, charts)
- 📦 Product management table with AI recommended price per product
- 🔍 Product details page: price history, sales history, competitor
  comparison, AI analysis, and a one-click "Apply Recommended Price" action
- ✨ AI Recommendations page — confidence-scored pricing suggestions
- ⚖️ Competitor analysis vs Amazon / Flipkart
- 📈 Analytics: revenue, profit, demand forecasting, customer behaviour
- 📦 Inventory page with low-stock and high-demand alerts
- 🧾 Reports page (pricing / revenue / AI decision reports)
- 🎨 Premium dark SaaS dashboard UI with glassmorphism cards and gradients

## 3. Architecture

```
                ┌────────────────────┐
                │   React + Vite     │  <- Dashboard UI (Tailwind, Recharts)
                │   frontend/        │
                └─────────┬──────────┘
                          │ REST (Axios / JWT)
                ┌─────────▼──────────┐
                │   FastAPI backend  │  <- Auth, Products, Prediction routes
                │   backend/         │
                └─────────┬──────────┘
                          │
         ┌────────────────┼───────────────────┐
         │                                     │
┌────────▼─────────┐                ┌──────────▼───────────┐
│  MongoDB          │                │  ml_model/            │
│  (optional;        │                │  pricing_model.pkl    │
│  falls back to      │                │  (Random Forest,       │
│  in-memory sample    │                │  scikit-learn)          │
│  data automatically) │                └────────────────────────┘
└──────────────────────┘
```

The frontend never talks to the ML model directly — it calls the FastAPI
`/api/predict-price` endpoint, which loads `ml_model/pricing_model.pkl` and
returns a recommendation. If the backend isn't running, the frontend
gracefully falls back to bundled demo data so the UI is always explorable.

## 4. Project Structure

```
PriceSmart-AI/
├── frontend/               # React + Vite + Tailwind dashboard
│   └── src/
│       ├── api/            # Axios client
│       ├── components/     # Sidebar, Topbar, StatCard, ProtectedRoute
│       ├── context/        # AuthContext (JWT)
│       ├── data/           # Mock/demo data fallback
│       └── pages/          # Login, Dashboard, Products, ProductDetails,
│                            #   Recommendations, Competitors, Analytics,
│                            #   Inventory, Reports
├── backend/                # FastAPI REST API
│   ├── main.py
│   ├── database.py         # Mongo connection + in-memory fallback + seed data
│   ├── models.py           # Pydantic schemas
│   └── routes/
│       ├── auth.py
│       ├── products.py
│       └── prediction.py
├── ml_model/                # Machine learning
│   ├── generate_dataset.py  # Builds dataset.csv (600 rows)
│   ├── dataset.csv
│   ├── train_model.py       # Trains & saves pricing_model.pkl
│   ├── predict.py           # Loads model, exposes predict_price()
│   └── pricing_model.pkl
├── requirements.txt
└── README.md
```

## 5. Installation & Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- (Optional) MongoDB running locally — otherwise the backend automatically
  uses seeded in-memory sample data.

### 5.1 Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # optional, only needed for real MongoDB
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 5.2 Machine Learning model

The trained model (`pricing_model.pkl`) is already included, so this step is
optional unless you want to regenerate it:

```bash
cd ml_model
pip install -r ../requirements.txt
python generate_dataset.py      # regenerates dataset.csv (600 rows)
python train_model.py           # retrains and saves pricing_model.pkl
python predict.py               # quick manual test
```

### 5.3 Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env            # points at http://localhost:8000/api
npm run dev
```

App: http://localhost:5173

### 5.4 Sample login credentials

```
Email:    admin@pricesmart.ai
Password: admin123
```

## 6. How AI Pricing Works

1. `ml_model/generate_dataset.py` synthesizes 600 rows of realistic product
   data (category, current price, competitor price, demand score, stock,
   sales history, customer visits, season factor) with a ground-truth pricing
   rule baked in (demand ↑ and stock ↓ push price up; high competitor price
   allows a premium; off-season / high stock pushes price down).
2. `ml_model/train_model.py` trains a **Random Forest Regressor** (scikit-learn)
   inside a `Pipeline` with one-hot encoding for `category`, and saves it to
   `pricing_model.pkl` with `joblib`.
3. `backend/routes/prediction.py` exposes `POST /api/predict-price`, which
   loads the pickled pipeline via `ml_model/predict.py` and returns:
   - `recommended_price`
   - `price_change_pct`
   - `expected_profit_increase` / `expected_revenue_increase`
   - `confidence_score`
   - a list of plain-English `reasons` (demand, stock, competitor, season)
4. The React dashboard calls this endpoint for the featured product on the
   Dashboard, for every product on the Recommendations page, and for the
   selected product on the Product Details page — then lets the admin
   **Apply Recommended Price**, which calls `PUT /api/update-price`.

## 7. API Reference

| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| POST   | `/api/login`            | Authenticate, returns JWT             |
| GET    | `/api/products`         | List all products                     |
| GET    | `/api/product/{id}`     | Product details + history + competitor|
| POST   | `/api/predict-price`    | Run the ML model, get a recommendation|
| PUT    | `/api/update-price`     | Persist the applied price             |

## 8. Database Collections (MongoDB)

- `users`
- `products`
- `price_history`
- `competitors`
- `predictions`

If MongoDB isn't available, `backend/database.py` automatically seeds and
uses an equivalent in-memory store so the whole app still runs end-to-end.

## 9. Future Improvements

- Swap Random Forest for a gradient-boosted model (XGBoost/LightGBM) and
  add hyperparameter tuning
- Real competitor price scraping/integration instead of simulated data
- A/B testing framework to validate AI price changes against actual revenue
- Role-based access control (admin vs analyst vs viewer)
- Scheduled batch re-pricing with approval workflow
- Real-time WebSocket price update stream to the dashboard
