from pydantic import BaseModel
from typing import Optional


class RecordPaymentRequest(BaseModel):
    amount: float
    paymentMethod: str
    transactionId: Optional[str] = None
    collectedBy: Optional[str] = None
    remarks: Optional[str] = None


class MakePaymentRequest(BaseModel):
    collectionId: str
    amount: float
    paymentMethod: str


class CollectionOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    type: str
    referenceId: str
    amount: float
    dueDate: str
    status: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class OverdueCollectionOut(CollectionOut):
    daysOverdue: int
    assignedAgent: Optional[str] = None


class PaymentOut(BaseModel):
    paymentId: str
    amount: float
    paymentMethod: str
    transactionId: Optional[str] = None
    collectedDate: Optional[str] = None
    date: Optional[str] = None
    status: str


class MemberPaymentOut(BaseModel):
    paymentId: str
    type: str
    referenceId: Optional[str] = None
    amount: float
    date: str
    method: Optional[str] = None
    status: str


class CollectionDashboardOut(BaseModel):
    collectionRate: float
    activeCases: int
    totalDue: float
    totalCollected: float
    overdueAmount: float
    overdueMembers: int


class RecoveryCaseOut(BaseModel):
    caseId: str
    memberId: str
    memberName: str
    outstanding: float
    missedEmis: int
    assignedAgent: Optional[str] = None
    agentId: Optional[str] = None
    status: str
    lastContact: Optional[str] = None
    nextFollowUp: Optional[str] = None
