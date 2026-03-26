from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class MemberCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    address: Optional[str] = None
    risk: Optional[str] = "Low"
    kyc: Optional[str] = "Pending"
    nomineeName: Optional[str] = None
    nomineeRelation: Optional[str] = None
    nomineeAadhaar: Optional[str] = None
    nomineePan: Optional[str] = None


class MemberUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    risk: Optional[str] = None
    kyc: Optional[str] = None
    status: Optional[str] = None
    nomineeName: Optional[str] = None
    nomineeRelation: Optional[str] = None
    nomineeAadhaar: Optional[str] = None
    nomineePan: Optional[str] = None


class MemberOut(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    address: Optional[str] = None
    deposits: float = 0
    loans: float = 0
    risk: str
    sti: int
    kyc: str
    joinDate: str
    status: str
    nomineeName: Optional[str] = None
    nomineeRelation: Optional[str] = None
    nomineeAadhaar: Optional[str] = None
    nomineePan: Optional[str] = None

    class Config:
        from_attributes = True


class STIBreakdown(BaseModel):
    paymentPunctuality: int
    accountActivity: int
    kycStatus: int
    fraudFlags: int
    depositTenure: int


class STIResponse(BaseModel):
    memberId: str
    sti: int
    breakdown: STIBreakdown
    lastCalculated: Optional[str] = None
    trend: str = "stable"
