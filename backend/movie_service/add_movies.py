"""
Script to add 5 classic movies to the database
Run this from the movie_service directory:
python add_movies.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URI = "mongodb://mongo:27017"
DATABASE_NAME = "ONLINE_ENTERTAINMENT_PLATFORM"

movies_data = [
    {
        "title": "Nosferatu",
        "description": "A classic silent horror film about a vampire named Count Orlok who preys on a small German town. One of the first vampire films ever made.",
        "thumbnailUrl": "https://m.media-amazon.com/images/M/MV5BNDg1OTI1M2MtMTVlMS00ZjFhLTgyMTAtYjIzOWUwZTkyZWE5XkEyXkFqcGc@._V1_.jpg",
        "bannerUrl": "https://images.squarespace-cdn.com/content/v1/5a79de6f9f8dce3b1b0ce70a/1551852862642-0ONINVS85W73Z6YJWCZC/Nosferatu1.jpg",
        "videoUrl": "https://ia803207.us.archive.org/33/items/nosferatu-1922/Nosferatu%20%281922%29.mp4",
        "duration": 4920,  # 82 minutes
        "releaseYear": 1922,
        "director": "F.W. Murnau",
        "cast": ["Max Schreck", "Greta Schröder", "Gustav von Wangenheim"],
        "genres": ["Horror", "Fantasy", "Silent"],
        "country": "Germany",
        "totalViews": 0,
        "rating": 0.0,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 1,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "title": "The Matrix",
        "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "thumbnailUrl": "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg",
        "bannerUrl": "https://images.hdqwalls.com/download/the-matrix-4k-0c-3840x2160.jpg",
        "videoUrl": "https://ia800901.us.archive.org/7/items/the.-matrix.-1999.-remastered.-proper.-1080p.-blu-ray.-h-264.-aac-rarbg/The.Matrix.1999.REMASTERED.PROPER.1080p.BluRay.H264.AAC-RARBG.mp4",
        "duration": 8160,  # 136 minutes
        "releaseYear": 1999,
        "director": "The Wachowskis",
        "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
        "genres": ["Action", "Sci-Fi", "Thriller"],
        "country": "United States",
        "totalViews": 0,
        "rating": 0.0,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 2,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "title": "TRON",
        "description": "A computer programmer is transported into a digital world where he must survive deadly games and fight the Master Control Program.",
        "thumbnailUrl": "https://m.media-amazon.com/images/M/MV5BMTA4Y2VjOWEtMWQ5MS00YWU5LTkxZTMtNzVmMDYyNWFiODU5XkEyXkFqcGc@._V1_.jpg",
        "bannerUrl": "https://wallpapercave.com/wp/wp2108648.jpg",
        "videoUrl": "https://archive.org/details/tron-1982-4-k-hdr",
        "duration": 5760,  # 96 minutes
        "releaseYear": 1982,
        "director": "Steven Lisberger",
        "cast": ["Jeff Bridges", "Bruce Boxleitner", "David Warner", "Cindy Morgan"],
        "genres": ["Sci-Fi", "Action", "Adventure"],
        "country": "United States",
        "totalViews": 0,
        "rating": 0.0,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 3,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "title": "Memento",
        "description": "A man with short-term memory loss attempts to track down his wife's murderer using notes, tattoos, and Polaroid photos.",
        "thumbnailUrl": "https://alternativemovieposters.com/wp-content/uploads/2024/08/Geoffrey-Riccio_Memento.jpg",
        "bannerUrl": "https://wallpapercave.com/wp/wp8935099.jpg",
        "videoUrl": "https://dn720005.ca.archive.org/0/items/memento.-2000.1080p.-blu-ray.x-264.-yify/Memento.2000.1080p.BluRay.x264.YIFY.mp4",
        "duration": 6780,  # 113 minutes
        "releaseYear": 2000,
        "director": "Christopher Nolan",
        "cast": ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
        "genres": ["Mystery", "Thriller", "Drama"],
        "country": "United States",
        "totalViews": 0,
        "rating": 0.0,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 4,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
        "thumbnailUrl": "https://pbs.twimg.com/media/G5JugB4W4AAdAc2.jpg",
        "bannerUrl": "https://wallpapercave.com/wp/wp1818679.jpg",
        "videoUrl": "https://ia902908.us.archive.org/9/items/interstellar-2014/Interstellar%20%282014%29.mp4",
        "duration": 10140,  # 169 minutes
        "releaseYear": 2014,
        "director": "Christopher Nolan",
        "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
        "genres": ["Sci-Fi", "Drama", "Adventure"],
        "country": "United States",
        "totalViews": 0,
        "rating": 0.0,
        "totalRatings": 0,
        "isPremium": False,
        "isFeatured": True,
        "featuredRank": 5,
        "isActive": True,
        "isDeleted": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
]

async def add_movies():
    """Add movies to MongoDB"""
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    movies_collection = db.get_collection("movies")

    print("🎬 Adding movies to database...")

    for movie in movies_data:
        # Check if movie already exists
        existing = await movies_collection.find_one({"title": movie["title"]})
        if existing:
            print(f"⚠️  Movie '{movie['title']}' already exists, skipping...")
            continue

        # Insert movie
        result = await movies_collection.insert_one(movie)
        print(f"✅ Added: {movie['title']} ({movie['releaseYear']}) - ID: {result.inserted_id}")

    print("\n🎉 Done! Movies added successfully!")

    # Show total count
    total = await movies_collection.count_documents({})
    print(f"📊 Total movies in database: {total}")

    client.close()

if __name__ == "__main__":
    asyncio.run(add_movies())
