from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

print(f"=== Connecting to MongoDB: {settings.MONGO_URI} ===")
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]
users_collection = db.get_collection("users")
