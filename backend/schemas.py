from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DestinationBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationUpdate(DestinationBase):
    pass

class DestinationInDB(DestinationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True