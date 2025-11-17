# app/core/config.py (Phiên bản đã chỉnh sửa)
import os
from pydantic_settings import BaseSettings
from pydantic import Field, EmailStr
from typing import Optional



class Settings(BaseSettings):
    SERVICE_NAME: str = Field(default="auth_service", env="SERVICE_NAME")
    PORT: int = Field(default=8001, env="PORT")
    MONGO_URI: str = Field(..., env="MONGO_URI")  # Required
    DATABASE_NAME: str = Field(default="ONLINE_ENTERTAINMENT_PLATFORM", env="DATABASE_NAME")

    # JWT Fields
    JWT_SECRET: str = Field(..., env="JWT_SECRET", description="Secret key for JWT signing")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_ACCESS_EXPIRE_MINUTES: int = Field(default=15, env="JWT_ACCESS_EXPIRE_MINUTES")
    JWT_REFRESH_EXPIRE_DAYS: int = Field(default=7, env="JWT_REFRESH_EXPIRE_DAYS")

    # --- CẤU HÌNH EMAIL MỚI ---
    SMTP_SERVER: str = Field(..., env="SMTP_SERVER", description="SMTP Hostname") # Required
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USER: str = Field(..., env="SMTP_USER", description="SMTP Username")     # Required
    SMTP_PASSWORD: str = Field(..., env="SMTP_PASSWORD", description="SMTP Password/App Key") # Required
    REDIS_URL: str = Field(..., env="REDIS_URL")
    EMAIL_FROM: EmailStr = Field(..., env="EMAIL_FROM", description="Email address used as sender (e.g., no-reply@example.com)") # Required
    EMAIL_FROM_NAME: str = Field(default="Auth Service", env="EMAIL_FROM_NAME", description="Display name for sender")
    # --- END CẤU HÌNH EMAIL MỚI ---
    FRONTEND_URL: str = Field(..., env="FRONTEND_URL", description="Base URL of the frontend application for links")
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }

settings = Settings()