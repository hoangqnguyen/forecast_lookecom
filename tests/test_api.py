import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

@pytest.fixture
def sample_payload():
    return dict(
        category="Accessories",
        traffic_source="Search",
        day_of_week=0, # Chủ Nhật
        current_cost=4.99
    )

def test_home(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200

def test_optimize_price(client: TestClient, sample_payload: dict):
    response = client.post("/optimize-price", json=sample_payload)
    assert response.status_code == 200
