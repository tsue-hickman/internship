from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import Destination
from schemas import DestinationCreate, DestinationUpdate, DestinationInDB

router = APIRouter()

@router.post("/destinations/", response_model=DestinationInDB)
def create_destination(destination: DestinationCreate, db: Session = Depends(get_db)):
    db_destination = Destination(**destination.dict())
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    return db_destination

@router.get("/destinations/", response_model=List[DestinationInDB])
def read_destinations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    destinations = db.query(Destination).offset(skip).limit(limit).all()
    return destinations

@router.put("/destinations/{destination_id}", response_model=DestinationInDB)
def update_destination(destination_id: int, destination: DestinationUpdate, db: Session = Depends(get_db)):
    db_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not db_destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    for key, value in destination.dict(exclude_unset=True).items():
        setattr(db_destination, key, value)
    
    db.commit()
    db.refresh(db_destination)
    return db_destination

@router.delete("/destinations/{destination_id}", response_model=dict)
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    db_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not db_destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    db.delete(db_destination)
    db.commit()
    return {"detail": "Destination deleted successfully"}