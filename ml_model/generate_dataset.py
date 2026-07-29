"""
generate_dataset.py
--------------------
Generates a synthetic e-commerce pricing dataset (500+ rows) used to train
the PriceSmart AI Random Forest pricing model.

Run:
    python generate_dataset.py
Produces:
    dataset.csv
"""

import numpy as np
import pandas as pd

np.random.seed(42)

CATEGORIES = ["Electronics", "Fashion", "Footwear", "Accessories", "Wearables", "Home Appliances"]
N_ROWS = 600


def generate_row(_):
    category = np.random.choice(CATEGORIES)

    # Base price ranges differ by category to keep data realistic
    base_price_map = {
        "Electronics": (15000, 150000),
        "Fashion": (500, 6000),
        "Footwear": (1200, 12000),
        "Accessories": (300, 5000),
        "Wearables": (2000, 40000),
        "Home Appliances": (3000, 60000),
    }
    low, high = base_price_map[category]
    current_price = np.random.uniform(low, high)

    # Competitor price fluctuates +/-15% around current price
    competitor_price = current_price * np.random.uniform(0.85, 1.15)

    demand_score = np.random.uniform(0, 100)          # 0-100
    stock_quantity = np.random.randint(0, 500)         # units
    sales_history = np.random.randint(0, 1000)          # units sold last 30 days
    customer_visits = np.random.randint(50, 20000)       # page visits last 30 days
    season_factor = np.random.uniform(0.8, 1.3)          # seasonal multiplier

    # ----- Ground-truth pricing logic (what the model should learn) -----
    # Higher demand & low stock => price goes up
    # Higher competitor price => can push price up a bit
    # Low sales / high stock => price goes down to clear inventory
    demand_effect = (demand_score - 50) / 100          # -0.5 .. 0.5
    stock_effect = -((stock_quantity - 250) / 500)       # low stock -> positive
    competitor_effect = (competitor_price - current_price) / current_price * 0.5
    season_effect = (season_factor - 1.0)
    sales_effect = (sales_history - 500) / 1000

    adjustment = (
        demand_effect * 0.08
        + stock_effect * 0.05
        + competitor_effect * 0.4
        + season_effect * 0.15
        + sales_effect * 0.04
    )

    # clip adjustment to +/-20%
    adjustment = np.clip(adjustment, -0.20, 0.20)

    noise = np.random.normal(0, 0.01)
    recommended_price = current_price * (1 + adjustment + noise)
    recommended_price = max(recommended_price, current_price * 0.5)

    return {
        "category": category,
        "current_price": round(current_price, 2),
        "competitor_price": round(competitor_price, 2),
        "demand_score": round(demand_score, 2),
        "stock_quantity": stock_quantity,
        "sales_history": sales_history,
        "customer_visits": customer_visits,
        "season_factor": round(season_factor, 2),
        "recommended_price": round(recommended_price, 2),
    }


def main():
    rows = [generate_row(i) for i in range(N_ROWS)]
    df = pd.DataFrame(rows)
    df.to_csv("dataset.csv", index=False)
    print(f"Generated dataset.csv with {len(df)} rows")


if __name__ == "__main__":
    main()
