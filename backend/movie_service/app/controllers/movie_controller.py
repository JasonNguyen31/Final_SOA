from fastapi import Depends
from app.services.movie_service import *
from app.schemas.movie_dto import *
from app.middlewares.jwt_middleware import verify_token, verify_token_optional
from app.core.response import success

async def list_movies_controller(query: MovieFilterQuery = Depends(), user_payload=Depends(verify_token_optional)):
    user_id = user_payload["sub"] if user_payload else None
    return success(await get_movies(user_id, query))

# app/controllers/movie_controller.py
async def search_controller(
    query: str,
    user_id: str | None,
    page: int = 1,
    limit: int = 20
):
    return success(await search_content(query, user_id, page, limit))

async def get_movie_controller(movie_id: str, user_payload=Depends(verify_token_optional)):
    user_id = user_payload["sub"] if user_payload else None
    return success(await get_movie_detail(movie_id, user_id))

# app/controllers/movie_controller.py
# app/controllers/movie_controller.py
async def trending_controller(
    page: int = 1,
    limit: int = 10,
    user_payload=Depends(verify_token)
):
    # Chỉ lấy user_id (str hoặc None), không truyền Depends object
    user_id = None
    if user_payload:
        user_id = user_payload.get("sub") if isinstance(user_payload, dict) else str(user_payload)

    return success(await get_trending(page, limit, user_id))

# 2. Authenticated APIs
async def start_watching_controller(movie_id: str, user_payload=Depends(verify_token)):
    return success(await start_watching(movie_id, user_payload["sub"]))

async def update_progress_controller(movie_id: str, data: WatchProgressDTO, user_payload=Depends(verify_token)):
    return success(await update_progress(movie_id, user_payload["sub"], data))

async def rate_movie_controller(movie_id: str, data: RateMovieDTO, user_payload):
    result = await rate_movie(movie_id, user_payload["sub"], data)
    return success(result, message="Rating submitted")

async def continue_watching_controller(limit: int = 10, user_payload=Depends(verify_token)):
    # Xử lý cả trường hợp user_payload là dict hoặc string
    user_id = None
    if user_payload:
        if isinstance(user_payload, dict):
            user_id = user_payload.get("sub")
        elif isinstance(user_payload, str):
            user_id = user_payload  # verify_token trả về trực tiếp user_id
    return success(await get_continue_watching(user_id, limit))

async def recommended_movies_controller(limit: int = 5, user_payload=Depends(verify_token)):
    user_id = user_payload["sub"] if isinstance(user_payload, dict) else user_payload
    movies = await get_recommended_movies(user_id, limit)
    return success(movies)

async def random_movies_controller(limit: int = 5):
    movies = await get_random_movies(limit)
    return success(movies)

async def movie_of_week_controller():
    movie = await get_movie_of_week()
    return success(movie)