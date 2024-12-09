from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Destination(Base):
    __tablename__ = 'destinations'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50))
    description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())