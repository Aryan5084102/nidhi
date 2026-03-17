from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FraudCaseUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None
    actionTaken: Optional[str] = None


class FraudDashboardOut(BaseModel):
    totalAlerts: int
    criticalAlerts: int
    resolvedThisMonth: int
    avgResolutionDays: float
    falsePositiveRate: float
    totalLossPrevented: float


class FraudCaseOut(BaseModel):
    id: str
    type: str
    description: str
    members: List[str]
    severity: str
    detectedBy: str
    detectedAt: str
    status: str
    potentialLoss: Optional[float] = None
    assignedTo: Optional[str] = None

    class Config:
        from_attributes = True


class FraudPatternItem(BaseModel):
    type: str
    frequency: int
    trend: str
    lastDetected: str


class MonthlyTrendItem(BaseModel):
    month: str
    alerts: int


class FraudPatternsOut(BaseModel):
    patterns: List[FraudPatternItem]
    monthlyTrend: List[MonthlyTrendItem]


class TransactionAnomalyOut(BaseModel):
    id: str
    memberId: str
    memberName: str
    type: str
    description: str
    amount: float
    confidence: int
    detectedAt: str
    status: str
