from urllib.parse import quote_plus
from dotenv import load_dotenv
from app.core import logger
import pymongo
import os

logger.set_pymongo_log_level()

DB_NAME = "KLTN_2025"
USERNAME = quote_plus("dxnghxn203")
PASSWORD = quote_plus("2908203Hen@")
CLUSTER = "kltn2025.qyu1q.mongodb.net"

# Build connection string
conn = f"mongodb+srv://{USERNAME}:{PASSWORD}@{CLUSTER}/{DB_NAME}"
logger.info("Connecting to MongoDB...")
logger.info("Url mongo : " + conn)
try:
    # Connect to MongoDB
    client = pymongo.MongoClient(
        conn,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000
    )
    
    # Test connection
    client.admin.command('ping')
    # Connect to MongoDB
    # Get database instance
    db = client[DB_NAME]
    logger.info("MongoDB connection successful!")

    existing_collections = db.list_collection_names()
    collections = [
        'admin', 'categories', 'orders',
        'comments', 'products', 'reviews',
        'users','trackings', 'pharmacists']
    for collection in collections:
        if collection not in existing_collections:
            db.create_collection(collection)
            logger.info(f"Collection '{collection}' đã được tạo.")
        else:
            logger.info(f"Collection '{collection}' đã tồn tại.")

except Exception as e:
    logger.error("Lỗi khi kết nối MongoDB!", error=e)


