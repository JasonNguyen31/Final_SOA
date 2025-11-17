from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class CreateCommentDTO(BaseModel):
    contentType: Literal["movie", "book"]
    contentId: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1, max_length=1000)

class CommentResponse(BaseModel):
    id: str
    userId: str
    userDetails: dict
    contentType: str
    contentId: str
    text: str
    status: str
    createdAt: str

class CommentListQuery(BaseModel):
    contentType: Literal["movie", "book"]
    contentId: str
    page: int = Field(1, ge=1)
    limit: int = Field(50, ge=1, le=100)
