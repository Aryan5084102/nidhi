from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Member(Base):
    __tablename__ = "members"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    address = Column(String, nullable=True)
    risk = Column(String, default="Low")  # Low, Medium, High
    sti = Column(Integer, default=50)     # Trust Score Index 0-100
    kyc = Column(String, default="Pending")  # Pending, Verified, Rejected
    status = Column(String, default="Active")  # Active, Inactive
    join_date = Column(String, default=lambda: datetime.utcnow().date().isoformat())
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Nominee details (Chit Funds Act requirement)
    nominee_name = Column(String, nullable=True)
    nominee_relation = Column(String, nullable=True)
    nominee_aadhaar = Column(String, nullable=True)
    nominee_pan = Column(String, nullable=True)

    # KYC detail fields
    pan_verified = Column(Boolean, default=False)
    aadhaar_verified = Column(Boolean, default=False)
    address_verified = Column(Boolean, default=False)
    photo_verified = Column(Boolean, default=False)
    last_kyc_verification = Column(String, nullable=True)
    kyc_due_date = Column(String, nullable=True)

    # STI breakdown
    sti_payment_punctuality = Column(Integer, default=50)
    sti_account_activity = Column(Integer, default=50)
    sti_kyc_status = Column(Integer, default=50)
    sti_fraud_flags = Column(Integer, default=100)
    sti_deposit_tenure = Column(Integer, default=50)
    sti_last_calculated = Column(String, nullable=True)
    sti_trend = Column(String, default="stable")

    chit_enrollments = relationship("ChitEnrollment", back_populates="member", cascade="all, delete-orphan")
    loans = relationship("Loan", back_populates="member", cascade="all, delete-orphan")
    deposits = relationship("Deposit", back_populates="member", cascade="all, delete-orphan")

    @property
    def total_deposits(self) -> float:
        return sum(d.amount for d in self.deposits if d.status == "Active")

    @property
    def total_loans(self) -> float:
        active_statuses = ["Approved", "Disbursed"]
        return sum(
            l.outstanding_balance or l.amount
            for l in self.loans
            if l.status in active_statuses
        )
