from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

from ..core.database import get_db
from ..core.security import hash_password, verify_password, create_access_token
from ..core.exceptions import UnauthorizedException, BadRequestException, ConflictException, NotFoundException
from ..core.dependencies import get_current_user
from ..models.user import User
from ..models.password_reset import PasswordResetToken
from ..schemas.auth import (
    LoginRequest, RegisterRequest, ForgotPasswordRequest,
    ResetPasswordRequest, GoogleLoginRequest, ChangePasswordRequest,
    UserOut, TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _user_to_out(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "roleLabel": user.role_label,
        "avatar": user.avatar,
        "memberId": user.member_id,
        "phone": user.phone,
    }


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email, User.is_active == True).first()
    if not user or not verify_password(payload.password, user.hashed_password or ""):
        raise UnauthorizedException("Invalid email or password", "INVALID_CREDENTIALS")
    user.last_login = datetime.utcnow()
    db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"success": True, "data": {"token": token, "user": _user_to_out(user)}}


@router.post("/google")
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    # Simplified Google OAuth — in production verify the Google token via Google's API
    # Here we simulate by decoding a fake token payload
    fake_email = f"google_{payload.googleToken[:8]}@gmail.com"
    user = db.query(User).filter(User.email == fake_email).first()
    is_new = False
    if not user:
        is_new = True
        user = User(
            id=f"U-{uuid.uuid4().hex[:6].upper()}",
            name="Google User",
            email=fake_email,
            role="MEMBER",
            is_google_user=True,
        )
        db.add(user)
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "success": True,
        "data": {"token": token, "user": _user_to_out(user), "isNewUser": is_new},
    }


@router.post("/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.password != payload.confirmPassword:
        raise BadRequestException("Passwords do not match", "PASSWORD_MISMATCH")
    if db.query(User).filter(User.email == payload.email).first():
        raise ConflictException("Email already registered", "EMAIL_EXISTS")
    user = User(
        id=f"U-{uuid.uuid4().hex[:6].upper()}",
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "data": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "message": "Registration successful",
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    import random
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise BadRequestException("No account found with this email", "USER_NOT_FOUND")
    # Invalidate any existing unused tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False,
    ).update({"used": True})
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    reset_token = PasswordResetToken(
        id=uuid.uuid4().hex,
        user_id=user.id,
        token=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(reset_token)
    db.commit()
    # In production: send OTP via email. For dev, return it in response.
    return {
        "success": True,
        "message": "OTP sent to your email",
        "otp": otp,  # Remove this in production
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if payload.newPassword != payload.confirmPassword:
        raise BadRequestException("Passwords do not match", "PASSWORD_MISMATCH")
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise BadRequestException("No account found with this email", "USER_NOT_FOUND")
    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.token == payload.otp,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow(),
        )
        .first()
    )
    if not record:
        raise BadRequestException("Invalid or expired OTP", "INVALID_OTP")
    user.hashed_password = hash_password(payload.newPassword)
    record.used = True
    db.commit()
    # Debug: verify the new password works immediately after saving
    print(f"[RESET] email={payload.email}, newPassword='{payload.newPassword}', verify={verify_password(payload.newPassword, user.hashed_password)}")
    return {"success": True, "message": "Password reset successful"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"success": True, "data": _user_to_out(current_user)}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # JWT is stateless; client should discard token
    return {"success": True, "message": "Logged out successfully"}
