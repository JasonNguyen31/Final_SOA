from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from app.routes import book_routes
from app.core.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.config import get_settings
from app.core.database import db, movies_collection, watching_progress_collection, ratings_collection
import asyncio

app = FastAPI(title="Book Service")
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Đảm bảo port đúng
app.include_router(book_routes.router, prefix="/api/books")
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