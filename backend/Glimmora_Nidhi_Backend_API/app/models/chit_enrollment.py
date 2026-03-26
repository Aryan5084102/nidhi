from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class ChitEnrollment(Base):
    __tablename__ = "chit_enrollments"

    id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, ForeignKey("chit_schemes.id"), nullable=False)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    nominee_name = Column(String, nullable=True)
    nominee_relationship = Column(String, nullable=True)
    nominee_aadhaar = Column(String, nullable=True)
    nominee_pan = Column(String, nullable=True)
    accepted_terms = Column(Boolean, default=False)
    authorized_auto_deduction = Column(Boolean, default=False)
    has_won_auction = Column(Boolean, default=False)
    enrolled_date = Column(String, default=lambda: datetime.utcnow().date().isoformat())
    status = Column(String, default="Active")  # Active, Completed, Cancelled, Withdrawn, Pending
    # GAP 4: Withdrawal / Cancellation lifecycle
    deregistration_status = Column(String, nullable=True)  # Registered, Deregistered, Pending Deregistration
    withdrawal_date = Column(String, nullable=True)
    withdrawal_commission = Column(Float, nullable=True)
    refund_amount = Column(Float, nullable=True)
    registrar_notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    scheme = relationship("ChitScheme", back_populates="enrollments")
    member = relationship("Member", back_populates="chit_enrollments")
