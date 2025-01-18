from datetime import datetime
from bson import ObjectId

@staticmethod
async def create(event_data: dict):
    return {
        "id": str(ObjectId()),
        "event_type": event_data["event_type"],
        "event_data": event_data["event_data"],
        "created_at": datetime.utcnow()
    }

@staticmethod
async def find_by_type(event_type: str):
    return {
        "id": str(ObjectId()),
    }