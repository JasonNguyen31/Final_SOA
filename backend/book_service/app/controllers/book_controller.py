# app/controllers/book_controller.py
from fastapi import Depends, HTTPException
from app.services.book_service import *
from app.schemas.book_dto import *
from app.middlewares.jwt_middleware import verify_token, verify_token_optional
from app.core.response import success

async def book_list_controller(
    query: BookListQuery = Depends(),
    user_payload = Depends(verify_token_optional)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    return success(await get_book_list(query, user_id))

async def book_detail_controller(
    book_id: str,
    user_payload = Depends(verify_token_optional)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    return success(await get_book_detail(book_id, user_id))

async def read_chapter_controller(
    book_id: str,
    chapter_num: int,
    user_payload = Depends(verify_token)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    if not user_id:
        raise HTTPException(401, "Unauthorized")
    return success(await read_book_chapter(book_id, chapter_num, user_id))

async def update_progress_controller(
    book_id: str,
    data: BookProgressUpdate,
    user_payload = Depends(verify_token)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    if not user_id:
        raise HTTPException(401, "Unauthorized")
    return success(await update_reading_progress(book_id, data, user_id))

async def rate_book_controller(
    book_id: str,
    data: BookRating,
    user_payload = Depends(verify_token)
):
    user_id = user_payload.get("sub") if isinstance(user_payload, dict) else user_payload
    if not user_id:
        raise HTTPException(401, "Unauthorized")
    return success(await rate_book(book_id, data, user_id))

# app/controllers/book_controller.py
# app/controllers/book_controller.py
async def continue_reading_controller(
    limit: int = 10,
    user_payload=Depends(verify_token)
):
    print("=== [DEBUG] VÀO continue_reading_controller ===")
    print(f"user_payload type: {type(user_payload)}")
    print(f"user_payload value: {user_payload}")

    user_id = None
    try:
        if isinstance(user_payload, dict):
            user_id = user_payload.get("sub")
        elif user_payload and hasattr(user_payload, "sub"):
            user_id = user_payload.sub
        elif user_payload:
            user_id = str(user_payload)
    except Exception as e:
        print(f"ERROR extracting user_id: {e}")

    print(f"Final user_id: {user_id}")

    if not user_id:
        print("No user_id → 401")
        raise HTTPException(401, "Unauthorized")

    try:
        result = await get_continue_reading(limit, user_id)
        print(f"Service result: {result}")
        return success(result)
    except Exception as e:
        print(f"Service error: {e}")
        raise