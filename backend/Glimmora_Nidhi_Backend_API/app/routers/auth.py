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
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        token_str = uuid.uuid4().hex
        reset_token = PasswordResetToken(
            id=uuid.uuid4().hex,
            user_id=user.id,
            token=token_str,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        db.add(reset_token)
        db.commit()
        # In production: send email with token_str
    return {"success": True, "message": "Password reset link sent to your email"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if payload.newPassword != payload.confirmPassword:
        raise BadRequestException("Passwords do not match", "PASSWORD_MISMATCH")
    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == payload.token,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow(),
        )
        .first()
    )
    if not record:
        raise BadRequestException("Invalid or expired reset token", "INVALID_RESET_TOKEN")
    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise NotFoundException("User not found")
    user.hashed_password = hash_password(payload.newPassword)
    record.used = True
    db.commit()
    return {"success": True, "message": "Password reset successful"}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # JWT is stateless; client should discard token
    return {"success": True, "message": "Logged out successfully"}
