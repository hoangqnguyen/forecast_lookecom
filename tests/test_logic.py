import pytest
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from app import ModelConfig, logic

@pytest.fixture
def model_config():
    return ModelConfig(
        model_path="models/best_model.json",
        le_source_path="models/source_encoder.pkl",
        le_category_path="models/category_encoder.pkl",
    )

def test_load_model(model_config):
    model, le_category, le_source = logic.load_model(model_config)

    assert type(model) == xgb.XGBRegressor
    assert type(le_category) == LabelEncoder
    assert type(le_source) == LabelEncoder

def test_predict_demand(model_config):
    model, _, _ = logic.load_model(model_config)

    pred_demand = logic.predict_demand(
        model=model,
        price=23.99,
        category_id=0,
        source_id=1,
        day_of_week=2
    )

    assert type(pred_demand) == float
    assert pred_demand >= 0

def test_predict_profit(model_config):
    model, _, _ = logic.load_model(model_config)

    pred_profit, pred_demand = logic.predict_profit(
        model=model,
        price=23.99,
        category_id=0,
        source_id=1,
        cost=3.99,
        day_of_week=2
    )

    assert type(pred_profit) == type(pred_demand) == float
    assert pred_profit >= 0
    assert pred_demand >= 0
