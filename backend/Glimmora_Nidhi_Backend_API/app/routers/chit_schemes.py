from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.chit_scheme import ChitScheme
from ..models.chit_enrollment import ChitEnrollment
from ..models.member import Member
from ..models.user import User
from ..schemas.chit_scheme import ChitSchemeCreate

router = APIRouter(prefix="/chit-schemes", tags=["Chit Schemes"])


def _scheme_out(s: ChitScheme) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "monthlyAmount": s.monthly_amount,
        "duration": s.duration,
        "totalMembers": s.total_members,
        "enrolledMembers": s.enrolled_members,
        "potSize": s.pot_size,
        "nextAuction": s.next_auction,
        "status": s.status,
        "description": s.description,
        "minSTI": s.min_sti,
        "kycRequired": s.kyc_required,
        "spotsLeft": s.spots_left,
        "bracket": s.bracket or "Low",
        "payoutMethod": s.payout_method or "Auction",
        "maxDiscountPct": s.max_discount_pct or 30.0,
        "currentMonth": s.current_month or 0,
    }


def _generate_scheme_id(db: Session) -> str:
    count = db.query(ChitScheme).count()
    return f"CS-{str(count + 1).zfill(3)}"


@router.get("")
def get_schemes(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(ChitScheme)
    if status:
        query = query.filter(ChitScheme.status == status)
    schemes = query.all()
    return {"success": True, "data": [_scheme_out(s) for s in schemes]}


@router.get("/{scheme_id}")
def get_scheme(
    scheme_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(ChitScheme).filter(ChitScheme.id == scheme_id).first()
    if not s:
        raise NotFoundException("Chit scheme not found")
    data = _scheme_out(s)
    enrolled = (
        db.query(ChitEnrollment, Member)
        .join(Member, ChitEnrollment.member_id == Member.id)
        .filter(ChitEnrollment.scheme_id == scheme_id)
        .all()
    )
    data["members"] = [
        {
            "memberId": e.member_id,
            "name": m.name,
            "enrolledDate": e.enrolled_date,
            "hasWonAuction": e.has_won_auction,
        }
        for e, m in enrolled
    ]
    return {"success": True, "data": data}


@router.post("", status_code=201)
def create_scheme(
    payload: ChitSchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    scheme = ChitScheme(
        id=_generate_scheme_id(db),
        name=payload.name,
        monthly_amount=payload.monthlyAmount,
        duration=payload.duration,
        total_members=payload.totalMembers,
        enrolled_members=0,
        pot_size=payload.monthlyAmount * payload.totalMembers,
        description=payload.description,
        min_sti=payload.minSTI or 50,
        kyc_required=payload.kycRequired or "Verified",
        status="Open",
        bracket=payload.bracket or "Low",
        payout_method=payload.payoutMethod or "Auction",
        max_discount_pct=payload.maxDiscountPct or 30.0,
    )
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return {
        "success": True,
        "data": _scheme_out(scheme),
        "message": "Chit scheme created successfully",
    }
