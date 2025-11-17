from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from app.controllers import auth_controller
from app.schemas.auth_dto import (
    RegisterDTO, OTPVerifyDTO, LoginDTO, RefreshTokenDTO,
    ForgotPasswordDTO, ResetPasswordDTO
)
from app.middlewares.jwt_middleware import verify_token
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter
from app.core.response import fail
router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
@limiter.limit("5/hour")
async def register(payload: RegisterDTO, request: Request, response: Response):
    return await auth_controller.register_controller(payload, response)

@router.post("/verify-otp")
@limiter.limit("10/hour")
async def verify_otp(payload: OTPVerifyDTO, request: Request, response: Response):
    return await auth_controller.verify_otp_controller(payload, response)

@router.post("/login")
@limiter.limit("10/5minutes")
async def login(payload: LoginDTO, request: Request, response: Response):
    return await auth_controller.login_controller(payload, response)

@router.post("/refresh")
async def refresh(request: Request, response: Response):
    if await request.body():
        raise fail("Refresh token must be in cookie, not body", 400)
    return await auth_controller.refresh_controller(request, response)

@router.post("/forgot-password")
@limiter.limit("100/hour")  # Increased for development/testing (was 3/hour)
async def forgot_password(payload: ForgotPasswordDTO, request: Request):
    return await auth_controller.forgot_password_controller(payload)

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordDTO):
    return await auth_controller.reset_password_controller(payload)

@router.post("/logout")
async def logout(response: Response, user=Depends(verify_token)):
    return await auth_controller.logout_controller(user, response)
