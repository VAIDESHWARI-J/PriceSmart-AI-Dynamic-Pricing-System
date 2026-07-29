# PriceSmart AI — Folder Structure (Phase 1)

This is the FULL target structure for the finished project. Files will be created
progressively in later phases — nothing here is generated yet except what's listed
under `docs/`. Use this as the map for what's coming.

```
pricesmart-ai/
│
├── docs/                                  # ✅ Phase 1 (this phase)
│   ├── 01-architecture.md
│   ├── 02-folder-structure.md
│   ├── 03-database-design.md
│   ├── 04-api-planning.md
│   ├── 05-ui-structure.md
│   └── 06-diagrams.md
│
├── frontend/                              # ⏳ Phase 3
│   ├── public/
│   ├── src/
│   │   ├── api/                           # axios instance + endpoint modules
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/                    # Button, Card, Modal, Loader, etc.
│   │   │   ├── layout/                    # Navbar, Sidebar, DashboardLayout
│   │   │   ├── charts/                    # Recharts wrappers
│   │   │   └── products/
│   │   ├── context/                       # AuthContext, ThemeContext
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Products/
│   │   │   ├── ProductDetails/
│   │   │   ├── PriceRecommendation/
│   │   │   ├── DemandForecasting/
│   │   │   ├── CompetitorAnalysis/
│   │   │   ├── Analytics/
│   │   │   ├── Reports/
│   │   │   ├── Settings/
│   │   │   └── Auth/                      # Login / Register
│   │   ├── routes/                        # AppRouter, ProtectedRoute
│   │   ├── store/                         # global state (context or zustand)
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/                               # ⏳ Phase 2
│   ├── src/
│   │   ├── config/                        # db.js, env.js
│   │   ├── models/                        # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── PriceHistory.js
│   │   │   ├── DemandForecast.js
│   │   │   ├── Competitor.js
│   │   │   ├── Report.js
│   │   │   └── Settings.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/                    # auth.js, errorHandler.js, validate.js
│   │   ├── services/                      # aiService.js (calls Flask API)
│   │   ├── utils/
│   │   └── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── ai-service/                            # ⏳ Phase 4
│   ├── app/
│   │   ├── models/                        # trained .pkl / .joblib artifacts
│   │   ├── routes/                        # pricing_routes.py, forecast_routes.py
│   │   ├── services/                      # pricing_engine.py, forecasting.py
│   │   ├── utils/
│   │   └── __init__.py
│   ├── notebooks/                         # model training notebooks
│   ├── data/                              # sample/training datasets
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
│
├── .gitignore
└── README.md
```

## Notes

- Each service (`frontend`, `backend`, `ai-service`) is independently runnable and has its own dependency manifest and `.env.example`.
- `docs/` ships with the repo so any hackathon judge or teammate can read the design without running anything.
- Trained ML artifacts are kept out of git in practice (`.gitignore`) but a placeholder path is reserved so the backend integration code (Phase 2/4) has a stable contract to call against.
