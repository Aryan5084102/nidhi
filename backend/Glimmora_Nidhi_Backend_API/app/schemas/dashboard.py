from pydantic import BaseModel
from typing import List, Any, Optional


class MetricItem(BaseModel):
    label: str
    value: Any
    change: float


class LiquidityChartOut(BaseModel):
    labels: List[str]
    inflow: List[float]
    payout: List[float]


class DepositChartOut(BaseModel):
    labels: List[str]
    fd: List[float]
    rd: List[float]
    savings: List[float]


class RiskDistributionItem(BaseModel):
    stiRange: str
    count: int
    risk: str


class RiskHeatmapOut(BaseModel):
    low: int
    medium: int
    high: int
    distribution: List[RiskDistributionItem]
