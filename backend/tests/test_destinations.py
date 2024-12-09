from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app import app
from database import Base, get_db
from models import Destination

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

def test_create_destination():
    destination_data = {
        "name": "Test Destination",
        "type": "City",
        "description": "A test destination"
    }
    response = client.post("/destinations/", json=destination_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Destination"
    assert "id" in data

def test_read_destinations():
    response = client.get("/destinations/")
    assert response.status_code == 200
    destinations = response.json()
    assert len(destinations) > 0

def test_update_destination():
    # First create a destination
    create_response = client.post("/destinations/", json={
        "name": "Update Test",
        "type": "City",
        "description": "To be updated"
    })
    created_destination = create_response.json()

    # Then update it
    update_data = {
        "name": "Updated Destination",
        "description": "Updated description"
    }
    update_response = client.put(f"/destinations/{created_destination['id']}", json=update_data)
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["name"] == "Updated Destination"

def test_delete_destination():
    # First create a destination
    create_response = client.post("/destinations/", json={
        "name": "Delete Test",
        "type": "City",
        "description": "To be deleted"
    })
    created_destination = create_response.json()

    # Then delete it
    delete_response = client.delete(f"/destinations/{created_destination['id']}")
    assert delete_response.status_code == 200

def test_get_nonexistent_destination():
    response = client.get("/destinations/9999")
    assert response.status_code == 404