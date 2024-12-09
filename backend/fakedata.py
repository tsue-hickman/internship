from faker import Faker
import random
from sqlalchemy.orm import Session
from models import Destination, Customer

fake = Faker()

def generate_destination():
    return {
        'name': fake.city(),
        'type': random.choice(['Urban', 'Rural', 'Coastal', 'Mountain', 'Desert']),
        'description': fake.paragraph()
    }

def populate_destinations(db: Session, num_destinations: int = 50):
    destinations = [Destination(**generate_destination()) for _ in range(num_destinations)]
    db.add_all(destinations)
    db.commit()
    return destinations