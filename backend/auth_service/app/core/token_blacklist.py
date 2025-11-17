import redis
import logging
from datetime import datetime, timedelta
from app.core.config import settings

log = logging.getLogger(__name__)

# Kết nối Redis
try:
    redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    log.info("[BLACKLIST] Redis connected")
except Exception as e:
    log.error(f"[BLACKLIST] Redis connection failed: {e}")
    redis_client = None

def add_to_blacklist(jti: str, expire_minutes: int = 15):
    if not redis_client:
        return
    expires_at = datetime.utcnow() + timedelta(minutes=expire_minutes)
    redis_client.setex(f"blacklist:{jti}", expire_minutes * 60, str(expires_at.timestamp()))
    log.info(f"[BLACKLIST] Token {jti} revoked for {expire_minutes} minutes")

def is_blacklisted(jti: str) -> bool:
    if not redis_client:
        return False
    value = redis_client.get(f"blacklist:{jti}")
    if value:
        expires_at = float(value)
        if datetime.utcnow().timestamp() > expires_at:
            redis_client.delete(f"blacklist:{jti}")
            return False
        return True
    return False