# PriceSmart AI — Database Design (Phase 1)

Database: **MongoDB** (document store, Mongoose ODM on the backend).

## 1. Collections Overview

| Collection         | Purpose                                                          |
|---------------------|-------------------------------------------------------------------|
| `users`             | Auth + role (admin/analyst) for JWT-protected access             |
| `products`          | Core product catalog: cost, current price, category, stock       |
| `pricehistories`    | Time-series log of every price change (manual or AI-driven)      |
| `demandforecasts`   | AI-generated demand predictions per product per period            |
| `competitorprices`  | Scraped/entered competitor pricing per product                    |
| `reports`           | Generated report metadata + snapshot data for download/reuse      |
| `settings`          | Per-user/workspace configuration (currency, pricing rules, thresholds) |

## 2. Schema Definitions

### 2.1 `users`
```js
{
  _id: ObjectId,
  name: String,
  email: String,          // unique, indexed
  password: String,       // bcrypt hash
  role: "admin" | "analyst",
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 `products`
```js
{
  _id: ObjectId,
  name: String,
  sku: String,             // unique, indexed
  category: String,
  description: String,
  costPrice: Number,
  basePrice: Number,       // list price before AI adjustment
  currentPrice: Number,    // active/effective price
  stock: Number,
  minPrice: Number,        // pricing guardrail
  maxPrice: Number,        // pricing guardrail
  imageUrl: String,
  createdBy: ObjectId,     // ref: users
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 `pricehistories`
```js
{
  _id: ObjectId,
  productId: ObjectId,     // ref: products, indexed
  oldPrice: Number,
  newPrice: Number,
  changeReason: "manual" | "ai_recommendation" | "competitor_adjustment",
  changedBy: ObjectId,     // ref: users (nullable if system/AI)
  confidenceScore: Number, // AI confidence, if applicable
  createdAt: Date
}
```

### 2.4 `demandforecasts`
```js
{
  _id: ObjectId,
  productId: ObjectId,     // ref: products, indexed
  forecastPeriod: "daily" | "weekly" | "monthly",
  predictedDemand: Number,
  predictedRevenue: Number,
  modelVersion: String,    // e.g. "xgb_v1.2"
  generatedAt: Date
}
```

### 2.5 `competitorprices`
```js
{
  _id: ObjectId,
  productId: ObjectId,     // ref: products, indexed
  competitorName: String,
  competitorPrice: Number,
  source: String,          // manual entry / API / scraped
  recordedAt: Date
}
```

### 2.6 `reports`
```js
{
  _id: ObjectId,
  title: String,
  type: "pricing" | "demand" | "competitor" | "summary",
  generatedBy: ObjectId,   // ref: users
  dateRange: { from: Date, to: Date },
  dataSnapshot: Object,    // stored aggregation result for re-render/export
  createdAt: Date
}
```

### 2.7 `settings`
```js
{
  _id: ObjectId,
  userId: ObjectId,        // ref: users, unique
  currency: String,        // e.g. "INR", "USD"
  defaultMargin: Number,   // %
  aiAutoApply: Boolean,    // whether AI recs auto-apply or need approval
  notificationPrefs: {
    priceAlerts: Boolean,
    demandAlerts: Boolean
  },
  updatedAt: Date
}
```

## 3. Indexing Plan

- `users.email` — unique index
- `products.sku` — unique index
- `products.category` — index (dashboard filtering)
- `pricehistories.productId` + `createdAt` — compound index (timeline queries)
- `demandforecasts.productId` + `forecastPeriod` — compound index
- `competitorprices.productId` — index

## 4. Relationships (document references, not joins)

- `products.createdBy` → `users._id`
- `pricehistories.productId` → `products._id`
- `pricehistories.changedBy` → `users._id`
- `demandforecasts.productId` → `products._id`
- `competitorprices.productId` → `products._id`
- `reports.generatedBy` → `users._id`
- `settings.userId` → `users._id`
