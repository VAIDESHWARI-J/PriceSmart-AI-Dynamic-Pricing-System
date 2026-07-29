"""
models.py
----------
Pydantic request/response models used across the FastAPI routes.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class Product(BaseModel):
    id: int
    name: str
    category: str
    image: str
    current_price: float
    competitor_price: float
    demand_score: float
    stock_quantity: int
    sales_history: int
    customer_visits: int
    season_factor: float


class PredictPriceRequest(BaseModel):
    product_id: Optional[int] = None
    category: str
    current_price: float
    competitor_price: float
    demand_score: float
    stock_quantity: int
    sales_history: int
    customer_visits: int
    season_factor: float


class PredictPriceResponse(BaseModel):
    recommended_price: float
    price_change_pct: float
    expected_profit_increase: float
    expected_revenue_increase: float
    confidence_score: float
    reasons: List[str]


class UpdatePriceRequest(BaseModel):
    product_id: int
    new_price: float
