from pydantic import BaseModel
from typing import Optional, List


class LoanApplyRequest(BaseModel):
    memberId: str
    amount: float
    purpose: str
    tenure: int


class LoanApproveRequest(BaseModel):
    approvedAmount: float
    interestRate: float
    tenure: int
    remarks: Optional[str] = None


class LoanRejectRequest(BaseModel):
    reason: str


class LoanDisburseRequest(BaseModel):
    disbursementDate: str
    bankAccount: str


class LoanOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    amount: float
    purpose: str
    tenure: int
    interestRate: float
    risk: str
    stiScore: int
    status: str
    appliedDate: str
    emi: Optional[float] = None
    nextEmi: Optional[str] = None

    class Config:
        from_attributes = True


class MemberLoanOut(BaseModel):
    id: str
    amount: float
    purpose: str
    tenure: int
    interestRate: float
    emi: Optional[float] = None
    nextEmi: Optional[str] = None
    status: str
    outstandingBalance: Optional[float] = None


class EMIScheduleItem(BaseModel):
    emiNo: int
    dueDate: str
    amount: float
    principal: float
    interest: float
    outstandingBalance: float
    status: str
    paidDate: Optional[str] = None


class EMIScheduleOut(BaseModel):
    loanId: str
    totalEmis: int
    emiAmount: float
    schedule: List[EMIScheduleItem]


class LoanPortfolioItem(BaseModel):
    category: str
    count: int
    sanctioned: float
    disbursed: float
    npa: int
    avgRate: float


class LoanDefaultOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    outstanding: float
    missedEmis: int
    defaultDate: str
    status: str
