from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..models.member import Member
from ..models.loan import Loan
from ..models.deposit import Deposit
from ..models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER")


@router.get("/metrics")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    active_members = db.query(Member).filter(Member.status == "Active").count()
    total_loans = sum(
        l.outstanding_balance or l.amount
        for l in db.query(Loan).filter(Loan.status == "Disbursed").all()
    )
    total_deposits = sum(
        d.amount for d in db.query(Deposit).filter(Deposit.status == "Active").all()
    )
    high_risk = db.query(Member).filter(Member.risk == "High").count()

    return {
        "success": True,
        "data": {
            "metrics": [
                {"label": "Active Members", "value": active_members, "change": 4.2},
                {"label": "Total Loans", "value": total_loans, "change": 2.8},
                {"label": "Total Deposits", "value": total_deposits, "change": 5.1},
                {"label": "Liquidity Ratio", "value": 1.8, "change": -0.3},
                {"label": "Risk Alerts", "value": high_risk, "change": 12.0},
                {"label": "Compliance Score", "value": 94, "change": 1.0},
            ]
        },
    }


@router.get("/charts/liquidity")
def get_liquidity_chart(
    period: str = Query("6months"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    return {
        "success": True,
        "data": {
            "labels": ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"],
            "inflow": [8200000, 8500000, 9100000, 9800000, 10000000, 10200000],
            "payout": [7800000, 8100000, 8600000, 9200000, 9500000, 10000000],
        },
    }


@router.get("/charts/deposits")
def get_deposits_chart(
    period: str = Query("6months"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    return {
        "success": True,
        "data": {
            "labels": ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"],
            "fd": [120000000, 125000000, 130000000, 135000000, 140000000, 145000000],
            "rd": [30000000, 32000000, 34000000, 35000000, 37000000, 39000000],
            "savings": [15000000, 16000000, 16500000, 17000000, 17500000, 18500000],
        },
    }


@router.get("/charts/risk-heatmap")
def get_risk_heatmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    total = db.query(Member).count() or 1
    low = db.query(Member).filter(Member.risk == "Low").count()
    medium = db.query(Member).filter(Member.risk == "Medium").count()
    high = db.query(Member).filter(Member.risk == "High").count()

    return {
        "success": True,
        "data": {
            "low": low,
            "medium": medium,
            "high": high,
            "distribution": [
                {"stiRange": "90-100", "count": db.query(Member).filter(Member.sti >= 90).count(), "risk": "Low"},
                {"stiRange": "70-89", "count": db.query(Member).filter(Member.sti >= 70, Member.sti < 90).count(), "risk": "Low"},
                {"stiRange": "50-69", "count": db.query(Member).filter(Member.sti >= 50, Member.sti < 70).count(), "risk": "Medium"},
                {"stiRange": "30-49", "count": db.query(Member).filter(Member.sti >= 30, Member.sti < 50).count(), "risk": "High"},
                {"stiRange": "0-29", "count": db.query(Member).filter(Member.sti < 30).count(), "risk": "High"},
            ],
        },
    }
