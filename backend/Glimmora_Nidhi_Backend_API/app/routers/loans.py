from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date, timedelta
import uuid, math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException, BadRequestException
from ..models.loan import Loan, EMISchedule, LoanDefault
from ..models.member import Member
from ..models.user import User
from ..schemas.loan import LoanApplyRequest, LoanApproveRequest, LoanRejectRequest, LoanDisburseRequest

router = APIRouter(prefix="/loans", tags=["Loans"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER")


def _calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    r = annual_rate / 100 / 12
    if r == 0:
        return principal / tenure_months
    return round(principal * r * (1 + r) ** tenure_months / ((1 + r) ** tenure_months - 1), 2)


def _generate_emi_schedule(loan_id: str, principal: float, annual_rate: float, tenure: int, start_date: date):
    schedule = []
    r = annual_rate / 100 / 12
    emi = _calculate_emi(principal, annual_rate, tenure)
    balance = principal
    current_date = start_date
    for i in range(1, tenure + 1):
        interest = round(balance * r, 2)
        principal_part = round(emi - interest, 2)
        balance = round(balance - principal_part, 2)
        current_date = current_date + timedelta(days=30)
        schedule.append(
            EMISchedule(
                loan_id=loan_id,
                emi_no=i,
                due_date=current_date.isoformat(),
                amount=emi,
                principal=principal_part,
                interest=interest,
                outstanding_balance=max(balance, 0),
                status="Upcoming",
            )
        )
    return schedule


def _loan_out(loan: Loan, member: Member) -> dict:
    return {
        "id": loan.id,
        "memberId": loan.member_id,
        "memberName": member.name if member else "Unknown",
        "amount": loan.amount,
        "purpose": loan.purpose,
        "tenure": loan.tenure,
        "interestRate": loan.interest_rate,
        "risk": loan.risk,
        "stiScore": loan.sti_score,
        "status": loan.status,
        "appliedDate": loan.applied_date,
        "emi": loan.emi,
        "nextEmi": loan.next_emi,
    }


def _generate_loan_id(db: Session) -> str:
    count = db.query(Loan).count()
    return f"LA-{str(count + 1).zfill(3)}"


@router.get("/applications")
def get_loan_applications(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    risk: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = db.query(Loan, Member).join(Member, Loan.member_id == Member.id)
    if status:
        query = query.filter(Loan.status == status)
    if risk:
        query = query.filter(Loan.risk == risk)
    total = query.count()
    results = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [_loan_out(l, m) for l, m in results],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.post("/apply", status_code=201)
def apply_loan(
    payload: LoanApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    member = db.query(Member).filter(Member.id == payload.memberId).first()
    if not member:
        raise NotFoundException("Member not found")
    emi = _calculate_emi(payload.amount, 12.0, payload.tenure)
    loan = Loan(
        id=_generate_loan_id(db),
        member_id=payload.memberId,
        amount=payload.amount,
        purpose=payload.purpose,
        tenure=payload.tenure,
        interest_rate=12.0,
        risk=member.risk,
        sti_score=member.sti,
        status="Pending",
        applied_date=datetime.utcnow().date().isoformat(),
        emi=emi,
        outstanding_balance=payload.amount,
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return {
        "success": True,
        "data": _loan_out(loan, member),
        "message": "Loan application submitted successfully",
    }


@router.put("/{loan_id}/approve")
def approve_loan(
    loan_id: str,
    payload: LoanApproveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise NotFoundException("Loan not found")
    if loan.status not in ("Pending", "Under Review"):
        raise BadRequestException(f"Cannot approve loan in status: {loan.status}", "INVALID_STATUS")
    emi = _calculate_emi(payload.approvedAmount, payload.interestRate, payload.tenure)
    loan.status = "Approved"
    loan.approved_date = datetime.utcnow().date().isoformat()
    loan.approved_by = current_user.name
    loan.approved_amount = payload.approvedAmount
    loan.interest_rate = payload.interestRate
    loan.tenure = payload.tenure
    loan.emi = emi
    loan.remarks = payload.remarks
    db.commit()
    return {
        "success": True,
        "data": {
            "id": loan.id,
            "status": loan.status,
            "approvedBy": loan.approved_by,
            "approvedDate": loan.approved_date,
            "approvedAmount": loan.approved_amount,
            "emi": loan.emi,
        },
        "message": "Loan approved",
    }


@router.put("/{loan_id}/reject")
def reject_loan(
    loan_id: str,
    payload: LoanRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise NotFoundException("Loan not found")
    loan.status = "Rejected"
    loan.rejected_date = datetime.utcnow().date().isoformat()
    loan.rejected_by = current_user.name
    loan.rejection_reason = payload.reason
    db.commit()
    return {
        "success": True,
        "data": {
            "id": loan.id,
            "status": loan.status,
            "rejectedBy": loan.rejected_by,
            "rejectedDate": loan.rejected_date,
            "reason": loan.rejection_reason,
        },
        "message": "Loan rejected",
    }


@router.put("/{loan_id}/disburse")
def disburse_loan(
    loan_id: str,
    payload: LoanDisburseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise NotFoundException("Loan not found")
    if loan.status != "Approved":
        raise BadRequestException(f"Cannot disburse loan in status: {loan.status}", "INVALID_STATUS")

    first_emi_date = date.fromisoformat(payload.disbursementDate) + timedelta(days=30)
    loan.status = "Disbursed"
    loan.disburse_date = payload.disbursementDate
    loan.bank_account = payload.bankAccount
    loan.first_emi_date = first_emi_date.isoformat()
    loan.next_emi = first_emi_date.isoformat()

    # Generate EMI schedule
    schedule = _generate_emi_schedule(
        loan.id,
        loan.approved_amount or loan.amount,
        loan.interest_rate,
        loan.tenure,
        date.fromisoformat(payload.disbursementDate),
    )
    for item in schedule:
        db.add(item)
    db.commit()

    emi_items = [
        {
            "emiNo": s.emi_no,
            "date": s.due_date,
            "amount": s.amount,
            "principal": s.principal,
            "interest": s.interest,
            "balance": s.outstanding_balance,
        }
        for s in schedule[:2]
    ]
    return {
        "success": True,
        "data": {
            "id": loan.id,
            "status": loan.status,
            "disbursedAmount": loan.approved_amount or loan.amount,
            "disbursementDate": loan.disburse_date,
            "firstEmiDate": loan.first_emi_date,
            "emiSchedule": emi_items,
        },
        "message": "Loan disbursed successfully",
    }


@router.get("/{loan_id}/emi-schedule")
def get_emi_schedule(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise NotFoundException("Loan not found")
    schedule = (
        db.query(EMISchedule)
        .filter(EMISchedule.loan_id == loan_id)
        .order_by(EMISchedule.emi_no)
        .all()
    )
    return {
        "success": True,
        "data": {
            "loanId": loan_id,
            "totalEmis": loan.tenure,
            "emiAmount": loan.emi,
            "schedule": [
                {
                    "emiNo": s.emi_no,
                    "dueDate": s.due_date,
                    "amount": s.amount,
                    "principal": s.principal,
                    "interest": s.interest,
                    "outstandingBalance": s.outstanding_balance,
                    "status": s.status,
                    "paidDate": s.paid_date,
                }
                for s in schedule
            ],
        },
    }


@router.get("/portfolio")
def get_loan_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    # Aggregate by category
    categories = db.query(Loan.category).distinct().all()
    portfolio = []
    for (cat,) in categories:
        loans = db.query(Loan).filter(Loan.category == cat).all()
        sanctioned = sum(l.approved_amount or l.amount for l in loans)
        disbursed = sum(l.approved_amount or l.amount for l in loans if l.status == "Disbursed")
        portfolio.append({
            "category": cat or "Personal",
            "count": len(loans),
            "sanctioned": sanctioned,
            "disbursed": disbursed,
            "npa": sum(1 for l in loans if l.status in ("Defaulted",)),
            "avgRate": sum(l.interest_rate for l in loans) / len(loans) if loans else 0,
        })
    return {"success": True, "data": portfolio}


@router.get("/defaults")
def get_loan_defaults(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    defaults = (
        db.query(LoanDefault, Member)
        .join(Member, LoanDefault.member_id == Member.id)
        .all()
    )
    return {
        "success": True,
        "data": [
            {
                "id": d.id,
                "memberId": d.member_id,
                "memberName": m.name,
                "outstanding": d.outstanding,
                "missedEmis": d.missed_emis,
                "defaultDate": d.default_date,
                "status": d.status,
            }
            for d, m in defaults
        ],
    }


@router.get("/members/{member_id}/loans", tags=["Members"])
def get_member_loans(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loans = db.query(Loan).filter(Loan.member_id == member_id).all()
    return {
        "success": True,
        "data": [
            {
                "id": l.id,
                "amount": l.amount,
                "purpose": l.purpose,
                "tenure": l.tenure,
                "interestRate": l.interest_rate,
                "emi": l.emi,
                "nextEmi": l.next_emi,
                "status": l.status,
                "outstandingBalance": l.outstanding_balance,
            }
            for l in loans
        ],
    }
