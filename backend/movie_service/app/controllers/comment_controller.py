from fastapi import Depends, Query
from app.services.comment_service import (
    get_comments, create_comment, delete_comment, report_comment
)
from app.schemas.comment_dto import CreateCommentDTO, CommentListQuery
from app.middlewares.jwt_middleware import verify_token
from app.core.response import success

async def list_comments_controller(
    contentType: str = Query(...),
    contentId: str = Query(...),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """Get comments for content (public endpoint)"""
    query = CommentListQuery(
        contentType=contentType,
        contentId=contentId,
        page=page,
        limit=limit
    )
    comments = await get_comments(query)
    return success(comments)

async def create_comment_controller(
    data: CreateCommentDTO,
    user_payload=Depends(verify_token)
):
    """Create a new comment (authenticated)"""
    user_id = user_payload["sub"]
    comment = await create_comment(user_id, data)
    return success(comment, message="Comment created successfully")

async def delete_comment_controller(
    comment_id: str,
    user_payload=Depends(verify_token)
):
    """Delete a comment (authenticated, owner or admin only)"""
    user_id = user_payload["sub"]
    result = await delete_comment(comment_id, user_id)
    return success(result, message="Comment deleted successfully")

async def report_comment_controller(
    comment_id: str,
    reason: str,
    user_payload=Depends(verify_token)
):
    """Report a comment (authenticated)"""
    user_id = user_payload["sub"]
    result = await report_comment(comment_id, user_id, reason)
    return success(result, message="Comment reported successfully")
