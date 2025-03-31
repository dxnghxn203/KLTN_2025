
from core import logger
from core.mongo import db

collection_name = "reviews"

def get_all_review():
    try:
        collection = db[collection_name]
        return collection.find({}, {"_id": 0})
    except Exception as e:
        logger.error(f"Failed [get_all_review]: {e}")
        return []