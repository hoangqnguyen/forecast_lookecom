import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def sample_payload():
    return dict(
        category="Accessories",
        traffic_source="Search",
        day_of_week=0, # Chủ Nhật
        current_cost=4.99
    )

def test_home():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200

def test_optimize_price(sample_payload):
    with TestClient(app) as client:
        response = client.post("/optimize-price", json=sample_payload)
        assert response.status_code == 200
        print(response.json())
