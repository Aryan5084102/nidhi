import secrets
import uuid
import re
import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.security import hash_password, verify_password, create_access_token
from ..core.exceptions import UnauthorizedException, BadRequestException, ConflictException
from ..core.dependencies import get_current_user
from ..models.user import User
from ..models.password_reset import PasswordResetToken
from ..schemas.auth import (
    LoginRequest, RegisterRequest, ForgotPasswordRequest,
    ResetPasswordRequest, GoogleLoginRequest,
    UserOut, TokenResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ── Password policy ──────────────────────────────────────
MIN_PASSWORD_LENGTH = 8
PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
)


def _validate_password(password: str):
    if len(password) < MIN_PASSWORD_LENGTH:
        raise BadRequestException(
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters",
            "PASSWORD_TOO_SHORT",
        )
    if not PASSWORD_REGEX.match(password):
        raise BadRequestException(
            "Password must contain uppercase, lowercase, number, and special character (@$!%*?&#)",
            "PASSWORD_WEAK",
        )


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
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"success": True, "data": {"token": token, "user": _user_to_out(user)}}


@router.post("/google")
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    import httpx

    # Verify Google ID token with Google's API
    if not payload.googleToken or len(payload.googleToken) < 10:
        raise BadRequestException("Invalid Google token", "INVALID_GOOGLE_TOKEN")

    try:
        resp = httpx.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.googleToken}",
            timeout=10,
        )
        if resp.status_code != 200:
            raise BadRequestException("Google token verification failed", "GOOGLE_VERIFY_FAILED")
        google_data = resp.json()
    except httpx.RequestError:
        raise BadRequestException("Could not verify Google token", "GOOGLE_VERIFY_ERROR")

    email = google_data.get("email")
    name = google_data.get("name", "Google User")
    picture = google_data.get("picture")

    if not email:
        raise BadRequestException("Google account has no email", "NO_EMAIL")

    user = db.query(User).filter(User.email == email).first()
    is_new = False
    if not user:
        is_new = True
        user = User(
            id=f"U-{uuid.uuid4().hex[:6].upper()}",
            name=name,
            email=email,
            role="MEMBER",
            is_google_user=True,
            avatar=picture,
        )
        db.add(user)
    else:
        # Update name/avatar on each login
        user.name = name
        if picture:
            user.avatar = picture

    user.last_login = datetime.now(timezone.utc)
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
    _validate_password(payload.password)
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
    if not user:
        # Generic response to prevent user enumeration
        return {"success": True, "message": "If the email is registered, an OTP has been sent"}
    # Invalidate existing unused tokens
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False,
    ).update({"used": True})
    # Generate 6-digit OTP using cryptographically secure random
    otp = str(secrets.randbelow(900000) + 100000)
    reset_token = PasswordResetToken(
        id=uuid.uuid4().hex,
        user_id=user.id,
        token=otp,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
    )
    db.add(reset_token)
    db.commit()
    logger.info(f"OTP generated for user {user.id}")
    # In production: send OTP via email service (SendGrid, SES, etc.)
    # For development only — remove in production:
    return {"success": True, "message": "OTP sent to your email", "otp": otp}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if payload.newPassword != payload.confirmPassword:
        raise BadRequestException("Passwords do not match", "PASSWORD_MISMATCH")
    _validate_password(payload.newPassword)
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise BadRequestException("Invalid request", "INVALID_REQUEST")
    record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.token == payload.otp,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.now(timezone.utc),
        )
        .first()
    )
    if not record:
        raise BadRequestException("Invalid or expired OTP", "INVALID_OTP")
    user.hashed_password = hash_password(payload.newPassword)
    record.used = True
    db.commit()
    logger.info(f"Password reset for user {user.id}")
    return {"success": True, "message": "Password reset successful"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"success": True, "data": _user_to_out(current_user)}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"success": True, "message": "Logged out successfully"}
