from app.core.config import get_settings
from motor.motor_asyncio import AsyncIOMotorClient

settings = get_settings()
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]

users_collection = db.get_collection("users")
transactions_collection = db.get_collection("transactions")
notifications_collection = db.get_collection("notifications")
watching_progress_collection = db.get_collection("watching_progress")
movies_collection = db.get_collection("movies")
premium_subscriptions_collection = db.get_collection("premiumSubscriptions")
ratings_collection = db.get_collection("ratings")
books_collection = db.get_collection("books")
comments_collection = db.get_collection("comments")