from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class AIAgentOut(BaseModel):
    name: str
    status: str
    processed: int
    pending: int


class AIRiskDashboardOut(BaseModel):
    agentsOnline: int
    totalAgents: int
    activeAlerts: int
    riskScore: int
    agents: List[AIAgentOut]


class RiskFactorOut(BaseModel):
    factor: str
    impact: str
    score: int


class MemberRiskOut(BaseModel):
    memberId: str
    memberName: str
    riskLevel: str
    riskScore: int
    factors: List[RiskFactorOut]
    recommendation: str
    lastAssessed: str


class LiquidityInflowOut(BaseModel):
    deposits: float
    emiCollections: float
    chitSubscriptions: float
    total: float


class LiquidityOutflowOut(BaseModel):
    chitPayouts: float
    loanDisbursements: float
    depositMaturities: float
    operatingExpenses: float
    total: float


class LiquidityOut(BaseModel):
    currentRatio: float
    unencumberedDeposits: float
    status: str
    inflows: LiquidityInflowOut
    outflows: LiquidityOutflowOut
    netPosition: float
    forecast30Days: str
