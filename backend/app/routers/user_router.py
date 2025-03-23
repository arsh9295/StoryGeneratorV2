from fastapi import APIRouter

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.get("/profile")
async def get_user_profile():
    return {"user": "User profile data"}

@router.post("/preferences")
async def update_preferences(preferences: dict):
    return {"message": "Preferences updated successfully"}
