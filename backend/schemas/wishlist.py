from pydantic import BaseModel
from typing import Optional

class WishlistAddRequest(BaseModel):
    user_id: str
    book_id: str

class BookInfo(BaseModel):
    id: str
    title: str
    author: str
    price: float
    image_url: Optional[str] = None
    status: str

class WishlistItemResponse(BaseModel):
    id: str
    book_id: str
    book_details: BookInfo
