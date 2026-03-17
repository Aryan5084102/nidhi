from pydantic import BaseModel
from typing import Optional, List, Any, Dict


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str


class UserUpdate(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    roleLabel: str
    status: str
    lastLogin: Optional[str] = None

    class Config:
        from_attributes = True


class RoleOut(BaseModel):
    role: str
    label: str
    permissions: List[str]
    navAccess: List[str]


class CompanyConfig(BaseModel):
    name: Optional[str] = None
    cin: Optional[str] = None
    address: Optional[str] = None
    financialYear: Optional[str] = None
    currency: Optional[str] = None


class DepositsConfig(BaseModel):
    fdMinAmount: Optional[float] = None
    fdMaxRate: Optional[float] = None
    rdMinMonthly: Optional[float] = None
    savingsRate: Optional[float] = None
    autoRenewal: Optional[bool] = None


class LoansConfig(BaseModel):
    maxAmount: Optional[float] = None
    minSTI: Optional[int] = None
    maxRate: Optional[float] = None
    defaultThreshold: Optional[int] = None


class ChitFundsConfig(BaseModel):
    foremanCommission: Optional[float] = None
    minBidDecrement: Optional[float] = None
    maxSubscribers: Optional[int] = None
    auctionFrequency: Optional[str] = None


class AIConfig(BaseModel):
    riskModelVersion: Optional[str] = None
    fraudSensitivity: Optional[str] = None
    autoKYC: Optional[bool] = None
    stiRecalcFrequency: Optional[str] = None
    escalationThreshold: Optional[int] = None


class NotificationsConfig(BaseModel):
    smsEnabled: Optional[bool] = None
    emailEnabled: Optional[bool] = None
    whatsappEnabled: Optional[bool] = None
    emiReminderDays: Optional[int] = None
    maturityAlertDays: Optional[int] = None


class SystemConfigUpdate(BaseModel):
    company: Optional[CompanyConfig] = None
    deposits: Optional[DepositsConfig] = None
    loans: Optional[LoansConfig] = None
    chitFunds: Optional[ChitFundsConfig] = None
    ai: Optional[AIConfig] = None
    notifications: Optional[NotificationsConfig] = None
