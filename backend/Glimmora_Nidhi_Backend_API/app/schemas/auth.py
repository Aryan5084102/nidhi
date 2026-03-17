from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    googleToken: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirmPassword: str
    role: str = "MEMBER"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str
    confirmPassword: str


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str
    confirmPassword: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    roleLabel: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    token: str
    user: UserOut
