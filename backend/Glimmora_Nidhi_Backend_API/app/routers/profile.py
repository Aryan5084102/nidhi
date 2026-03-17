from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..core.security import verify_password, hash_password
from ..core.exceptions import BadRequestException
from ..models.user import User
from ..schemas.auth import ChangePasswordRequest

router = APIRouter(prefix="/profile", tags=["Profile"])


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None


@router.get("")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "role": current_user.role,
            "roleLabel": current_user.role_label,
            "avatar": current_user.avatar,
            "joinDate": current_user.join_date.date().isoformat() if current_user.join_date else None,
            "lastLogin": current_user.last_login.isoformat() + "Z" if current_user.last_login else None,
        },
    }


@router.put("")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.name:
        current_user.name = payload.name
    if payload.phone:
        current_user.phone = payload.phone
    if payload.avatar:
        current_user.avatar = payload.avatar
    db.commit()
    return {"success": True, "message": "Profile updated successfully"}


@router.put("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.currentPassword, current_user.hashed_password or ""):
        raise BadRequestException("Current password is incorrect", "WRONG_PASSWORD")
    if payload.newPassword != payload.confirmPassword:
        raise BadRequestException("Passwords do not match", "PASSWORD_MISMATCH")
    current_user.hashed_password = hash_password(payload.newPassword)
    db.commit()
    return {"success": True, "message": "Password changed successfully"}
