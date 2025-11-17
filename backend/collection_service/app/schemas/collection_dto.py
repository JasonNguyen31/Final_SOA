from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CollectionItemDTO(BaseModel):
    contentId: str
    contentType: str  # "movie" or "book"
    title: str
    thumbnail: Optional[str] = None

class CreateCollectionDTO(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=200)
    privacy: str = Field(default="private")  # "public" or "private"

class UpdateCollectionDTO(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=200)
    privacy: Optional[str] = None

class AddItemDTO(BaseModel):
    contentId: str
    contentType: str
    title: str
    thumbnail: Optional[str] = None
