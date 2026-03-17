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

    class Config:
        from_attributes = True


class EnrolledMemberOut(BaseModel):
    memberId: str
    name: str
    enrolledDate: str
    hasWonAuction: bool


class ChitSchemeDetailOut(ChitSchemeOut):
    members: List[EnrolledMemberOut] = []
