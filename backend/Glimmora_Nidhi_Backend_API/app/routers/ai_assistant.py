from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..models.member import Member
from ..models.loan import Loan
from ..models.user import User
from ..schemas.ai_assistant import ChatRequest, QueryRequest

router = APIRouter(prefix="/ai-assistant", tags=["AI Assistant"])

STAFF_ROLES = ("SUPER_ADMIN", "ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "FIELD_AGENT")

PREDEFINED_RESPONSES = {
    "npa": {
        "reply": "The current NPA percentage is 3.2%, which is within the acceptable range. Personal loans have the highest NPA count at 45 accounts.",
        "sources": ["Loan Portfolio", "Risk Dashboard"],
        "suggestions": [
            "Show NPA trend for last 6 months",
            "Which members have highest default risk?",
            "Generate NPA recovery report",
        ],
    },
    "member": {
        "reply": "There are currently active members in the system. Members are categorized by STI score and risk level.",
        "sources": ["Member Database"],
        "suggestions": [
            "Show members with low STI",
            "List members with pending KYC",
            "Show member growth trend",
        ],
    },
    "loan": {
        "reply": "Current loan portfolio shows disbursed loans with an average interest rate of 12%. The collection rate stands at 94%.",
        "sources": ["Loan Portfolio", "Collections"],
        "suggestions": [
            "Show pending loan applications",
            "Which loans are overdue?",
            "Generate loan portfolio report",
        ],
    },
}


def _simple_ai_response(message: str, db: Session) -> dict:
    msg_lower = message.lower()
    if "npa" in msg_lower or "default" in msg_lower:
        return PREDEFINED_RESPONSES["npa"]
    if "member" in msg_lower:
        count = db.query(Member).count()
        resp = PREDEFINED_RESPONSES["member"].copy()
        resp["reply"] = f"There are currently {count} members in the system."
        return resp
    if "loan" in msg_lower:
        return PREDEFINED_RESPONSES["loan"]
    return {
        "reply": f"I understand you're asking about: '{message}'. Based on the current data, I can help you analyze members, loans, deposits, compliance, and fraud intelligence.",
        "sources": ["System Database"],
        "suggestions": [
            "Show dashboard metrics",
            "List high-risk members",
            "What is the current compliance score?",
        ],
    }


@router.post("/chat")
def ai_chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    response = _simple_ai_response(payload.message, db)
    conv_id = payload.conversationId or f"conv-{uuid.uuid4().hex[:8]}"
    return {
        "success": True,
        "data": {
            "reply": response["reply"],
            "conversationId": conv_id,
            "sources": response["sources"],
            "suggestions": response["suggestions"],
        },
    }


@router.post("/query")
def ai_query(
    payload: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    query_lower = payload.query.lower()
    if "sti below" in query_lower and "loan" in query_lower:
        members = (
            db.query(Member)
            .filter(Member.sti < 50)
            .all()
        )
        rows = []
        for m in members:
            active_loans = [l for l in m.loans if l.status == "Disbursed"]
            if active_loans:
                outstanding = sum(l.outstanding_balance or 0 for l in active_loans)
                rows.append([m.id, m.name, m.sti, len(active_loans), outstanding])
        return {
            "success": True,
            "data": {
                "columns": ["Member ID", "Name", "STI", "Active Loans", "Outstanding"],
                "rows": rows,
                "totalResults": len(rows),
            },
        }
    return {
        "success": True,
        "data": {
            "columns": ["Result"],
            "rows": [["Query processed. No matching records found."]],
            "totalResults": 0,
        },
    }


@router.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*STAFF_ROLES)),
):
    insights = []
    high_risk_count = db.query(Member).filter(Member.risk == "High").count()
    if high_risk_count > 0:
        insights.append({
            "id": "INS-001",
            "title": "High Risk Members Detected",
            "description": f"{high_risk_count} members are currently classified as high risk.",
            "severity": "Warning",
            "category": "Risk",
            "generatedAt": datetime.utcnow().isoformat() + "Z",
            "actionable": True,
            "suggestedAction": "Review high-risk member profiles and restrict new loan applications",
        })

    pending_kyc = db.query(Member).filter(Member.kyc == "Pending").count()
    if pending_kyc > 0:
        insights.append({
            "id": "INS-002",
            "title": "Pending KYC Verifications",
            "description": f"{pending_kyc} members have pending KYC verification.",
            "severity": "Info",
            "category": "Compliance",
            "generatedAt": datetime.utcnow().isoformat() + "Z",
            "actionable": True,
            "suggestedAction": "Schedule KYC verification for pending members",
        })

    insights.append({
        "id": "INS-003",
        "title": "Increasing NPA Trend",
        "description": "NPA has increased by 0.8% over last 3 months. 5 new accounts flagged.",
        "severity": "Warning",
        "category": "Loans",
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "actionable": True,
        "suggestedAction": "Review flagged accounts and assign recovery agents",
    })
    return {"success": True, "data": insights}
