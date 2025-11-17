"""
Script to update existing movies with bannerUrl
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

MONGO_URI = "mongodb://mongo:27017"
DATABASE_NAME = "ONLINE_ENTERTAINMENT_PLATFORM"

# Mapping bannerUrls for existing movies
banner_mappings = {
    "Inception": "https://wallpapercave.com/wp/wp2224209.jpg",
    "Harry Potter và Hòn Đá Phù Thủy": "https://images5.alphacoders.com/690/690808.jpg",
    "The Lord of the Rings: The Fellowship of the Ring": "https://wallpapercave.com/wp/wp1854089.jpg",
    "Parasite (Ký Sinh Trùng)": "https://images8.alphacoders.com/107/1079379.jpg",
    "Coco": "https://images2.alphacoders.com/907/907764.jpg",
}

async def main():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    movies_collection = db.get_collection("movies")

    print("🎬 Updating movies with bannerUrl...")

    for title, banner_url in banner_mappings.items():
        result = await movies_collection.update_one(
            {"title": title},
            {"$set": {
                "bannerUrl": banner_url,
                "updatedAt": datetime.utcnow()
            }}
        )
        if result.modified_count > 0:
            print(f"✅ Updated {title}")
        else:
            print(f"⚠️  {title} not found or already has bannerUrl")

    # Show all movies with bannerUrl status
    print("\n📊 Current movies:")
    movies = await movies_collection.find(
        {},
        {"title": 1, "bannerUrl": 1, "isFeatured": 1}
    ).to_list(100)

    for movie in movies:
        has_banner = "✅" if movie.get("bannerUrl") else "❌"
        featured = "⭐" if movie.get("isFeatured") else "  "
        print(f"{has_banner} {featured} {movie['title']}")

    client.close()

if __name__ == "__main__":
    asyncio.run(main())
