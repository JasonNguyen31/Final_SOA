from fastapi import Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings
from datetime import datetime, timedelta
import uuid
security = HTTPBearer()
from app.core.token_blacklist import is_blacklisted
def create_refresh_token(data: dict):
    jti = str(uuid.uuid4())
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "jti": jti})
    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, jti

def create_access_token(data: dict):
    jti = str(uuid.uuid4())
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "jti": jti})
    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, jti  # PHẢI TRẢ VỀ 2 GIÁ TRỊ
def create_reset_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        jti = payload.get("jti")
        if jti and is_blacklisted(jti):
            raise HTTPException(status_code=401, detail={"success": False, "error": "Token revoked"})
        
        # Kiểm tra thời hạn
        if payload.get("exp", 0) < datetime.utcnow().timestamp():
            raise HTTPException(status_code=401, detail={"success": False, "error": "Token expired"})
        
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail={"success": False, "error": "Invalid token"})