from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, Literal
from datetime import datetime

class ProfileUpdateDTO(BaseModel):
    displayName: Optional[str] = Field(None, min_length=1, max_length=50)
    avatar: Optional[str] = None
    
class ChangePasswordDTO(BaseModel):
    currentPassword: str
    newPassword: str

class UpgradePremiumDTO(BaseModel):
    duration: int = Field(..., ge=1, le=12)  # months
    amount: int = Field(..., gt=0)


class ChangePasswordDTO(BaseModel):
    currentPassword: str = Field(..., min_length=6)
    newPassword: str = Field(..., min_length=6)

    @validator("newPassword")
    def validate_password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain number")
        if not any(c in "!@#$%^&*()_+" for c in v):
            raise ValueError("Password must contain special char")
        return v
class PaginationQuery(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

    