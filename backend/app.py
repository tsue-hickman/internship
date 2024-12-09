from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, Destination, engine, Base
from routes import router as destinations_router

# FastAPI App Initialization
app = FastAPI()

# Database initialization
Base.metadata.create_all(bind=engine)

# CORS configuration for FastAPI (allowing all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(destinations_router, prefix="/api/v1")

# FastAPI Database Dependency
def get_db():
    db_session = Session(bind=engine)
    try:
        yield db_session
    finally:
        db_session.close()

# FastAPI Routes (Destinations)
@app.get("/destinations")
def get_destinations(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    return [{"id": dest.id, "name": dest.name, "type": dest.type, "description": dest.description, "createdAt": dest.created_at} for dest in destinations]

@app.post("/destinations")
def create_destination(data: dict, db: Session = Depends(get_db)):
    new_dest = Destination(
        name=data['name'],
        type=data['type'],
        description=data.get('description', '')
    )
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)
    return {"message": "Destination created", "id": new_dest.id}, 201

@app.put("/destinations/{id}")
def update_destination(id: int, data: dict, db: Session = Depends(get_db)):
    dest = db.query(Destination).get(id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    dest.name = data['name']
    dest.type = data['type']
    dest.description = data.get('description', dest.description)
    db.commit()
    return {"message": "Destination updated"}

@app.delete("/destinations/{id}")
def delete_destination(id: int, db: Session = Depends(get_db)):
    dest = db.query(Destination).get(id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    db.delete(dest)
    db.commit()
    return {"message": "Destination deleted"}

# Flask Integration
flask_app = Flask(__name__)

# CORS configuration for Flask (allowing all origins)
CORS(flask_app)

# Database configuration for Flask
flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(flask_app)

# Flask Migrate Initialization
migrate = Migrate(flask_app, db)

# Flask Routes
@flask_app.route('/flask/destinations', methods=['GET'])
def get_destinations_flask():
    destinations = Destination.query.all()
    return jsonify([{
        "id": dest.id,
        "name": dest.name,
        "type": dest.type,
        "description": dest.description,
        "createdAt": dest.created_at
    } for dest in destinations])

@flask_app.route('/flask/destinations', methods=['POST'])
def create_destination_flask():
    data = request.json
    new_dest = Destination(
        name=data['name'],
        type=data['type'],
        description=data.get('description', '')
    )
    db.session.add(new_dest)
    db.session.commit()
    return jsonify({"message": "Destination created", "id": new_dest.id}), 201

@flask_app.route('/flask/destinations/<int:id>', methods=['PUT'])
def update_destination_flask(id):
    data = request.json
    dest = Destination.query.get_or_404(id)
    dest.name = data['name']
    dest.type = data['type']
    dest.description = data.get('description', dest.description)
    db.session.commit()
    return jsonify({"message": "Destination updated"})

@flask_app.route('/flask/destinations/<int:id>', methods=['DELETE'])
def delete_destination_flask(id):
    dest = Destination.query.get_or_404(id)
    db.session.delete(dest)
    db.session.commit()
    return jsonify({"message": "Destination deleted"})

# Run FastAPI and Flask Apps
if __name__ == '__main__':
    import threading

    def run_flask():
        flask_app.run(debug=True, port=5000)

    # Start Flask app in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Run FastAPI app using Uvicorn
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
