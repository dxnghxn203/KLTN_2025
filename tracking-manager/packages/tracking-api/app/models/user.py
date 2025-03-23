from app.core import database

collection_name = "users"

async def get_by_email(email: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email})