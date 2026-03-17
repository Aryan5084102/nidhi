from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime
from ..core.database import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    used = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
