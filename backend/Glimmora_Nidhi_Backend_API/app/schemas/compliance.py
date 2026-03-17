from pydantic import BaseModel
from typing import Optional, List


class ComplianceDashboardOut(BaseModel):
    overallScore: float
    totalRules: int
    compliant: int
    warnings: int
    actionRequired: int
    lastAudit: Optional[str] = None
    nextAudit: Optional[str] = None


class ComplianceChecklistOut(BaseModel):
    id: str
    rule: str
    category: str
    status: str
    lastAudit: Optional[str] = None
    details: Optional[str] = None
    weight: int


class KYCMonitoringOut(BaseModel):
    memberId: str
    memberName: str
    kycStatus: str
    panVerified: bool
    aadhaarVerified: bool
    addressVerified: bool
    photoVerified: bool
    lastVerification: Optional[str] = None
    dueDate: Optional[str] = None


class KYCSummary(BaseModel):
    totalMembers: int
    verified: int
    pending: int
    review: int


class KYCMonitoringResponse(BaseModel):
    success: bool = True
    data: List[KYCMonitoringOut]
    summary: KYCSummary


class AMLAlertOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    type: str
    description: str
    totalAmount: float
    transactionCount: int
    detectedDate: str
    severity: str
    status: str


class RegulatoryFilingOut(BaseModel):
    form: str
    description: str
    frequency: str
    dueDate: str
    status: str
    lastFiled: Optional[str] = None


class AuditLogOut(BaseModel):
    id: str
    userId: Optional[str] = None
    userName: Optional[str] = None
    role: Optional[str] = None
    action: str
    module: Optional[str] = None
    ip: Optional[str] = None
    timestamp: str
    details: Optional[str] = None
