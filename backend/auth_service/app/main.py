from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.core.database import db, users_collection  # import db
from app.core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import asyncio

app = FastAPI(title="Auth Service")

# Add limiter state first
app.state.limiter = limiter

# Add SlowAPI middleware first
app.add_middleware(SlowAPIMiddleware)

# CORS Configuration - must be added LAST (executed FIRST in request chain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RateLimitExceeded)

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)
async def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"error": "Too many requests"})

app.include_router(auth_router)

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
