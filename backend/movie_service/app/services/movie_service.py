from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.response import success, fail
from app.core.database import (
    movies_collection, books_collection, watching_progress_collection,
    ratings_collection, users_collection
)
from app.schemas.movie_dto import *
import json
import hashlib

# Redis cache helper
async def get_redis():
    from app.core.token_blacklist import redis_client
    return redis_client

# Cache key generator
# app/services/movie_service.py
def cache_key(prefix: str, **kwargs):
    # Chỉ serialize các giá trị an toàn
    safe_kwargs = {}
    for k, v in kwargs.items():
        if v is None:
            safe_kwargs[k] = "null"
        elif isinstance(v, (str, int, float, bool)):
            safe_kwargs[k] = v
        else:
            safe_kwargs[k] = str(v)  # fallback
    return f"{prefix}:{json.dumps(safe_kwargs, sort_keys=True)}"

# 1. List movies
# 1. LIST MOVIES – ĐÚNG FORMAT
async def get_movies(user_id: str | None, query: MovieFilterQuery):
    pipeline = []

    match_stage = {"isActive": True, "isDeleted": False}
    if query.type:
        match_stage["type"] = query.type
    if query.genre:
        match_stage["genres"] = query.genre
    if query.year:
        match_stage["releaseYear"] = query.year
    if query.search:
        match_stage["$text"] = {"$search": query.search}
    if query.isPremium is not None:
        match_stage["isPremium"] = query.isPremium
    if query.isFeatured is not None:
        match_stage["isFeatured"] = query.isFeatured

    pipeline.append({"$match": match_stage})

    # Project đúng format
    project_stage = {
        "id": {"$toString": "$_id"},
        "title": 1,
        "description": 1,
        "thumbnail": "$thumbnailUrl",
        "thumbnailUrl": 1,
        "bannerUrl": 1,
        "duration": 1,
        "releaseYear": 1,
        "genres": 1,  # ← TRẢ VỀ MẢNG, KHÔNG ĐẾM
        "viewCount": "$totalViews",
        "rating": 1,
        "isPremium": 1,
        "hasBook": {"$ne": ["$adaptedFromBookId", None]}
    }
    pipeline.append({"$project": project_stage})

    # Sort
    sort_map = {
        "latest": {"createdAt": -1},
        "rating": {"rating": -1},
        "viewCount": {"totalViews": -1}
    }
    pipeline.append({"$sort": sort_map.get(query.sortBy, {"featuredRank": 1, "totalViews": -1})})

    # Pagination
    pipeline.extend([
        {"$skip": (query.page - 1) * query.limit},
        {"$limit": query.limit}
    ])

    movies = await movies_collection.aggregate(pipeline).to_list(query.limit)
    total = await movies_collection.count_documents(match_stage)

    return {
        "movies": movies,
        "pagination": {
            "total": total,
            "page": query.page,
            "limit": query.limit,
            "totalPages": (total + query.limit - 1) // query.limit
        }
    }

# 2. SEARCH – FIX REDIS
# app/services/movie_service.py
async def search_content(
    query: str,
    user_id: str | None = None,
    page: int = 1,
    limit: int = 20
):
    regex = {"$regex": query, "$options": "i"}
    skip = (page - 1) * limit

    # Tìm phim
    movie_pipeline = [
        {"$match": {
            "$or": [{"title": regex}, {"description": regex}],
            "isActive": True,
            "isDeleted": False
        }},
        {"$sort": {"totalViews": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "description": 1,
            "thumbnailUrl": 1,
            "bannerUrl": 1,
            "rating": 1,
            "totalViews": 1,
            "releaseYear": 1,
            "genres": 1,
            "duration": 1,
            "isPremium": 1,
            "adaptedFromBookId": 1
        }}
    ]

    movies = await movies_collection.aggregate(movie_pipeline).to_list(limit)

    # Lấy danh sách book_id từ phim
    book_ids = [m["adaptedFromBookId"] for m in movies if m.get("adaptedFromBookId")]

    books = []
    if book_ids:
        books = await books_collection.find({
            "_id": {"$in": book_ids},
            "isActive": True,
            "isDeleted": False
        }).to_list(len(book_ids))
        # Chuyển _id thành str
        for b in books:
            b["id"] = str(b["_id"])
            del b["_id"]

    # Gắn sách vào phim tương ứng
    book_map = {str(b["id"]): b for b in books}
    for movie in movies:
        book_id = movie.get("adaptedFromBookId")
        if book_id and str(book_id) in book_map:
            movie["book"] = book_map[str(book_id)]
        # Xóa field phụ
        movie.pop("adaptedFromBookId", None)

    total_movies = await movies_collection.count_documents({
        "$or": [{"title": regex}, {"description": regex}],
        "isActive": True, "isDeleted": False
    })

    return {
        "movies": movies,
        "books": books,  # optional, chỉ có khi liên kết
        "pagination": {
            "total": total_movies,
            "page": page,
            "limit": limit
        }
    }

# 3. GET MOVIE DETAIL
async def get_movie_detail(movie_id: str, user_id: Optional[str]):
    movie = await movies_collection.find_one({
        "_id": ObjectId(movie_id),
        "isActive": True,
        "isDeleted": False
    })
    if not movie:
        raise HTTPException(404, "Movie not found")

    # Allow all users (guest and authenticated) to VIEW movie details
    # Only block when they try to WATCH (handled in start_watching endpoint)
    # So we remove this premium check from get_movie_detail
    # if movie.get("isPremium") and user_id:
    #     user = await users_collection.find_one({"_id": ObjectId(user_id)})
    #     if not user or not user.get("isPremium"):
    #         raise HTTPException(403, "Premium content")

    book = None
    if movie.get("adaptedFromBookId"):
        book = await books_collection.find_one(
            {"_id": movie["adaptedFromBookId"]},
            {"title": 1, "author": 1}
        )

    progress = None
    if user_id:
        prog = await watching_progress_collection.find_one({
            "userId": ObjectId(user_id),
            "movieId": ObjectId(movie_id)
        })
        if prog:
            total = prog.get("duration") or movie["duration"]
            progress = {
                "watchedSeconds": prog["currentTime"],
                "percentage": round(prog["currentTime"] / total * 100, 2),
                "lastWatchedAt": prog["viewedAt"].isoformat() if prog["viewedAt"] else None
            }

    return {
        "id": str(movie["_id"]),
        "title": movie["title"],
        "description": movie["description"],
        "thumbnailUrl": movie["thumbnailUrl"],
        "bannerUrl": movie.get("bannerUrl"),
        "videoUrl": movie["videoUrl"],
        "duration": movie["duration"],
        "releaseYear": movie["releaseYear"],
        "director": movie.get("director"),
        "cast": movie.get("cast", []),
        "genres": movie.get("genres", []),
        "country": movie.get("country", "Unknown"),
        "viewCount": movie["totalViews"],
        "rating": movie["rating"],
        "totalRatings": movie["totalRatings"],
        "isPremium": movie["isPremium"],
        "book": {
            "id": str(book["_id"]),
            "title": book["title"],
            "author": book["author"]
        } if book else None,
        "userProgress": progress
    }

# 4. UPDATE PROGRESS – FIX REDIS + totalSeconds tự động
async def update_progress(movie_id: str, user_id: str, data: WatchProgressDTO):
    cache = await get_redis()
    if cache:
        rate_key = f"progress_rate:{user_id}:{movie_id}"
        try:
            if await cache.get(rate_key):
                raise HTTPException(429, "Too many requests")
            await cache.setex(rate_key, 1, "1")
        except Exception as e:
            print(f"Redis rate limit error: {e}")  # Không crash

    movie = await movies_collection.find_one({"_id": ObjectId(movie_id)})
    if not movie:
        raise HTTPException(404, "Movie not found")

    total_seconds = data.totalSeconds or movie["duration"]
    percentage = round(data.watchedSeconds / total_seconds * 100, 2) if total_seconds else 0

    await watching_progress_collection.update_one(
        {"userId": ObjectId(user_id), "movieId": ObjectId(movie_id)},
        {"$set": {
            "currentTime": data.watchedSeconds,
            "duration": total_seconds,
            "percentage": percentage,
            "viewedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }},
        upsert=True
    )

    view_counted = False
    if data.watchedSeconds >= 30 or percentage >= 10:
        await movies_collection.update_one(
            {"_id": ObjectId(movie_id)},
            {"$inc": {"totalViews": 1}}
        )
        view_counted = True

    return {
        "watchedSeconds": data.watchedSeconds,
        "percentage": percentage,
        "viewCounted": view_counted
    }

# 5. RATE – THÊM MESSAGE
async def rate_movie(movie_id: str, user_id: str, data: RateMovieDTO):
    movie_oid = ObjectId(movie_id)
    user_oid = ObjectId(user_id)

    await ratings_collection.update_one(
        {"userId": user_oid, "contentType": "movie", "contentId": movie_oid},
        {"$set": {"rating": data.rating, "updatedAt": datetime.utcnow()}},
        upsert=True
    )

    stats = await ratings_collection.aggregate([
        {"$match": {"contentType": "movie", "contentId": movie_oid}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]).to_list(1)

    avg_rating = round(stats[0]["avg"], 1) if stats else 0
    total = stats[0]["count"] if stats else 0

    await movies_collection.update_one(
        {"_id": movie_oid},
        {"$set": {"rating": avg_rating, "totalRatings": total}}
    )

    return {
        "userRating": data.rating,
        "movieAvgRating": avg_rating,
        "totalRatings": total
    }
# 4. Start watching
async def start_watching(movie_id: str, user_id: str):
    movie = await movies_collection.find_one({"_id": ObjectId(movie_id)})
    if not movie:
        raise HTTPException(404, "Movie not found")
    # Allow all authenticated users to watch premium content
    # Premium check disabled - authentication is sufficient
    # if movie.get("isPremium"):
    #     user = await users_collection.find_one({"_id": ObjectId(user_id)})
    #     if not user or not user.get("isPremium"):
    #         raise HTTPException(403, "Premium required")

    prog = await watching_progress_collection.find_one(
        {"userId": ObjectId(user_id), "movieId": ObjectId(movie_id)},
        {"currentTime": 1, "duration": 1}
    )
    return {
        "videoUrl": movie["videoUrl"],
        "progress": {
            "watchedSeconds": prog["currentTime"] if prog else 0,
            "percentage": round((prog["currentTime"] / prog["duration"] * 100), 2) if prog and prog["duration"] else 0
        }
    }
# 6. TRENDING
# app/services/movie_service.py
async def get_trending(page: int, limit: int, user_id: Optional[str] = None):
    cache = await get_redis()
    key = cache_key("trending", page=page, limit=limit, user_id=user_id or "guest")

    if cache:
        try:
            cached = await cache.get(key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            print(f"Redis trending error: {e}")

    pipeline = [
        {"$match": {"isActive": True, "isDeleted": False}},
        {"$addFields": {
            "viewCountWeek": {"$ifNull": ["$viewCountWeek", "$totalViews"]}  # fallback
        }},
        {"$sort": {"viewCountWeek": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "thumbnail": "$thumbnailUrl",
            "viewCount": "$totalViews",
            "viewCountWeek": 1,
            "rating": 1
        }}
    ]

    movies = await movies_collection.aggregate(pipeline).to_list(limit)
    total = await movies_collection.count_documents({"isActive": True, "isDeleted": False})

    result = {
        "movies": movies,
        "pagination": {"total": total, "page": page, "limit": limit}
    }

    if cache:
        try:
            await cache.setex(key, 300, json.dumps(result))  # 5 phút
        except Exception:
            pass

    return result

# 7. CONTINUE WATCHING
async def get_continue_watching(user_id: str, limit: int = 10):
    pipeline = [
        {"$match": {"userId": ObjectId(user_id), "percentage": {"$lt": 95}}},
        {"$sort": {"viewedAt": -1}},
        {"$limit": limit},
        {"$lookup": {
            "from": "movies",
            "localField": "movieId",
            "foreignField": "_id",
            "as": "movie"
        }},
        {"$unwind": "$movie"},
        {"$match": {"movie.isActive": True}},
        {"$project": {
            "id": {"$toString": "$movie._id"},
            "title": "$movie.title",
            "thumbnailUrl": "$movie.thumbnailUrl",
            "bannerUrl": "$movie.bannerUrl",
            "rating": "$movie.rating",
            "releaseYear": "$movie.releaseYear",
            "genres": "$movie.genres",
            "duration": "$duration",
            "currentTime": "$currentTime",
            "percentage": "$percentage",
            "lastWatchedAt": {"$dateToString": {"format": "%Y-%m-%dT%H:%M:%SZ", "date": "$viewedAt"}}
        }}
    ]
    movies = await watching_progress_collection.aggregate(pipeline).to_list(limit)
    return {"movies": movies}

# 8. RECOMMENDED MOVIES - Based on genres watched recently
async def get_recommended_movies(user_id: str, limit: int = 5):
    # Get genres from user's watch history
    pipeline = [
        {"$match": {"userId": ObjectId(user_id)}},
        {"$lookup": {
            "from": "movies",
            "localField": "movieId",
            "foreignField": "_id",
            "as": "movie"
        }},
        {"$unwind": "$movie"},
        {"$project": {"genres": "$movie.genres"}},
        {"$unwind": "$genres"},
        {"$group": {"_id": "$genres", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 3}  # Top 3 genres
    ]

    watched_genres = await watching_progress_collection.aggregate(pipeline).to_list(3)
    genres = [doc["_id"] for doc in watched_genres if doc["_id"]]

    # Get movies from these genres, excluding already watched
    watched_movie_ids = await watching_progress_collection.distinct(
        "movieId", {"userId": ObjectId(user_id)}
    )

    match_stage = {
        "isActive": True,
        "isDeleted": False,
        "_id": {"$nin": watched_movie_ids}
    }
    if genres:
        match_stage["genres"] = {"$in": genres}

    pipeline = [
        {"$match": match_stage},
        {"$sort": {"totalViews": -1}},
        {"$limit": limit},
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "thumbnailUrl": 1,
            "genres": 1,
            "viewCount": "$totalViews",
            "rating": 1,
            "releaseYear": 1,
            "duration": 1,
            "totalRatings": 1,
            "isPremium": 1
        }}
    ]

    movies = await movies_collection.aggregate(pipeline).to_list(limit)

    # If no recommendations found (user has no history), return popular movies
    if not movies and not genres:
        pipeline = [
            {"$match": {
                "isActive": True,
                "isDeleted": False,
                "_id": {"$nin": watched_movie_ids}
            }},
            {"$sort": {"totalViews": -1}},
            {"$limit": limit},
            {"$project": {
                "id": {"$toString": "$_id"},
                "title": 1,
                "thumbnailUrl": 1,
                "genres": 1,
                "viewCount": "$totalViews",
                "rating": 1,
                "releaseYear": 1,
                "duration": 1,
                "totalRatings": 1,
                "isPremium": 1
            }}
        ]
        movies = await movies_collection.aggregate(pipeline).to_list(limit)

    return movies

# 9. RANDOM MOVIES - For guest users on landing page
async def get_random_movies(limit: int = 5):
    cache = await get_redis()
    cache_key_str = f"random_movies:{limit}"

    if cache:
        try:
            cached = await cache.get(cache_key_str)
            if cached:
                print(f"[RANDOM MOVIES] Cache hit: {cache_key_str}")
                return json.loads(cached)
        except Exception as e:
            print(f"[RANDOM MOVIES] Redis error: {e}")

    # Get total count of active movies
    total_count = await movies_collection.count_documents({
        "isActive": True,
        "isDeleted": False
    })

    print(f"[RANDOM MOVIES] Total active movies: {total_count}")

    if total_count == 0:
        print("[RANDOM MOVIES] No active movies found in database")
        return []

    # Get random movies
    pipeline = [
        {"$match": {"isActive": True, "isDeleted": False}},
        {"$sample": {"size": min(limit, total_count)}},  # Random sample
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "thumbnailUrl": 1,
            "genres": 1,
            "viewCount": "$totalViews",
            "rating": 1,
            "releaseYear": 1,
            "duration": 1,
            "totalRatings": 1,
            "isPremium": 1
        }}
    ]

    movies = await movies_collection.aggregate(pipeline).to_list(limit)

    print(f"[RANDOM MOVIES] Fetched {len(movies)} random movies")

    if cache:
        try:
            await cache.setex(cache_key_str, 300, json.dumps(movies))  # Cache for 5 minutes
        except Exception:
            pass

    return movies

# 10. MOVIE OF THE WEEK - Most viewed this week
async def get_movie_of_week():
    cache = await get_redis()
    cache_key_str = "movie_of_week"

    if cache:
        try:
            cached = await cache.get(cache_key_str)
            if cached:
                return json.loads(cached)
        except Exception as e:
            print(f"Redis movie of week error: {e}")

    # Get movies by total views (fallback to viewCountWeek if available)
    pipeline = [
        {"$match": {"isActive": True, "isDeleted": False}},
        {"$addFields": {
            "effectiveViewCount": {"$ifNull": ["$viewCountWeek", "$totalViews"]}
        }},
        {"$sort": {"effectiveViewCount": -1}},
        {"$limit": 1},
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "thumbnailUrl": 1,
            "genres": 1,
            "viewCount": "$totalViews",
            "rating": 1,
            "releaseYear": 1,
            "duration": 1,
            "totalRatings": 1,
            "isPremium": 1,
            "description": 1
        }}
    ]

    result = await movies_collection.aggregate(pipeline).to_list(1)

    if result:
        movie = result[0]
        if cache:
            try:
                await cache.setex(cache_key_str, 3600, json.dumps(movie))  # Cache for 1 hour
            except Exception:
                pass
        return movie

    raise HTTPException(404, "No movies available")

# 11. GET ALL GENRES - For genre filter dropdown
async def get_all_genres():
    """Get all unique genres from active movies"""
    pipeline = [
        {"$match": {"isActive": True, "isDeleted": False}},
        {"$unwind": "$genres"},
        {"$group": {"_id": "$genres"}},
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "name": "$_id"}}
    ]

    genres = await movies_collection.aggregate(pipeline).to_list(None)
    return [g["name"] for g in genres]