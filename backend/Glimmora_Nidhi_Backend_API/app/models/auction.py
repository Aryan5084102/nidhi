from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Auction(Base):
    __tablename__ = "auctions"

    id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, ForeignKey("chit_schemes.id"), nullable=False)
    month = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    pot_size = Column(Float, nullable=False)
    foreman_commission = Column(Float, nullable=False)
    available_pot = Column(Float, nullable=False)
    min_bid = Column(Float, nullable=True)
    status = Column(String, default="Scheduled")  # Scheduled, Live, Completed, Cancelled
    winner_id = Column(String, ForeignKey("members.id"), nullable=True)
    winning_bid = Column(Float, nullable=True)
    dividend_per_member = Column(Float, nullable=True)
    time_remaining = Column(Integer, nullable=True)  # seconds
    closed_at = Column(DateTime, nullable=True)
    closed_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    scheme = relationship("ChitScheme", back_populates="auctions")
    bids = relationship("Bid", back_populates="auction", cascade="all, delete-orphan")
    winner = relationship("Member", foreign_keys=[winner_id])

    @property
    def total_bidders(self) -> int:
        return len(set(b.member_id for b in self.bids))


class Bid(Base):
    __tablename__ = "bids"

    id = Column(String, primary_key=True, index=True)
    auction_id = Column(String, ForeignKey("auctions.id"), nullable=False)
    member_id = Column(String, ForeignKey("members.id"), nullable=False)
    bid_amount = Column(Float, nullable=False)
    discount = Column(Float, nullable=False)
    is_winning = Column(Boolean, default=False)
    time = Column(DateTime, default=datetime.utcnow)

    auction = relationship("Auction", back_populates="bids")
    member = relationship("Member", foreign_keys=[member_id])
