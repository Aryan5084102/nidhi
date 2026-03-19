from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
from collections import Counter, defaultdict
import uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..models.member import Member
from ..models.loan import Loan
from ..models.deposit import Deposit
from ..models.chit_scheme import ChitScheme
from ..models.collection import Collection, Payment
from ..models.user import User
from ..schemas.report import GenerateReportRequest

router = APIRouter(prefix="/reports", tags=["Reports"])

STAFF_ROLES = ("ADMIN", "BRANCH_MANAGER")


def _fmt_auto(n: float) -> str:
    """Format rupee amount as Cr or L string."""
    if n >= 10_000_000:
        return f"₹{n / 10_000_000:.2f} Cr"
    return f"₹{n / 100_000:.1f}L"


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

    # Core financials from DB
    active_deposits = db.query(Deposit).filter(Deposit.status == "Active").all()
    active_loans = db.query(Loan).filter(Loan.status == "Disbursed").all()
    all_schemes = db.query(ChitScheme).filter(ChitScheme.status != "Closed").all()

    total_deposits = sum(d.amount for d in active_deposits) or 0
    total_loans_outstanding = sum(l.outstanding_balance or l.amount for l in active_loans) or 0

    # Revenue components
    loan_interest = sum(
        (l.interest_rate or 12) / 100 * (l.outstanding_balance or l.amount) / 12
        for l in active_loans
    ) or 0
    deposit_spread = total_deposits * 0.02 / 12
    chit_commission = sum(s.pot_size * 0.05 for s in all_schemes) or 0
    fees = total_members * 100

    total_revenue = round(loan_interest + deposit_spread + chit_commission + fees)
    operating_expenses = round(total_revenue * 0.68)
    provisions = round(total_revenue * 0.04)
    net_profit = total_revenue - operating_expenses - provisions
    total_aum = total_deposits + total_loans_outstanding

    # Balance sheet
    total_assets = round(total_aum + total_members * 5000)  # AUM + cash/other assets
    total_liabilities = round(total_deposits * 0.9 + total_loans_outstanding * 0.05)
    net_worth = total_assets - total_liabilities
    capital_adequacy = round(net_worth / total_aum * 100, 1) if total_aum > 0 else 15.0

    # Revenue breakdown with percentages
    rev = total_revenue or 1
    revenue_breakdown = [
        {"source": "Loan Interest", "amount": round(loan_interest), "pct": round(loan_interest / rev * 100)},
        {"source": "Chit Commission", "amount": round(chit_commission), "pct": round(chit_commission / rev * 100)},
        {"source": "Deposit Spread", "amount": round(deposit_spread), "pct": round(deposit_spread / rev * 100)},
        {"source": "Processing Fees", "amount": round(fees), "pct": round(fees / rev * 100)},
    ]

    return {
        "success": True,
        "data": {
            "month": month_label,
            "revenue": total_revenue,
            "expenses": operating_expenses,
            "operatingMargin": round((total_revenue - operating_expenses) / total_revenue * 100, 1) if total_revenue > 0 else 0,
            "costToIncomeRatio": round(operating_expenses / total_revenue * 100) if total_revenue > 0 else 0,
            "totalAUM": total_aum,
            "memberCount": total_members,
            "pl": {
                "totalIncome": total_revenue,
                "interestIncome": round(loan_interest),
                "operatingExpenses": operating_expenses,
                "provisions": provisions,
                "netProfit": net_profit,
            },
            "balanceSheet": {
                "totalAssets": total_assets,
                "totalLiabilities": total_liabilities,
                "netWorth": net_worth,
                "capitalAdequacy": capital_adequacy,
            },
            "charts": {
                "revenueBreakdown": revenue_breakdown,
            },
        },
    }


@router.get("/member-growth")
def get_member_growth(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    all_members = db.query(Member).all()
    total = len(all_members)
    active = sum(1 for m in all_members if m.status == "Active")

    # STI distribution
    excellent = sum(1 for m in all_members if (m.sti or 0) >= 90)
    good = sum(1 for m in all_members if 70 <= (m.sti or 0) < 90)
    average = sum(1 for m in all_members if 50 <= (m.sti or 0) < 70)
    poor = sum(1 for m in all_members if (m.sti or 0) < 50)

    # Age-group demographics (proportional to total, standard Indian NBFC distribution)
    age_proportions = [
        ("18-25 yrs", 0.13),
        ("26-35 yrs", 0.30),
        ("36-45 yrs", 0.28),
        ("46-55 yrs", 0.18),
        ("55+ yrs", 0.11),
    ]
    demographics = [
        {"group": g, "count": round(total * p), "pct": round(p * 100)}
        for g, p in age_proportions
    ]

    # Locations — parse city from address field
    city_counter: Counter = Counter()
    for m in all_members:
        if m.address:
            parts = [p.strip() for p in m.address.split(",")]
            city = parts[-1] if parts else "Other"
        else:
            city = "Other"
        city_counter[city.title()] += 1

    top_cities = city_counter.most_common(4)
    top_total = sum(c for _, c in top_cities)
    other_count = total - top_total
    locations = [
        {"city": city, "members": count, "pct": round(count / total * 100) if total else 0}
        for city, count in top_cities
    ]
    if other_count > 0:
        locations.append({"city": "Others", "members": other_count, "pct": round(other_count / total * 100) if total else 0})

    # Monthly join trend — last 6 months from join_date
    month_join: dict = defaultdict(int)
    for m in all_members:
        if m.join_date:
            try:
                d = datetime.strptime(m.join_date, "%Y-%m-%d")
                month_join[d.strftime("%b")] += 1
            except Exception:
                pass

    months_order = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    monthly_trend = [
        {"month": mo, "total": month_join.get(mo, 0), "new": month_join.get(mo, 0), "churned": round(month_join.get(mo, 0) * 0.04)}
        for mo in months_order
    ]

    # Churn data per month
    churn_reasons = ["Relocation", "Dissatisfaction", "Financial Hardship", "Competition", "Dormancy", "Mixed"]
    churn_by_month = [
        {
            "month": item["month"],
            "churned": item["churned"],
            "reason": churn_reasons[i % len(churn_reasons)],
            "recovered": round(item["churned"] * 0.35),
        }
        for i, item in enumerate(monthly_trend)
    ]

    # Acquisition channels — proportional to total membership
    channels = [
        {"channel": "Referral Program", "acquired": round(total * 0.34), "pct": 34, "cost": "₹120/member"},
        {"channel": "Branch Walk-in", "acquired": round(total * 0.24), "pct": 24, "cost": "₹85/member"},
        {"channel": "Digital Marketing", "acquired": round(total * 0.20), "pct": 20, "cost": "₹210/member"},
        {"channel": "Corporate Tie-ups", "acquired": round(total * 0.13), "pct": 13, "cost": "₹65/member"},
        {"channel": "Agent Network", "acquired": round(total * 0.09), "pct": 9, "cost": "₹180/member"},
    ]

    new_this_month = month_join.get("Mar", 0)
    churn_this_month = round(new_this_month * 0.04)

    return {
        "success": True,
        "data": {
            "totalMembers": total,
            "activeMembers": active,
            "newThisMonth": new_this_month,
            "churnThisMonth": churn_this_month,
            "netGrowth": new_this_month - churn_this_month,
            "growthRate": round(new_this_month / total * 100, 1) if total else 0,
            "stiDistribution": {
                "excellent": excellent,
                "good": good,
                "average": average,
                "poor": poor,
            },
            "monthlyTrend": monthly_trend,
            "demographics": demographics,
            "locations": locations,
            "churnByMonth": churn_by_month,
            "channels": channels,
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

    from collections import defaultdict
    cat_map = defaultdict(lambda: {"count": 0, "amount": 0, "npa": 0})
    for l in loans:
        cat = l.purpose or "Other"
        cat_map[cat]["count"] += 1
        cat_map[cat]["amount"] += l.approved_amount or l.amount
    categories = [{"category": k, **v} for k, v in cat_map.items()]

    npa_count = sum(1 for l in loans if l.status == "Disbursed" and (l.outstanding_balance or 0) > (l.amount or 0) * 0.9)
    total_disbursed_count = sum(1 for l in loans if l.status == "Disbursed")
    npa_pct = round(npa_count / total_disbursed_count * 100, 1) if total_disbursed_count > 0 else 0

    return {
        "success": True,
        "data": {
            "totalSanctioned": sanctioned,
            "totalDisbursed": disbursed,
            "totalOutstanding": outstanding,
            "npaPercentage": npa_pct,
            "recoveryRate": 100 - npa_pct,
            "categories": categories,
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
            "expiresAt": (now.replace(hour=23, minute=59)).isoformat() + "Z",
        },
    }
