from fastapi import APIRouter, HTTPException
from core.database import supabase
from schemas.profiles import RatingCreate, ProfileResponse

router = APIRouter(prefix="/api/profiles", tags=["Profiles"])

@router.get("/{user_id}", response_model=ProfileResponse)
def get_user_profile(user_id: str):
    try:
        # Get all ratings for this user (as a seller)
        response = supabase.table("ratings").select("stars").eq("seller_id", user_id).execute()
        
        ratings = response.data
        count = len(ratings)
        
        if count == 0:
            return {
                "user_id": user_id,
                "average_rating": 0.0,
                "rating_count": 0,
                "is_trusted": False
            }
        
        avg = sum(r["stars"] for r in ratings) / count
        
        # A seller is trusted if they have at least 3 ratings and avg >= 4.0
        is_trusted = count >= 3 and avg >= 4.0
        
        return {
            "user_id": user_id,
            "average_rating": round(avg, 1),
            "rating_count": count,
            "is_trusted": is_trusted
        }
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/rate")
def rate_user(rating: RatingCreate):
    try:
        # Prevent self-rating
        if rating.rater_id == rating.seller_id:
            raise HTTPException(status_code=400, detail="You cannot rate yourself")

        supabase.table("ratings").insert([{
            "rater_id": rating.rater_id,
            "seller_id": rating.seller_id,
            "stars": rating.stars,
            "comment": rating.comment
        }]).execute()
        
        return {"message": "Rating submitted! ⭐"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error submitting rating: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
