from app.core.config import get_settings
from motor.motor_asyncio import AsyncIOMotorClient

settings = get_settings()
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]

# Collections
collections_collection = db.get_collection("collections")
users_collection = db.get_collection("users")
movies_collection = db.get_collection("movies")
books_collection = db.get_collection("books")
