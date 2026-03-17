from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    amount = Column(Float, nullable=False)
    purpose = Column(String, nullable=False)
    tenure = Column(Integer, nullable=False)        # months
    interest_rate = Column(Float, default=12.0)
    risk = Column(String, default="Low")
    sti_score = Column(Integer, default=50)
    status = Column(String, default="Pending")
    # Pending -> Under Review -> Approved/Rejected -> Disbursed
    applied_date = Column(String, default=lambda: datetime.utcnow().date().isoformat())
    approved_date = Column(String, nullable=True)
    approved_by = Column(String, nullable=True)
    approved_amount = Column(Float, nullable=True)
    rejected_date = Column(String, nullable=True)
    rejected_by = Column(String, nullable=True)
    rejection_reason = Column(String, nullable=True)
    disburse_date = Column(String, nullable=True)
    bank_account = Column(String, nullable=True)
    first_emi_date = Column(String, nullable=True)
    emi = Column(Float, nullable=True)
    next_emi = Column(String, nullable=True)
    outstanding_balance = Column(Float, nullable=True)
    category = Column(String, default="Personal")  # Personal, Business, Education, etc.
    remarks = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", back_populates="loans")
    emi_schedule = relationship("EMISchedule", back_populates="loan", cascade="all, delete-orphan")
    default_record = relationship("LoanDefault", back_populates="loan", uselist=False)


class EMISchedule(Base):
    __tablename__ = "emi_schedule"

    id = Column(Integer, primary_key=True, autoincrement=True)
    loan_id = Column(String, ForeignKey("loans.id"), nullable=False)
    emi_no = Column(Integer, nullable=False)
    due_date = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    principal = Column(Float, nullable=False)
    interest = Column(Float, nullable=False)
    outstanding_balance = Column(Float, nullable=False)
    status = Column(String, default="Upcoming")  # Upcoming, Paid, Overdue
    paid_date = Column(String, nullable=True)

    loan = relationship("Loan", back_populates="emi_schedule")


class LoanDefault(Base):
    __tablename__ = "loan_defaults"

    id = Column(String, primary_key=True, index=True)
    loan_id = Column(String, ForeignKey("loans.id"), unique=True, nullable=False)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    outstanding = Column(Float, nullable=False)
    missed_emis = Column(Integer, default=0)
    default_date = Column(String, nullable=False)
    status = Column(String, default="In Recovery")  # In Recovery, Recovered, Written Off
    created_at = Column(DateTime, default=datetime.utcnow)

    loan = relationship("Loan", back_populates="default_record")
    member = relationship("Member", foreign_keys=[member_id])
