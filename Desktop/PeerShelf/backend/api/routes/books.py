from fastapi import APIRouter, HTTPException, Query
from core.database import supabase
from typing import Optional, List

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("")
def get_books(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: Optional[str] = Query(None)
):
    try:
        query = supabase.table("books").select("*")

        # 🔍 SEARCH (Title or Author)
        if search:
            query = query.or_(f"title.ilike.%{search}%,author.ilike.%{search}%")

        # 🎯 FILTERS
        if category:
            query = query.eq("category", category)
        
        if max_price:
            query = query.lte("price", max_price)

        # 🔄 SORTING
        if sort_by == "low":
            query = query.order("price", desc=False)
        elif sort_by == "high":
            query = query.order("price", desc=True)
        elif sort_by == "new":
            # Fallback to ID sorting if created_at is missing
            query = query.order("id", desc=True)
        else:
            query = query.order("title", desc=False) # Default to A-Z for now

        response = query.execute()
        return response.data

    except Exception as e:
        print(f"CRITICAL ERROR fetching books: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
