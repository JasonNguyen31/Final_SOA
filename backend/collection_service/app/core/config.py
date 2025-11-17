from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    SERVICE_NAME: str = Field(default="collection_service", env="SERVICE_NAME")
    MONGO_URI: str = Field(..., env="MONGO_URI")
    DATABASE_NAME: str = Field(default="ONLINE_ENTERTAINMENT_PLATFORM", env="DATABASE_NAME")
    JWT_SECRET: str = Field(..., env="JWT_SECRET", description="Secret key for JWT signing")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_ACCESS_EXPIRE_MINUTES: int = Field(default=15, env="JWT_ACCESS_EXPIRE_MINUTES")
    JWT_REFRESH_EXPIRE_DAYS: int = Field(default=7, env="JWT_REFRESH_EXPIRE_DAYS")
    PORT: int = Field(default=8005, env="PORT")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
