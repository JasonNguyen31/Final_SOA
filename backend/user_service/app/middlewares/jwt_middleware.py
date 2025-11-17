from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.core.config import settings
from app.core.token_blacklist import is_blacklisted
from datetime import datetime
security = HTTPBearer()

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