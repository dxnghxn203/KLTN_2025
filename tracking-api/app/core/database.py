from urllib.parse import quote_plus
from dotenv import load_dotenv
from app.core import logger
import pymongo
import os

logger.set_pymongo_log_level()
load_dotenv()

# Database configuration
DB_NAME = "KLTN_2025"
USERNAME = quote_plus("dxnghxn203")
PASSWORD = quote_plus("2908203Hen@")
CLUSTER = "kltn2025.qyu1q.mongodb.net"

# Build connection string
conn = f"mongodb+srv://{USERNAME}:{PASSWORD}@{CLUSTER}/{DB_NAME}"
logger.info("Connecting to MongoDB...")

try:
    # Connect with timeout settings
    client = pymongo.MongoClient(
        conn,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000
    )
    
    # Test connection
    client.admin.command('ping')
    
    # Get database instance
    db = client[DB_NAME]
    logger.info("MongoDB connection successful!")

except pymongo.errors.ConfigurationError as e:
    logger.error("MongoDB Configuration Error!", error=str(e))
    raise
except pymongo.errors.ConnectionFailure as e:
    logger.error("MongoDB Connection Error!", error=str(e))
    raise
except Exception as e:
    logger.error("MongoDB Error!", error=str(e))
    raise