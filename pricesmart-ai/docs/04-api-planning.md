# PriceSmart AI — API Planning (Phase 1)

Base URLs:
- Backend: `http://localhost:5000/api`
- AI Service: `http://localhost:8000/api` (called internally by backend only)

All backend routes (except auth) require `Authorization: Bearer <JWT>`.

## 1. Auth

| Method | Endpoint            | Description            |
|--------|----------------------|-------------------------|
| POST   | `/auth/register`     | Create user account     |
| POST   | `/auth/login`        | Login, returns JWT       |
| GET    | `/auth/me`           | Get current user profile |

## 2. Products

| Method | Endpoint              | Description                  |
|--------|-------------------------|--------------------------------|
| GET    | `/products`             | List all products (filter/paginate) |
| GET    | `/products/:id`         | Get single product details    |
| POST   | `/products`              | Create product                |
| PUT    | `/products/:id`          | Update product                |
| DELETE | `/products/:id`          | Delete product                |
| GET    | `/products/:id/history`  | Price change history for product |

## 3. AI Price Recommendation

| Method | Endpoint                              | Description                                   |
|--------|-----------------------------------------|-------------------------------------------------|
| POST   | `/pricing/recommend/:productId`          | Backend calls AI service, returns recommended price + confidence |
| POST   | `/pricing/apply/:productId`              | Apply a recommended price (writes to `pricehistories`) |
| GET    | `/pricing/history/:productId`            | Get pricing recommendation history            |

**AI Service internal:** `POST /api/predict-price`
```json
// Request
{ "productId": "...", "costPrice": 250, "currentPrice": 399, "stock": 120,
  "category": "electronics", "competitorPrices": [389, 405, 410] }

// Response
{ "recommendedPrice": 394.5, "confidenceScore": 0.87, "modelVersion": "xgb_v1.0" }
```

## 4. Demand Forecasting

| Method | Endpoint                                  | Description                     |
|--------|----------------------------------------------|-----------------------------------|
| GET    | `/forecast/:productId`                        | Get latest demand forecast        |
| POST   | `/forecast/:productId/generate`               | Trigger new forecast generation   |
| GET    | `/forecast/:productId/history`                | Historical forecast records       |

**AI Service internal:** `POST /api/forecast-demand`
```json
// Request
{ "productId": "...", "historicalSales": [...], "period": "weekly" }

// Response
{ "predictedDemand": 340, "predictedRevenue": 135660, "modelVersion": "rf_v1.0" }
```

## 5. Competitor Analysis

| Method | Endpoint                         | Description                     |
|--------|-------------------------------------|------------------------------------|
| GET    | `/competitors/:productId`            | List competitor prices for product |
| POST   | `/competitors/:productId`            | Add/update competitor price entry  |
| DELETE | `/competitors/:id`                   | Remove competitor entry            |

## 6. Analytics

| Method | Endpoint                | Description                             |
|--------|----------------------------|--------------------------------------------|
| GET    | `/analytics/overview`       | KPIs: revenue, avg margin, top movers      |
| GET    | `/analytics/price-trends`   | Price trend series across products/time    |
| GET    | `/analytics/demand-trends`  | Demand trend series                        |

## 7. Reports

| Method | Endpoint            | Description                  |
|--------|-----------------------|---------------------------------|
| GET    | `/reports`             | List generated reports          |
| POST   | `/reports/generate`    | Generate a new report (snapshot) |
| GET    | `/reports/:id`         | Get single report                |
| DELETE | `/reports/:id`         | Delete report                    |

## 8. Settings

| Method | Endpoint      | Description                |
|--------|-----------------|--------------------------------|
| GET    | `/settings`      | Get current user's settings    |
| PUT    | `/settings`      | Update settings                 |

## 9. Standard Response Envelope

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { }
}
```

Errors follow the same shape with `"success": false` and an `errors` array when validation fails.
