from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BidCreate(BaseModel):
    memberId: str
    bidAmount: float


class BidOut(BaseModel):
    bidId: str
    memberId: str
    memberName: str
    bidAmount: float
    discount: float
    sti: int
    time: str
    isWinning: bool

    class Config:
        from_attributes = True


class AuctionOut(BaseModel):
    auctionId: str
    schemeId: str
    month: int
    date: str
    potSize: float
    foremanCommission: float
    availablePot: float
    status: str
    winner: Optional[str] = None
    winningBid: Optional[float] = None
    totalBidders: int

    class Config:
        from_attributes = True


class LiveAuctionOut(BaseModel):
    auctionId: str
    schemeId: str
    schemeName: str
    potSize: float
    foremanCommission: float
    availablePot: float
    minBid: Optional[float] = None
    status: str
    timeRemaining: Optional[int] = None
    totalBidders: int
    bids: List[BidOut] = []


class AuctionCloseOut(BaseModel):
    auctionId: str
    winnerId: str
    winnerName: str
    winningBid: float
    discount: float
    dividendPerMember: float
    status: str
