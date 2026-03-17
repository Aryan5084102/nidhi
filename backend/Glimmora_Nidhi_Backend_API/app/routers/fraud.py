from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import json, math

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.fraud import FraudCase, TransactionAnomaly
from ..models.member import Member
from ..models.user import User
from ..schemas.fraud import FraudCaseUpdate

router = APIRouter(prefix="/fraud", tags=["Fraud Intelligence"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "FIELD_AGENT")


@router.get("/dashboard")
def get_fraud_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    cases = db.query(FraudCase).all()
    total = len(cases)
    critical = sum(1 for c in cases if c.severity == "Critical")
    resolved_this_month = sum(1 for c in cases if c.status == "Resolved")
    prevented = sum(c.potential_loss or 0 for c in cases if c.status == "Resolved")
    return {
        "success": True,
        "data": {
            "totalAlerts": total,
            "criticalAlerts": critical,
            "resolvedThisMonth": resolved_this_month,
            "avgResolutionDays": 4.2,
            "falsePositiveRate": 12,
            "totalLossPrevented": prevented,
        },
    }


@router.get("/cases")
def get_fraud_cases(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query = db.query(FraudCase)
    if severity:
        query = query.filter(FraudCase.severity == severity)
    if status:
        query = query.filter(FraudCase.status == status)
    total = query.count()
    cases = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "type": c.type,
                "description": c.description,
                "members": json.loads(c.members_involved) if c.members_involved else [],
                "severity": c.severity,
                "detectedBy": c.detected_by,
                "detectedAt": c.detected_at.isoformat() + "Z",
                "status": c.status,
                "potentialLoss": c.potential_loss,
                "assignedTo": c.assigned_to,
            }
            for c in cases
        ],
        "pagination": {
            "page": page, "limit": limit, "total": total,
            "totalPages": math.ceil(total / limit) if limit else 1,
        },
    }


@router.put("/cases/{case_id}")
def update_fraud_case(
    case_id: str,
    payload: FraudCaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    case = db.query(FraudCase).filter(FraudCase.id == case_id).first()
    if not case:
        raise NotFoundException("Fraud case not found")
    case.status = payload.status
    if payload.remarks:
        case.remarks = payload.remarks
    if payload.actionTaken:
        case.action_taken = payload.actionTaken
    case.updated_at = datetime.utcnow()
    case.updated_by = current_user.name
    db.commit()
    return {
        "success": True,
        "data": {
            "id": case.id,
            "status": case.status,
            "updatedAt": case.updated_at.isoformat() + "Z",
            "updatedBy": case.updated_by,
        },
        "message": "Case updated",
    }


@router.get("/patterns")
def get_fraud_patterns(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    cases = db.query(FraudCase).all()
    pattern_map: dict = {}
    for c in cases:
        t = c.type
        if t not in pattern_map:
            pattern_map[t] = {"type": t, "frequency": 0, "trend": "stable", "lastDetected": ""}
        pattern_map[t]["frequency"] += 1
        ts = c.detected_at.date().isoformat()
        if ts > pattern_map[t]["lastDetected"]:
            pattern_map[t]["lastDetected"] = ts

    return {
        "success": True,
        "data": {
            "patterns": list(pattern_map.values()),
            "monthlyTrend": [
                {"month": "Jan 2026", "alerts": 12},
                {"month": "Feb 2026", "alerts": 18},
                {"month": "Mar 2026", "alerts": len(cases)},
            ],
        },
    }
