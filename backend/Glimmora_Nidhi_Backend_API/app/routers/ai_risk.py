from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.member import Member
from ..models.fraud import TransactionAnomaly
from ..models.user import User

router = APIRouter(prefix="/ai-risk", tags=["AI Risk Control"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "FIELD_AGENT")


@router.get("/dashboard")
def get_ai_risk_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    high_risk_count = db.query(Member).filter(Member.risk == "High").count()
    return {
        "success": True,
        "data": {
            "agentsOnline": 4,
            "totalAgents": 6,
            "activeAlerts": high_risk_count,
            "riskScore": 72,
            "agents": [
                {"name": "Onboarding Agent", "status": "Active", "processed": 142, "pending": 8},
                {"name": "Fraud Triage Agent", "status": "Alert", "processed": 89, "pending": 12},
                {"name": "Loan Risk Agent", "status": "Active", "processed": 220, "pending": 5},
                {"name": "KYC Verification Agent", "status": "Active", "processed": 310, "pending": 15},
                {"name": "Collection Agent", "status": "Idle", "processed": 90, "pending": 0},
                {"name": "STI Recalc Agent", "status": "Idle", "processed": 180, "pending": 0},
            ],
        },
    }


@router.get("/member-risk/{member_id}")
def get_member_risk(
    member_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise NotFoundException("Member not found")

    factors = []
    risk_score = 0

    if member.sti < 50:
        factors.append({"factor": "Low STI", "impact": "High", "score": -25})
        risk_score += 25
    if member.kyc != "Verified":
        factors.append({"factor": "KYC Not Verified", "impact": "Medium", "score": -15})
        risk_score += 15
    if member.sti_fraud_flags < 100:
        factors.append({"factor": "Fraud Flag", "impact": "High", "score": -20})
        risk_score += 20

    # Determine risk level
    if risk_score >= 40:
        risk_level = "High"
    elif risk_score >= 20:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    recommendation = {
        "High": "Restrict new loan applications. Increase monitoring.",
        "Medium": "Monitor closely. Require additional documentation.",
        "Low": "Standard monitoring. No restrictions.",
    }.get(risk_level, "No action required.")

    return {
        "success": True,
        "data": {
            "memberId": member.id,
            "memberName": member.name,
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "factors": factors,
            "recommendation": recommendation,
            "lastAssessed": datetime.utcnow().isoformat() + "Z",
        },
    }


@router.get("/liquidity")
def get_liquidity_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    return {
        "success": True,
        "data": {
            "currentRatio": 1.8,
            "unencumberedDeposits": 12,
            "status": "Healthy",
            "inflows": {
                "deposits": 5200000,
                "emiCollections": 3800000,
                "chitSubscriptions": 1200000,
                "total": 10200000,
            },
            "outflows": {
                "chitPayouts": 4500000,
                "loanDisbursements": 3200000,
                "depositMaturities": 1800000,
                "operatingExpenses": 500000,
                "total": 10000000,
            },
            "netPosition": 200000,
            "forecast30Days": "Stable",
        },
    }


@router.get("/transaction-anomalies")
def get_transaction_anomalies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    results = (
        db.query(TransactionAnomaly, Member)
        .join(Member, TransactionAnomaly.member_id == Member.id)
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
                "amount": a.amount,
                "confidence": a.confidence,
                "detectedAt": a.detected_at.isoformat() + "Z",
                "status": a.status,
            }
            for a, m in results
        ],
    }
