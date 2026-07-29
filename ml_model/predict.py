"""
predict.py
-----------
Loads pricing_model.pkl and exposes a predict_price() function that the
FastAPI backend imports to generate AI price recommendations.
"""

import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "pricing_model.pkl")

_model = None


def _load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def predict_price(
    category: str,
    current_price: float,
    competitor_price: float,
    demand_score: float,
    stock_quantity: int,
    sales_history: int,
    customer_visits: int,
    season_factor: float,
):
    """Returns the AI recommended price plus some derived metrics."""
    model = _load_model()

    row = pd.DataFrame(
        [
            {
                "category": category,
                "current_price": current_price,
                "competitor_price": competitor_price,
                "demand_score": demand_score,
                "stock_quantity": stock_quantity,
                "sales_history": sales_history,
                "customer_visits": customer_visits,
                "season_factor": season_factor,
            }
        ]
    )

    recommended_price = float(model.predict(row)[0])
    price_change_pct = (recommended_price - current_price) / current_price * 100

    # Simple heuristic reasons for explainability, driven by the same inputs
    reasons = []
    if demand_score >= 65:
        reasons.append("High demand for this product")
    elif demand_score <= 30:
        reasons.append("Low demand, consider clearing stock")

    if stock_quantity <= 50:
        reasons.append("Low stock availability")
    elif stock_quantity >= 300:
        reasons.append("High stock levels, discount recommended")

    if competitor_price > current_price:
        reasons.append("Competitor price is higher than ours")
    elif competitor_price < current_price:
        reasons.append("Competitor price is lower, consider matching")

    if season_factor >= 1.1:
        reasons.append("Seasonal / festival demand boost")
    elif season_factor <= 0.9:
        reasons.append("Off-season, lower demand expected")

    if not reasons:
        reasons.append("Market conditions are stable")

    expected_profit_increase = round(price_change_pct * 0.7, 2)  # simplistic estimate
    expected_revenue_increase = round(price_change_pct * 0.5, 2)

    confidence_score = round(min(95, max(60, 80 + (demand_score - 50) / 5)), 1)

    return {
        "recommended_price": round(recommended_price, 2),
        "price_change_pct": round(price_change_pct, 2),
        "expected_profit_increase": expected_profit_increase,
        "expected_revenue_increase": expected_revenue_increase,
        "confidence_score": confidence_score,
        "reasons": reasons,
    }


if __name__ == "__main__":
    # quick manual test
    result = predict_price(
        category="Electronics",
        current_price=104990,
        competitor_price=109999,
        demand_score=85,
        stock_quantity=20,
        sales_history=430,
        customer_visits=9800,
        season_factor=1.2,
    )
    print(result)
