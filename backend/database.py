"""
database.py
------------
Handles MongoDB connection. Falls back to an in-memory data store (seeded
with sample data) automatically if MongoDB is not running / not installed,
so the API works out-of-the-box without any extra setup.

Set MONGO_URI in a .env file (or environment variable) to point at a real
MongoDB instance to persist data instead of using the in-memory fallback.
"""

import os
from datetime import datetime, timedelta
import random

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "pricesmart_ai")

USE_MONGO = False
db = None

try:
    from pymongo import MongoClient

    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1500)
    client.server_info()  # force connection check
    db = client[DB_NAME]
    USE_MONGO = True
    print("[database] Connected to MongoDB at", MONGO_URI)
except Exception as exc:  # pragma: no cover - fallback path
    print("[database] MongoDB not available, using in-memory store. Reason:", exc)
    USE_MONGO = False


# ---------------------------------------------------------------------------
# In-memory fallback store (mirrors the Mongo collections: Users, Products,
# PriceHistory, Competitors, Predictions)
# ---------------------------------------------------------------------------

CATEGORIES = ["Electronics", "Fashion", "Footwear", "Accessories", "Wearables"]

SAMPLE_PRODUCTS = [
    {
        "id": 1,
        "name": "iPhone 15 Pro",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300",
        "current_price": 134900,
        "competitor_price": 139900,
        "demand_score": 88,
        "stock_quantity": 34,
        "sales_history": 512,
        "customer_visits": 15200,
        "season_factor": 1.15,
    },
    {
        "id": 2,
        "name": "Sony WH-1000XM5",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300",
        "current_price": 29990,
        "competitor_price": 27990,
        "demand_score": 62,
        "stock_quantity": 120,
        "sales_history": 240,
        "customer_visits": 6100,
        "season_factor": 1.0,
    },
    {
        "id": 3,
        "name": "Nike Air Max",
        "category": "Footwear",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
        "current_price": 8995,
        "competitor_price": 9495,
        "demand_score": 71,
        "stock_quantity": 210,
        "sales_history": 340,
        "customer_visits": 8300,
        "season_factor": 1.05,
    },
    {
        "id": 4,
        "name": "Fossil Smartwatch",
        "category": "Wearables",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
        "current_price": 15995,
        "competitor_price": 14995,
        "demand_score": 45,
        "stock_quantity": 340,
        "sales_history": 95,
        "customer_visits": 3100,
        "season_factor": 0.92,
    },
    {
        "id": 5,
        "name": "Titan Perfume",
        "category": "Accessories",
        "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300",
        "current_price": 1995,
        "competitor_price": 1895,
        "demand_score": 38,
        "stock_quantity": 480,
        "sales_history": 60,
        "customer_visits": 1800,
        "season_factor": 0.88,
    },
    {
        "id": 6,
        "name": "MacBook Air M2",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300",
        "current_price": 104990,
        "competitor_price": 109990,
        "demand_score": 85,
        "stock_quantity": 18,
        "sales_history": 210,
        "customer_visits": 9800,
        "season_factor": 1.2,
    },
]

SAMPLE_USERS = [
    {"id": 1, "email": "admin@pricesmart.ai", "password": "admin123", "role": "admin", "name": "Admin User"},
]

SAMPLE_COMPETITORS = [
    {"product_id": 1, "amazon": 136900, "flipkart": 135900},
    {"product_id": 2, "amazon": 28990, "flipkart": 27490},
    {"product_id": 3, "amazon": 9295, "flipkart": 8895},
    {"product_id": 4, "amazon": 15495, "flipkart": 14795},
    {"product_id": 5, "amazon": 2095, "flipkart": 1795},
    {"product_id": 6, "amazon": 106990, "flipkart": 105490},
]


def _build_price_history():
    history = {}
    today = datetime.utcnow()
    for product in SAMPLE_PRODUCTS:
        series = []
        price = product["current_price"] * 0.9
        for i in range(30, 0, -1):
            date = today - timedelta(days=i)
            price *= random.uniform(0.995, 1.015)
            series.append({"date": date.strftime("%Y-%m-%d"), "price": round(price, 2)})
        history[product["id"]] = series
    return history


_memory_store = {
    "users": SAMPLE_USERS,
    "products": SAMPLE_PRODUCTS,
    "competitors": SAMPLE_COMPETITORS,
    "price_history": _build_price_history(),
    "predictions": [],
}


def get_products():
    if USE_MONGO:
        return list(db.products.find({}, {"_id": 0}))
    return _memory_store["products"]


def get_product(product_id: int):
    if USE_MONGO:
        return db.products.find_one({"id": product_id}, {"_id": 0})
    return next((p for p in _memory_store["products"] if p["id"] == product_id), None)


def update_product_price(product_id: int, new_price: float):
    if USE_MONGO:
        db.products.update_one({"id": product_id}, {"$set": {"current_price": new_price}})
        return
    for p in _memory_store["products"]:
        if p["id"] == product_id:
            p["current_price"] = new_price


def get_price_history(product_id: int):
    if USE_MONGO:
        doc = db.price_history.find_one({"product_id": product_id}, {"_id": 0})
        return doc["series"] if doc else []
    return _memory_store["price_history"].get(product_id, [])


def get_competitor(product_id: int):
    if USE_MONGO:
        return db.competitors.find_one({"product_id": product_id}, {"_id": 0})
    return next((c for c in _memory_store["competitors"] if c["product_id"] == product_id), None)


def find_user(email: str, password: str):
    if USE_MONGO:
        return db.users.find_one({"email": email, "password": password}, {"_id": 0})
    return next(
        (u for u in _memory_store["users"] if u["email"] == email and u["password"] == password),
        None,
    )


def save_prediction(record: dict):
    if USE_MONGO:
        db.predictions.insert_one(record)
    else:
        _memory_store["predictions"].append(record)
