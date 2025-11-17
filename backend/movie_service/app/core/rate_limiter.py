# app/core/rate_limiter.py
import logging
from fastapi import Request, HTTPException
from functools import wraps
from typing import Callable, Optional
from app.core.token_blacklist import redis_client

log = logging.getLogger(__name__)

def rate_limit(
    max_requests: int = 60,
    duration: int = 60,
    key_prefix: str = "rate_limit",
    identifier_from: str = "user"  # "user" hoặc "ip"
):
    """
    Rate limiter sử dụng redis_client từ token_blacklist
    - identifier_from: "user" → dùng payload["sub"] (ưu tiên)
                     : "ip" → dùng client IP
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not redis_client:
                log.warning("[RATE_LIMIT] Redis not available, skipping")
                return await func(*args, **kwargs)

            # Lấy request từ kwargs hoặc args
            request: Optional[Request] = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request and "request" in kwargs:
                request = kwargs["request"]

            # Lấy user_id từ Depends(verify_token)
            user_id = None
            if "user" in kwargs and isinstance(kwargs["user"], dict):
                user_id = kwargs["user"].get("sub")

            # Fallback: IP nếu không có user hoặc identifier_from = "ip"
            if not user_id or identifier_from == "ip":
                client_ip = request.client.host if request and request.client else "unknown"
                identifier = client_ip
            else:
                identifier = user_id

            key = f"{key_prefix}:{identifier}:{func.__name__}"

            try:
                current = redis_client.get(key)
                if current and int(current) >= max_requests:
                    ttl = redis_client.ttl(key)
                    raise HTTPException(
                        status_code=429,
                        detail=f"Too many requests. Try again in {ttl} seconds.",
                        headers={"Retry-After": str(ttl)}
                    )

                # Lua script tăng đếm atomic
                lua_script = """
                local key = KEYS[1]
                local max_requests = tonumber(ARGV[1])
                local duration = tonumber(ARGV[2])
                local current = redis.call("INCR", key)
                if current == 1 then
                    redis.call("EXPIRE", key, duration)
                elseif current > max_requests then
                    redis.call("DECR", key)
                    return -1
                end
                return current
                """
                result = redis_client.eval(lua_script, 1, key, max_requests, duration)
                if result == -1:
                    raise HTTPException(429, "Rate limit exceeded")

            except Exception as e:
                log.error(f"[RATE_LIMIT] Error: {e}")
                # Fail-open
                pass

            return await func(*args, **kwargs)
        return wrapper
    return decorator