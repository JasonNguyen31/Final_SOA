from fastapi import APIRouter, Depends, Query, Body
from app.controllers.comment_controller import (
    list_comments_controller,
    create_comment_controller,
    delete_comment_controller,
    report_comment_controller
)
from app.schemas.comment_dto import CreateCommentDTO
from app.middlewares.jwt_middleware import verify_token

router = APIRouter(prefix="/comments", tags=["Comments"])

# GET /api/comments?contentType=movie&contentId=123
@router.get("")
async def get_comments(
    contentType: str = Query(...),
    contentId: str = Query(...),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all comments for a specific content (public)"""
    return await list_comments_controller(contentType, contentId, page, limit)

# POST /api/comments
@router.post("")
async def create_comment(
    data: CreateCommentDTO,
    user_payload = Depends(verify_token)
):
    """Create a new comment (authenticated)"""
    return await create_comment_controller(data, user_payload)

# DELETE /api/comments/{comment_id}
@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: str,
    user_payload = Depends(verify_token)
):
    """Delete a comment (authenticated, owner or admin only)"""
    return await delete_comment_controller(comment_id, user_payload)

# POST /api/comments/{comment_id}/report
@router.post("/{comment_id}/report")
async def report_comment(
    comment_id: str,
    reason: str = Body(..., embed=True),
    user_payload = Depends(verify_token)
):
    """Report a comment for moderation (authenticated)"""
    return await report_comment_controller(comment_id, reason, user_payload)
