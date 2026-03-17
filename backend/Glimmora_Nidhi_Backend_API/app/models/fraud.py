from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class FraudCase(Base):
    __tablename__ = "fraud_cases"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    members_involved = Column(String, nullable=True)  # JSON array as string
    severity = Column(String, default="Medium")  # Low, Medium, High, Critical
    detected_by = Column(String, default="AI Pattern Engine")
    detected_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Investigating")
    # Investigating, Escalated, Resolved, False Positive
    potential_loss = Column(Float, nullable=True)
    assigned_to = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(String, nullable=True)


class TransactionAnomaly(Base):
    __tablename__ = "transaction_anomalies"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    confidence = Column(Integer, default=80)  # percentage
    detected_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Flagged")  # Flagged, Reviewed, Cleared

    member = relationship("Member", foreign_keys=[member_id])
