# app/services/book_service.py
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from app.core.response import success, fail
from app.core.database import (
    books_collection, movies_collection, reading_progress_collection,
    ratings_collection, users_collection
)
from app.schemas.book_dto import *
import json

# Redis
async def get_redis():
    from app.core.token_blacklist import redis_client
    return redis_client

def cache_key(prefix: str, **kwargs):
    safe_kwargs = {}
    for k, v in kwargs.items():
        if v is None:
            safe_kwargs[k] = "null"
        elif isinstance(v, (str, int, float, bool)):
            safe_kwargs[k] = v
        else:
            safe_kwargs[k] = str(v)
    return f"{prefix}:{json.dumps(safe_kwargs, sort_keys=True)}"

# === GET BOOK LIST (ONLY ADAPTED) ===
async def get_book_list(query: BookListQuery, user_id: Optional[str] = None):
    cache = await get_redis()
    key = cache_key("book_list", **query.dict(), user_id=user_id or "guest")

    if cache:
        try:
            cached = await cache.get(key)
            if cached:
                return json.loads(cached)
        except:
            pass

    match_stage = {
        "isActive": True,
        "isDeleted": False,
        "movieAdaptations.0": {"$exists": True}  # Chỉ sách có phim
    }
    if query.genre:
        match_stage["categories"] = query.genre

    sort_field = query.sortBy
    if sort_field == "title":
        sort_key = {"title": 1}
    elif sort_field == "publishYear":
        sort_key = {"publishYear": -1}
    else:
        sort_key = {"rating": -1}

    pipeline = [
        {"$match": match_stage},
        {"$sort": sort_key},
        {"$skip": (query.page - 1) * query.limit},
        {"$limit": query.limit},
        {"$lookup": {
            "from": "movies",
            "localField": "movieAdaptations",
            "foreignField": "_id",
            "as": "movies"
        }},
        {"$unwind": "$movies"},
        {"$project": {
            "id": {"$toString": "$_id"},
            "title": 1,
            "author": 1,
            "description": 1,
            "thumbnail": "$coverImageUrl",
            "genres": "$categories",
            "publishYear": 1,
            "totalChapters": {"$ifNull": ["$totalPages", 30]},
            "adaptedMovie": {
                "id": {"$toString": "$movies._id"},
                "title": "$movies.title"
            }
        }}
    ]

    books = await books_collection.aggregate(pipeline).to_list(query.limit)
    total = await books_collection.count_documents(match_stage)

    result = {
        "books": books,
        "pagination": {"total": total, "page": query.page, "limit": query.limit}
    }

    if cache:
        try:
            await cache.setex(key, 300, json.dumps(result))
        except:
            pass

    return result

# === GET BOOK DETAIL ===
async def get_book_detail(book_id: str, user_id: Optional[str] = None):
    if not ObjectId.is_valid(book_id):
        raise HTTPException(404, "Book not found")

    cache = await get_redis()
    key = cache_key("book_detail", book_id=book_id, user_id=user_id or "guest")
    if cache:
        try:
            cached = await cache.get(key)
            if cached:
                return json.loads(cached)
        except:
            pass

    book = await books_collection.find_one({
        "_id": ObjectId(book_id),
        "isActive": True,
        "isDeleted": False
    })

    if not book:
        raise HTTPException(404, "Book not found")

    # Lấy phim chuyển thể
    movie = None
    if book.get("movieAdaptations"):
        movie_doc = await movies_collection.find_one({
            "_id": {"$in": book["movieAdaptations"]},
            "isActive": True
        })
        if movie_doc:
            movie = {
                "id": str(movie_doc["_id"]),
                "title": movie_doc["title"],
                "releaseYear": movie_doc.get("releaseYear")
            }

    # Lấy progress nếu có user
    user_progress = None
    if user_id:
        progress = await reading_progress_collection.find_one({
            "userId": ObjectId(user_id),
            "bookId": ObjectId(book_id)
        })
        if progress:
            user_progress = {
                "currentChapter": progress.get("currentChapter", 1),
                "lastReadAt": progress.get("updatedAt")
            }

    # Giả lập chapters
    total_chapters = book.get("totalPages", 30) // 10 or 30
    chapters = [
        {"number": i, "title": f"Chapter {i}", "wordCount": 5000}
        for i in range(1, total_chapters + 1)
    ]

    result = {
        "id": str(book["_id"]),
        "title": book["title"],
        "author": book.get("author"),
        "description": book["description"],
        "thumbnail": book.get("coverImageUrl"),
        "genres": book.get("categories", []),
        "publishYear": book.get("publishYear"),
        "totalChapters": total_chapters,
        "adaptedMovie": movie,
        "chapters": chapters,
        "userProgress": user_progress
    }

    if cache:
        try:
            await cache.setex(key, 300, json.dumps(result))
        except:
            pass

    return result

# === READ CHAPTER ===
async def read_book_chapter(book_id: str, chapter_num: int, user_id: str):
    if not ObjectId.is_valid(book_id):
        raise HTTPException(404, "Book not found")

    book = await books_collection.find_one({
        "_id": ObjectId(book_id),
        "isActive": True,
        "isDeleted": False
    })
    if not book:
        raise HTTPException(404, "Book not found")

    total_chapters = book.get("totalPages", 30) // 10 or 30
    if chapter_num < 1 or chapter_num > total_chapters:
        raise HTTPException(404, "Chapter not found")

    # Cập nhật progress
    await reading_progress_collection.update_one(
        {"userId": ObjectId(user_id), "bookId": ObjectId(book_id)},
        {"$set": {
            "currentChapter": chapter_num,
            "updatedAt": datetime.utcnow()
        }},
        upsert=True
    )

    # Navigation
    nav = {
        "hasNext": chapter_num < total_chapters,
        "hasPrevious": chapter_num > 1,
        "nextChapter": chapter_num + 1 if chapter_num < total_chapters else None,
        "previousChapter": chapter_num - 1 if chapter_num > 1 else None
    }

    return {
        "bookId": book_id,
        "chapter": {
            "number": chapter_num,
            "title": f"Chapter {chapter_num}: Sample Content",
            "content": f"This is the content of chapter {chapter_num}..." * 50,
            "wordCount": 5000
        },
        "navigation": nav
    }

# === UPDATE PROGRESS ===
async def update_reading_progress(book_id: str, data: BookProgressUpdate, user_id: str):
    if not ObjectId.is_valid(book_id):
        raise HTTPException(404, "Book not found")

    book = await books_collection.find_one({
        "_id": ObjectId(book_id),
        "isActive": True,
        "isDeleted": False
    })
    if not book:
        raise HTTPException(404, "Book not found")

    total_chapters = book.get("totalPages", 30) // 10 or 30
    if data.currentChapter > total_chapters:
        raise HTTPException(400, "Invalid chapter number")

    await reading_progress_collection.update_one(
        {"userId": ObjectId(user_id), "bookId": ObjectId(book_id)},
        {"$set": {
            "currentChapter": data.currentChapter,
            "updatedAt": datetime.utcnow()
        }},
        upsert=True
    )

    percentage = round((data.currentChapter / total_chapters) * 100, 2)
    return {
        "currentChapter": data.currentChapter,
        "percentage": percentage,
        "lastReadAt": datetime.utcnow().isoformat() + "Z"
    }

# === RATE BOOK ===
async def rate_book(book_id: str, data: BookRating, user_id: str):
    if not ObjectId.is_valid(book_id):
        raise HTTPException(404, "Book not found")

    book = await books_collection.find_one({
        "_id": ObjectId(book_id),
        "isActive": True,
        "isDeleted": False
    })
    if not book:
        raise HTTPException(404, "Book not found")

    # Cập nhật rating
    result = await ratings_collection.update_one(
        {"userId": ObjectId(user_id), "bookId": ObjectId(book_id)},
        {"$set": {"rating": data.rating, "updatedAt": datetime.utcnow()}},
        upsert=True
    )

    # Tính avg
    pipeline = [
        {"$match": {"bookId": ObjectId(book_id)}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    avg_result = await ratings_collection.aggregate(pipeline).to_list(1)
    avg_rating = round(avg_result[0]["avg"], 1) if avg_result else 0
    total = avg_result[0]["count"] if avg_result else 0

    # Cập nhật avg vào book
    await books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": {"rating": avg_rating, "totalRatings": total}}
    )

    return {
        "userRating": data.rating,
        "bookAvgRating": avg_rating,
        "totalRatings": total
    }
# app/services/book_service.py
# app/services/book_service.py
# ... (các hàm khác giữ nguyên)

async def get_continue_reading(limit: int, user_id: str):
    print(f"DEBUG: get_continue_reading | user_id = {user_id}")

    pipeline = [
        # 1. Lấy tất cả reading progress của user
        {"$match": {"userId": ObjectId(user_id)}},

        # 2. Join với books
        {"$lookup": {
            "from": "books",
            "localField": "bookId",
            "foreignField": "_id",
            "as": "book"
        }},
        {"$unwind": "$book"},

        # 3. Lọc: sách active + chưa hoàn thành
        {"$match": {
            "book.isActive": True,
            "book.isDeleted": {"$ne": True},
            "isCompleted": {"$ne": True}  # ← CHỈ SÁCH CHƯA HOÀN THÀNH
        }},

        # 4. Sắp xếp theo lastReadAt (mới nhất trước)
        {"$sort": {"updatedAt": -1}},

        # 5. Giới hạn
        {"$limit": limit},

        # 6. Project kết quả
        {"$project": {
            "id": {"$toString": "$book._id"},
            "title": "$book.title",
            "thumbnail": "$book.coverImageUrl",
            "progress": {
                "currentChapter": {"$ifNull": ["$currentChapter", 0]},  # ← Cho phép 0
                "totalChapters": {
                    "$ifNull": [
                        {"$ceil": {"$divide": ["$book.totalPages", 10]}},
                        30
                    ]
                },
                "percentage": {
                    "$round": [
                        {"$multiply": [
                            {"$divide": [
                                {"$ifNull": ["$currentChapter", 0]},
                                {"$ifNull": [
                                    {"$ceil": {"$divide": ["$book.totalPages", 10]}},
                                    30
                                ]}
                            ]},
                            100
                        ]},
                        2
                    ]
                },
                "lastReadAt": "$updatedAt"
            }
        }}
    ]

    books = await reading_progress_collection.aggregate(pipeline).to_list(limit)
    print(f"DEBUG: Found {len(books)} in-progress books")

    return {"books": books}