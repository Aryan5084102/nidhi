from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class DepositCreate(BaseModel):
    memberId: str
    type: str
    amount: float
    tenure: Optional[int] = None
    autoRenewal: Optional[bool] = False


class DepositOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    type: str
    amount: float
    rate: float
    tenure: Optional[int] = None
    maturityDate: Optional[str] = None
    maturityAmount: Optional[float] = None
    status: str
    openDate: str
    autoRenewal: bool

    class Config:
        from_attributes = True


class MemberDepositOut(BaseModel):
    id: str
    type: str
    amount: float
    rate: float
    tenure: Optional[int] = None
    maturityDate: Optional[str] = None
    maturityAmount: Optional[float] = None
    status: str
    openDate: str


class DepositSchemeOut(BaseModel):
    name: str
    type: str
    minAmount: float
    maxAmount: Optional[float] = None
    tenures: List[int]
    rates: Dict[str, float]
    members: int
    totalCorpus: float


class MaturityTrackerOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    type: str
    amount: float
    maturityDate: str
    maturityAmount: Optional[float] = None
    daysToMaturity: int
    autoRenewal: bool
    status: str
