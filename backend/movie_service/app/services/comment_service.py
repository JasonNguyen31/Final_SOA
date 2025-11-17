from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from app.core.response import success, fail
from app.core.database import comments_collection, users_collection
from app.schemas.comment_dto import CreateCommentDTO, CommentListQuery

async def get_comments(query: CommentListQuery):
    """Get comments for a specific content"""
    try:
        # Build query
        filter_query = {
            "contentType": query.contentType,
            "contentId": query.contentId,
            "status": "approved"  # Only return approved comments
        }

        # Get comments with pagination
        cursor = comments_collection.find(filter_query).sort("createdAt", -1)
        cursor = cursor.skip((query.page - 1) * query.limit).limit(query.limit)

        comments = []
        async for comment in cursor:
            # Get user details
            user = await users_collection.find_one({"_id": ObjectId(comment["userId"])})

            user_details = {
                "displayName": user.get("displayName", "Anonymous") if user else "Anonymous",
                "avatar": user.get("avatar", "") if user else ""
            }

            comments.append({
                "id": str(comment["_id"]),
                "userId": comment["userId"],
                "userDetails": user_details,
                "contentType": comment["contentType"],
                "contentId": comment["contentId"],
                "text": comment["text"],
                "status": comment["status"],
                "createdAt": comment["createdAt"].isoformat() + 'Z' if isinstance(comment["createdAt"], datetime) else comment["createdAt"]
            })

        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_comment(user_id: str, data: CreateCommentDTO):
    """Create a new comment"""
    try:
        # Get user details
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Create comment document
        comment_doc = {
            "userId": user_id,
            "contentType": data.contentType,
            "contentId": data.contentId,
            "text": data.text,
            "status": "approved",  # Auto-approve for now, can add moderation later
            "createdAt": datetime.utcnow()
        }

        # Insert into database
        result = await comments_collection.insert_one(comment_doc)

        # Return created comment
        user_details = {
            "displayName": user.get("displayName", "Anonymous"),
            "avatar": user.get("avatar", "")
        }

        return {
            "id": str(result.inserted_id),
            "userId": user_id,
            "userDetails": user_details,
            "contentType": data.contentType,
            "contentId": data.contentId,
            "text": data.text,
            "status": "approved",
            "createdAt": comment_doc["createdAt"].isoformat() + 'Z'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_comment(comment_id: str, user_id: str):
    """Delete a comment (only owner or admin can delete)"""
    try:
        # Find comment
        comment = await comments_collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        # Check ownership
        if comment["userId"] != user_id:
            # Check if user is admin/moderator
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
            if not user or user.get("role") not in ["admin", "moderator"]:
                raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

        # Delete comment
        await comments_collection.delete_one({"_id": ObjectId(comment_id)})

        return {"message": "Comment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def report_comment(comment_id: str, user_id: str, reason: str):
    """Report a comment for moderation"""
    try:
        # Find comment
        comment = await comments_collection.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        # Add report to comment
        await comments_collection.update_one(
            {"_id": ObjectId(comment_id)},
            {
                "$push": {
                    "reports": {
                        "userId": user_id,
                        "reason": reason,
                        "createdAt": datetime.utcnow()
                    }
                }
            }
        )

        return {"message": "Comment reported successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
