"""Collateral & Guarantor endpoints — derived from Loan and Member data."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict

from ..core.database import get_db
from ..core.dependencies import require_roles
from ..models.loan import Loan
from ..models.member import Member
from ..models.deposit import Deposit
from ..models.user import User

router = APIRouter(prefix="/collateral", tags=["Collateral"])
STAFF_ROLES = ("ADMIN", "BRANCH_MANAGER")


@router.get("/registry")
def get_collateral_registry(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """Derive collateral from active loans and deposits."""
    loans = db.query(Loan).filter(Loan.status.in_(["Disbursed", "Approved"])).all()
    deposits = db.query(Deposit).filter(Deposit.status == "Active").all()

    items = []
    # Loans as collateral pledges
    for l in loans:
        member = db.query(Member).filter(Member.id == l.member_id).first()
        items.append({
            "id": f"COL-{l.id}",
            "type": "Loan Collateral",
            "category": l.category or l.purpose or "General",
            "memberName": member.name if member else "Unknown",
            "memberId": l.member_id,
            "value": l.approved_amount or l.amount,
            "loanId": l.id,
            "status": "Active" if l.status == "Disbursed" else "Pledged",
            "riskLevel": l.risk or "Low",
        })

    # FD-backed collateral from deposits
    for d in deposits:
        if d.type == "Fixed Deposit" and d.amount >= 50000:
            member = db.query(Member).filter(Member.id == d.member_id).first()
            items.append({
                "id": f"COL-{d.id}",
                "type": "FD Receipt",
                "category": "Fixed Deposit",
                "memberName": member.name if member else "Unknown",
                "memberId": d.member_id,
                "value": d.amount,
                "depositId": d.id,
                "status": "Lien Marked" if d.amount >= 100000 else "Available",
                "riskLevel": "Low",
            })

    # Summary stats
    total_value = sum(i["value"] for i in items)
    by_type = defaultdict(float)
    for i in items:
        by_type[i["type"]] += i["value"]

    return {
        "success": True,
        "data": {
            "items": items,
            "totalValue": total_value,
            "totalItems": len(items),
            "byType": [{"type": k, "value": v} for k, v in by_type.items()],
        },
    }


@router.get("/guarantors")
def get_guarantors(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """Derive guarantors from member relationships with active loans."""
    loans = db.query(Loan).filter(Loan.status.in_(["Disbursed", "Approved"])).all()
    members = {m.id: m for m in db.query(Member).all()}

    guarantors = []
    for l in loans:
        borrower = members.get(l.member_id)
        if not borrower:
            continue
        # Each borrower with STI >= 70 can be a guarantor for others
        if borrower.sti and borrower.sti >= 70:
            guarantors.append({
                "id": f"GUA-{borrower.id}",
                "name": borrower.name,
                "memberId": borrower.id,
                "sti": borrower.sti,
                "kyc": borrower.kyc,
                "loansBacked": 1,
                "totalExposure": l.approved_amount or l.amount,
                "status": "Active" if borrower.status == "Active" else "Inactive",
            })

    return {
        "success": True,
        "data": {
            "guarantors": guarantors,
            "totalGuarantors": len(guarantors),
        },
    }


@router.get("/exposure")
def get_exposure_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """Exposure analysis across loan types and members."""
    loans = db.query(Loan).filter(Loan.status.in_(["Disbursed", "Approved"])).all()
    members = {m.id: m for m in db.query(Member).all()}

    # By risk level
    risk_dist = defaultdict(lambda: {"count": 0, "amount": 0})
    for l in loans:
        risk = l.risk or "Low"
        risk_dist[risk]["count"] += 1
        risk_dist[risk]["amount"] += l.outstanding_balance or l.approved_amount or l.amount

    # By category
    cat_dist = defaultdict(lambda: {"count": 0, "amount": 0})
    for l in loans:
        cat = l.category or l.purpose or "Other"
        cat_dist[cat]["count"] += 1
        cat_dist[cat]["amount"] += l.outstanding_balance or l.approved_amount or l.amount

    total_exposure = sum(l.outstanding_balance or l.approved_amount or l.amount for l in loans)

    return {
        "success": True,
        "data": {
            "totalExposure": total_exposure,
            "totalLoans": len(loans),
            "byRisk": [{"risk": k, **v} for k, v in risk_dist.items()],
            "byCategory": [{"category": k, **v} for k, v in cat_dist.items()],
        },
    }
