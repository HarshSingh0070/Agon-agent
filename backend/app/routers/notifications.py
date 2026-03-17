"""
FitBite AI - Notification Routes
Push notification management
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import httpx
import logging

from app.database.mongodb import get_db
from app.routers.auth import get_current_user
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class PushTokenRegister(BaseModel):
    expo_push_token: str


class NotificationCreate(BaseModel):
    title: str
    body: str
    data: Optional[dict] = None


@router.post("/register")
async def register_push_token(
    token_data: PushTokenRegister,
    current_user: dict = Depends(get_current_user)
):
    """Register Expo push token for the user."""
    db = get_db()
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"expo_push_token": token_data.expo_push_token}}
    )
    
    return {"message": "Push token registered successfully"}


@router.post("/send")
async def send_push_notification(
    notification: NotificationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Send a push notification to the current user."""
    push_token = current_user.get("expo_push_token")
    if not push_token:
        raise HTTPException(status_code=400, detail="No push token registered")
    
    message = {
        "to": push_token,
        "sound": "default",
        "title": notification.title,
        "body": notification.body,
        "data": notification.data or {},
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.EXPO_PUSH_URL,
            json={"messages": [message]},
            headers={"Accept": "application/json", "Content-Type": "application/json"}
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to send notification")
    
    # Store notification in DB
    db = get_db()
    await db.notifications.insert_one({
        "user_id": str(current_user["_id"]),
        "title": notification.title,
        "body": notification.body,
        "data": notification.data,
        "is_read": False,
        "created_at": datetime.utcnow(),
    })
    
    return {"message": "Notification sent successfully"}


@router.get("/")
async def get_notifications(
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """Get user's notifications."""
    db = get_db()
    
    cursor = db.notifications.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).limit(limit)
    
    notifications = await cursor.to_list(length=limit)
    for n in notifications:
        n["id"] = str(n.pop("_id"))
    
    return notifications
