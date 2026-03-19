from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..models.member import Member
from ..models.fraud import TransactionAnomaly
from ..models.user import User

router = APIRouter(prefix="/ai-risk", tags=["AI Risk Control"])

STAFF_ROLES = ("ADMIN", "BRANCH_MANAGER")


@router.get("/dashboard")
def get_ai_risk_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    from ..models.loan import Loan
    from ..models.deposit import Deposit
    from ..models.chit_enrollment import ChitEnrollment

    high_risk_count = db.query(Member).filter(Member.risk == "High").count()
    total_members = db.query(Member).count() or 1
    avg_sti = db.query(Member).with_entities(func.avg(Member.sti)).scalar() or 50
    risk_score = min(100, max(0, round(100 - avg_sti)))

    # Compute agent stats from real data
    total_loans = db.query(Loan).count()
    pending_loans = db.query(Loan).filter(Loan.status == "Pending").count()
    total_enrollments = db.query(ChitEnrollment).count()
    pending_kyc = db.query(Member).filter(Member.kyc != "Verified").count()
    anomalies = db.query(TransactionAnomaly).count()

    agents = [
        {"name": "Onboarding Agent", "status": "Active", "processed": total_enrollments, "pending": 0},
        {"name": "Fraud Triage Agent", "status": "Alert" if anomalies > 0 else "Active", "processed": anomalies, "pending": anomalies},
        {"name": "Loan Risk Agent", "status": "Active", "processed": total_loans, "pending": pending_loans},
        {"name": "KYC Verification Agent", "status": "Active", "processed": total_members - pending_kyc, "pending": pending_kyc},
        {"name": "Collection Agent", "status": "Active", "processed": total_loans, "pending": 0},
        {"name": "STI Recalc Agent", "status": "Active", "processed": total_members, "pending": 0},
    ]
    online = sum(1 for a in agents if a["status"] in ("Active", "Alert"))

    return {
        "success": True,
        "data": {
            "agentsOnline": online,
            "totalAgents": len(agents),
            "activeAlerts": high_risk_count,
            "riskScore": risk_score,
            "agents": agents,
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
    from ..models.loan import Loan
    from ..models.deposit import Deposit
    from ..models.chit_scheme import ChitScheme
    from ..models.collection import Payment

    total_deposits = sum(d.amount for d in db.query(Deposit).filter(Deposit.status == "Active").all()) or 0
    total_loans = sum(l.outstanding_balance or l.amount for l in db.query(Loan).filter(Loan.status == "Disbursed").all()) or 0
    chit_subs = sum(s.monthly_amount * s.enrolled_members for s in db.query(ChitScheme).filter(ChitScheme.status != "Closed").all()) or 0
    chit_payouts = sum(s.pot_size for s in db.query(ChitScheme).filter(ChitScheme.status != "Closed").all()) or 0
    emi_collections = sum(p.amount for p in db.query(Payment).filter(Payment.status == "Success").all()) or 0

    inflow_total = total_deposits + emi_collections + chit_subs
    outflow_total = chit_payouts + total_loans
    current_ratio = round(inflow_total / outflow_total, 1) if outflow_total > 0 else 0
    net_position = inflow_total - outflow_total

    status = "Healthy" if current_ratio >= 1.2 else "Warning" if current_ratio >= 0.8 else "Critical"
    forecast = "Stable" if current_ratio >= 1.2 else "Needs Attention" if current_ratio >= 0.8 else "At Risk"

    return {
        "success": True,
        "data": {
            "currentRatio": current_ratio,
            "unencumberedDeposits": round(total_deposits / 100000) if total_deposits else 0,
            "status": status,
            "inflows": {
                "deposits": total_deposits,
                "emiCollections": emi_collections,
                "chitSubscriptions": chit_subs,
                "total": inflow_total,
            },
            "outflows": {
                "chitPayouts": chit_payouts,
                "loanDisbursements": total_loans,
                "depositMaturities": 0,
                "operatingExpenses": 0,
                "total": outflow_total,
            },
            "netPosition": net_position,
            "forecast30Days": forecast,
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
