from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date
import uuid, math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.collection import Collection, Payment, RecoveryCase
from ..models.member import Member
from ..models.user import User
from ..schemas.collection import RecordPaymentRequest, MakePaymentRequest

router = APIRouter(prefix="/collections", tags=["Collections & Payments"])


def _generate_payment_id(db: Session) -> str:
    count = db.query(Payment).count()
    return f"PAY-{str(count + 1).zfill(3)}"


@router.get("/dashboard")
def get_collections_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_due = sum(c.amount for c in db.query(Collection).filter(Collection.status.in_(["Upcoming", "Overdue"])).all())
    total_collected = sum(p.amount for p in db.query(Payment).filter(Payment.status == "Success").all())
    overdue = db.query(Collection).filter(Collection.status == "Overdue").all()
    overdue_amount = sum(c.amount for c in overdue)
    overdue_member_ids = set(c.member_id for c in overdue)
    recovery_cases = db.query(RecoveryCase).filter(RecoveryCase.status.in_(["In Progress", "Assigned"])).count()
    total = total_due + total_collected
    rate = round((total_collected / total * 100), 1) if total > 0 else 0
    return {
        "success": True,
        "data": {
            "collectionRate": rate,
            "activeCases": recovery_cases,
            "totalDue": total_due,
            "totalCollected": total_collected,
            "overdueAmount": overdue_amount,
            "overdueMembers": len(overdue_member_ids),
        },
    }


@router.get("/schedule")
def get_payment_schedule(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Collection, Member).join(Member, Collection.member_id == Member.id)
    if type:
        query = query.filter(Collection.type == type)
    if status:
        query = query.filter(Collection.status == status)
    total = query.count()
    results = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "memberId": c.member_id,
                "memberName": m.name,
                "type": c.type,
                "referenceId": c.reference_id,
                "amount": c.amount,
                "dueDate": c.due_date,
                "status": c.status,
                "phone": m.phone,
            }
            for c, m in results
        ],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.get("/overdue")
def get_overdue_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = datetime.utcnow().date().isoformat()
    results = (
        db.query(Collection, Member)
        .join(Member, Collection.member_id == Member.id)
        .filter(Collection.status == "Overdue")
        .all()
    )
    data = []
    for c, m in results:
        due = date.fromisoformat(c.due_date)
        days_overdue = (datetime.utcnow().date() - due).days
        data.append({
            "id": c.id,
            "memberId": c.member_id,
            "memberName": m.name,
            "type": c.type,
            "referenceId": c.reference_id,
            "amount": c.amount,
            "dueDate": c.due_date,
            "daysOverdue": days_overdue,
            "status": c.status,
            "phone": m.phone,
            "assignedAgent": c.assigned_agent,
        })
    return {"success": True, "data": data}


@router.post("/{collection_id}/record-payment")
def record_payment(
    collection_id: str,
    payload: RecordPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise NotFoundException("Collection record not found")
    payment = Payment(
        id=_generate_payment_id(db),
        collection_id=collection_id,
        member_id=collection.member_id,
        type=collection.type,
        reference_id=collection.reference_id,
        amount=payload.amount,
        payment_method=payload.paymentMethod,
        transaction_id=payload.transactionId,
        collected_by=payload.collectedBy,
        remarks=payload.remarks,
        date=datetime.utcnow().date().isoformat(),
        status="Success",
    )
    db.add(payment)
    collection.status = "Paid"
    db.commit()
    db.refresh(payment)
    return {
        "success": True,
        "data": {
            "collectionId": collection_id,
            "paymentId": payment.id,
            "amount": payment.amount,
            "paymentMethod": payment.payment_method,
            "transactionId": payment.transaction_id,
            "collectedDate": payment.date,
            "status": payment.status,
        },
        "message": "Payment recorded successfully",
    }


@router.get("/recovery")
def get_recovery_cases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = (
        db.query(RecoveryCase, Member)
        .join(Member, RecoveryCase.member_id == Member.id)
        .all()
    )
    return {
        "success": True,
        "data": [
            {
                "caseId": r.id,
                "memberId": r.member_id,
                "memberName": m.name,
                "outstanding": r.outstanding,
                "missedEmis": r.missed_emis,
                "assignedAgent": r.assigned_agent,
                "agentId": r.agent_id,
                "status": r.status,
                "lastContact": r.last_contact,
                "nextFollowUp": r.next_follow_up,
            }
            for r, m in results
        ],
    }


@router.post("/members/{member_id}/make-payment", tags=["Members"])
def make_payment(
    member_id: str,
    payload: MakePaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    collection = db.query(Collection).filter(Collection.id == payload.collectionId).first()
    if not collection:
        raise NotFoundException("Collection record not found")
    payment = Payment(
        id=_generate_payment_id(db),
        collection_id=payload.collectionId,
        member_id=member_id,
        type=collection.type,
        reference_id=collection.reference_id,
        amount=payload.amount,
        payment_method=payload.paymentMethod,
        date=datetime.utcnow().date().isoformat(),
        status="Success",
    )
    db.add(payment)
    collection.status = "Paid"
    db.commit()
    db.refresh(payment)
    return {
        "success": True,
        "data": {
            "paymentId": payment.id,
            "amount": payment.amount,
            "paymentMethod": payment.payment_method,
            "date": payment.date,
            "status": payment.status,
        },
        "message": "Payment successful",
    }


@router.get("/members/{member_id}/payments", tags=["Members"])
def get_member_payments(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = db.query(Payment).filter(Payment.member_id == member_id).order_by(Payment.created_at.desc()).all()
    return {
        "success": True,
        "data": [
            {
                "paymentId": p.id,
                "type": p.type,
                "referenceId": p.reference_id,
                "amount": p.amount,
                "date": p.date,
                "method": p.payment_method,
                "status": p.status,
            }
            for p in payments
        ],
    }
