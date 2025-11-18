from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes
from app.core.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.config import get_settings
from app.core.database import db, users_collection, transactions_collection, notifications_collection, watching_progress_collection, movies_collection, premium_subscriptions_collection
import asyncio

app = FastAPI(title="User Service")
app.state.limiter = limiter

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://final-soa.vercel.app"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.add_middleware(SlowAPIMiddleware)

# Fix prefix to match routes - use /api/user to match frontend expectations
app.include_router(user_routes.router, prefix="/api/user")
@app.exception_handler(RateLimitExceeded)

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)
async def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"error": "Too many requests"})

@app.get("/health")
@limiter.limit("5/minute")
async def health_check(request: Request):
    try:
        # Kiểm tra sample doc trong users collection
        sample_doc = await users_collection.find_one({})

        # Lấy danh sách tất cả collection trong DB
        collection_list = await db.list_collection_names()

        return {
            "status": "healthy",
            "message": "MongoDB connected!",
            "sample_doc_exists": sample_doc is not None,
            "collections": collection_list
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")