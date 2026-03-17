from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    icon = Column(String, default="info")
    type = Column(String, default="info")  # alert, info, warning, success
    message = Column(String, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)
    category = Column(String, nullable=True)  # fraud, payment, kyc, loan, etc.

    user = relationship("User", back_populates="notifications")
