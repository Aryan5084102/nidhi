from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class ComplianceChecklist(Base):
    __tablename__ = "compliance_checklists"

    id = Column(String, primary_key=True, index=True)
    rule = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="Compliant")  # Compliant, Warning, Action Required
    last_audit = Column(String, nullable=True)
    details = Column(String, nullable=True)
    weight = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class KYCMonitoring(Base):
    __tablename__ = "kyc_monitoring"

    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(String, ForeignKey("members.id"), unique=True, nullable=False)
    kyc_status = Column(String, default="Pending")  # Pending, Verified, Review
    pan_verified = Column(Boolean, default=False)
    aadhaar_verified = Column(Boolean, default=False)
    address_verified = Column(Boolean, default=False)
    photo_verified = Column(Boolean, default=False)
    last_verification = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", foreign_keys=[member_id])


class AMLAlert(Base):
    __tablename__ = "aml_alerts"

    id = Column(String, primary_key=True, index=True)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    transaction_count = Column(Integer, default=1)
    detected_date = Column(String, nullable=False)
    severity = Column(String, default="Medium")  # Low, Medium, High, Critical
    status = Column(String, default="Under Review")  # Under Review, Cleared, Escalated
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    member = relationship("Member", foreign_keys=[member_id])


class RegulatoryFiling(Base):
    __tablename__ = "regulatory_filings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    form = Column(String, nullable=False)
    description = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
    status = Column(String, default="Pending")  # Pending, Due Soon, Filed, Overdue
    last_filed = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
