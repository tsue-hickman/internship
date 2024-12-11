from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from models import db, Destination, engine, Base
from routes import router as destinations_router
from database import init_db # Import the init_db function

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

app.include_router(destinations_router, prefix="/api/v1", router),

# Initialize database 
init_db() 

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

# Run FastAPI App
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)