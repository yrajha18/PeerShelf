from fastapi import APIRouter, HTTPException
from schemas.wishlist import WishlistAddRequest, WishlistItemResponse, BookInfo
from core.database import supabase
from typing import List

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.post("")
def add_to_wishlist(request: WishlistAddRequest):
    try:
        # Check if already in wishlist to prevent duplicates
        response = supabase.table("wishlist").select("id").eq("user_id", request.user_id).eq("book_id", request.book_id).execute()
        
        if response and response.data and len(response.data) > 0:
            return {"message": "Already in wishlist"}

        supabase.table("wishlist").insert([{
            "user_id": request.user_id,
            "book_id": request.book_id
        }]).execute()
        
        return {"message": "Added to wishlist ❤️"}
    except Exception as e:
        print(f"Error adding to wishlist: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/{user_id}", response_model=List[WishlistItemResponse])
def get_user_wishlist(user_id: str):
    try:
        response = supabase.table("wishlist").select("id, book_id, books(*)").eq("user_id", user_id).execute()
        
        # Format the response to be cleaner for the frontend
        formatted_data = []
        if not response.data:
            return []
            
        for item in response.data:
            if item.get("books"):
                book = item["books"]
                formatted_data.append({
                    "id": item["id"],
                    "book_id": item["book_id"],
                    "book_details": {
                        "id": book["id"],
                        "title": book["title"],
                        "author": book["author"],
                        "price": book["price"],
                        "image_url": book.get("image_url"),
                        "status": book["status"]
                    }
                })
        
        return formatted_data
    except Exception as e:
        print(f"Error fetching wishlist: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{user_id}/{book_id}")
def remove_from_wishlist(user_id: str, book_id: str):
    try:
        supabase.table("wishlist").delete().eq("user_id", user_id).eq("book_id", book_id).execute()
        return {"message": "Removed from wishlist ❌"}
    except Exception as e:
        print(f"Error removing from wishlist: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
