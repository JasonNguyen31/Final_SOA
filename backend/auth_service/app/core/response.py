from fastapi import HTTPException
from pydantic import BaseModel

class APIResponse(BaseModel):
    success: bool
    data: dict | None = None
    error: str | None = None

def success(data: dict):
    return APIResponse(success=True, data=data).model_dump(exclude_none=True)

def fail(error: str, status_code: int = 400):
    raise HTTPException(status_code=status_code, detail=APIResponse(success=False, error=error).model_dump(exclude_none=True))