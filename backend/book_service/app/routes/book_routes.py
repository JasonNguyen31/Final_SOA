# app/routes/book_routes.py
from fastapi import APIRouter, Depends
from app.controllers.book_controller import *
from app.schemas.book_dto import *
from app.core.rate_limiter import rate_limit
from app.middlewares.jwt_middleware import verify_token, verify_token_optional

router = APIRouter(tags=["Books"])
@router.get("/continue-reading")
async def get_continue_reading(limit: int = 10, user=Depends(verify_token)):
    print("Worked")
    return await continue_reading_controller(limit, user)
@router.get("")
async def get_books(query: BookListQuery = Depends(), user=Depends(verify_token_optional)):
    return await book_list_controller(query, user)

@router.get("/{book_id}")
async def get_book_detail(book_id: str, user=Depends(verify_token_optional)):
    return await book_detail_controller(book_id, user)

@router.get("/{book_id}/chapters/{chapter_num}")
@rate_limit(60, 60)
async def read_chapter(book_id: str, chapter_num: int, user=Depends(verify_token)):
    return await read_chapter_controller(book_id, chapter_num, user)

@router.put("/{book_id}/progress")
async def update_progress(book_id: str, data: BookProgressUpdate, user=Depends(verify_token)):
    return await update_progress_controller(book_id, data, user)

@router.post("/{book_id}/rate")
async def rate_book(book_id: str, data: BookRating, user=Depends(verify_token)):
    return await rate_book_controller(book_id, data, user)

