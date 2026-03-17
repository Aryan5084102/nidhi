from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    type = Column(String, nullable=False)     # Fixed Deposit, Recurring Deposit, Savings
    amount = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    tenure = Column(Integer, nullable=True)   # months
    maturity_date = Column(String, nullable=True)
    maturity_amount = Column(Float, nullable=True)
    status = Column(String, default="Active")  # Active, Matured, Closed
    open_date = Column(String, default=lambda: datetime.utcnow().date().isoformat())
    auto_renewal = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", back_populates="deposits")


class DepositScheme(Base):
    __tablename__ = "deposit_schemes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    min_amount = Column(Float, nullable=False)
    max_amount = Column(Float, nullable=True)
    tenures_json = Column(String, nullable=True)     # JSON array stored as string
    rates_json = Column(String, nullable=True)       # JSON object stored as string
    members_count = Column(Integer, default=0)
    total_corpus = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
