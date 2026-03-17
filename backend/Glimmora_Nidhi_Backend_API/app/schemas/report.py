from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class GenerateReportRequest(BaseModel):
    reportType: str
    format: str = "pdf"
    month: Optional[int] = None
    year: Optional[int] = None


class RevenueItem(BaseModel):
    source: str
    amount: float


class FinancialSummaryOut(BaseModel):
    month: str
    revenue: float
    expenses: float
    operatingMargin: float
    costToIncomeRatio: float
    totalAUM: float
    memberCount: int
    newMembers: int
    charts: Dict[str, Any]


class MonthlyTrendItem(BaseModel):
    month: str
    total: int
    new: int
    churned: int


class MemberGrowthOut(BaseModel):
    totalMembers: int
    newThisMonth: int
    churnThisMonth: int
    netGrowth: int
    growthRate: float
    stiDistribution: Dict[str, int]
    monthlyTrend: List[MonthlyTrendItem]


class LoanCategoryItem(BaseModel):
    category: str
    count: int
    amount: float
    npa: int


class LoanPortfolioReportOut(BaseModel):
    totalSanctioned: float
    totalDisbursed: float
    totalOutstanding: float
    npaPercentage: float
    recoveryRate: float
    categories: List[LoanCategoryItem]


class GeneratedReportOut(BaseModel):
    reportId: str
    downloadUrl: str
    format: str
    generatedAt: str
    expiresAt: str
