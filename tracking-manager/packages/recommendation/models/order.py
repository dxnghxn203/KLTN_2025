
from core import logger
from core.mongo import db

collection_name = "orders"

def get_all_order():
    try:
        collection = db[collection_name]
        return collection.find({}, {"_id": 0})
    except Exception as e:
        logger.error(f"Failed [get_all_order]: {e}")
        return []