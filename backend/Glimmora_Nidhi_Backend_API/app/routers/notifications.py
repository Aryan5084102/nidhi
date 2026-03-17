from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..core.exceptions import NotFoundException
from ..models.notification import Notification
from ..models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def get_notifications(
    read: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    if read is not None:
        query = query.filter(Notification.read == read)
    notifications = query.order_by(Notification.time.desc()).all()
    unread_count = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.read == False)
        .count()
    )
    return {
        "success": True,
        "data": [
            {
                "id": n.id,
                "icon": n.icon,
                "type": n.type,
                "message": n.message,
                "time": n.time.isoformat() + "Z",
                "read": n.read,
                "category": n.category,
            }
            for n in notifications
        ],
        "unreadCount": unread_count,
    }


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    if not notif:
        raise NotFoundException("Notification not found")
    notif.read = True
    db.commit()
    return {"success": True, "message": "Notification marked as read"}


@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.read == False
    ).update({"read": True})
    db.commit()
    return {"success": True, "message": "All notifications marked as read"}
