from fastapi import APIRouter, Depends
from app.controllers.movie_controller import *
from app.schemas.movie_dto import MovieFilterQuery, SearchQuery, WatchProgressDTO, RateMovieDTO
from app.core.rate_limiter import rate_limit
from app.middlewares.jwt_middleware import verify_token, verify_token_optional
# New controllers are imported via * from app.controllers.movie_controller
router = APIRouter(tags=["Movies"])
"""
@router.get("")
async def list_movies(query: MovieFilterQuery = Depends(), user_payload=Depends(verify_token_optional)):
    return await list_movies_controller(query, user_payload)

@router.get("/search")
async def search(query: SearchQuery = Depends(), user_payload=Depends(verify_token_optional)):
    return await search_controller(query, user_payload)

@router.get("/{movie_id}")
async def get_movie(movie_id: str, user_payload=Depends(verify_token_optional)):
    return await get_movie_controller(movie_id, user_payload)

@router.post("/{movie_id}/watch")
async def start_watching(movie_id: str, user_payload=Depends(verify_token)):
    return await start_watching_controller(movie_id, user_payload)

@router.put("/{movie_id}/progress")
@rate_limit(max_requests=60, duration=60, identifier_from="user")
async def update_progress(movie_id: str, data: WatchProgressDTO, user_payload=Depends(verify_token)):
    return await update_progress_controller(movie_id, data, user_payload)

@router.post("/{movie_id}/rate")
async def rate_movie(movie_id: str, data: RateMovieDTO, user_payload=Depends(verify_token)):
    return await rate_movie_controller(movie_id, data, user_payload)

@router.get("/trending")
async def trending(page: int = 1, limit: int = 20):
    return await trending_controller(page, limit)

@router.get("/continue-watching")
async def continue_watching(limit: int = 10, user_payload=Depends(verify_token)):
    return await continue_watching_controller(limit, user_payload)"""

# LIST + FILTER
@router.get("")
async def list_movies(
    query: MovieFilterQuery = Depends(),
    user_payload = Depends(verify_token_optional)
):
    return await list_movies_controller(query, user_payload)

# SEARCH
# app/routes/movie_routes.py
@router.get("/search")
async def search(
    query: SearchQuery = Depends(),
    user_payload=Depends(verify_token)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    return await search_controller(
        query.q,
        user_id,
        page=query.page,
        limit=query.limit
    )

# DETAIL


# WATCH
@router.post("/{movie_id}/watch")
async def start_watching(
    movie_id: str,
    user_payload = Depends(verify_token)
):
    return await start_watching_controller(movie_id, user_payload)

# PROGRESS
@router.put("/{movie_id}/progress")
@rate_limit(max_requests=60, duration=60, identifier_from="user")
async def update_progress(
    movie_id: str,
    data: WatchProgressDTO,
    user_payload = Depends(verify_token)
):
    return await update_progress_controller(movie_id, data, user_payload)

# RATE
@router.post("/{movie_id}/rate")
async def rate_movie(
    movie_id: str,
    data: RateMovieDTO,
    user_payload = Depends(verify_token)
):
    return await rate_movie_controller(movie_id, data, user_payload)

# TRENDING – RIÊNG
@router.get("/trending")
async def trending(
    page: int = 1, limit: int = 20,
    user_payload = Depends(verify_token_optional)
):
    return await trending_controller(page, limit)

# CONTINUE WATCHING – RIÊNG
@router.get("/continue-watching")
async def continue_watching(
    limit: int = 10,
    user_payload = Depends(verify_token)
):
    return await continue_watching_controller(limit, user_payload["sub"])

# RECOMMENDED MOVIES
@router.get("/recommended")
async def recommended(
    limit: int = 5,
    user_payload = Depends(verify_token)
):
    return await recommended_movies_controller(limit, user_payload)

# MOVIE OF THE WEEK
@router.get("/special/movie-of-week")
async def movie_of_week():
    return await movie_of_week_controller()

# DETAIL – GENERIC (MUST BE LAST)
@router.get("/{movie_id}")
async def get_movie(
    movie_id: str,
    user_payload = Depends(verify_token_optional)
):
    return await get_movie_controller(movie_id, user_payload)