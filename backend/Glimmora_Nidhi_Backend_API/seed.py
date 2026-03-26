"""
Seed script — populates the SQLite database with realistic sample data.
Run: python seed.py
"""
import sys
from datetime import datetime, timedelta, date
import json

from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User
from app.models.member import Member
from app.models.chit_scheme import ChitScheme
from app.models.chit_enrollment import ChitEnrollment
from app.models.auction import Auction, Bid
from app.models.loan import Loan, EMISchedule, LoanDefault
from app.models.deposit import Deposit, DepositScheme
from app.models.collection import Collection, Payment, RecoveryCase
from app.models.compliance import ComplianceChecklist, KYCMonitoring, AMLAlert, RegulatoryFiling
from app.models.fraud import FraudCase, TransactionAnomaly
from app.models.notification import Notification
from app.models.config import SystemConfig
from app.models.audit_log import AuditLog

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed():
    print("Seeding database...")

    # ------------------------------------------------------------------ Users
    users = [
        User(id="U-001", name="Aryan Kumar", email="admin@glimmora.com",
             hashed_password=hash_password("Admin@123"), role="ADMIN", is_active=True,
             last_login=datetime.utcnow()),
        User(id="U-002", name="Anita Desai", email="manager@glimmora.com",
             hashed_password=hash_password("Manager@123"), role="BRANCH_MANAGER", is_active=True),
        User(id="U-003", name="Rajesh Kumar", email="member@glimmora.com",
             hashed_password=hash_password("Member@123"), role="MEMBER", is_active=True,
             member_id="M-1001"),
    ]
    for u in users:
        if not db.query(User).filter(User.id == u.id).first():
            db.add(u)

    # ---------------------------------------------------------------- Members
    members_data = [
        ("M-1001", "Rajesh Kumar", "9876543210", "rajesh@email.com", "12, MG Road, Bengaluru", 92, "Verified", "Low"),
        ("M-1002", "Priya Mehta", "9876543211", "priya@email.com", "5, Park Ave, Mumbai", 85, "Verified", "Low"),
        ("M-1003", "Vikram Nair", "9876543212", "vikram@email.com", "33, Beach Road, Chennai", 45, "Pending", "High"),
        ("M-1004", "Sunita Rao", "9876543213", "sunita@email.com", "18, Hill Street, Pune", 78, "Verified", "Low"),
        ("M-1005", "Deepa Iyer", "9876543214", "deepa@email.com", "9, Lake View, Hyderabad", 88, "Verified", "Low"),
        ("M-1006", "Arun Pillai", "9876543215", "arun@email.com", "22, Temple Road, Kochi", 65, "Verified", "Medium"),
        ("M-1007", "Neha Singh", "9876543216", "neha@email.com", "7, Civil Lines, Delhi", 72, "Verified", "Low"),
        ("M-1008", "Meera Reddy", "9876543217", "meera@email.com", "14, Garden City, Bengaluru", 58, "Pending", "Medium"),
        ("M-1009", "Suresh Babu", "9876543218", "suresh@email.com", "3, River View, Kolkata", 90, "Verified", "Low"),
        ("M-1010", "Kavitha Nambiar", "9876543219", "kavitha@email.com", "11, Mount Road, Chennai", 82, "Verified", "Low"),
    ]
    nominee_data = {
        "M-1001": ("Priya Kumar", "Spouse", "XXXX-XXXX-1234", "ABCDE1234F"),
        "M-1002": ("Amit Mehta", "Spouse", "XXXX-XXXX-5678", "FGHIJ5678K"),
        "M-1003": ("Meena Nair", "Spouse", "XXXX-XXXX-9012", "KLMNO9012P"),
        "M-1004": ("Venkat Rao", "Husband", "XXXX-XXXX-3456", "PQRST3456U"),
        "M-1005": ("Ravi Iyer", "Spouse", "XXXX-XXXX-7890", "UVWXY7890Z"),
        "M-1009": ("Lakshmi Babu", "Spouse", "XXXX-XXXX-2345", "BCDEF2345G"),
        "M-1010": ("Rajan Nambiar", "Husband", "XXXX-XXXX-6789", "HIJKL6789M"),
    }
    for mid, name, phone, email, addr, sti, kyc, risk in members_data:
        if not db.query(Member).filter(Member.id == mid).first():
            nom = nominee_data.get(mid, (None, None, None, None))
            m = Member(
                id=mid, name=name, phone=phone, email=email, address=addr,
                sti=sti, kyc=kyc, risk=risk, status="Active",
                join_date="2025-01-15",
                nominee_name=nom[0], nominee_relation=nom[1],
                nominee_aadhaar=nom[2], nominee_pan=nom[3],
                sti_payment_punctuality=sti, sti_account_activity=sti - 5,
                sti_kyc_status=100 if kyc == "Verified" else 50,
                sti_fraud_flags=100 if risk != "High" else 60,
                sti_deposit_tenure=sti - 10,
                sti_last_calculated="2026-03-14",
                sti_trend="stable",
            )
            db.add(m)

    # ------------------------------------------------------------ Chit Schemes
    # Aligned to Vasuprada 4-bracket structure: Low (≤5L), Medium (≤10L), Upper Medium (15-25L), High (≤50L)
    schemes = [
        # LOW BRACKET (up to ₹5 Lakhs)
        ChitScheme(id="CS-001", name="Vasuprada Sahaya 2L", monthly_amount=10000, duration=20,
                   total_members=20, enrolled_members=18, pot_size=200000, current_month=6,
                   next_auction="2026-04-05", status="Open",
                   description="Entry-level chit for small savings — ₹2 Lakh pot with 20 subscribers",
                   min_sti=50, kyc_required="Verified", bracket="Low",
                   payout_method="Lucky Draw", max_discount_pct=30.0),
        ChitScheme(id="CS-002", name="Vasuprada Sahaya 5L", monthly_amount=20000, duration=25,
                   total_members=25, enrolled_members=22, pot_size=500000, current_month=10,
                   next_auction="2026-04-08", status="Open",
                   description="Popular low-bracket chit — ₹5 Lakh pot with monthly lucky draw",
                   min_sti=55, kyc_required="Verified", bracket="Low",
                   payout_method="Lucky Draw", max_discount_pct=30.0),
        # MEDIUM BRACKET (up to ₹10 Lakhs)
        ChitScheme(id="CS-003", name="Vasuprada Samruddhi 10L", monthly_amount=50000, duration=20,
                   total_members=20, enrolled_members=15, pot_size=1000000, current_month=4,
                   next_auction="2026-04-10", status="Open",
                   description="Medium-bracket chit — ₹10 Lakh pot with auction-based payout",
                   min_sti=60, kyc_required="Verified", bracket="Medium",
                   payout_method="Auction", max_discount_pct=30.0),
        ChitScheme(id="CS-004", name="Vasuprada Samruddhi 7.5L", monthly_amount=30000, duration=25,
                   total_members=25, enrolled_members=25, pot_size=750000, current_month=12,
                   next_auction="2026-04-12", status="Full",
                   description="Fully subscribed medium-bracket chit — ₹7.5 Lakh pot",
                   min_sti=60, kyc_required="Verified", bracket="Medium",
                   payout_method="Auction", max_discount_pct=30.0),
        # UPPER MEDIUM BRACKET (₹15-25 Lakhs)
        ChitScheme(id="CS-005", name="Vasuprada Unnati 15L", monthly_amount=75000, duration=20,
                   total_members=20, enrolled_members=12, pot_size=1500000, current_month=3,
                   next_auction="2026-04-15", status="Open",
                   description="Upper medium-bracket — ₹15 Lakh pot for business professionals",
                   min_sti=70, kyc_required="Verified", bracket="Upper Medium",
                   payout_method="Auction", max_discount_pct=35.0),
        ChitScheme(id="CS-006", name="Vasuprada Unnati 25L", monthly_amount=100000, duration=25,
                   total_members=25, enrolled_members=8, pot_size=2500000, current_month=0,
                   next_auction="2026-05-01", status="Open",
                   description="Premium upper-medium chit — ₹25 Lakh pot, ideal for asset building",
                   min_sti=75, kyc_required="Verified", bracket="Upper Medium",
                   payout_method="Both", max_discount_pct=35.0),
        # HIGH BRACKET (up to ₹50 Lakhs)
        ChitScheme(id="CS-007", name="Vasuprada Shikhar 50L", monthly_amount=200000, duration=25,
                   total_members=25, enrolled_members=10, pot_size=5000000, current_month=0,
                   next_auction="2026-05-10", status="Open",
                   description="Flagship high-value chit — ₹50 Lakh pot for HNI members",
                   min_sti=80, kyc_required="Verified", bracket="High",
                   payout_method="Auction", max_discount_pct=35.0),
        ChitScheme(id="CS-008", name="Vasuprada Shikhar 30L", monthly_amount=150000, duration=20,
                   total_members=20, enrolled_members=16, pot_size=3000000, current_month=5,
                   next_auction="2026-04-18", status="Open",
                   description="High-bracket chit — ₹30 Lakh pot with competitive auctions",
                   min_sti=75, kyc_required="Verified", bracket="High",
                   payout_method="Auction", max_discount_pct=35.0),
    ]
    for s in schemes:
        if not db.query(ChitScheme).filter(ChitScheme.id == s.id).first():
            db.add(s)

    # --------------------------------------------------------- Chit Enrollments
    enrollments = [
        ChitEnrollment(id="EN-001", scheme_id="CS-001", member_id="M-1001",
                       full_name="Rajesh Kumar", phone="9876543210", email="rajesh@email.com",
                       nominee_name="Priya Kumar", nominee_relationship="Spouse",
                       nominee_aadhaar="XXXX-XXXX-1234", nominee_pan="ABCDE1234F",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=True, enrolled_date="2025-12-01", status="Active",
                       deregistration_status="Registered"),
        ChitEnrollment(id="EN-002", scheme_id="CS-001", member_id="M-1005",
                       full_name="Deepa Iyer", phone="9876543214", email="deepa@email.com",
                       nominee_name="Ravi Iyer", nominee_relationship="Spouse",
                       nominee_aadhaar="XXXX-XXXX-5678", nominee_pan="FGHIJ5678K",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=False, enrolled_date="2025-12-05", status="Active",
                       deregistration_status="Registered"),
        ChitEnrollment(id="EN-003", scheme_id="CS-003", member_id="M-1002",
                       full_name="Priya Mehta", phone="9876543211", email="priya@email.com",
                       nominee_name="Amit Mehta", nominee_relationship="Spouse",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=False, enrolled_date="2025-11-15", status="Active",
                       deregistration_status="Registered"),
        ChitEnrollment(id="EN-004", scheme_id="CS-005", member_id="M-1009",
                       full_name="Suresh Babu", phone="9876543218", email="suresh@email.com",
                       nominee_name="Lakshmi Babu", nominee_relationship="Spouse",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=False, enrolled_date="2026-01-10", status="Active",
                       deregistration_status="Registered"),
        ChitEnrollment(id="EN-005", scheme_id="CS-007", member_id="M-1004",
                       full_name="Sunita Rao", phone="9876543213", email="sunita@email.com",
                       nominee_name="Venkat Rao", nominee_relationship="Husband",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=False, enrolled_date="2026-02-01", status="Pending",
                       deregistration_status=None),
        # GAP 4: Withdrawn enrollment example
        ChitEnrollment(id="EN-006", scheme_id="CS-002", member_id="M-1003",
                       full_name="Vikram Nair", phone="9876543212", email="vikram@email.com",
                       nominee_name="Meena Nair", nominee_relationship="Spouse",
                       accepted_terms=True, authorized_auto_deduction=True,
                       has_won_auction=False, enrolled_date="2025-10-01", status="Withdrawn",
                       deregistration_status="Pending Deregistration",
                       withdrawal_date="2026-03-15", withdrawal_commission=50000,
                       refund_amount=150000, registrar_notified=False),
    ]
    for e in enrollments:
        if not db.query(ChitEnrollment).filter(ChitEnrollment.id == e.id).first():
            db.add(e)

    # ----------------------------------------------------------------- Auctions
    auctions = [
        Auction(id="AUC-001", scheme_id="CS-003", month=5, date="2026-04-10",
                pot_size=1000000, foreman_commission=50000, available_pot=950000,
                min_bid=650000, status="Scheduled"),
        Auction(id="AUC-002", scheme_id="CS-005", month=4, date="2026-04-15",
                pot_size=1500000, foreman_commission=75000, available_pot=1425000,
                min_bid=975000, status="Scheduled"),
        Auction(id="AUC-003", scheme_id="CS-008", month=6, date="2026-04-18",
                pot_size=3000000, foreman_commission=150000, available_pot=2850000,
                min_bid=1950000, status="Scheduled"),
    ]
    for a in auctions:
        if not db.query(Auction).filter(Auction.id == a.id).first():
            db.add(a)

    # -------------------------------------------------------------------- Loans
    loans = [
        Loan(id="LA-001", member_id="M-1001", amount=200000, purpose="Business Expansion",
             tenure=24, interest_rate=12, risk="Low", sti_score=92,
             status="Disbursed", applied_date="2026-03-05",
             approved_date="2026-03-07", approved_by="Anita Desai",
             approved_amount=200000, disburse_date="2026-03-10",
             first_emi_date="2026-04-10", emi=9420, next_emi="2026-04-10",
             outstanding_balance=185086, category="Business"),
        Loan(id="LA-002", member_id="M-1003", amount=50000, purpose="Personal",
             tenure=12, interest_rate=14, risk="High", sti_score=45,
             status="Pending", applied_date="2026-03-12", category="Personal"),
        Loan(id="LA-003", member_id="M-1005", amount=150000, purpose="Education",
             tenure=18, interest_rate=12, risk="Low", sti_score=88,
             status="Approved", applied_date="2026-03-01",
             approved_date="2026-03-03", approved_by="Anita Desai",
             approved_amount=150000, emi=9500, category="Personal"),
    ]
    for l in loans:
        if not db.query(Loan).filter(Loan.id == l.id).first():
            db.add(l)

    # ----------------------------------------------------------------- Defaults
    default = LoanDefault(
        id="LD-001", loan_id="LA-002", member_id="M-1003",
        outstanding=120000, missed_emis=4, default_date="2026-01-15", status="In Recovery",
    )
    if not db.query(LoanDefault).filter(LoanDefault.id == "LD-001").first():
        db.add(default)

    # ---------------------------------------------------------------- Deposits
    deposits = [
        Deposit(id="FD-001", member_id="M-1001", type="Fixed Deposit",
                amount=200000, rate=9.0, tenure=12, maturity_date="2027-03-05",
                maturity_amount=218000, status="Active", open_date="2026-03-05",
                auto_renewal=True),
        Deposit(id="FD-002", member_id="M-1002", type="Fixed Deposit",
                amount=100000, rate=8.5, tenure=12, maturity_date="2027-02-10",
                maturity_amount=108500, status="Active", open_date="2026-02-10"),
        Deposit(id="FD-003", member_id="M-1005", type="Fixed Deposit",
                amount=150000, rate=9.0, tenure=12, maturity_date="2026-04-10",
                maturity_amount=163500, status="Active", open_date="2025-04-10",
                auto_renewal=False),
    ]
    for d in deposits:
        if not db.query(Deposit).filter(Deposit.id == d.id).first():
            db.add(d)

    # ---------------------------------------------------------- Deposit Schemes
    fd_scheme = DepositScheme(
        name="Glimmora Fixed Deposit", type="Fixed Deposit",
        min_amount=10000, max_amount=2500000,
        tenures_json=json.dumps([6, 12, 24, 36]),
        rates_json=json.dumps({"6": 8.0, "12": 8.5, "24": 9.0, "36": 9.5}),
        members_count=3200, total_corpus=185000000, is_active=True,
    )
    if db.query(DepositScheme).count() == 0:
        db.add(fd_scheme)
        db.add(DepositScheme(
            name="Glimmora Recurring Deposit", type="Recurring Deposit",
            min_amount=1000, max_amount=100000,
            tenures_json=json.dumps([12, 24, 36]),
            rates_json=json.dumps({"12": 7.5, "24": 8.0, "36": 8.5}),
            members_count=1800, total_corpus=45000000, is_active=True,
        ))

    # --------------------------------------------------------------- Collections
    collections_data = [
        Collection(id="COL-001", member_id="M-1001", type="EMI",
                   reference_id="LA-001", amount=9420, due_date="2026-03-15", status="Upcoming"),
        Collection(id="COL-002", member_id="M-1001", type="Chit Subscription",
                   reference_id="CS-001", amount=5000, due_date="2026-03-20", status="Upcoming"),
        Collection(id="COL-010", member_id="M-1003", type="EMI",
                   reference_id="LA-002", amount=12500, due_date="2026-02-15",
                   status="Overdue", assigned_agent="Suresh Nair"),
    ]
    for c in collections_data:
        if not db.query(Collection).filter(Collection.id == c.id).first():
            db.add(c)

    # ------------------------------------------------------------ Recovery Cases
    rec = RecoveryCase(
        id="REC-001", member_id="M-1003", outstanding=120000, missed_emis=4,
        assigned_agent="Suresh Nair", agent_id="U-005",
        status="In Progress", last_contact="2026-03-10", next_follow_up="2026-03-18",
    )
    if not db.query(RecoveryCase).filter(RecoveryCase.id == "REC-001").first():
        db.add(rec)

    # ---------------------------------------------------- Compliance Checklists
    rules = [
        # Nidhi Company Rules
        ComplianceChecklist(id="CL-001", rule="Net Owned Funds >= Rs 20 Lakhs",
                            category="Capital Adequacy", status="Compliant",
                            last_audit="2026-03-01",
                            details="Current NOF: Rs 1.2 Cr. Well above minimum threshold.", weight=10),
        ComplianceChecklist(id="CL-002", rule="Minimum 200 members within 1 year",
                            category="Membership", status="Compliant",
                            last_audit="2026-03-01",
                            details="Current members: 12,450. Threshold met.", weight=10),
        ComplianceChecklist(id="CL-003", rule="Deposits not more than 20x Net Owned Funds",
                            category="Deposit Limit", status="Compliant",
                            last_audit="2026-03-01",
                            details="Current ratio: 15x. Within limit.", weight=10),
        ComplianceChecklist(id="CL-004", rule="Loans only to members",
                            category="Lending", status="Compliant",
                            last_audit="2026-03-01",
                            details="All loans issued exclusively to registered members.", weight=5),
        ComplianceChecklist(id="CL-005", rule="Annual NDH-1 filing",
                            category="Regulatory Filing", status="Warning",
                            last_audit="2026-03-01",
                            details="NDH-1 due by Sept 30, 2026. Preparation in progress.", weight=5),
        # Chit Funds Act 1982 Compliance (GAP 5)
        ComplianceChecklist(id="CL-006", rule="Registrar of Chits — Registration Current",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="Registration No. RoC/TS/2024/1234. Valid until 2028.", weight=15),
        ComplianceChecklist(id="CL-007", rule="Security Deposit Filed with Registrar",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="Security deposit of Rs 5 Lakh filed. FDR submitted.", weight=10),
        ComplianceChecklist(id="CL-008", rule="Chit Agreement Filed per Scheme",
                            category="Chit Funds Act 1982", status="Warning",
                            last_audit="2026-03-10",
                            details="7 of 8 schemes filed. CS-008 agreement pending filing.", weight=10),
        ComplianceChecklist(id="CL-009", rule="Periodic Returns to Registrar",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="Quarterly return for Q3 FY26 filed on time.", weight=10),
        ComplianceChecklist(id="CL-010", rule="Draw Minutes Maintained",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="Minutes recorded for all 32 draws conducted this year.", weight=5),
        ComplianceChecklist(id="CL-011", rule="Subscriber Register Maintained",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="Digital subscriber register maintained per scheme.", weight=5),
        ComplianceChecklist(id="CL-012", rule="Maximum Discount Cap Compliance (Sec. 21)",
                            category="Chit Funds Act 1982", status="Compliant",
                            last_audit="2026-03-10",
                            details="All auctions within 35% max discount. No violations.", weight=5),
    ]
    for r in rules:
        if not db.query(ComplianceChecklist).filter(ComplianceChecklist.id == r.id).first():
            db.add(r)

    # --------------------------------------------------------------- KYC Monitor
    kyc_members = [("M-1003", "Pending", False, False, True, True, "2026-02-20", "2026-03-20"),
                   ("M-1001", "Verified", True, True, True, True, "2026-01-10", None)]
    for mid, status, pan, aadh, addr, photo, last_v, due in kyc_members:
        if not db.query(KYCMonitoring).filter(KYCMonitoring.member_id == mid).first():
            db.add(KYCMonitoring(
                member_id=mid, kyc_status=status, pan_verified=pan,
                aadhaar_verified=aadh, address_verified=addr, photo_verified=photo,
                last_verification=last_v, due_date=due,
            ))

    # ---------------------------------------------------------------- AML Alerts
    aml = AMLAlert(
        id="AML-001", member_id="M-1003", type="Deposit Layering",
        description="Multiple deposits of Rs 49,000 within 24 hours (structuring pattern)",
        total_amount=196000, transaction_count=4, detected_date="2026-03-14",
        severity="High", status="Under Review",
    )
    if not db.query(AMLAlert).filter(AMLAlert.id == "AML-001").first():
        db.add(aml)

    # --------------------------------------------------------- Regulatory Filings
    filings = [
        RegulatoryFiling(form="NDH-1", description="Return of Statutory Compliances (Nidhi)",
                         frequency="Annual", due_date="2026-09-30",
                         status="Pending", last_filed="2025-09-28"),
        RegulatoryFiling(form="NDH-3", description="Half-Yearly Return (Nidhi)",
                         frequency="Half-Yearly", due_date="2026-03-31",
                         status="Due Soon", last_filed="2025-09-30"),
        # Chit Fund Act filings
        RegulatoryFiling(form="Form A", description="Chit Agreement Registration — Chit Funds Act Sec. 4",
                         frequency="Per Scheme", due_date="2026-04-30",
                         status="Filed", last_filed="2026-03-01"),
        RegulatoryFiling(form="Form D", description="Quarterly Return to Registrar of Chits — Sec. 61",
                         frequency="Quarterly", due_date="2026-06-30",
                         status="Pending", last_filed="2026-03-28"),
        RegulatoryFiling(form="Draw Minutes", description="Minutes of each Draw/Auction — Sec. 22",
                         frequency="Per Draw", due_date="2026-04-15",
                         status="On Time", last_filed="2026-03-22"),
    ]
    if db.query(RegulatoryFiling).count() == 0:
        for f in filings:
            db.add(f)

    # ---------------------------------------------------------------- Fraud Cases
    fc = FraudCase(
        id="FC-001", type="Auction Manipulation",
        description="Coordinated bidding pattern detected among 3 members in CS-003 auction",
        members_involved=json.dumps(["M-1003", "M-1015", "M-1022"]),
        severity="Critical", detected_by="AI Pattern Engine",
        detected_at=datetime.utcnow(), status="Investigating",
        potential_loss=300000, assigned_to="Priya Sharma",
    )
    if not db.query(FraudCase).filter(FraudCase.id == "FC-001").first():
        db.add(fc)

    # ------------------------------------------------------- Transaction Anomaly
    ta = TransactionAnomaly(
        id="TA-001", member_id="M-1003", type="Unusual Deposit Pattern",
        description="4 deposits of Rs 49,000 each within 2 hours",
        amount=196000, confidence=92, detected_at=datetime.utcnow(), status="Flagged",
    )
    if not db.query(TransactionAnomaly).filter(TransactionAnomaly.id == "TA-001").first():
        db.add(ta)

    # -------------------------------------------------------------- Notifications
    notifs = [
        Notification(user_id="U-001", icon="warning", type="alert",
                     message="Suspicious transaction detected for M-1003",
                     time=datetime.utcnow(), read=False, category="fraud"),
        Notification(user_id="U-001", icon="info", type="info",
                     message="NDH-3 filing due in 15 days",
                     time=datetime.utcnow(), read=False, category="compliance"),
        Notification(user_id="U-001", icon="warning", type="alert",
                     message="3 EMI payments overdue this week",
                     time=datetime.utcnow(), read=False, category="payment"),
    ]
    if db.query(Notification).count() == 0:
        for n in notifs:
            db.add(n)

    # ----------------------------------------------------------------- Audit Logs
    logs = [
        AuditLog(id="AL-001", user_id="U-001", action="Updated system configuration",
                 module="Config", ip="192.168.1.10",
                 timestamp=datetime.utcnow(),
                 details="Changed foreman commission from 5% to 4.5%"),
        AuditLog(id="AL-002", user_id="U-002", action="Approved loan LA-001",
                 module="Loans", ip="192.168.1.11", timestamp=datetime.utcnow()),
    ]
    for l in logs:
        if not db.query(AuditLog).filter(AuditLog.id == l.id).first():
            db.add(l)

    db.commit()
    print("Seeding complete!")
    print("\nDefault credentials:")
    print("  Admin   : admin@glimmora.com / Admin@123")
    print("  Manager : manager@glimmora.com / Manager@123")
    print("  Member  : member@glimmora.com / Member@123")
    db.close()


if __name__ == "__main__":
    seed()
