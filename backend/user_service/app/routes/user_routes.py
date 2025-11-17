from fastapi import APIRouter, Depends, Request
from app.controllers import user_controller
from app.middlewares.jwt_middleware import verify_token
from app.schemas.user_dto import ProfileUpdateDTO, ChangePasswordDTO, PaginationQuery, UpgradePremiumDTO
from app.core.response import success, fail
router = APIRouter()

@router.get("/profile")
async def get_profile(request: Request, user=Depends(verify_token)):
    return await user_controller.get_profile_controller(request, user)

@router.put("/profile")
async def update_profile(
    request: Request,
    payload: ProfileUpdateDTO,
    user=Depends(verify_token)
):
    return await user_controller.update_profile_controller(request, payload, user)



@router.post("/change-password")
async def change_password(payload: ChangePasswordDTO, user=Depends(verify_token)):
    return success(await user_controller.change_password_controller(payload, user))

@router.get("/notifications")
async def get_notifications(
    unreadOnly: bool = False,
    page: int = 1,
    limit: int = 20,
    user=Depends(verify_token)
):
    return await user_controller.get_notifications_controller(
        unreadOnly=unreadOnly,
        page=page,
        limit=limit,
        user_payload=user
    )
@router.get("/wallet")
async def get_wallet(query: PaginationQuery = Depends(), user=Depends(verify_token)):
    return await user_controller.get_wallet_controller(query=query, user_payload=user)

@router.patch("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, user=Depends(verify_token)):
    return success(await user_controller.mark_notification_read_controller(notif_id, user))


@router.get("/view-history")
async def get_view_history(query: PaginationQuery = Depends(), user=Depends(verify_token)):
    return success(await user_controller.get_view_history_controller(query, user))

@router.delete("/view-history")
async def clear_view_history(user=Depends(verify_token)):
    return success(await user_controller.clear_view_history_controller(user))

@router.delete("/notifications/{notif_id}")
async def delete_notification(notif_id: str, user=Depends(verify_token)):
    return success(await user_controller.delete_notification_controller(notif_id, user))

@router.post("/premium/upgrade")
async def upgrade_premium(payload: UpgradePremiumDTO, user=Depends(verify_token)):
    return await user_controller.upgrade_premium_controller(payload, user)
