from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import os, uuid
from datetime import datetime

from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..core.security import verify_password, hash_password
from ..core.exceptions import BadRequestException
from ..models.user import User
from ..models.member import Member
from ..schemas.auth import ChangePasswordRequest

router = APIRouter(prefix="/profile", tags=["Profile"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads", "kyc")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None


@router.get("")
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "roleLabel": current_user.role_label,
        "avatar": current_user.avatar,
        "joinDate": current_user.join_date.date().isoformat() if current_user.join_date else None,
        "lastLogin": current_user.last_login.isoformat() + "Z" if current_user.last_login else None,
    }

    # Include member data if user has a linked member
    if current_user.member_id:
        member = db.query(Member).filter(Member.id == current_user.member_id).first()
        if member:
            data["member"] = {
                "id": member.id,
                "name": member.name,
                "phone": member.phone,
                "email": member.email,
                "address": member.address,
                "deposits": member.total_deposits,
                "loans": member.total_loans,
                "risk": member.risk,
                "sti": member.sti,
                "kyc": member.kyc,
                "status": member.status,
                "joinDate": member.join_date,
                "kycDocuments": {
                    "pan": {
                        "verified": member.pan_verified or False,
                        "date": member.last_kyc_verification,
                    },
                    "aadhaar": {
                        "verified": member.aadhaar_verified or False,
                        "date": member.last_kyc_verification,
                    },
                    "addressProof": {
                        "verified": member.address_verified or False,
                        "date": member.last_kyc_verification,
                    },
                    "photo": {
                        "verified": member.photo_verified or False,
                        "date": member.last_kyc_verification,
                    },
                },
            }

    return {"success": True, "data": data}


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

    # Update member address if applicable
    if payload.address and current_user.member_id:
        member = db.query(Member).filter(Member.id == current_user.member_id).first()
        if member:
            member.address = payload.address

    db.commit()
    return {"success": True, "message": "Profile updated successfully"}


@router.post("/kyc-upload")
async def upload_kyc_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.member_id:
        raise BadRequestException("Only members can upload KYC documents", "NOT_MEMBER")

    valid_types = ["pan", "aadhaar", "addressProof", "photo"]
    if document_type not in valid_types:
        raise BadRequestException(f"Invalid document type. Must be one of: {', '.join(valid_types)}", "INVALID_TYPE")

    # Validate file type
    allowed_extensions = {".pdf", ".jpg", ".jpeg", ".png"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_extensions:
        raise BadRequestException("Only PDF, JPG, and PNG files are allowed", "INVALID_FILE")

    # Validate file size (5MB max)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise BadRequestException("File size must be less than 5MB", "FILE_TOO_LARGE")

    # Save file
    filename = f"{current_user.member_id}_{document_type}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)

    # Update member KYC fields
    member = db.query(Member).filter(Member.id == current_user.member_id).first()
    if member:
        now = datetime.utcnow().date().isoformat()
        if document_type == "pan":
            member.pan_verified = True
        elif document_type == "aadhaar":
            member.aadhaar_verified = True
        elif document_type == "addressProof":
            member.address_verified = True
        elif document_type == "photo":
            member.photo_verified = True
        member.last_kyc_verification = now

        # Update overall KYC status if all documents verified
        if member.pan_verified and member.aadhaar_verified and member.address_verified and member.photo_verified:
            member.kyc = "Verified"

        db.commit()

    return {
        "success": True,
        "data": {
            "filename": filename,
            "documentType": document_type,
            "uploadedDate": datetime.utcnow().date().isoformat(),
            "size": f"{len(content) / 1024:.0f} KB" if len(content) < 1024 * 1024 else f"{len(content) / (1024 * 1024):.1f} MB",
        },
        "message": "Document uploaded successfully",
    }


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
