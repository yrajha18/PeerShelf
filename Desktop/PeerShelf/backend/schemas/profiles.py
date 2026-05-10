from pydantic import BaseModel
from typing import Optional

class RatingCreate(BaseModel):
    rater_id: str
    seller_id: str
    stars: int
    comment: Optional[str] = None

class ProfileResponse(BaseModel):
    user_id: str
    average_rating: float
    rating_count: int
    is_trusted: bool
