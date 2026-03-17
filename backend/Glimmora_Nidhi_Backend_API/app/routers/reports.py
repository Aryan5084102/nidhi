from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..models.member import Member
from ..models.loan import Loan
from ..models.deposit import Deposit
from ..models.user import User
from ..schemas.report import GenerateReportRequest

router = APIRouter(prefix="/reports", tags=["Reports"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER")


@router.get("/financial-summary")
def get_financial_summary(
    month: int = Query(3, ge=1, le=12),
    year: int = Query(2026, ge=2020),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    from calendar import month_name
    month_label = f"{month_name[month]} {year}"
    total_members = db.query(Member).filter(Member.status == "Active").count()
    return {
        "success": True,
        "data": {
            "month": month_label,
            "revenue": 11800000,
            "expenses": 7967000,
            "operatingMargin": 32.5,
            "costToIncomeRatio": 44,
            "totalAUM": 452000000,
            "memberCount": total_members,
            "newMembers": 520,
            "charts": {
                "revenueBreakdown": [
                    {"source": "Loan Interest", "amount": 5200000},
                    {"source": "Chit Commission", "amount": 3100000},
                    {"source": "Deposit Spread", "amount": 2500000},
                    {"source": "Fees", "amount": 1000000},
                ]
            },
        },
    }


@router.get("/member-growth")
def get_member_growth(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    total = db.query(Member).count()
    active = db.query(Member).filter(Member.status == "Active").count()

    excellent = db.query(Member).filter(Member.sti >= 90).count()
    good = db.query(Member).filter(Member.sti >= 70, Member.sti < 90).count()
    average = db.query(Member).filter(Member.sti >= 50, Member.sti < 70).count()
    poor = db.query(Member).filter(Member.sti < 50).count()

    return {
        "success": True,
        "data": {
            "totalMembers": total,
            "newThisMonth": 520,
            "churnThisMonth": 18,
            "netGrowth": 502,
            "growthRate": 4.2,
            "stiDistribution": {
                "excellent": excellent,
                "good": good,
                "average": average,
                "poor": poor,
            },
            "monthlyTrend": [
                {"month": "Jan 2026", "total": 11430, "new": 480, "churned": 12},
                {"month": "Feb 2026", "total": 11948, "new": 530, "churned": 12},
                {"month": "Mar 2026", "total": total, "new": 520, "churned": 18},
            ],
        },
    }


@router.get("/loan-portfolio")
def get_loan_portfolio_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    loans = db.query(Loan).all()
    sanctioned = sum(l.approved_amount or l.amount for l in loans)
    disbursed = sum(l.approved_amount or l.amount for l in loans if l.status == "Disbursed")
    outstanding = sum(l.outstanding_balance or 0 for l in loans if l.status == "Disbursed")

    return {
        "success": True,
        "data": {
            "totalSanctioned": sanctioned,
            "totalDisbursed": disbursed,
            "totalOutstanding": outstanding,
            "npaPercentage": 3.2,
            "recoveryRate": 94,
            "categories": [
                {"category": "Personal", "count": 1800, "amount": 9000000, "npa": 45},
                {"category": "Business", "count": 950, "amount": 15000000, "npa": 28},
            ],
        },
    }


@router.post("/generate")
def generate_report(
    payload: GenerateReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    report_id = f"RPT-{uuid.uuid4().hex[:6].upper()}"
    now = datetime.utcnow()
    return {
        "success": True,
        "data": {
            "reportId": report_id,
            "downloadUrl": f"/api/v1/reports/download/{report_id}",
            "format": payload.format,
            "generatedAt": now.isoformat() + "Z",
            "expiresAt": now.replace(day=now.day + 1).isoformat() + "Z",
        },
    }
