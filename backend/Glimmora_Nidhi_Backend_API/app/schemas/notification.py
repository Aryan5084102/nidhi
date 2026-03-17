from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class NotificationOut(BaseModel):
    id: int
    icon: str
    type: str
    message: str
    time: str
    read: bool
    category: Optional[str] = None

    class Config:
        from_attributes = True


class NotificationsResponse(BaseModel):
    success: bool = True
    data: List[NotificationOut]
    unreadCount: int
