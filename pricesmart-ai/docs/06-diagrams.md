# PriceSmart AI — Diagrams (Phase 1)

All diagrams are written in Mermaid syntax. Paste into any Mermaid live editor
(https://mermaid.live) or view directly in VS Code with the "Markdown Preview Mermaid Support" extension.

## 1. ER Diagram

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : creates
    USERS ||--o{ REPORTS : generates
    USERS ||--|| SETTINGS : configures
    PRODUCTS ||--o{ PRICEHISTORIES : has
    PRODUCTS ||--o{ DEMANDFORECASTS : has
    PRODUCTS ||--o{ COMPETITORPRICES : has
    USERS ||--o{ PRICEHISTORIES : "changes (optional)"

    USERS {
        ObjectId _id
        string name
        string email
        string password
        string role
    }
    PRODUCTS {
        ObjectId _id
        string name
        string sku
        string category
        number costPrice
        number basePrice
        number currentPrice
        number stock
        number minPrice
        number maxPrice
        ObjectId createdBy
    }
    PRICEHISTORIES {
        ObjectId _id
        ObjectId productId
        number oldPrice
        number newPrice
        string changeReason
        ObjectId changedBy
        number confidenceScore
    }
    DEMANDFORECASTS {
        ObjectId _id
        ObjectId productId
        string forecastPeriod
        number predictedDemand
        number predictedRevenue
        string modelVersion
    }
    COMPETITORPRICES {
        ObjectId _id
        ObjectId productId
        string competitorName
        number competitorPrice
        string source
    }
    REPORTS {
        ObjectId _id
        string title
        string type
        ObjectId generatedBy
        object dataSnapshot
    }
    SETTINGS {
        ObjectId _id
        ObjectId userId
        string currency
        number defaultMargin
        boolean aiAutoApply
    }
```

## 2. Use Case Diagram

```mermaid
flowchart LR
    Admin(["Admin User"])
    Analyst(["Analyst User"])

    subgraph System["PriceSmart AI"]
        UC1(["Manage Products"])
        UC2(["View Dashboard"])
        UC3(["Request AI Price Recommendation"])
        UC4(["Apply Recommended Price"])
        UC5(["Generate Demand Forecast"])
        UC6(["Manage Competitor Prices"])
        UC7(["View Analytics"])
        UC8(["Generate Reports"])
        UC9(["Configure Settings"])
        UC10(["Manage Users"])
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10

    Analyst --> UC2
    Analyst --> UC3
    Analyst --> UC5
    Analyst --> UC6
    Analyst --> UC7
    Analyst --> UC8
```

## 3. Core Workflow Diagram — AI Price Recommendation

```mermaid
flowchart TD
    Start(["User opens Product Details"]) --> Req["User clicks 'Get AI Recommendation'"]
    Req --> BE["Backend: POST /pricing/recommend/:id"]
    BE --> Gather["Backend gathers cost, current price,\nstock, competitor prices"]
    Gather --> AI["AI Service: POST /predict-price\n(XGBoost model inference)"]
    AI --> Score["Model returns recommendedPrice\n+ confidenceScore"]
    Score --> Return["Backend returns result to frontend"]
    Return --> Show["Frontend shows recommendation card"]
    Show --> Decision{"User applies\nrecommendation?"}
    Decision -- "Yes" --> Apply["POST /pricing/apply/:id"]
    Apply --> Log["Write entry to pricehistories\n(changeReason: ai_recommendation)"]
    Log --> Update["Update product.currentPrice"]
    Update --> Done(["Dashboard & Analytics refresh"])
    Decision -- "No" --> End(["No changes made"])
```

## 4. Core Workflow Diagram — Demand Forecasting

```mermaid
flowchart TD
    A(["User selects forecast period"]) --> B["POST /forecast/:id/generate"]
    B --> C["Backend fetches historical sales data\nfor product"]
    C --> D["AI Service: POST /forecast-demand"]
    D --> E["Model (RandomForest/XGBoost) predicts\ndemand & revenue"]
    E --> F["Backend saves result to demandforecasts"]
    F --> G["Frontend renders forecast chart\n+ history table"]
```

## 5. System Architecture Diagram

(See `01-architecture.md §2` for the full annotated version.)

```mermaid
flowchart TB
    FE["React + Vite Frontend"] -->|"REST + JWT"| BE["Express Backend API"]
    BE -->|"REST"| AI["Flask AI Service"]
    BE -->|"Mongoose"| DB[("MongoDB")]
```
