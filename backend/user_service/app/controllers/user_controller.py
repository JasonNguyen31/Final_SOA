from fastapi import Request, Response, Depends
from app.services import user_service
from app.schemas.user_dto import ProfileUpdateDTO, ChangePasswordDTO, UpgradePremiumDTO, PaginationQuery
from app.core.response import success, fail
from app.core.limiter import limiter
from app.middlewares.jwt_middleware import verify_token
@limiter.limit("10/minute")
async def get_profile_controller(request: Request, user_payload):
    try:
        result = await user_service.get_profile(user_payload["sub"])
        return success(result)
    except ValueError as e:
        raise fail(str(e), 404)
    except Exception as e:
        raise fail("Internal server error", 500)

@limiter.limit("5/minute")
async def update_profile_controller(request: Request, payload: ProfileUpdateDTO, user_payload):
    try:
        result = await user_service.update_profile(
            user_id=user_payload["sub"],
            display_name=payload.displayName,
            avatar=payload.avatar
        )
        return success({"message": "Profile updated", "data": result})
    except ValueError as e:
        raise fail(str(e), 400)
    except Exception as e:
        raise fail("Internal server error", 500)
    

async def change_password_controller(payload: ChangePasswordDTO, user_payload):
    return await user_service.change_password(
        user_id=user_payload["sub"],
        current_password=payload.currentPassword,
        new_password=payload.newPassword
    )


async def get_notifications_controller(
    unreadOnly: bool = False,
    page: int = 1,
    limit: int = 20,
    user_payload=Depends(verify_token)
):
    try:
        result = await user_service.get_notifications(
            user_id=user_payload["sub"],
            unread_only=unreadOnly,
            page=page,
            limit=limit
        )
        return success(result)
    except Exception as e:
        return fail("Failed to get notifications", 500)

async def get_wallet_controller(
    query: PaginationQuery = Depends(),
    user_payload=Depends(verify_token)
):
    try:
        result = await user_service.get_wallet(
            user_id=user_payload["sub"],
            page=query.page,
            limit=query.limit
        )
        return success(result)
    except Exception as e:
        return fail("Failed to get wallet", 500)


async def mark_notification_read_controller(notif_id: str, user_payload):
    return await user_service.mark_notification_read(user_payload["sub"], notif_id)


async def get_view_history_controller(query: PaginationQuery = Depends(), user_payload=Depends(verify_token)):
    return await user_service.get_view_history(user_payload["sub"], query.page, query.limit)


async def clear_view_history_controller(user_payload):
    result = await user_service.clear_view_history(user_payload["sub"])
    return {"message": "View history cleared", "data": result}


async def delete_notification_controller(notif_id: str, user_payload):
    return await user_service.delete_notification(user_payload["sub"], notif_id)


async def upgrade_premium_controller(payload: UpgradePremiumDTO, user_payload):
    try:
        result = await user_service.upgrade_premium(
            user_id=user_payload["sub"],
            duration=payload.duration,
            amount=payload.amount
        )
        return success({"message": "Premium upgraded successfully", "user": result})
    except ValueError as e:
        raise fail(str(e), 400)
    except Exception as e:
        raise fail(str(e), 500)
