
from datetime import datetime
from core.database import db

class EventModel:
    collection = db.events

    @staticmethod
    async def create(event_data: dict):
        return await EventModel.collection.insert_one(event_data)

    @staticmethod
    async def find_by_type(event_type: str):
        return await EventModel.collection.find({"event_type": event_type}).to_list(None)