"""Governance & Board Pack endpoints — derived from compliance, audit, and member data."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict

from ..core.database import get_db
from ..core.dependencies import require_roles
from ..models.member import Member
from ..models.loan import Loan
from ..models.deposit import Deposit
from ..models.chit_scheme import ChitScheme
from ..models.compliance import ComplianceChecklist, RegulatoryFiling
from ..models.audit_log import AuditLog
from ..models.user import User

router = APIRouter(prefix="/governance", tags=["Governance"])
STAFF_ROLES = ("ADMIN",)


@router.get("/board-pack")
def get_board_pack(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """KPI snapshot and board-level summary for governance review."""
    total_members = db.query(Member).filter(Member.status == "Active").count()
    total_deposits = sum(d.amount for d in db.query(Deposit).filter(Deposit.status == "Active").all()) or 0
    total_loans = sum(l.outstanding_balance or l.amount for l in db.query(Loan).filter(Loan.status == "Disbursed").all()) or 0
    active_schemes = db.query(ChitScheme).filter(ChitScheme.status != "Closed").count()
    compliance_rules = db.query(ComplianceChecklist).all()
    compliant = sum(1 for r in compliance_rules if r.status == "Compliant")
    total_rules = len(compliance_rules) or 1
    compliance_score = round(compliant / total_rules * 100)

    npa_count = db.query(Loan).filter(Loan.status == "Disbursed").count()
    high_risk = db.query(Member).filter(Member.risk == "High").count()

    kpis = [
        {"label": "Active Members", "value": total_members, "type": "number"},
        {"label": "Total AUM", "value": total_deposits + total_loans, "type": "currency"},
        {"label": "Total Deposits", "value": total_deposits, "type": "currency"},
        {"label": "Loan Outstanding", "value": total_loans, "type": "currency"},
        {"label": "Active Chit Schemes", "value": active_schemes, "type": "number"},
        {"label": "Compliance Score", "value": f"{compliance_score}%", "type": "text"},
        {"label": "High Risk Members", "value": high_risk, "type": "number"},
        {"label": "Disbursed Loans", "value": npa_count, "type": "number"},
    ]

    # Filings status
    filings = db.query(RegulatoryFiling).all()
    filings_data = [
        {
            "form": f.form,
            "description": f.description,
            "dueDate": f.due_date,
            "status": f.status,
            "lastFiled": f.last_filed,
        }
        for f in filings
    ]

    return {
        "success": True,
        "data": {
            "kpis": kpis,
            "complianceScore": compliance_score,
            "filings": filings_data,
        },
    }


@router.get("/compliance-review")
def get_compliance_review(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """Compliance rules status and risk heatmap."""
    rules = db.query(ComplianceChecklist).all()
    members = db.query(Member).all()

    rules_data = [
        {
            "id": r.id,
            "rule": r.rule,
            "category": r.category,
            "status": r.status,
            "lastAudit": r.last_audit,
            "details": r.details,
            "weight": r.weight,
        }
        for r in rules
    ]

    # Risk distribution
    risk_dist = defaultdict(int)
    for m in members:
        risk_dist[m.risk or "Low"] += 1

    # STI distribution
    sti_dist = {
        "excellent": sum(1 for m in members if (m.sti or 0) >= 90),
        "good": sum(1 for m in members if 70 <= (m.sti or 0) < 90),
        "average": sum(1 for m in members if 50 <= (m.sti or 0) < 70),
        "poor": sum(1 for m in members if (m.sti or 0) < 50),
    }

    return {
        "success": True,
        "data": {
            "rules": rules_data,
            "riskDistribution": dict(risk_dist),
            "stiDistribution": sti_dist,
            "totalMembers": len(members),
        },
    }


@router.get("/audit-trail")
def get_audit_trail(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    """Recent audit log entries."""
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50).all()

    return {
        "success": True,
        "data": [
            {
                "id": l.id,
                "action": l.action,
                "userId": l.user_id,
                "module": l.module,
                "ip": l.ip,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None,
                "details": l.details,
            }
            for l in logs
        ],
    }
