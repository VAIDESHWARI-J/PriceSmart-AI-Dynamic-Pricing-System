"""
main.py
--------
PriceSmart AI - FastAPI backend entrypoint.

Run:
    uvicorn main:app --reload --port 8000

Docs available at:
    http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, products, prediction

app = FastAPI(
    title="PriceSmart AI API",
    description="AI-Based Dynamic Pricing System backend",
    version="1.0.0",
)

# Allow the Vite frontend (default port 5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(prediction.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "PriceSmart AI API", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
