from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import collection_routes
from app.core.config import get_settings
from app.core.database import db

app = FastAPI(title="Collection Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:5173",
        "https://final-soa.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(collection_routes.router, prefix="/api/collections")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.get("/health")
async def health_check():
    try:
        # Check MongoDB connection
        await db.command("ping")
        collections = await db.list_collection_names()

        return {
            "status": "healthy",
            "service": "collection_service",
            "mongo": "connected",
            "collections": collections
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service Unavailable: {str(e)}"
        )
