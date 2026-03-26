from pydantic import BaseModel
from typing import Optional, List


class ChitSchemeCreate(BaseModel):
    name: str
    monthlyAmount: float
    duration: int
    totalMembers: int
    description: Optional[str] = None
    minSTI: Optional[int] = 50
    kycRequired: Optional[str] = "Verified"
    bracket: Optional[str] = "Low"  # Low, Medium, Upper Medium, High
    payoutMethod: Optional[str] = "Auction"  # Auction, Lucky Draw, Both
    maxDiscountPct: Optional[float] = 30.0


class ChitSchemeOut(BaseModel):
    id: str
    name: str
    monthlyAmount: float
    duration: int
    totalMembers: int
    enrolledMembers: int
    potSize: float
    nextAuction: Optional[str] = None
    status: str
    description: Optional[str] = None
    minSTI: int
    kycRequired: str
    spotsLeft: int
    bracket: Optional[str] = "Low"
    payoutMethod: Optional[str] = "Auction"
    maxDiscountPct: Optional[float] = 30.0
    currentMonth: Optional[int] = 0

    class Config:
        from_attributes = True


class EnrolledMemberOut(BaseModel):
    memberId: str
    name: str
    enrolledDate: str
    hasWonAuction: bool


class ChitSchemeDetailOut(ChitSchemeOut):
    members: List[EnrolledMemberOut] = []
