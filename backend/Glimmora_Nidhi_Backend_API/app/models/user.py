from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    role = Column(String, nullable=False, default="MEMBER")
    avatar = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_google_user = Column(Boolean, default=False)
    last_login = Column(DateTime, nullable=True)
    join_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")

    ROLES = {
        "SUPER_ADMIN": "Super Admin",
        "ADMIN": "Admin",
        "BRANCH_MANAGER": "Branch Manager",
        "LOAN_OFFICER": "Loan Officer",
        "FIELD_AGENT": "Field Agent",
        "MEMBER": "Member",
    }

    @property
    def role_label(self) -> str:
        return self.ROLES.get(self.role, self.role)
