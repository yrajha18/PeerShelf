from pydantic import BaseModel

class BuyRequest(BaseModel):
    book_id: str
    buyer_id: str
    seller_id: str
