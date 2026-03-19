# Glimmora Nidhi — Complete Functional Documentation

> A Nidhi (financial cooperative) management platform with AI-powered risk assessment, chit fund auctions, loans, deposits, compliance, and fraud detection.

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           GLIMMORA NIDHI PLATFORM                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ┌──────────────┐     Next.js Rewrite      ┌──────────────────────────┐   │
│   │   FRONTEND   │ ──── /api/* ──────────▶  │       BACKEND API        │   │
│   │  (Next.js)   │ ◀──── JSON ────────────  │  (FastAPI + Uvicorn)     │   │
│   │  Port: 3000  │                          │  Port: 8000              │   │
│   └──────────────┘                          └────────────┬─────────────┘   │
│         │                                                │                 │
│         │ useAuth()                              SQLAlchemy ORM            │
│         │ useData()                                      │                 │
│         ▼                                                ▼                 │
│   ┌──────────────┐                          ┌──────────────────────────┐   │
│   │  localStorage │                          │    SQLite Database       │   │
│   │  (JWT Token)  │                          │  (glimmora_nidhi.db)     │   │
│   └──────────────┘                          └──────────────────────────┘   │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. USER ROLES & HIERARCHY

```
                        ┌───────────────┐
                        │     ADMIN     │  ← Full access: config, users, all modules
                        └───────┬───────┘
                                │
                        ┌───────▼───────┐
                        │    MANAGER    │  ← Branch operations, approvals, reports
                        │(BRANCH_MANAGER│
                        └───────┬───────┘
                                │
                        ┌───────▼───────┐
                        │    MEMBER     │  ← Self-service portal only
                        └───────────────┘
```

### Role Mapping

| Role            | Label           | Default Landing Page  |
|-----------------|------------------|-----------------------|
| ADMIN           | Admin            | /dashboard            |
| BRANCH_MANAGER  | Branch Manager   | /dashboard            |
| MEMBER          | Member           | /member/dashboard     |

---

## 3. NAVIGATION ACCESS MATRIX

```
                     Admin   Branch Mgr   Member
                     ─────   ──────────   ──────
Executive Dashboard    ✅        ✅         ❌
Members Management     ✅        ✅         ❌
Chit Funds             ✅        ✅         ❌
Agents (AI)            ✅        ❌         ❌
Loans                  ✅        ✅         ❌
Deposits               ✅        ✅         ❌
Collections            ✅        ✅         ❌
Compliance             ✅        ✅         ❌
AI Risk Control        ✅        ❌         ❌
Fraud Intel            ✅        ❌         ❌
Reports                ✅        ✅         ❌
Config / Settings      ✅        ❌         ❌
Collateral             ✅        ✅         ❌
Governance             ✅        ❌         ❌
AI Assistant           ✅        ❌         ❌
────────────────────────────────────────────────
Member Dashboard       ❌        ❌         ✅
My Chit Funds          ❌        ❌         ✅
My Loans               ❌        ❌         ✅
My Deposits            ❌        ❌         ✅
My Payments            ❌        ❌         ✅
────────────────────────────────────────────────
Profile                ✅        ✅         ✅
```

---

## 4. AUTHENTICATION FLOW

```
                                ┌─────────────┐
                                │  /login     │
                                │  (LoginPage)│
                                └──────┬──────┘
                                       │
                      ┌────────────────┼────────────────┐
                      │                │                │
              ┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
              │ Email/Pass   │  │ Google OAuth │  │  Signup    │
              │ Login Form   │  │   Button     │  │  Form      │
              └───────┬──────┘  └──────┬──────┘  └─────┬──────┘
                      │                │                │
                      ▼                ▼                ▼
              POST /auth/login  POST /auth/google  POST /auth/register
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │ Backend returns│
                              │ JWT Token +    │
                              │ User Data      │
                              └────────┬───────┘
                                       │
                              ┌────────▼───────┐
                              │ Store token in │
                              │ localStorage   │
                              └────────┬───────┘
                                       │
                              ┌────────▼───────┐
                              │ Validate via   │
                              │ GET /auth/me   │
                              └────────┬───────┘
                                       │
                       ┌───────────────┼───────────────┐
                       │                               │
               ┌───────▼──────┐                ┌──────▼───────┐
               │  Admin/Staff │                │    Member    │
               │  → /dashboard│                │  → /member/  │
               │              │                │    dashboard │
               └──────────────┘                └──────────────┘
```

### Password Reset Flow

```
  Forgot Password           Email Sent            Reset Password
  ┌───────────┐     POST    ┌──────────┐   POST   ┌──────────────┐
  │ Enter     │ ──────────▶ │ Token    │ ───────▶ │ New Password │
  │ Email     │  /forgot-   │ sent to  │  /reset- │ + Confirm    │
  └───────────┘  password   │ email    │  password└──────────────┘
                            └──────────┘
```

---

## 5. DATABASE SCHEMA & RELATIONSHIPS

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│  USERS   │ 1───1 │   MEMBERS    │ 1───* │    LOANS     │
│──────────│       │──────────────│       │──────────────│
│ id (PK)  │       │ id (PK)      │       │ id (PK)      │
│ name     │       │ name, phone  │       │ member_id(FK)│
│ email    │       │ email, addr  │       │ amount       │
│ password │       │ risk (L/M/H) │       │ purpose      │
│ role     │       │ sti (0-100)  │       │ tenure       │
│ member_id│──FK──▶│ kyc status   │       │ interest_rate│
│ is_active│       │ status       │       │ status       │
└──────────┘       │ pan_verified │       │ emi, next_emi│
                   │ aadhaar_ver  │       └──────┬───────┘
                   └──────┬───────┘              │
                          │                      │ 1───*
                          │               ┌──────▼───────┐
                          │               │ EMI_SCHEDULE  │
                          │               │──────────────│
                          │               │ loan_id (FK) │
                          │               │ emi_no       │
                          │               │ due_date     │
                          │               │ amount       │
                          │               │ status       │
                          │               └──────────────┘
                          │
                          │ 1───*
                   ┌──────▼───────┐       ┌──────────────┐
                   │   DEPOSITS   │       │DEPOSIT_SCHEMES│
                   │──────────────│       │──────────────│
                   │ id (PK)      │       │ id (PK)      │
                   │ member_id(FK)│       │ name, type   │
                   │ type (FD/RD) │       │ min/max amt  │
                   │ amount, rate │       │ tenures_json │
                   │ tenure       │       │ rates_json   │
                   │ maturity_date│       │ members_count│
                   │ status       │       └──────────────┘
                   └──────────────┘
                          │
                          │ 1───*
                   ┌──────▼───────────┐
                   │ CHIT_ENROLLMENTS │       ┌──────────────┐
                   │─────────────────│       │ CHIT_SCHEMES │
                   │ id (PK)         │       │──────────────│
                   │ scheme_id (FK)──│──FK──▶│ id (PK)      │
                   │ member_id (FK)  │       │ name         │
                   │ full_name       │       │ monthly_amt  │
                   │ nominee_name    │       │ duration     │
                   │ status          │       │ total_members│
                   │ has_won_auction │       │ pot_size     │
                   └─────────────────┘       │ status       │
                                             └──────┬───────┘
                                                    │ 1───*
                                             ┌──────▼───────┐
                                             │   AUCTIONS   │
                                             │──────────────│
                                             │ id (PK)      │
                                             │ scheme_id(FK)│
                                             │ month        │
                                             │ pot_size     │
                                             │ status       │
                                             │ winner_id    │
                                             │ winning_bid  │
                                             └──────┬───────┘
                                                    │ 1───*
                                             ┌──────▼───────┐
                                             │    BIDS      │
                                             │──────────────│
                                             │ auction_id   │
                                             │ member_id    │
                                             │ bid_amount   │
                                             │ is_winning   │
                                             └──────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ COLLECTIONS  │ 1──* │   PAYMENTS   │      │FRAUD_CASES   │
│──────────────│      │──────────────│      │──────────────│
│ id (PK)      │      │ id (PK)      │      │ id (PK)      │
│ member_id(FK)│      │ collection_id│      │ type         │
│ type         │      │ member_id    │      │ severity     │
│ amount       │      │ amount       │      │ members      │
│ due_date     │      │ method       │      │ status       │
│ status       │      │ date         │      │ potential_   │
│ assigned_agt │      │ status       │      │ loss         │
└──────────────┘      └──────────────┘      └──────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ COMPLIANCE   │      │ KYC_MONITOR  │      │ AML_ALERTS   │
│  CHECKLIST   │      │──────────────│      │──────────────│
│──────────────│      │ member_id(FK)│      │ member_id(FK)│
│ rule         │      │ kyc_status   │      │ type         │
│ category     │      │ pan_verified │      │ severity     │
│ status       │      │ aadhaar_ver  │      │ total_amount │
│ weight       │      │ due_date     │      │ status       │
└──────────────┘      └──────────────┘      └──────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ AUDIT_LOGS   │      │SYSTEM_CONFIG │      │NOTIFICATIONS │
│──────────────│      │──────────────│      │──────────────│
│ user_id (FK) │      │ key (PK)     │      │ user_id (FK) │
│ action       │      │ value (JSON) │      │ type         │
│ module       │      │ category     │      │ message      │
│ ip, timestamp│      │ updated_by   │      │ read         │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 6. COMPLETE API ENDPOINTS

### Authentication (No auth required)
```
POST /api/v1/auth/login           → Login with email/password → JWT token
POST /api/v1/auth/register        → Register new user
POST /api/v1/auth/google          → Google OAuth login
POST /api/v1/auth/forgot-password → Request password reset email
POST /api/v1/auth/reset-password  → Reset password with token
GET  /api/v1/auth/me              → Get current user (requires token)
POST /api/v1/auth/logout          → Logout (client discards token)
```

### Dashboard (Staff only)
```
GET /api/v1/dashboard/metrics              → Key metrics (members, loans, deposits)
GET /api/v1/dashboard/charts/liquidity     → Liquidity inflow vs payout (6 months)
GET /api/v1/dashboard/charts/deposits      → Deposit growth by type
GET /api/v1/dashboard/charts/risk-heatmap  → Risk distribution by STI
```

### Members (Staff roles)
```
GET    /api/v1/members              → List all members (paginated)
GET    /api/v1/members/{id}         → Member detail
POST   /api/v1/members              → Create member
PUT    /api/v1/members/{id}         → Update member
DELETE /api/v1/members/{id}         → Deactivate (Admin only)
GET    /api/v1/members/{id}/sti     → STI score breakdown
```

### Chit Schemes (Any auth user)
```
GET  /api/v1/chit-schemes            → List schemes (filter by status)
GET  /api/v1/chit-schemes/{id}       → Scheme detail + enrolled members
POST /api/v1/chit-schemes            → Create scheme (Admin only)
```

### Chit Enrollments
```
GET  /api/v1/chit-enrollments                → List enrollments (Staff)
POST /api/v1/chit-schemes/{id}/enroll        → Enroll in scheme (Any user)
PUT  /api/v1/chit-enrollments/{id}/approve   → Approve enrollment (Staff)
PUT  /api/v1/chit-enrollments/{id}/reject    → Reject enrollment (Staff)
```

### Auctions
```
GET  /api/v1/chit-schemes/{id}/auctions  → List scheme auctions
GET  /api/v1/auctions/{id}/live          → Live auction details + bids
POST /api/v1/auctions/{id}/bid           → Place bid
```

### Loans
```
GET  /api/v1/loans/applications          → List applications (Staff)
POST /api/v1/loans/apply                 → Apply for loan (Any user)
PUT  /api/v1/loans/{id}/approve          → Approve loan (Staff)
PUT  /api/v1/loans/{id}/reject           → Reject loan (Staff)
PUT  /api/v1/loans/{id}/disburse         → Disburse loan (Staff)
```

### Deposits
```
GET  /api/v1/deposits/accounts           → List accounts (Staff)
POST /api/v1/deposits/accounts           → Open deposit (Any user)
GET  /api/v1/deposits/schemes            → List schemes (Any user)
GET  /api/v1/deposits/maturity-tracker   → Upcoming maturities
```

### Collections & Payments
```
GET  /api/v1/collections/dashboard                → Collection stats
GET  /api/v1/collections/schedule                  → Payment schedule
GET  /api/v1/collections/overdue                   → Overdue list
POST /api/v1/collections/{id}/record-payment       → Record payment
```

### Profile
```
GET  /api/v1/profile                → User profile + member info
PUT  /api/v1/profile                → Update profile
POST /api/v1/profile/kyc-upload     → Upload KYC document
PUT  /api/v1/profile/change-password→ Change password
```

### Compliance (Staff only)
```
GET /api/v1/compliance/dashboard           → Compliance score
GET /api/v1/compliance/checklist           → Rule checklist
GET /api/v1/compliance/kyc-monitoring      → KYC status per member
GET /api/v1/compliance/aml-monitoring      → AML alerts
GET /api/v1/compliance/regulatory-filings  → Filing deadlines
```

### Fraud Intelligence (Staff only)
```
GET /api/v1/fraud/dashboard        → Fraud metrics
GET /api/v1/fraud/cases            → Fraud cases (paginated)
PUT /api/v1/fraud/cases/{id}       → Update case status
GET /api/v1/fraud/patterns         → Fraud trends
```

### AI Risk Control (Staff only)
```
GET /api/v1/ai-risk/dashboard              → AI agent status
GET /api/v1/ai-risk/member-risk/{id}       → Member risk assessment
GET /api/v1/ai-risk/liquidity              → Liquidity risk
```

### Reports (Staff only)
```
GET  /api/v1/reports/financial-summary  → P&L, balance sheet
GET  /api/v1/reports/member-growth      → Growth metrics
GET  /api/v1/reports/loan-portfolio     → Portfolio analysis
POST /api/v1/reports/generate           → Custom report
```

### Config (Admin only)
```
GET  /api/v1/config          → System configuration
PUT  /api/v1/config          → Update configuration
GET  /api/v1/config/users    → List users
POST /api/v1/config/users    → Create user
PUT  /api/v1/config/users/{id} → Update user role
```

---

## 7. KEY BUSINESS WORKFLOWS

### A. Loan Application → Disbursement

```
  MEMBER                          ADMIN / MANAGER
  ──────                          ────────────────

  Browse Loan Schemes
  (My Loans → Available Schemes)
         │
         ▼
  Check Eligibility
  (STI score ≥ scheme minimum?)
         │
    ┌────┴────┐
    │Eligible │  Not Eligible → "Not Eligible" badge shown
    └────┬────┘
         │
         ▼
  Fill Application Form
  (Amount, Tenure, Purpose,
   Employment, Income)
         │
         ▼
  POST /loans/apply
         │
         ▼
  Status: "Pending"                    Sees in Loans → Applications Tab
         │                                      │
         │                                      ▼
         │                             Review Application
         │                             (AI Risk Score, Member STI,
         │                              Transaction History)
         │                                      │
         │                              ┌───────┴───────┐
         │                              │               │
         │                     PUT /approve      PUT /reject
         │                              │               │
         ▼                              ▼               ▼
  Notification:              Status: "Approved"   Status: "Rejected"
  "Loan Approved!" ◀──────── EMI schedule         Reason provided
         │                   generated
         │                              │
         │                              ▼
         │                     PUT /disburse
         │                              │
         ▼                              ▼
  Status: "Disbursed"        Amount credited
  EMIs begin                 First EMI date set
         │
         ▼
  Monthly EMI Payments
  (My Loans → Pay Now)
         │
         ▼
  POST /record-payment
```

### B. Chit Fund Enrollment → Auction → Payout

```
  MEMBER                               ADMIN / BRANCH MANAGER
  ──────                               ──────────────────────

  Browse Chit Schemes
  (My Chit Funds → Available)
         │
         ▼
  Check: STI ≥ min_sti?
  Check: Spots available?
         │
    ┌────┴────┐
    │ Can     │  Cannot → Button disabled
    │ Enroll  │
    └────┬────┘
         │
         ▼
  Fill Enrollment Form
  (Nominee, Terms acceptance,
   Auto-debit authorization)
         │
         ▼
  POST /chit-schemes/{id}/enroll
         │
         ▼
  Status: "Under Review"              Sees in Chit Funds → Enrollments
         │                                      │
         │                              ┌───────┴───────┐
         │                              │               │
         │                       PUT /approve      PUT /reject
         │                              │               │
         ▼                              ▼               ▼
  Status: "Active"             enrolled_members++   Reason sent
  Monthly contributions begin
         │
         │
         ▼
  ┌──────────────────────────── MONTHLY CYCLE ──────────────────────┐
  │                                                                 │
  │  1. Monthly Contribution Collected (auto-debit)                 │
  │         │                                                       │
  │         ▼                                                       │
  │  2. Auction Goes Live                                           │
  │     GET /auctions/{id}/live                                     │
  │         │                                                       │
  │         ▼                                                       │
  │  3. Members Place Bids (discount they're willing to accept)     │
  │     POST /auctions/{id}/bid                                     │
  │         │                                                       │
  │         ▼                                                       │
  │  4. Lowest Bid Wins                                             │
  │     Winner gets: pot_size - foreman_commission - winning_bid    │
  │     Others get: dividend_per_member (from winning bid amount)   │
  │         │                                                       │
  │         ▼                                                       │
  │  5. Next Month's Auction Scheduled                              │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘
```

### C. Deposit Account Opening

```
  MEMBER                               ADMIN
  ──────                               ─────

  Browse Deposit Schemes
  (My Deposits → Available)
         │
         ▼
  Select Type: FD / RD / Savings
         │
         ▼
  Fill Form
  (Amount, Tenure, Nominee,
   Auto-renewal preference)
         │
         ▼
  POST /deposits/accounts
         │
         ▼
  Status: "Under Review"              Sees in Deposits → Applications
         │                                      │
         │                                      ▼
         │                             Review & Approve
         │                                      │
         ▼                                      ▼
  Status: "Active"                     Account Created
  ┌─────────────────────────────────────────────────┐
  │ FD: Lump sum deposited → Maturity date set      │
  │ RD: Monthly installments → Auto-debit starts    │
  │ Savings: Open balance → Earn 4% interest        │
  └─────────────────────────────────────────────────┘
         │
         ▼
  Track in My Deposits
  (Progress bar → maturity date)
```

### D. Fraud Detection & Resolution

```
  AI AGENTS (Background)                    ADMIN
  ──────────────────────                    ─────

  ┌─────────────────────┐
  │ Fraud Sentinel Agent│
  │ scans transactions  │
  │ continuously        │
  └─────────┬───────────┘
            │
  Detects anomaly:
  • Auction bid manipulation
  • Identity duplication
  • Deposit layering
  • Ghost member activity
            │
            ▼
  Creates FRAUD_CASE                     Sees in Fraud Intel → Dashboard
  (severity, type, members)                       │
            │                                     ▼
            ▼                            Reviews Active Cases
  Creates TRANSACTION_ANOMALY            (Case details, evidence,
  (flagged for review)                    affected members)
                                                  │
                                         ┌────────┴────────┐
                                         │                 │
                                  Investigate        False Positive
                                  (status →           (status →
                                   Investigating)      Cleared)
                                         │
                                         ▼
                                  Resolve / Escalate
                                  (action_taken,
                                   remarks updated)
                                         │
                                         ▼
                                  Update Prevention Rules
                                  (Config → Risk Thresholds)
```

### E. KYC Verification Flow

```
  MEMBER                                   ADMIN / MANAGER
  ──────                                   ────────────────

  Profile → KYC Documents
         │
         ▼
  Upload Documents:
  ┌─────────────────────┐
  │ • PAN Card          │
  │ • Aadhaar Card      │
  │ • Address Proof     │
  │ • Passport Photo    │
  └─────────┬───────────┘
            │
  POST /profile/kyc-upload
  (type = pan/aadhaar/
   address/photo)
            │
            ▼
  Status: "Pending"                     Compliance → KYC Monitoring
            │                                    │
            │                                    ▼
            │                           Review Documents
            │                           (verify authenticity)
            │                                    │
            │                           ┌────────┴────────┐
            │                           │                 │
            │                    Verify All         Reject
            │                    Documents          (reason)
            │                           │
            ▼                           ▼
  KYC Status: "Verified"       Member kyc_status updated
  STI score boosted            pan_verified = true
  (sti_kyc_status ↑)           aadhaar_verified = true
                               etc.
```

---

## 8. STI (Strength Through Integrity) SCORE

```
  ┌──────────────────────────────────────────────────────┐
  │                   STI SCORE (0-100)                  │
  │                                                      │
  │  ┌────────────────────────────┐                      │
  │  │ Payment Punctuality  25%  │ ██████████░░░░░  70   │
  │  ├────────────────────────────┤                      │
  │  │ Account Activity     25%  │ ████████████░░░  80   │
  │  ├────────────────────────────┤                      │
  │  │ KYC Status           20%  │ ███████████████ 100   │
  │  ├────────────────────────────┤                      │
  │  │ Fraud Flags          15%  │ ██████████████░  90   │
  │  ├────────────────────────────┤                      │
  │  │ Deposit Tenure       15%  │ ████████░░░░░░░  55   │
  │  └────────────────────────────┘                      │
  │                                                      │
  │  TOTAL STI = (70×0.25)+(80×0.25)+(100×0.20)          │
  │             +(90×0.15)+(55×0.15) = 79.25             │
  │                                                      │
  │  Risk Classification:                                │
  │  ┌────────────────────────────────────┐              │
  │  │  STI ≥ 70  → LOW Risk    (Green)  │              │
  │  │  STI 50-69 → MEDIUM Risk (Yellow) │              │
  │  │  STI < 50  → HIGH Risk   (Red)    │              │
  │  └────────────────────────────────────┘              │
  └──────────────────────────────────────────────────────┘
```

**STI affects:**
- Loan eligibility (min STI per scheme: 30-65)
- Chit fund enrollment (min STI per scheme)
- Risk classification for compliance
- AI agent monitoring priority

---

## 9. FRONTEND PAGE MAP

```
app/
├── page.js                              → Redirect (→ /dashboard or /login)
├── login/page.js                        → Login / Signup / Forgot Password
│
└── (dashboard)/                         → Shared Layout (Sidebar + Header)
    │
    ├── dashboard/page.js                → Executive Dashboard
    │   ├── 6 metric cards
    │   ├── Liquidity Chart
    │   ├── Loan Portfolio Chart
    │   ├── Deposit Growth Chart
    │   ├── Risk Heatmap
    │   └── AI Agent Control Center
    │
    ├── members/page.js                  → Member Management
    │   ├── Search + Risk Filter
    │   ├── Member Cards/Table
    │   └── Add/Edit/View Modals
    │
    ├── chit-funds/page.js               → Chit Fund Management
    │   ├── Tab: Enrollments (approve/reject)
    │   ├── Tab: Schemes (view/create)
    │   └── Tab: Foreman Commission
    │
    ├── loans/page.js                    → Loan Management
    │   ├── Tab: Dashboard (metrics)
    │   ├── Tab: Applications (list)
    │   ├── Tab: Approval (decide)
    │   ├── Tab: Portfolio (analysis)
    │   ├── Tab: Repayments (EMIs)
    │   └── Tab: Defaults (NPAs)
    │
    ├── deposits/page.js                 → Deposit Management
    │   ├── Tab: Overview
    │   ├── Tab: Applications
    │   ├── Tab: Accounts
    │   ├── Tab: Schemes
    │   └── Tab: Maturity Tracker
    │
    ├── collections/page.js              → Collections
    ├── compliance/page.js               → Compliance Center
    │   ├── Tab: Dashboard (score)
    │   ├── Tab: Checklist
    │   ├── Tab: KYC Monitoring
    │   ├── Tab: AML Monitoring
    │   ├── Tab: Regulatory Filings
    │   └── Tab: Audit Logs
    │
    ├── ai-risk/page.js                  → AI Risk Control
    ├── fraud-intel/page.js              → Fraud Intelligence
    │   ├── Tab: Dashboard (metrics)
    │   ├── Tab: Active Cases
    │   └── Tab: Pattern Analysis
    │
    ├── agents/page.js                   → AI Agents Status
    ├── reports/page.js                  → Reports
    │   ├── Tab: Financial Reports (P&L)
    │   └── Tab: Member Growth
    │
    ├── settings/page.js                 → System Configuration
    │   ├── Tab: User Management
    │   ├── Tab: General / Deposits / Loans / Chit Fund config
    │   ├── Tab: AI Agent Configuration
    │   └── Tab: Audit Log
    │
    ├── collateral/page.js               → Collateral Management
    ├── governance/page.js               → Governance
    ├── ai-assistant/page.js             → AI Chat Assistant
    ├── profile/page.js                  → User Profile + KYC
    │
    └── member/                          → MEMBER PORTAL
        ├── dashboard/page.js            → Member Dashboard
        │   ├── Welcome + STI Score
        │   ├── Summary Cards (4)
        │   ├── Savings Chart
        │   ├── Quick Actions (6 buttons)
        │   ├── My Chit Funds Summary
        │   ├── Upcoming Payments
        │   └── Available Schemes
        │
        ├── chit-funds/page.js           → My Chit Funds
        │   ├── Enrolled Schemes + Dashboard
        │   ├── Contribution Timeline
        │   └── Available Schemes
        │
        ├── chit-funds/enroll/page.js    → Enroll in Chit Fund
        │
        ├── loans/page.js               → My Loans
        │   ├── Active Loans + EMI Pay
        │   └── Available Loan Schemes
        │
        ├── loans/apply/page.js          → Apply for Loan
        │
        ├── deposits/page.js             → My Deposits
        │   ├── Active Deposits
        │   └── Available Schemes
        │
        ├── deposits/open/page.js        → Open New Deposit
        │
        └── payments/page.js             → Payment History
```

---

## 10. DEFAULT LOGIN CREDENTIALS

| Role           | Email                    | Password     |
|----------------|--------------------------|--------------|
| Admin          | admin@glimmora.com       | Admin@123    |
| Branch Manager | manager@glimmora.com     | Manager@123  |
| Member         | member@glimmora.com      | Member@123   |

---

## 11. TECH STACK SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                    │  BACKEND                     │
│──────────────────────────────│──────────────────────────────│
│  Next.js (App Router)        │  FastAPI (Python 3.10+)      │
│  React 18+                   │  SQLAlchemy ORM              │
│  Tailwind CSS 4              │  SQLite (dev) / PostgreSQL   │
│  Chart.js (charts)           │  Uvicorn (ASGI server)       │
│  GSAP (animations)           │  JWT (python-jose)           │
│  SWR pattern (useData hook)  │  bcrypt (passlib)            │
│  Context API (auth state)    │  Pydantic v2 (validation)    │
│  localStorage (token)        │  Alembic (migrations)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. CONFIGURATION SETTINGS

| Category       | Setting                    | Default Value |
|----------------|----------------------------|---------------|
| **Deposits**   | FD Minimum                 | ₹10,000       |
|                | FD Max Rate                | 9.5%          |
|                | RD Min Monthly             | ₹1,000        |
|                | Savings Rate               | 4.0%          |
| **Loans**      | Max Loan Amount            | ₹15,00,000    |
|                | Min STI for Loans          | 50            |
|                | Max Interest Rate          | 14%           |
|                | Default Threshold (EMIs)   | 3             |
| **Chit Funds** | Foreman Commission         | 5%            |
|                | Min Bid Decrement          | ₹500          |
|                | Max Subscribers            | 40            |
|                | Auction Frequency          | Monthly       |
| **AI/Risk**    | Risk Model Version         | v2.4.1        |
|                | Fraud Detection Sensitivity| High          |
|                | STI Recalc Frequency       | Weekly        |
|                | Escalation Threshold       | 80%           |
| **Alerts**     | EMI Reminder               | 3 days before |
|                | Maturity Alert             | 30 days before|
