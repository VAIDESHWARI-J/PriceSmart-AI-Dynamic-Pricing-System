"""
routes/prediction.py
----------------------
Wraps the trained ML model (ml_model/pricing_model.pkl) as a REST API.
"""

import os
import sys
from datetime import datetime

from fastapi import APIRouter, HTTPException

from models import PredictPriceRequest, PredictPriceResponse
from database import save_prediction, get_product

# Make ml_model importable regardless of where uvicorn is launched from
ML_MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "ml_model")
if ML_MODEL_DIR not in sys.path:
    sys.path.append(ML_MODEL_DIR)

router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict-price", response_model=PredictPriceResponse)
def predict_price(payload: PredictPriceRequest):
    try:
        from predict import predict_price as ml_predict_price
    except ImportError as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "ML model not found. Run 'python train_model.py' inside the "
                f"ml_model/ folder first. ({exc})"
            ),
        )

    result = ml_predict_price(
        category=payload.category,
        current_price=payload.current_price,
        competitor_price=payload.competitor_price,
        demand_score=payload.demand_score,
        stock_quantity=payload.stock_quantity,
        sales_history=payload.sales_history,
        customer_visits=payload.customer_visits,
        season_factor=payload.season_factor,
    )

    save_prediction(
        {
            "product_id": payload.product_id,
            "category": payload.category,
            "current_price": payload.current_price,
            **result,
            "created_at": datetime.utcnow().isoformat(),
        }
    )

    return result
