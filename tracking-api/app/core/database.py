import motor.motor_asyncio
import os

mongo_client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
db = mongo_client.tracking_db
