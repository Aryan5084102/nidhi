from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class ChitScheme(Base):
    __tablename__ = "chit_schemes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    monthly_amount = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)   # in months
    total_members = Column(Integer, nullable=False)
    enrolled_members = Column(Integer, default=0)
    pot_size = Column(Float, nullable=False)
    next_auction = Column(String, nullable=True)
    status = Column(String, default="Open")      # Open, Closed, Completed
    description = Column(String, nullable=True)
    min_sti = Column(Integer, default=50)
    kyc_required = Column(String, default="Verified")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    enrollments = relationship("ChitEnrollment", back_populates="scheme", cascade="all, delete-orphan")
    auctions = relationship("Auction", back_populates="scheme", cascade="all, delete-orphan")

    @property
    def spots_left(self) -> int:
        return max(0, self.total_members - self.enrolled_members)
