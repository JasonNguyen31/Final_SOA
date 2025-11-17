from fastapi import HTTPException, Request, Response
from app.schemas.auth_dto import *
from app.services import auth_service
from app.core.response import success, fail
from app.core.otp_limiter import increment_otp_attempt, reset_otp_attempts

async def register_controller(payload: RegisterDTO, response: Response):
    try:
        result = await auth_service.register_user(payload)
        return success(result)
    except ValueError as e:
        fail(str(e), 400)

async def verify_otp_controller(payload: OTPVerifyDTO, response: Response):
    is_locked, msg = increment_otp_attempt(payload.email)
    if is_locked:
        fail(msg, 429)

    try:
        result = await auth_service.verify_otp(payload)
        reset_otp_attempts(payload.email)
        return success(result)
    except ValueError as e:
        fail(str(e), 400)

async def login_controller(data: LoginDTO, response: Response):
    try:
        token_dto, user_info = await auth_service.login_user(data)  # NHẬN 2 GIÁ TRỊ
        response.set_cookie(
            key="refreshToken",
            value=token_dto.refreshToken,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=7 * 24 * 60 * 60
        )
        return success({
            "accessToken": token_dto.accessToken,
            "user": user_info
        })
    except ValueError as e:
        fail(str(e), 401)

async def refresh_controller(request: Request, response: Response):
    refresh_token = request.cookies.get("refreshToken")
    if not refresh_token:
        fail("No refresh token", 401)

    try:
        result = await auth_service.refresh_token(refresh_token)
        response.set_cookie(
            key="refreshToken",
            value=result.refreshToken,
            httponly=True,
            secure=True,
            samesite="strict",
            max_age=7 * 24 * 60 * 60
        )
        return success({"accessToken": result.accessToken})
    except ValueError as e:
        fail(str(e), 401)

async def forgot_password_controller(payload: ForgotPasswordDTO):
    try:
        result = await auth_service.forgot_password(payload)
        return success({"message": result["message"]})
    except ValueError as e:
        fail(str(e), 404)

async def reset_password_controller(payload: ResetPasswordDTO):
    try:
        result = await auth_service.reset_password(payload)
        return success({"message": result["message"]})
    except ValueError as e:
        fail(str(e), 400)

async def logout_controller(user_payload, response: Response):
    try:
        result = await auth_service.logout_user(user_payload)
        response.delete_cookie(key="refreshToken")
        return success({"message": result["message"]})
    except ValueError as e:
        fail(str(e), 400)