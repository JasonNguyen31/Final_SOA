

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Literal
from datetime import datetime

class MovieFilterQuery(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
    genre: Optional[str] = None
    year: Optional[int] = Field(None, ge=1900, le=2100)
    sortBy: Optional[Literal["viewCount", "rating", "releaseYear"]] = "viewCount"
    order: Optional[Literal["asc", "desc"]] = "desc"
    isPremium: Optional[bool] = None
    isFeatured: Optional[bool] = None
    search: Optional[str] = None
    type: Optional[str] = None

    @validator("genre")
    def normalize_genre(cls, v):
        return v.strip().title() if v else None

class SearchQuery(BaseModel):
    q: str = Field(..., min_length=2, max_length=100)
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

    @validator("q")
    def strip_query(cls, v):
        return v.strip()

class WatchProgressDTO(BaseModel):
    watchedSeconds: int = Field(..., ge=0)
    totalSeconds: Optional[int] = Field(None, ge=1)

    @validator("watchedSeconds")
    def validate_progress(cls, v, values):
        total = values.get("totalSeconds")
        if total and v > total:
            raise ValueError("watchedSeconds cannot exceed totalSeconds")
        return v

class RateMovieDTO(BaseModel):
    rating: int = Field(..., ge=1, le=5)