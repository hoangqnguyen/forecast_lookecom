import joblib
import pandas as pd
import xgboost as xgb
from dataclasses import dataclass

@dataclass
class ModelConfig:
    model_path: str
    le_source_path: str
    le_category_path: str

def load_model(config: ModelConfig):
    # Load model XGBoost 
    model = xgb.XGBRegressor()
    model.load_model(config.model_path)

    # Load label encoders
    le_category = joblib.load(config.le_category_path)
    le_source = joblib.load(config.le_source_path)

    return model, le_category, le_source

def predict_demand(model: xgb.XGBRegressor, price: float, category_id: int, source_id: int, day_of_week: int, round_down: bool = True):
    # Tạo input data
    input_data = pd.DataFrame(dict(
        avg_price=[price], category_encoded=[category_id], source_encoded=[source_id], day_of_week=[day_of_week]
    ))

    # Predict
    pred = model.predict(input_data)[0]
    return max(0.0, int(pred) if round_down else float(pred)) # Ko nên có demand âm

def predict_profit(model: xgb.XGBRegressor, price: float, category_id: int, source_id: int, cost: float, day_of_week: int):
    demand = predict_demand(model, price, category_id, source_id, day_of_week)
    total_profit = (price - cost) * demand
    return total_profit, demand