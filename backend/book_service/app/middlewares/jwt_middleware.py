from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings
from app.core.token_blacklist import is_blacklisted
from datetime import datetime
from typing import Optional


security = HTTPBearer(auto_error=False)

async def _decode_token(credentials: HTTPAuthorizationCredentials):
    if not credentials:
        return None
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        jti = payload.get("jti")
        if jti and is_blacklisted(jti):
            raise HTTPException(status_code=401, detail={"success": False, "error": "Token revoked"})
        if payload.get("exp", 0) < datetime.utcnow().timestamp():
            raise HTTPException(status_code=401, detail={"success": False, "error": "Token expired"})
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail={"success": False, "error": "Invalid token"})

# REQUIRED: Có token
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = await _decode_token(credentials)
    if not payload:
        raise HTTPException(status_code=401, detail={"success": False, "error": "Missing token"})
    return payload

# OPTIONAL: Không cần token
async def verify_token_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return await _decode_token(credentials)  # Trả về None nếu không có token