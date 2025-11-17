"""
Debug script to insert movies
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def main():
    # Connect to MongoDB
    MONGO_URI = "mongodb://mongo:27017"
    DATABASE_NAME = "ONLINE_ENTERTAINMENT_PLATFORM"

    print(f"Connecting to: {MONGO_URI}")
    print(f"Database: {DATABASE_NAME}")

    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    movies_collection = db.get_collection("movies")

    # Check current count
    count_before = await movies_collection.count_documents({})
    print(f"Movies before: {count_before}")

    # List existing movies
    existing = await movies_collection.find({}, {"title": 1}).to_list(100)
    print(f"Existing movies: {[m['title'] for m in existing]}")

    # Insert one test movie
    movie = {
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "thumbnailUrl": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        "bannerUrl": "https://wallpapercave.com/wp/wp2224209.jpg",
        "videoUrl": "https://ia800107.us.archive.org/20/items/inception-2010/Inception%20%282010%29.mp4",
        "duration": 8880,  # 148 minutes
        "releaseYear": 2010,
        "director": "Christopher Nolan",
        "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
        "genres": ["Sci-Fi", "Thriller", "Action", "Mystery"],
        "country": "United States",
        "totalViews": 0,
        "rating": 4.7,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 6,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    # Delete if exists
    deleted = await movies_collection.delete_one({"title": "Inception"})
    print(f"Deleted existing Inception: {deleted.deleted_count}")

    # Insert
    result = await movies_collection.insert_one(movie)
    print(f"Inserted Inception with ID: {result.inserted_id}")

    # Check count after
    count_after = await movies_collection.count_documents({})
    print(f"Movies after: {count_after}")

    client.close()

if __name__ == "__main__":
    asyncio.run(main())
