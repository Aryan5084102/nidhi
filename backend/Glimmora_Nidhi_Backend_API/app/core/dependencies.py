from fastapi import Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, List
from .database import get_db
from .security import decode_token
from .exceptions import UnauthorizedException, ForbiddenException
from ..models.user import User

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise UnauthorizedException("Invalid or expired token", "INVALID_TOKEN")
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException()
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise UnauthorizedException("User not found or inactive", "USER_NOT_FOUND")
    return user


def require_roles(*roles: str):
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise ForbiddenException(
                f"This action requires one of these roles: {', '.join(roles)}"
            )
        return current_user
    return checker


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user


def pagination_params(page: int = 1, limit: int = 10):
    return {"page": page, "limit": limit, "offset": (page - 1) * limit}


def build_pagination_response(data: list, total: int, page: int, limit: int) -> dict:
    import math
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": math.ceil(total / limit) if limit > 0 else 1,
    }
