from urllib.parse import quote_plus
from dotenv import load_dotenv
from app.core import logger
import pymongo
import os

logger.set_pymongo_log_level()

load_dotenv()

conn = f"mongodb://127.0.0.1:27017/KLTN_2025"
logger.info("Url mongo : " + conn)
try:
    # Connect to MongoDB
    client = pymongo.MongoClient(conn)
    db = client[db_name]
    logger.info("Kết nối MongoDB thành công!")

except Exception as e:
    logger.error("Lỗi khi kết nối MongoDB!", error=e)