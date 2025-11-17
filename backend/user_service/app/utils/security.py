# security.py (Phiên bản đã chỉnh sửa)
from passlib.context import CryptContext
import random, re
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings
import uuid
# --- ĐÃ CHỈNH SỬA ---
# Chuyển sang pbkdf2_sha256 để tránh lỗi thư viện bcrypt và giới hạn 72 byte.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
# --- END CHỈNH SỬA ---

# Password
def hash_password(password: str) -> str:
    # --- ĐÃ CHỈNH SỬA ---
    # Bỏ cắt chuỗi ([:72]) vì pbkdf2_sha256 không có giới hạn này.
    return pwd_context.hash(password)
    # --- END CHỈNH SỬA ---

def verify_password(password: str, hashed: str) -> bool:
    # --- ĐÃ CHỈNH SỬA ---
    # Bỏ cắt chuỗi ([:72]) vì pbkdf2_sha256 không có giới hạn này.
    return pwd_context.verify(password, hashed)
    # --- END CHỈNH SỬA ---

def validate_password(password: str) -> bool:
    # Min 8 chars, 1 uppercase, 1 number, 1 special char
    pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$'
    return bool(re.match(pattern, password))



# OTP
def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"