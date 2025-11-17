from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import movie_routes, comment_routes
from app.core.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.config import get_settings
from app.core.database import db, movies_collection, watching_progress_collection, ratings_collection
import asyncio

app = FastAPI(title="Movie Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Đảm bảo port đúng
app.include_router(movie_routes.router, prefix="/api/movies")
app.include_router(comment_routes.router, prefix="/api")

@app.exception_handler(RateLimitExceeded)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": "Too many requests"}
    )
@app.get("/health")
@limiter.limit("5/minute")
async def health_check(request: Request):
    try:
        # Kiểm tra kết nối MongoDB
        await db.command("ping")

        # Kiểm tra collection movies có dữ liệu không
        sample_movie = await movies_collection.find_one({"isActive": True})
        sample_progress = await watching_progress_collection.find_one({})
        sample_rating = await ratings_collection.find_one({"contentType": "movie"})

        # Danh sách collection
        collections = await db.list_collection_names()

        return {
            "status": "healthy",
            "service": "movie_service",
            "mongo": "connected",
            "collections": collections,
            "sample_movie": bool(sample_movie),
            "sample_progress": bool(sample_progress),
            "sample_rating": bool(sample_rating),
            "timestamp": asyncio.get_event_loop().time()
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service Unavailable: {str(e)}"
        )