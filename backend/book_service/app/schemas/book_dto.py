# app/schemas/book_dto.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Literal
from datetime import datetime

class BookChapter(BaseModel):
    number: int
    title: str
    wordCount: int
    content: Optional[str] = None

class BookProgressUpdate(BaseModel):
    currentChapter: int = Field(..., ge=1)

    @validator('currentChapter')
    def check_positive(cls, v):
        if v < 1:
            raise ValueError("currentChapter must be >= 1")
        return v

class BookRating(BaseModel):
    rating: int = Field(..., ge=1, le=5)

class BookListQuery(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
    genre: Optional[str] = None
    hasMovie: Optional[bool] = True
    sortBy: Optional[Literal["title", "publishYear", "rating"]] = "title"

class ContinueReadingQuery(BaseModel):
    limit: int = Field(10, ge=1, le=50)