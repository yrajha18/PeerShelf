from fastapi import APIRouter, HTTPException
from schemas.orders import BuyRequest
from core.database import supabase

router = APIRouter(prefix="/api", tags=["Orders"])

@router.post("/buy")
def buy_book(request: BuyRequest):
    try:
        # 1. Insert order
        order_response = supabase.table("orders").insert([{
            "book_id": request.book_id,
            "buyer_id": request.buyer_id,
            "seller_id": request.seller_id
        }]).execute()

        # error handling if insert fails is managed by postgrest exception usually
        # but just in case we check data
        
        # 2. Update book status
        book_response = supabase.table("books").update({"status": "sold"}).eq("id", request.book_id).execute()

        return {"message": "Purchase successful ✅"}
    except Exception as e:
        print(f"Error during purchase: {e}")
        raise HTTPException(status_code=500, detail="Server error")
