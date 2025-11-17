"""
Script to update movie types in MongoDB database.
Movies will be classified as:
- 'movie': Single films (1 episode or duration-based)
- 'anime': Multi-episode series or movies with 'Anime' genre

Run this script to add the 'type' field to all movies in the database.
"""

import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'ONLINE_ENTERTAINMENT_PLATFORM')

def connect_to_db():
    """Connect to MongoDB database"""
    try:
        client = MongoClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
        return db
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        sys.exit(1)

def update_movie_types(db):
    """
    Update movie types based on genres.
    - If movie has 'Anime' in genres → type = 'anime'
    - Otherwise → type = 'movie'
    """
    movies_collection = db['movies']

    # Count total movies
    total_movies = movies_collection.count_documents({})
    print(f"📊 Total movies in database: {total_movies}")

    # Update anime (movies with 'Anime' in genres)
    anime_result = movies_collection.update_many(
        {
            '$or': [
                {'genres': {'$regex': 'anime', '$options': 'i'}},
                {'genres': {'$regex': 'アニメ', '$options': 'i'}}
            ]
        },
        {'$set': {'type': 'anime'}}
    )
    print(f"✅ Updated {anime_result.modified_count} movies to type='anime'")

    # Update movies (all movies without type or not anime)
    movie_result = movies_collection.update_many(
        {
            '$and': [
                {'type': {'$ne': 'anime'}},
                {
                    '$and': [
                        {'genres': {'$not': {'$regex': 'anime', '$options': 'i'}}},
                        {'genres': {'$not': {'$regex': 'アニメ', '$options': 'i'}}}
                    ]
                }
            ]
        },
        {'$set': {'type': 'movie'}}
    )
    print(f"✅ Updated {movie_result.modified_count} movies to type='movie'")

    # Verify results
    anime_count = movies_collection.count_documents({'type': 'anime'})
    movie_count = movies_collection.count_documents({'type': 'movie'})
    no_type_count = movies_collection.count_documents({'type': {'$exists': False}})

    print(f"\n📈 Final Statistics:")
    print(f"   - Anime: {anime_count}")
    print(f"   - Movies: {movie_count}")
    print(f"   - No type: {no_type_count}")

    if no_type_count > 0:
        print(f"\n⚠️  Warning: {no_type_count} movies still don't have a type!")
        print("   Setting them to 'movie' by default...")
        default_result = movies_collection.update_many(
            {'type': {'$exists': False}},
            {'$set': {'type': 'movie'}}
        )
        print(f"✅ Updated {default_result.modified_count} movies to default type='movie'")

def show_sample_data(db):
    """Show sample data for verification"""
    movies_collection = db['movies']

    print("\n📝 Sample Anime:")
    anime_samples = movies_collection.find({'type': 'anime'}).limit(3)
    for movie in anime_samples:
        print(f"   - {movie.get('title', 'N/A')} | Genres: {movie.get('genres', [])}")

    print("\n📝 Sample Movies:")
    movie_samples = movies_collection.find({'type': 'movie'}).limit(3)
    for movie in movie_samples:
        print(f"   - {movie.get('title', 'N/A')} | Genres: {movie.get('genres', [])}")

def main():
    """Main function"""
    print("=" * 60)
    print("🎬 Movie Type Update Script")
    print("=" * 60)

    # Connect to database
    db = connect_to_db()

    # Update movie types
    update_movie_types(db)

    # Show sample data
    show_sample_data(db)

    print("\n" + "=" * 60)
    print("✅ Movie type update completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
