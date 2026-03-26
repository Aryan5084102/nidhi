from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid, math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException, BadRequestException, ConflictException
from ..models.chit_scheme import ChitScheme
from ..models.chit_enrollment import ChitEnrollment
from ..models.member import Member
from ..models.user import User
from ..schemas.chit_enrollment import ChitEnrollmentCreate

router = APIRouter(tags=["Chit Enrollments"])

STAFF_ROLES = ("ADMIN", "BRANCH_MANAGER")


def _generate_enrollment_id(db: Session) -> str:
    count = db.query(ChitEnrollment).count()
    return f"EN-{str(count + 1).zfill(3)}"


@router.get("/chit-enrollments")
def get_all_enrollments(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=200),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = (
        db.query(ChitEnrollment, ChitScheme, Member)
        .join(ChitScheme, ChitEnrollment.scheme_id == ChitScheme.id)
        .join(Member, ChitEnrollment.member_id == Member.id)
    )
    if status:
        query = query.filter(ChitEnrollment.status == status)
    total = query.count()
    results = query.order_by(ChitEnrollment.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    data = []
    for e, s, m in results:
        data.append({
            "id": e.id,
            "memberId": e.member_id,
            "memberName": m.name,
            "schemeId": e.scheme_id,
            "schemeName": s.name,
            "monthlyAmount": s.monthly_amount,
            "stiScore": m.sti,
            "kyc": m.kyc,
            "nomineeName": e.nominee_name,
            "nomineeRelation": e.nominee_relationship,
            "appliedDate": e.enrolled_date,
            "status": e.status,
            "payoutMethod": s.payout_method or "Auction",
            "deregistrationStatus": e.deregistration_status,
        })
    return {
        "success": True,
        "data": data,
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.put("/chit-enrollments/{enrollment_id}/approve")
def approve_enrollment(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    enrollment = db.query(ChitEnrollment).filter(ChitEnrollment.id == enrollment_id).first()
    if not enrollment:
        raise NotFoundException("Enrollment not found")
    if enrollment.status == "Active":
        raise BadRequestException("Enrollment is already active", "ALREADY_ACTIVE")
    enrollment.status = "Active"
    db.commit()
    return {"success": True, "message": "Enrollment approved successfully"}


@router.put("/chit-enrollments/{enrollment_id}/reject")
def reject_enrollment(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    enrollment = db.query(ChitEnrollment).filter(ChitEnrollment.id == enrollment_id).first()
    if not enrollment:
        raise NotFoundException("Enrollment not found")
    enrollment.status = "Rejected"
    db.commit()
    return {"success": True, "message": "Enrollment rejected"}


@router.post("/chit-schemes/{scheme_id}/enroll", status_code=201)
def enroll_member(
    scheme_id: str,
    payload: ChitEnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scheme = db.query(ChitScheme).filter(ChitScheme.id == scheme_id).first()
    if not scheme:
        raise NotFoundException("Chit scheme not found")
    if scheme.status != "Open":
        raise BadRequestException("Chit scheme is not open for enrollment", "SCHEME_CLOSED")
    if scheme.spots_left <= 0:
        raise BadRequestException("No spots available in this scheme", "SCHEME_FULL")

    member = db.query(Member).filter(Member.id == payload.memberId).first()
    if not member:
        raise NotFoundException("Member not found")
    if member.sti < scheme.min_sti:
        raise BadRequestException(
            f"Member STI score ({member.sti}) is below minimum required ({scheme.min_sti})",
            "STI_TOO_LOW",
        )
    if scheme.kyc_required == "Verified" and member.kyc != "Verified":
        raise BadRequestException("Member KYC is not verified", "KYC_NOT_VERIFIED")

    existing = (
        db.query(ChitEnrollment)
        .filter(
            ChitEnrollment.scheme_id == scheme_id,
            ChitEnrollment.member_id == payload.memberId,
            ChitEnrollment.status == "Active",
        )
        .first()
    )
    if existing:
        raise ConflictException("Member is already enrolled in this scheme", "ALREADY_ENROLLED")

    enrollment = ChitEnrollment(
        id=_generate_enrollment_id(db),
        scheme_id=scheme_id,
        member_id=payload.memberId,
        full_name=payload.fullName,
        phone=payload.phone,
        email=payload.email,
        nominee_name=payload.nomineeName,
        nominee_relationship=payload.nomineeRelationship,
        accepted_terms=payload.acceptedTerms,
        authorized_auto_deduction=payload.authorizedAutoDeduction,
        status="Active",
    )
    db.add(enrollment)
    scheme.enrolled_members += 1
    db.commit()
    db.refresh(enrollment)
    return {
        "success": True,
        "data": {
            "enrollmentId": enrollment.id,
            "schemeId": scheme_id,
            "memberId": payload.memberId,
            "schemeName": scheme.name,
            "monthlyAmount": scheme.monthly_amount,
            "enrolledDate": enrollment.enrolled_date,
            "nomineeName": enrollment.nominee_name,
            "nomineeRelationship": enrollment.nominee_relationship,
            "status": enrollment.status,
        },
        "message": "Enrollment successful",
    }


@router.put("/chit-enrollments/{enrollment_id}/withdraw")
def withdraw_enrollment(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    enrollment = db.query(ChitEnrollment).filter(ChitEnrollment.id == enrollment_id).first()
    if not enrollment:
        raise NotFoundException("Enrollment not found")
    if enrollment.status not in ("Active",):
        raise BadRequestException("Only active enrollments can be withdrawn", "INVALID_STATUS")
    scheme = db.query(ChitScheme).filter(ChitScheme.id == enrollment.scheme_id).first()
    # Calculate commission deduction and refund
    commission_rate = 0.05  # 5% foreman commission
    total_paid = scheme.monthly_amount * (scheme.current_month or 1)
    commission_deduction = total_paid * commission_rate
    refund = total_paid - commission_deduction
    enrollment.status = "Withdrawn"
    enrollment.withdrawal_date = datetime.utcnow().date().isoformat()
    enrollment.withdrawal_commission = commission_deduction
    enrollment.refund_amount = refund
    enrollment.deregistration_status = "Pending Deregistration"
    scheme.enrolled_members = max(0, scheme.enrolled_members - 1)
    db.commit()
    return {
        "success": True,
        "message": "Enrollment withdrawn successfully",
        "data": {
            "totalPaid": total_paid,
            "commissionDeducted": commission_deduction,
            "refundAmount": refund,
            "deregistrationStatus": "Pending Deregistration",
        },
    }


@router.put("/chit-enrollments/{enrollment_id}/deregister")
def confirm_deregistration(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    enrollment = db.query(ChitEnrollment).filter(ChitEnrollment.id == enrollment_id).first()
    if not enrollment:
        raise NotFoundException("Enrollment not found")
    enrollment.deregistration_status = "Deregistered"
    enrollment.registrar_notified = True
    db.commit()
    return {"success": True, "message": "Deregistration confirmed and Registrar notified"}


@router.get("/members/{member_id}/chit-enrollments")
def get_member_enrollments(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    enrollments = (
        db.query(ChitEnrollment, ChitScheme)
        .join(ChitScheme, ChitEnrollment.scheme_id == ChitScheme.id)
        .filter(ChitEnrollment.member_id == member_id)
        .all()
    )
    data = [
        {
            "enrollmentId": e.id,
            "schemeId": e.scheme_id,
            "schemeName": s.name,
            "monthlyAmount": s.monthly_amount,
            "potSize": s.pot_size,
            "duration": s.duration,
            "enrolledDate": e.enrolled_date,
            "nextAuction": s.next_auction,
            "hasWonAuction": e.has_won_auction,
            "status": e.status,
            "payoutMethod": s.payout_method or "Auction",
            "bracket": s.bracket or "Low",
        }
        for e, s in enrollments
    ]
    return {"success": True, "data": data}
