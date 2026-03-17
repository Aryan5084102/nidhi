from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Collection(Base):
    __tablename__ = "collections"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    type = Column(String, nullable=False)       # EMI, Chit Subscription
    reference_id = Column(String, nullable=False)  # loan id or chit scheme id
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False)
    status = Column(String, default="Upcoming")  # Upcoming, Paid, Overdue
    assigned_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", foreign_keys=[member_id])
    payments = relationship("Payment", back_populates="collection")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    collection_id = Column(String, ForeignKey("collections.id"), nullable=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    type = Column(String, nullable=False)   # EMI, Chit Subscription
    reference_id = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=True)
    transaction_id = Column(String, nullable=True)
    collected_by = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    date = Column(String, default=lambda: datetime.utcnow().date().isoformat())
    status = Column(String, default="Success")  # Success, Failed, Pending
    created_at = Column(DateTime, default=datetime.utcnow)

    collection = relationship("Collection", back_populates="payments")
    member = relationship("Member", foreign_keys=[member_id])


class RecoveryCase(Base):
    __tablename__ = "recovery_cases"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    outstanding = Column(Float, nullable=False)
    missed_emis = Column(Integer, default=0)
    assigned_agent = Column(String, nullable=True)
    agent_id = Column(String, nullable=True)
    status = Column(String, default="In Progress")
    last_contact = Column(String, nullable=True)
    next_follow_up = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", foreign_keys=[member_id])
