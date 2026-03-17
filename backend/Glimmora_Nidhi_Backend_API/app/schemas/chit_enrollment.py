from pydantic import BaseModel, EmailStr
from typing import Optional


class ChitEnrollmentCreate(BaseModel):
    memberId: str
    fullName: str
    phone: str
    email: EmailStr
    nomineeName: Optional[str] = None
    nomineeRelationship: Optional[str] = None
    acceptedTerms: bool = False
    authorizedAutoDeduction: bool = False


class ChitEnrollmentOut(BaseModel):
    enrollmentId: str
    schemeId: str
    memberId: str
    schemeName: str
    monthlyAmount: float
    enrolledDate: str
    nomineeName: Optional[str] = None
    nomineeRelationship: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class MemberChitEnrollmentOut(BaseModel):
    enrollmentId: str
    schemeId: str
    schemeName: str
    monthlyAmount: float
    potSize: float
    duration: int
    enrolledDate: str
    nextAuction: Optional[str] = None
    hasWonAuction: bool
    status: str
