from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
import json, uuid

from ..core.database import get_db
from ..core.dependencies import get_current_user, require_roles
from ..core.exceptions import NotFoundException
from ..core.security import hash_password
from ..models.config import SystemConfig
from ..models.user import User
from ..schemas.config import SystemConfigUpdate, UserCreate, UserUpdate

router = APIRouter(prefix="/config", tags=["Configuration"])


def _get_config_value(db: Session, key: str, default=None):
    record = db.query(SystemConfig).filter(SystemConfig.key == key).first()
    if record:
        try:
            return json.loads(record.value)
        except Exception:
            return record.value
    return default


def _set_config_value(db: Session, key: str, value, category: str, user_id: str):
    record = db.query(SystemConfig).filter(SystemConfig.key == key).first()
    val_str = json.dumps(value) if not isinstance(value, str) else value
    if record:
        record.value = val_str
        record.updated_by = user_id
    else:
        db.add(SystemConfig(key=key, value=val_str, category=category, updated_by=user_id))


def _build_full_config(db: Session) -> dict:
    return {
        "company": {
            "name": _get_config_value(db, "company.name", "Glimmora Nidhi Limited"),
            "cin": _get_config_value(db, "company.cin", "U65100KA2024PLC123456"),
            "address": _get_config_value(db, "company.address", "No. 42, MG Road, Bengaluru"),
            "financialYear": _get_config_value(db, "company.financialYear", "April - March"),
            "currency": _get_config_value(db, "company.currency", "INR"),
        },
        "deposits": {
            "fdMinAmount": _get_config_value(db, "deposits.fdMinAmount", 10000),
            "fdMaxRate": _get_config_value(db, "deposits.fdMaxRate", 9.5),
            "rdMinMonthly": _get_config_value(db, "deposits.rdMinMonthly", 1000),
            "savingsRate": _get_config_value(db, "deposits.savingsRate", 4.0),
            "autoRenewal": _get_config_value(db, "deposits.autoRenewal", True),
        },
        "loans": {
            "maxAmount": _get_config_value(db, "loans.maxAmount", 1500000),
            "minSTI": _get_config_value(db, "loans.minSTI", 50),
            "maxRate": _get_config_value(db, "loans.maxRate", 14),
            "defaultThreshold": _get_config_value(db, "loans.defaultThreshold", 3),
        },
        "chitFunds": {
            "foremanCommission": _get_config_value(db, "chitFunds.foremanCommission", 5),
            "minBidDecrement": _get_config_value(db, "chitFunds.minBidDecrement", 500),
            "maxSubscribers": _get_config_value(db, "chitFunds.maxSubscribers", 40),
            "auctionFrequency": _get_config_value(db, "chitFunds.auctionFrequency", "Monthly"),
            "maxAuctionDiscount": _get_config_value(db, "chitFunds.maxAuctionDiscount", 30),
            "regulatoryFramework": _get_config_value(db, "chitFunds.regulatoryFramework", "Chit Funds Act 1982"),
            "defaultPayoutMethod": _get_config_value(db, "chitFunds.defaultPayoutMethod", "Auction"),
        },
        "ai": {
            "riskModelVersion": _get_config_value(db, "ai.riskModelVersion", "v2.4.1"),
            "fraudSensitivity": _get_config_value(db, "ai.fraudSensitivity", "High"),
            "autoKYC": _get_config_value(db, "ai.autoKYC", True),
            "stiRecalcFrequency": _get_config_value(db, "ai.stiRecalcFrequency", "Weekly"),
            "escalationThreshold": _get_config_value(db, "ai.escalationThreshold", 80),
        },
        "notifications": {
            "smsEnabled": _get_config_value(db, "notifications.smsEnabled", True),
            "emailEnabled": _get_config_value(db, "notifications.emailEnabled", True),
            "whatsappEnabled": _get_config_value(db, "notifications.whatsappEnabled", True),
            "emiReminderDays": _get_config_value(db, "notifications.emiReminderDays", 3),
            "maturityAlertDays": _get_config_value(db, "notifications.maturityAlertDays", 30),
        },
    }


@router.get("")
def get_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    return {"success": True, "data": _build_full_config(db)}


@router.put("")
def update_config(
    payload: SystemConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    update_data = payload.model_dump(exclude_none=True)
    for category, fields in update_data.items():
        if isinstance(fields, dict):
            for field, val in fields.items():
                if val is not None:
                    _set_config_value(db, f"{category}.{field}", val, category, current_user.id)
    db.commit()
    return {"success": True, "message": "Configuration updated successfully"}


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    users = db.query(User).all()
    return {
        "success": True,
        "data": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "roleLabel": u.role_label,
                "status": "Active" if u.is_active else "Inactive",
                "lastLogin": u.last_login.isoformat() + "Z" if u.last_login else None,
            }
            for u in users
        ],
    }


@router.post("/users", status_code=201)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    user = User(
        id=f"U-{uuid.uuid4().hex[:6].upper()}",
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "data": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "message": "User created",
    }


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException("User not found")
    if payload.role:
        user.role = payload.role
    if payload.status:
        user.is_active = payload.status == "Active"
    db.commit()
    return {"success": True, "message": "User updated"}


ROLES_DATA = [
    {
        "role": "ADMIN",
        "label": "Admin",
        "permissions": [
            "MANAGE_MEMBERS", "MANAGE_LOANS", "MANAGE_DEPOSITS",
            "MANAGE_CHITS", "VIEW_REPORTS", "VIEW_COMPLIANCE",
        ],
        "navAccess": ["*"],
    },
    {
        "role": "BRANCH_MANAGER",
        "label": "Branch Manager",
        "permissions": ["MANAGE_MEMBERS", "APPROVE_LOANS", "VIEW_REPORTS"],
        "navAccess": ["dashboard", "members", "loans", "deposits", "chit-funds", "reports"],
    },
    {
        "role": "MEMBER",
        "label": "Member",
        "permissions": [
            "VIEW_OWN_LOANS", "APPLY_LOAN", "VIEW_OWN_DEPOSITS",
            "MAKE_PAYMENT", "ENROLL_CHITFUND", "VIEW_PROFILE",
        ],
        "navAccess": [
            "member-dashboard", "my-chitfunds", "my-loans",
            "my-deposits", "my-payments", "profile",
        ],
    },
]


@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN")),
):
    return {"success": True, "data": ROLES_DATA}
