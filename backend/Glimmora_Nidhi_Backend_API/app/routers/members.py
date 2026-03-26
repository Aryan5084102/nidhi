from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid, math
from datetime import datetime

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException, ConflictException
from ..models.member import Member
from ..models.user import User
from ..schemas.member import MemberCreate, MemberUpdate, MemberOut, STIResponse, STIBreakdown

router = APIRouter(prefix="/members", tags=["Members"])

STAFF_ROLES = ("ADMIN", "BRANCH_MANAGER")


def _member_out(m: Member) -> dict:
    return {
        "id": m.id,
        "name": m.name,
        "phone": m.phone,
        "email": m.email,
        "address": m.address,
        "deposits": m.total_deposits,
        "loans": m.total_loans,
        "risk": m.risk,
        "sti": m.sti,
        "kyc": m.kyc,
        "joinDate": m.join_date,
        "status": m.status,
        "nomineeName": m.nominee_name,
        "nomineeRelation": m.nominee_relation,
        "nomineeAadhaar": m.nominee_aadhaar,
        "nomineePan": m.nominee_pan,
    }


def _generate_member_id(db: Session) -> str:
    count = db.query(Member).count()
    return f"M-{1001 + count}"


@router.get("")
def get_members(
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=100),
    search: Optional[str] = None,
    risk: Optional[str] = None,
    kyc: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = db.query(Member)
    if search:
        like = f"%{search}%"
        query = query.filter(
            Member.name.ilike(like) | Member.phone.ilike(like) | Member.email.ilike(like)
        )
    if risk:
        query = query.filter(Member.risk == risk)
    if kyc:
        query = query.filter(Member.kyc == kyc)
    if status:
        query = query.filter(Member.status == status)
    total = query.count()
    members = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [_member_out(m) for m in members],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.get("/{member_id}")
def get_member(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(Member).filter(Member.id == member_id).first()
    if not m:
        raise NotFoundException("Member not found")
    return {"success": True, "data": _member_out(m)}


@router.post("", status_code=201)
def create_member(
    payload: MemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    if db.query(Member).filter(Member.email == payload.email).first():
        raise ConflictException("Email already registered", "EMAIL_EXISTS")
    if db.query(Member).filter(Member.phone == payload.phone).first():
        raise ConflictException("Phone already registered", "PHONE_EXISTS")
    member = Member(
        id=_generate_member_id(db),
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        address=payload.address,
        risk=payload.risk or "Low",
        kyc=payload.kyc or "Pending",
        sti=50,
        join_date=datetime.utcnow().date().isoformat(),
        status="Active",
        nominee_name=payload.nomineeName,
        nominee_relation=payload.nomineeRelation,
        nominee_aadhaar=payload.nomineeAadhaar,
        nominee_pan=payload.nomineePan,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return {
        "success": True,
        "data": _member_out(member),
        "message": "Member added successfully",
    }


@router.put("/{member_id}")
def update_member(
    member_id: str,
    payload: MemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    m = db.query(Member).filter(Member.id == member_id).first()
    if not m:
        raise NotFoundException("Member not found")
    camel_to_snake = {
        "nomineeName": "nominee_name",
        "nomineeRelation": "nominee_relation",
        "nomineeAadhaar": "nominee_aadhaar",
        "nomineePan": "nominee_pan",
    }
    for field, val in payload.model_dump(exclude_none=True).items():
        attr = camel_to_snake.get(field, field)
        setattr(m, attr, val)
    db.commit()
    db.refresh(m)
    return {
        "success": True,
        "data": {
            "id": m.id, "name": m.name, "phone": m.phone, "email": m.email,
            "address": m.address, "risk": m.risk, "kyc": m.kyc,
        },
        "message": "Member updated successfully",
    }


@router.delete("/{member_id}")
def deactivate_member(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    m = db.query(Member).filter(Member.id == member_id).first()
    if not m:
        raise NotFoundException("Member not found")
    m.status = "Inactive"
    m.is_active = False
    db.commit()
    return {"success": True, "message": "Member deactivated successfully"}


@router.get("/{member_id}/sti")
def get_member_sti(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(Member).filter(Member.id == member_id).first()
    if not m:
        raise NotFoundException("Member not found")
    return {
        "success": True,
        "data": {
            "memberId": m.id,
            "sti": m.sti,
            "breakdown": {
                "paymentPunctuality": m.sti_payment_punctuality,
                "accountActivity": m.sti_account_activity,
                "kycStatus": m.sti_kyc_status,
                "fraudFlags": m.sti_fraud_flags,
                "depositTenure": m.sti_deposit_tenure,
            },
            "lastCalculated": m.sti_last_calculated,
            "trend": m.sti_trend,
        },
    }
