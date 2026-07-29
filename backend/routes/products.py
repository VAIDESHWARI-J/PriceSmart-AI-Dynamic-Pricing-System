"""
routes/products.py
--------------------
CRUD-style endpoints for products, price history and competitor data.
"""

from fastapi import APIRouter, HTTPException

from database import (
    get_products,
    get_product,
    get_price_history,
    get_competitor,
    update_product_price,
)
from models import UpdatePriceRequest

router = APIRouter(prefix="/api", tags=["products"])


@router.get("/products")
def list_products():
    return get_products()


@router.get("/product/{product_id}")
def product_details(product_id: int):
    product = get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "product": product,
        "price_history": get_price_history(product_id),
        "competitor": get_competitor(product_id),
    }


@router.put("/update-price")
def update_price(payload: UpdatePriceRequest):
    product = get_product(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_product_price(payload.product_id, payload.new_price)
    return {"message": "Price updated successfully", "product_id": payload.product_id, "new_price": payload.new_price}
