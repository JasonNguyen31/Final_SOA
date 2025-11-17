from datetime import datetime, timedelta
from bson import ObjectId
from app.core.database import users_collection
from app.schemas.auth_dto import (
    RegisterDTO, OTPVerifyDTO, LoginDTO, RefreshTokenDTO,
    ForgotPasswordDTO, ResetPasswordDTO, TokenDTO
)
from app.utils.email_sender import send_email
from app.utils.security import (
    hash_password, verify_password, validate_password,
    generate_otp
)
from app.middlewares.jwt_middleware import (
    create_access_token, create_refresh_token, create_reset_token
)
from app.core.config import settings
from fastapi import HTTPException, status
from app.core.token_blacklist import add_to_blacklist
from jose import jwt
# ========== REGISTER ==========
async def register_user(data: RegisterDTO):
    # Check for duplicate email/username
    if await users_collection.find_one({"email": data.email}):
        raise ValueError("Email already taken")
    if await users_collection.find_one({"username": data.username}):
        raise ValueError("Username already taken")
    if not validate_password(data.password):
        raise ValueError("Weak password: must have uppercase, number, special char")
    otp_code = await _generate_unique_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=5)
    now = datetime.utcnow()

    # Create user document with defaults
    user_doc = {
        "email": data.email,
        "username": data.username,
        "passwordHash": hash_password(data.password),
        "fullName": data.username,           # default fullName = username
        "displayName": data.displayName,
        "avatar": None,                       # default avatar None
        "role": "user",
        "language": "en",
        "isVerified": False,
        "otpCode": otp_code,
        "otpExpiresAt": otp_expires,
        "resetPasswordToken": None,
        "resetPasswordExpiresAt": None,
        "isPremium": False,
        "premiumExpiresAt": None,
        "wallet": {
            "balance": 0,
            "currency": "VND",
            "totalDeposited": 0,
            "totalSpent": 0,
            "lastTransactionAt": None
        },
        "stats": {
            "totalMoviesWatched": 0,
            "totalBooksRead": 0,
            "totalComments": 0,
            "totalRatings": 0
        },
        "violationCount": 0,
        "status": "active",
        "lastLoginAt": now,
        "createdAt": now,
        "updatedAt": now
    }

    result = await users_collection.insert_one(user_doc)

    # Send OTP email
    html = f"""
        <h2>Verify Your Account</h2>
        <p>Your OTP code to verify your account is:</p>
        <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 5px;">{otp_code}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    """
    await send_email(data.email, "Verify Your Account - GENZMOBO", html)

    return {
        "userId": str(result.inserted_id),
        "email": data.email,
        "otpExpiresAt": otp_expires
    }

# ========== VERIFY OTP ==========
async def verify_otp(data: OTPVerifyDTO):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise ValueError("User not found")
    if user["isVerified"]:
        raise ValueError("Already verified")
    if user["otpCode"] != data.otp:
        raise ValueError("Invalid OTP")
    if datetime.utcnow() > user["otpExpiresAt"]:
        raise ValueError("OTP expired")

    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"isVerified": True, "otpCode": None, "otpExpiresAt": None}}
    )

    return {"message": "Email verified successfully"}


# ========== LOGIN ==========
async def login_user(data: LoginDTO):
    user = await users_collection.find_one({
        "$or": [{"email": data.identifier}, {"username": data.identifier}]
    })
    if not user or not verify_password(data.password, user["passwordHash"]):
        raise ValueError("Invalid credentials")
    if not user["isVerified"]:
        raise ValueError("Please verify your email first")

    access_token, jti = create_access_token({"sub": str(user["_id"])})
    refresh_token, refresh_jti = create_refresh_token({"sub": str(user["_id"])})

    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "refreshToken": refresh_token,
            "currentTokenJti": jti,  # Save current jti
            "lastActivityAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }}
    )

    user_info = {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "displayName": user["displayName"],
        "role": user["role"],
        "isPremium": user["isPremium"]
    }

    return TokenDTO(accessToken=access_token, refreshToken=refresh_token), user_info


# ========== REFRESH TOKEN ==========
async def refresh_token(refresh_token: str):
    user = await users_collection.find_one({"refreshToken": refresh_token})
    if not user:
        raise ValueError("Invalid or revoked refresh token")

    # Create new tokens
    access_token, access_jti = create_access_token({"sub": str(user["_id"])})
    new_refresh_token, new_refresh_jti = create_refresh_token({"sub": str(user["_id"])})

    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "refreshToken": new_refresh_token,
            "currentTokenJti": access_jti,
            "updatedAt": datetime.utcnow()
        }}
    )

    return TokenDTO(accessToken=access_token, refreshToken=new_refresh_token)




def create_reset_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token  # CHỈ TRẢ VỀ 1 GIÁ TRỊ
# ========== FORGOT PASSWORD ==========
async def forgot_password(data: ForgotPasswordDTO):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise ValueError("Email not registered")

    # Generate OTP code (6 digits) instead of link
    otp_code = await _generate_unique_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=5)  # OTP valid for 5 minutes

    html = f"""
        <h2>Reset Password OTP</h2>
        <p>Your OTP code to reset password is:</p>
        <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 5px;">{otp_code}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    """
    await send_email(data.email, "Password Reset OTP - GENZMOBO", html)

    # Store OTP in database (reuse otpCode field)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "otpCode": otp_code,
            "otpExpiresAt": otp_expires,
            "updatedAt": datetime.utcnow()
        }}
    )

    return {"message": "Password reset OTP sent to your email"}

# ========== RESET PASSWORD ==========
async def reset_password(data: ResetPasswordDTO):
    # Changed: Verify OTP instead of reset token
    user = await users_collection.find_one({"otpCode": data.token})
    if not user:
        raise ValueError("Invalid or expired OTP")

    # Check if OTP expired
    if user.get("otpExpiresAt") and datetime.utcnow() > user["otpExpiresAt"]:
        raise ValueError("OTP has expired. Please request a new one")

    if not validate_password(data.newPassword):
        raise ValueError("Weak password: must have uppercase, number, special char")

    new_hash = hash_password(data.newPassword)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "passwordHash": new_hash,
            "otpCode": None,  # Clear OTP after use
            "otpExpiresAt": None,
            "updatedAt": datetime.utcnow()
        }}
    )

    return {"message": "Password reset successful"}


# ========== LOGOUT ==========
from app.core.token_blacklist import add_to_blacklist

async def logout_user(user_payload: dict):
    user_id = user_payload.get("sub")
    jti = user_payload.get("jti")  # Get jti from token
    if not user_id or not jti:
        raise ValueError("Invalid token payload")

    # Blacklist access token (15 minutes)
    add_to_blacklist(jti, settings.JWT_ACCESS_EXPIRE_MINUTES * 60)

    # Remove refresh token
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$unset": {"refreshToken": "", "currentTokenJti": ""},
            "$set": {"updatedAt": datetime.utcnow()}
        }
    )
    return {"message": "Logged out successfully"}


# ========== UTILITIES ==========
async def _generate_unique_otp() -> str:
    while True:
        otp = generate_otp()
        exists = await users_collection.find_one({"otpCode": otp})
        if not exists:
            return otp
