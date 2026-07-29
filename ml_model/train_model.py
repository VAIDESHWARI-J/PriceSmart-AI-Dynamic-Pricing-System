"""
train_model.py
----------------
Trains a Random Forest Regression model to predict the AI-recommended
product price, using dataset.csv.

Run:
    python train_model.py
Produces:
    pricing_model.pkl   (trained sklearn Pipeline: preprocessing + model)
"""

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
import joblib

NUMERIC_FEATURES = [
    "current_price",
    "competitor_price",
    "demand_score",
    "stock_quantity",
    "sales_history",
    "customer_visits",
    "season_factor",
]
CATEGORICAL_FEATURES = ["category"]
TARGET = "recommended_price"


def main():
    df = pd.read_csv("dataset.csv")

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
        ],
        remainder="passthrough",
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"Model trained. MAE: {mae:.2f}, R2: {r2:.4f}")

    joblib.dump(pipeline, "pricing_model.pkl")
    print("Saved trained model to pricing_model.pkl")


if __name__ == "__main__":
    main()
