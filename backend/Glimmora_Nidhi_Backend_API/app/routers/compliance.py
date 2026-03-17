from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..models.compliance import ComplianceChecklist, KYCMonitoring, AMLAlert, RegulatoryFiling
from ..models.audit_log import AuditLog
from ..models.member import Member
from ..models.user import User

router = APIRouter(prefix="/compliance", tags=["Compliance"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "FIELD_AGENT")


@router.get("/dashboard")
def get_compliance_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    checklists = db.query(ComplianceChecklist).all()
    compliant = sum(1 for c in checklists if c.status == "Compliant")
    warnings = sum(1 for c in checklists if c.status == "Warning")
    action_req = sum(1 for c in checklists if c.status == "Action Required")
    total = len(checklists)
    score = round((compliant / total * 100), 0) if total else 0
    return {
        "success": True,
        "data": {
            "overallScore": score,
            "totalRules": total,
            "compliant": compliant,
            "warnings": warnings,
            "actionRequired": action_req,
            "lastAudit": "2026-03-01",
            "nextAudit": "2026-04-01",
        },
    }


@router.get("/checklist")
def get_checklist(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    checklists = db.query(ComplianceChecklist).all()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "rule": c.rule,
                "category": c.category,
                "status": c.status,
                "lastAudit": c.last_audit,
                "details": c.details,
                "weight": c.weight,
            }
            for c in checklists
        ],
    }


@router.get("/kyc-monitoring")
def get_kyc_monitoring(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = (
        db.query(KYCMonitoring, Member)
        .join(Member, KYCMonitoring.member_id == Member.id)
    )
    if status:
        query = query.filter(KYCMonitoring.kyc_status == status)
    total = query.count()
    results = query.offset((page - 1) * limit).limit(limit).all()

    # Summary
    all_kyc = db.query(KYCMonitoring).all()
    summary = {
        "totalMembers": len(all_kyc),
        "verified": sum(1 for k in all_kyc if k.kyc_status == "Verified"),
        "pending": sum(1 for k in all_kyc if k.kyc_status == "Pending"),
        "review": sum(1 for k in all_kyc if k.kyc_status == "Review"),
    }

    return {
        "success": True,
        "data": [
            {
                "memberId": k.member_id,
                "memberName": m.name,
                "kycStatus": k.kyc_status,
                "panVerified": k.pan_verified,
                "aadhaarVerified": k.aadhaar_verified,
                "addressVerified": k.address_verified,
                "photoVerified": k.photo_verified,
                "lastVerification": k.last_verification,
                "dueDate": k.due_date,
            }
            for k, m in results
        ],
        "summary": summary,
    }


@router.get("/aml-monitoring")
def get_aml_monitoring(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    results = (
        db.query(AMLAlert, Member)
        .join(Member, AMLAlert.member_id == Member.id)
        .all()
    )
    return {
        "success": True,
        "data": [
            {
                "id": a.id,
                "memberId": a.member_id,
                "memberName": m.name,
                "type": a.type,
                "description": a.description,
                "totalAmount": a.total_amount,
                "transactionCount": a.transaction_count,
                "detectedDate": a.detected_date,
                "severity": a.severity,
                "status": a.status,
            }
            for a, m in results
        ],
    }


@router.get("/regulatory-filings")
def get_regulatory_filings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    filings = db.query(RegulatoryFiling).all()
    return {
        "success": True,
        "data": [
            {
                "form": f.form,
                "description": f.description,
                "frequency": f.frequency,
                "dueDate": f.due_date,
                "status": f.status,
                "lastFiled": f.last_filed,
            }
            for f in filings
        ],
    }


@router.get("/audit-logs")
def get_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    action: Optional[str] = None,
    userId: Optional[str] = None,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("SUPER_ADMIN", "ADMIN")),
):
    query = db.query(AuditLog, User).outerjoin(User, AuditLog.user_id == User.id)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if userId:
        query = query.filter(AuditLog.user_id == userId)
    total = query.count()
    results = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [
            {
                "id": log.id,
                "userId": log.user_id,
                "userName": u.name if u else None,
                "role": u.role if u else None,
                "action": log.action,
                "module": log.module,
                "ip": log.ip,
                "timestamp": log.timestamp.isoformat() + "Z",
                "details": log.details,
            }
            for log, u in results
        ],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }
