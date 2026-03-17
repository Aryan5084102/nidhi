from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date, timedelta
import json, math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.deposit import Deposit, DepositScheme
from ..models.member import Member
from ..models.user import User
from ..schemas.deposit import DepositCreate

router = APIRouter(prefix="/deposits", tags=["Deposits"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER")

DEPOSIT_RATES = {
    "Fixed Deposit": {"6": 8.0, "12": 8.5, "24": 9.0, "36": 9.5},
    "Recurring Deposit": {"12": 7.5, "24": 8.0, "36": 8.5},
    "Savings": {},
}


def _get_rate(dep_type: str, tenure: Optional[int]) -> float:
    rates = DEPOSIT_RATES.get(dep_type, {})
    if tenure and str(tenure) in rates:
        return rates[str(tenure)]
    if rates:
        return list(rates.values())[0]
    return 4.0  # savings rate


def _generate_deposit_id(db: Session) -> str:
    count = db.query(Deposit).count()
    prefix = "FD" if True else "RD"
    return f"FD-{str(count + 1).zfill(3)}"


def _deposit_out(d: Deposit, member_name: str) -> dict:
    return {
        "id": d.id,
        "memberId": d.member_id,
        "memberName": member_name,
        "type": d.type,
        "amount": d.amount,
        "rate": d.rate,
        "tenure": d.tenure,
        "maturityDate": d.maturity_date,
        "maturityAmount": d.maturity_amount,
        "status": d.status,
        "openDate": d.open_date,
        "autoRenewal": d.auto_renewal,
    }


@router.get("/accounts")
def get_deposit_accounts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = db.query(Deposit, Member).join(Member, Deposit.member_id == Member.id)
    if type:
        query = query.filter(Deposit.type == type)
    if status:
        query = query.filter(Deposit.status == status)
    total = query.count()
    results = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [_deposit_out(d, m.name) for d, m in results],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.post("/accounts", status_code=201)
def open_deposit(
    payload: DepositCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    member = db.query(Member).filter(Member.id == payload.memberId).first()
    if not member:
        raise NotFoundException("Member not found")

    rate = _get_rate(payload.type, payload.tenure)
    open_date = datetime.utcnow().date()
    maturity_date = None
    maturity_amount = None
    if payload.tenure:
        maturity_date = (open_date + timedelta(days=30 * payload.tenure)).isoformat()
        maturity_amount = round(payload.amount * (1 + rate / 100), 2)

    deposit = Deposit(
        id=_generate_deposit_id(db),
        member_id=payload.memberId,
        type=payload.type,
        amount=payload.amount,
        rate=rate,
        tenure=payload.tenure,
        maturity_date=maturity_date,
        maturity_amount=maturity_amount,
        open_date=open_date.isoformat(),
        auto_renewal=payload.autoRenewal or False,
        status="Active",
    )
    db.add(deposit)
    db.commit()
    db.refresh(deposit)
    return {
        "success": True,
        "data": _deposit_out(deposit, member.name),
        "message": "Deposit account opened successfully",
    }


@router.get("/schemes")
def get_deposit_schemes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schemes = db.query(DepositScheme).filter(DepositScheme.is_active == True).all()
    data = []
    for s in schemes:
        tenures = json.loads(s.tenures_json) if s.tenures_json else []
        rates = json.loads(s.rates_json) if s.rates_json else {}
        data.append({
            "name": s.name,
            "type": s.type,
            "minAmount": s.min_amount,
            "maxAmount": s.max_amount,
            "tenures": tenures,
            "rates": rates,
            "members": s.members_count,
            "totalCorpus": s.total_corpus,
        })
    return {"success": True, "data": data}


@router.get("/maturity-tracker")
def get_maturity_tracker(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    today = datetime.utcnow().date()
    cutoff = today + timedelta(days=days)
    deposits = (
        db.query(Deposit, Member)
        .join(Member, Deposit.member_id == Member.id)
        .filter(
            Deposit.status == "Active",
            Deposit.maturity_date.isnot(None),
            Deposit.maturity_date <= cutoff.isoformat(),
        )
        .all()
    )
    data = []
    for d, m in deposits:
        mat_date = date.fromisoformat(d.maturity_date)
        days_left = (mat_date - today).days
        data.append({
            "id": d.id,
            "memberId": d.member_id,
            "memberName": m.name,
            "type": d.type,
            "amount": d.amount,
            "maturityDate": d.maturity_date,
            "maturityAmount": d.maturity_amount,
            "daysToMaturity": days_left,
            "autoRenewal": d.auto_renewal,
            "status": "Maturing Soon",
        })
    return {"success": True, "data": data}


@router.get("/members/{member_id}/deposits", tags=["Members"])
def get_member_deposits(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deposits = db.query(Deposit).filter(Deposit.member_id == member_id).all()
    return {
        "success": True,
        "data": [
            {
                "id": d.id,
                "type": d.type,
                "amount": d.amount,
                "rate": d.rate,
                "tenure": d.tenure,
                "maturityDate": d.maturity_date,
                "maturityAmount": d.maturity_amount,
                "status": d.status,
                "openDate": d.open_date,
            }
            for d in deposits
        ],
    }
