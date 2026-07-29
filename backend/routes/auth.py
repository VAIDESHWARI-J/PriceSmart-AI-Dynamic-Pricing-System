"""
routes/auth.py
----------------
Handles JWT-based login for the dashboard.

Sample login credentials (seeded in database.py):
    email:    admin@pricesmart.ai
    password: admin123
"""

import os
from datetime import datetime, timedelta

import jwt
from fastapi import APIRouter, HTTPException

from database import find_user
from models import LoginRequest, LoginResponse

router = APIRouter(prefix="/api", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "pricesmart-ai-dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 12  # 12 hours


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    user = find_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["email"], "role": user["role"]})
    user_public = {k: v for k, v in user.items() if k != "password"}
    return LoginResponse(access_token=token, user=user_public)
