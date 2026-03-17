# Glimmora Nidhi — API Documentation
> **Plain English Guide** — What each API does, who can use it, and what it returns.

**Base URL:** `http://localhost:8000/api/v1`
**Interactive Docs:** `http://localhost:8000/api/docs`

---

## How Authentication Works

Every API (except Login/Register) requires you to send a **JWT Token** in the request header.

```
Authorization: Bearer <your_token_here>
```

You get this token when you log in. Think of it like a **temporary ID card** — you show it every time you want to do something.

---

## Roles & What They Can Do

| Role | Who They Are | What They Can Access |
|------|-------------|----------------------|
| `SUPER_ADMIN` | Owner/Top Management | Everything |
| `ADMIN` | Head Office Admin | Almost everything |
| `BRANCH_MANAGER` | Branch Head | Members, Loans, Reports |
| `LOAN_OFFICER` | Loan Department Staff | Loans, Collections |
| `FIELD_AGENT` | On-ground Collection Staff | Collections, View Members |
| `MEMBER` | Customer/Investor | Own loans, deposits, payments |

---

## Common Response Format

**Success:**
```json
{ "success": true, "data": { ... }, "message": "Done" }
```

**Error:**
```json
{ "success": false, "error": "What went wrong", "code": "ERROR_CODE" }
```

**List with Pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 }
}
```

---

---

# MODULE 1 — AUTHENTICATION
> *"Who are you and do you have permission to be here?"*

These APIs handle **login, registration, and password management**. No token needed for these.

---

### `POST /auth/login`
**What it does:** Log in with email and password. Returns a JWT token you use for all other requests.

**Simple Analogy:** Like swiping your office ID card at the entrance — it checks who you are and lets you in.

**Send:**
```json
{
  "email": "admin@glimmora.com",
  "password": "Admin@123"
}
```

**You Get Back:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "U-002",
      "name": "Priya Sharma",
      "role": "ADMIN",
      "roleLabel": "Admin"
    }
  }
}
```

**Errors:**
- `INVALID_CREDENTIALS` — Wrong email or password

---

### `POST /auth/google`
**What it does:** Log in using a Google account (Google OAuth). If the person is new, their account is created automatically.

**Simple Analogy:** "Sign in with Google" button on websites.

**Send:**
```json
{ "googleToken": "google_oauth_token_from_frontend" }
```

**You Get Back:** Same as normal login + `"isNewUser": true/false`

---

### `POST /auth/register`
**What it does:** Create a new user account (for staff or members).

**Send:**
```json
{
  "name": "Amit Patel",
  "email": "amit@email.com",
  "password": "Amit@123",
  "confirmPassword": "Amit@123",
  "role": "MEMBER"
}
```

**You Get Back:** The newly created user details with status `201 Created`.

**Errors:**
- `EMAIL_EXISTS` — This email is already registered
- `PASSWORD_MISMATCH` — Passwords don't match

---

### `POST /auth/forgot-password`
**What it does:** Sends a password reset link to the user's email.

**Simple Analogy:** Clicking "Forgot Password?" on any website — you get a reset link in your inbox.

**Send:** `{ "email": "amit@email.com" }`

**Note:** In production, an actual email is sent. During development, the token is generated but email delivery is mocked.

---

### `POST /auth/reset-password`
**What it does:** Sets a new password using the token from the reset email.

**Send:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

**Errors:**
- `INVALID_RESET_TOKEN` — Token is expired or already used

---

### `POST /auth/logout`
**What it does:** Logs out the user. Since we use JWT (stateless tokens), the client simply discards the token.

**Who can use it:** Any logged-in user.

---

---

# MODULE 2 — MEMBERS
> *"Managing all the people who save money or take loans at our Nidhi."*

Members are the **customers** of the Nidhi — they open deposits, take loans, join chit funds.

---

### `GET /members`
**What it does:** Get a list of all members. Supports searching and filtering.

**Who can use it:** Admin, Manager, Loan Officer, Field Agent (NOT regular members).

**Filters you can apply:**
- `?search=Rajesh` — Find by name, phone, or email
- `?risk=Low` — Filter by risk level (Low / Medium / High)
- `?kyc=Verified` — Filter by KYC status
- `?status=Active` — Filter by member status
- `?page=1&limit=10` — For pagination

**You Get Back:** List of members with their deposits, loans, STI score, KYC status, etc.

---

### `GET /members/{id}`
**What it does:** Get full details of one specific member by their ID (e.g., `M-1001`).

**Simple Analogy:** Looking up a customer's file at the front desk.

---

### `POST /members`
**What it does:** Add a new member to the system.

**Who can use it:** Admin, Manager, and above.

**Send:**
```json
{
  "name": "Sunil Verma",
  "phone": "9988776655",
  "email": "sunil@email.com",
  "address": "45, Park Street, Kolkata",
  "risk": "Low",
  "kyc": "Pending"
}
```

**What happens:** Member is created with a unique ID (e.g., `M-1019`), default STI of 50, and zero deposits/loans.

---

### `PUT /members/{id}`
**What it does:** Update an existing member's details (name, phone, KYC status, risk level, etc.).

**Simple Analogy:** Updating someone's profile on the system.

---

### `DELETE /members/{id}`
**What it does:** Deactivates a member (soft delete — data is kept, status becomes "Inactive").

**Who can use it:** Super Admin and Admin only.

**Note:** Data is never permanently deleted — it's just hidden from active views. This is important for audit trails.

---

### `GET /members/{id}/sti`
**What it does:** Get a member's **STI (Social Trust Index)** — their trustworthiness score from 0 to 100.

**Simple Analogy:** Like a credit score, but more holistic. Higher = more trustworthy.

**What it includes:**

| Factor | What it Measures |
|--------|-----------------|
| `paymentPunctuality` | Does the member pay on time? |
| `accountActivity` | How actively they use the account |
| `kycStatus` | Is their identity verified? |
| `fraudFlags` | Any fraud incidents? |
| `depositTenure` | How long they've been depositing |

---

---

# MODULE 3 — CHIT FUNDS
> *"Chit funds are group savings where everyone contributes monthly and one person wins the pot each month."*

**How Chit Funds Work (Simple):**
- 25 people each put in ₹5,000/month = ₹1,25,000 pot
- Every month, members bid for the pot
- Whoever bids the lowest amount wins (they get less but win earlier)
- The difference is shared as dividend among all members
- Everyone gets a turn over 25 months

---

### `GET /chit-schemes`
**What it does:** Get all available chit fund schemes.

**Filter:** `?status=Open` — Only show schemes open for new enrollment.

**You Get Back:**
```json
{
  "id": "CS-001",
  "name": "Glimmora Gold 25",
  "monthlyAmount": 5000,
  "duration": 25,
  "totalMembers": 25,
  "enrolledMembers": 18,
  "potSize": 125000,
  "spotsLeft": 7,
  "nextAuction": "2026-03-22",
  "status": "Open",
  "minSTI": 60
}
```

---

### `GET /chit-schemes/{id}`
**What it does:** Get full details of one scheme, including the list of all enrolled members.

---

### `POST /chit-schemes`
**What it does:** Create a new chit scheme.

**Who can use it:** Super Admin and Admin only.

**Send:**
```json
{
  "name": "Glimmora Platinum 30",
  "monthlyAmount": 10000,
  "duration": 30,
  "totalMembers": 30,
  "minSTI": 70,
  "kycRequired": "Verified"
}
```

**What happens automatically:** `potSize` is calculated as `monthlyAmount × totalMembers = ₹3,00,000`.

---

---

# MODULE 4 — CHIT ENROLLMENT
> *"Signing up a member to participate in a chit fund scheme."*

---

### `POST /chit-schemes/{schemeId}/enroll`
**What it does:** Enroll a member into a chit fund scheme.

**Validations performed:**
1. Is the scheme still open?
2. Are there spots left?
3. Does the member's STI meet the minimum required?
4. Is the member's KYC verified (if required)?
5. Is the member already enrolled in this scheme?

**Send:**
```json
{
  "memberId": "M-1001",
  "fullName": "Rajesh Kumar",
  "phone": "9876543210",
  "email": "rajesh@email.com",
  "nomineeName": "Priya Kumar",
  "nomineeRelationship": "Spouse",
  "acceptedTerms": true,
  "authorizedAutoDeduction": true
}
```

**Error Example:**
```json
{
  "success": false,
  "error": "Member STI score (45) is below minimum required (60)",
  "code": "STI_TOO_LOW"
}
```

---

### `GET /members/{memberId}/chit-enrollments`
**What it does:** Get all chit funds a specific member is currently enrolled in.

**Who would use it:** A member checking their "My Chit Funds" page.

---

---

# MODULE 5 — CHIT AUCTIONS
> *"The monthly event where members bid for the chit pot."*

---

### `GET /chit-schemes/{schemeId}/auctions`
**What it does:** Get the list of all past and upcoming auctions for a chit scheme.

**You Get Back:** Auction date, pot size, winner, winning bid, status (Scheduled / Live / Completed).

---

### `GET /auctions/{auctionId}/live`
**What it does:** Get real-time data of an ongoing auction — all bids placed, current winning bid, time remaining.

**Simple Analogy:** Like watching a live auction on TV — you can see who bid what.

**Who would use it:** Members watching and participating in a live auction.

---

### `POST /auctions/{auctionId}/bid`
**What it does:** Place a bid in a live auction.

**Rules enforced:**
- Auction must be `Live`
- Member must be enrolled in the scheme
- Member must not have already won a previous auction
- Bid must be lower than the current winning bid

**Send:**
```json
{ "memberId": "M-1005", "bidAmount": 95000 }
```

**Simple Analogy:** Like bidding in a reverse auction — you want to bid the LOWEST to win (you get less but faster).

---

### `POST /auctions/{auctionId}/close`
**What it does:** Ends the auction and declares the winner. Calculates dividend per member.

**Who can use it:** Super Admin, Admin, Branch Manager only.

**What happens:**
1. Lowest bidder is declared winner
2. Winner's enrollment is marked `hasWonAuction = true`
3. Dividend per member is calculated and stored
4. Auction status becomes `Completed`

---

---

# MODULE 6 — LOANS
> *"Managing loans given to members — from application to repayment."*

**Loan Lifecycle:**
`Pending → Under Review → Approved/Rejected → Disbursed → (Repayment) → Closed`

---

### `GET /loans/applications`
**What it does:** Get all loan applications across the system (for staff review).

**Who can use it:** Loan Officer and above.

**Filters:** `?status=Approved&risk=Low&page=1&limit=10`

---

### `POST /loans/apply`
**What it does:** Submit a new loan application.

**Who can use it:** Any logged-in user (member applies for themselves or staff applies on behalf).

**Send:**
```json
{
  "memberId": "M-1001",
  "amount": 200000,
  "purpose": "Business Expansion",
  "tenure": 24
}
```

**What happens automatically:**
- EMI is calculated using standard reducing balance formula
- Interest rate defaults to 12% (configurable in system settings)
- Member's STI and risk level are copied into the application

---

### `PUT /loans/{id}/approve`
**What it does:** Approve a loan application. Can adjust amount, rate, or tenure.

**Who can use it:** Loan Officer and above.

**Send:**
```json
{
  "approvedAmount": 200000,
  "interestRate": 12,
  "tenure": 24,
  "remarks": "Good STI score. Approved."
}
```

---

### `PUT /loans/{id}/reject`
**What it does:** Reject a loan application with a reason.

**Send:** `{ "reason": "STI score too low for requested amount" }`

---

### `PUT /loans/{id}/disburse`
**What it does:** Disburse (transfer money to member) an approved loan. Generates the full EMI repayment schedule.

**Send:**
```json
{
  "disbursementDate": "2026-03-16",
  "bankAccount": "XXXX-XXXX-1234"
}
```

**What happens:** Full EMI schedule is auto-generated (24 rows for a 24-month loan) with principal, interest, and outstanding balance for each installment.

---

### `GET /loans/{id}/emi-schedule`
**What it does:** Get the complete repayment schedule for a loan.

**Simple Analogy:** Like the loan repayment chart your bank gives you when you take a home loan.

**You Get Back:** Each EMI with due date, principal amount, interest amount, outstanding balance, and payment status.

---

### `GET /loans/portfolio`
**What it does:** Summary of all loans grouped by category (Personal, Business, Education, etc.)

**Used for:** Management reporting and risk analysis.

---

### `GET /loans/defaults`
**What it does:** List of all defaulted loans (members who haven't paid EMIs for 3+ months).

**Simple Analogy:** The "bad loans" or NPA (Non-Performing Assets) report.

---

### `GET /members/{memberId}/loans`
**What it does:** Get all loans of a specific member.

**Who would use it:** A member checking their "My Loans" page.

---

---

# MODULE 7 — DEPOSITS
> *"Fixed Deposits, Recurring Deposits, and Savings accounts for members."*

---

### `GET /deposits/accounts`
**What it does:** Get all deposit accounts across all members (staff view).

**Filters:** `?type=Fixed Deposit&status=Active`

---

### `POST /deposits/accounts`
**What it does:** Open a new deposit account for a member.

**Send:**
```json
{
  "memberId": "M-1001",
  "type": "Fixed Deposit",
  "amount": 100000,
  "tenure": 12,
  "autoRenewal": true
}
```

**What happens automatically:**
- Interest rate is looked up from the deposit scheme rates
- Maturity date is calculated (open date + tenure months)
- Maturity amount is calculated with interest

**Deposit Types & Default Rates:**

| Type | Tenure | Rate |
|------|--------|------|
| Fixed Deposit | 6 months | 8.0% |
| Fixed Deposit | 12 months | 8.5% |
| Fixed Deposit | 24 months | 9.0% |
| Fixed Deposit | 36 months | 9.5% |
| Recurring Deposit | 12 months | 7.5% |
| Savings | — | 4.0% |

---

### `GET /deposits/schemes`
**What it does:** Get all available deposit scheme options (rates, tenures, min/max amounts).

**Who would use it:** Frontend showing "Available Deposit Plans" page.

---

### `GET /deposits/maturity-tracker`
**What it does:** Get deposits that are maturing soon.

**Filter:** `?days=30` — Show deposits maturing within next 30 days.

**Why it's important:** So staff can contact members before maturity to either renew or pay out. Prevents money from sitting idle.

---

### `GET /members/{memberId}/deposits`
**What it does:** Get all deposits of a specific member.

**Who would use it:** Member checking their "My Deposits" page.

---

---

# MODULE 8 — COLLECTIONS & PAYMENTS
> *"Tracking money that members owe, collecting it, and recording payments."*

---

### `GET /collections/dashboard`
**What it does:** Summary view of the entire collections operation.

**You Get Back:**
- Collection Rate (e.g., 94% — meaning 94% of dues have been collected)
- Total amount due vs total collected
- Overdue amount and number of overdue members
- Active recovery cases

---

### `GET /collections/schedule`
**What it does:** List of all upcoming EMI and chit subscription payments due from members.

**Filters:** `?type=EMI&status=Upcoming`

**Who would use it:** Field agents preparing their collection list for the day.

---

### `GET /collections/overdue`
**What it does:** List of all overdue payments — members who have missed their due date.

**You Get Back:** Member details, amount overdue, how many days overdue, assigned collection agent.

---

### `POST /collections/{id}/record-payment`
**What it does:** Record a payment collected by a field agent in person (cash/UPI/cheque).

**Simple Analogy:** The field agent visits member's house, collects ₹9,420 in cash, and marks it as collected in the app.

**Send:**
```json
{
  "amount": 9420,
  "paymentMethod": "UPI",
  "transactionId": "UPI123456789",
  "collectedBy": "U-005",
  "remarks": "Collected at member's shop"
}
```

---

### `POST /members/{memberId}/make-payment`
**What it does:** Member makes a self-service payment from their own portal (net banking, UPI, etc.).

**Simple Analogy:** Paying your credit card bill yourself through the bank's app.

---

### `GET /members/{memberId}/payments`
**What it does:** Get a member's complete payment history.

**Who would use it:** Member checking "My Payments" or staff verifying payment records.

---

### `GET /collections/recovery`
**What it does:** List of active recovery cases — members in serious default being handled by recovery agents.

**You Get Back:** Outstanding amount, missed EMI count, assigned agent, last contact date, next follow-up date.

---

---

# MODULE 9 — COMPLIANCE
> *"Making sure Glimmora Nidhi follows all government rules and regulations."*

Nidhi companies in India are regulated by the **Ministry of Corporate Affairs (MCA)** under the Companies Act. They must follow specific rules to keep their license.

---

### `GET /compliance/dashboard`
**What it does:** Overall compliance health check — how many rules are being followed.

**You Get Back:**
- Overall compliance score (e.g., 94%)
- Rules: compliant / warning / action required
- Last audit date and next scheduled audit date

---

### `GET /compliance/checklist`
**What it does:** Full list of all compliance rules with their current status.

**Example rules checked:**
- Net Owned Funds must be ≥ ₹20 Lakhs
- Minimum 200 members within first year
- Deposits must not exceed 20x Net Owned Funds
- Loans only to members (no outsiders)
- Annual NDH-1 filing must be done on time

---

### `GET /compliance/kyc-monitoring`
**What it does:** Track KYC (Know Your Customer) verification status of all members.

**Filter:** `?status=Pending` — Show only members with incomplete KYC.

**Why it's important:** RBI and MCA mandate that Nidhi companies verify identity (PAN, Aadhaar, address) of all members. Unverified members cannot take loans or join chit funds.

**You Get Back:** Per member — pan verified, aadhaar verified, address verified, photo verified, due date.

---

### `GET /compliance/aml-monitoring`
**What it does:** Get AML (Anti-Money Laundering) alerts — suspicious transaction patterns detected by the system.

**Example flags:**
- Member depositing ₹49,000 multiple times in a day (just below the ₹50,000 reporting threshold — a known structuring pattern)
- Sudden large withdrawals
- Multiple accounts with same address

---

### `GET /compliance/regulatory-filings`
**What it does:** Status of all mandatory government filings.

**Key filings:**
| Form | Purpose | Frequency |
|------|---------|-----------|
| NDH-1 | Annual statutory compliance return | Yearly |
| NDH-3 | Half-yearly return | Every 6 months |

---

### `GET /compliance/audit-logs`
**What it does:** Complete log of every action performed in the system — who did what, when, from which IP.

**Filters:** `?action=login&userId=U-001&from=2026-03-01&to=2026-03-16`

**Why it's important:** Required for internal audits and investigations. If anything goes wrong, you can trace exactly who did it.

---

---

# MODULE 10 — FRAUD INTELLIGENCE
> *"Detecting and managing fraud before it causes damage."*

---

### `GET /fraud/dashboard`
**What it does:** Bird's eye view of fraud activity.

**You Get Back:**
- Total fraud alerts
- Critical alerts count
- Cases resolved this month
- Average days to resolve a case
- False positive rate (how often alerts were wrong)
- Total loss prevented by catching fraud

---

### `GET /fraud/cases`
**What it does:** List all active fraud investigation cases.

**Filters:** `?severity=Critical&status=Investigating`

**Fraud types tracked:**
- Auction Manipulation (coordinated bidding)
- Identity Fraud
- Deposit Layering (money laundering)
- Loan Fraud

---

### `PUT /fraud/cases/{id}`
**What it does:** Update the status of a fraud case as investigation progresses.

**Status flow:** `Investigating → Escalated → Resolved / False Positive`

**Send:**
```json
{
  "status": "Escalated",
  "remarks": "Evidence confirmed. Escalating to compliance team.",
  "actionTaken": "Member accounts frozen pending investigation"
}
```

---

### `GET /fraud/patterns`
**What it does:** Analysis of fraud trends — which types of fraud are increasing, decreasing, or new.

**You Get Back:** Frequency of each fraud type, trend direction, and monthly alert count chart data.

---

---

# MODULE 11 — AI RISK CONTROL
> *"Automated AI agents monitoring risk 24/7 so staff don't have to."*

---

### `GET /ai-risk/dashboard`
**What it does:** Status of all AI monitoring agents running in the system.

**AI Agents running:**
| Agent | What it does |
|-------|-------------|
| Onboarding Agent | Checks new member applications for red flags |
| Fraud Triage Agent | Monitors transactions for suspicious patterns |
| Loan Risk Agent | Scores loan applications |
| KYC Verification Agent | Auto-processes KYC documents |
| Collection Agent | Predicts which members might default |
| STI Recalc Agent | Recalculates trust scores weekly |

**You Get Back:** Each agent's status (Active / Alert / Idle), items processed today, items pending.

---

### `GET /ai-risk/member-risk/{memberId}`
**What it does:** AI-generated risk assessment for a specific member.

**Simple Analogy:** Like a credit score report but smarter — it explains exactly WHY someone is risky.

**You Get Back:**
- Overall risk level (Low / Medium / High)
- Risk score (0–100)
- List of contributing factors with their impact
- AI recommendation (e.g., "Restrict new loan applications. Increase monitoring.")

---

### `GET /ai-risk/liquidity`
**What it does:** Real-time liquidity risk monitoring — can the Nidhi meet all its payment obligations?

**Simple Analogy:** Checking if the company has enough cash to pay everyone who's coming to collect money.

**You Get Back:**
- Current liquidity ratio (healthy if > 1.0)
- Monthly inflows (deposits received, EMIs collected, chit subscriptions)
- Monthly outflows (chit payouts, loan disbursements, deposit maturities)
- Net position
- 30-day forecast

---

### `GET /ai-risk/transaction-anomalies`
**What it does:** List of transactions flagged as unusual by the AI system.

**You Get Back:** Member, type of anomaly, amount, AI confidence score (e.g., 92%), detected timestamp.

---

---

# MODULE 12 — NOTIFICATIONS
> *"Alerts and updates delivered to the right person at the right time."*

---

### `GET /notifications`
**What it does:** Get all notifications for the currently logged-in user.

**Filter:** `?read=false` — Only unread notifications.

**You Get Back:**
```json
{
  "data": [
    {
      "id": 1,
      "icon": "warning",
      "type": "alert",
      "message": "Suspicious transaction detected for M-1003",
      "time": "2026-03-16T10:00:00Z",
      "read": false,
      "category": "fraud"
    }
  ],
  "unreadCount": 5
}
```

**Notification categories:** `fraud`, `payment`, `kyc`, `loan`, `compliance`, `system`

---

### `PUT /notifications/{id}/read`
**What it does:** Mark one specific notification as read (when user clicks on it).

---

### `PUT /notifications/read-all`
**What it does:** Mark ALL notifications as read at once (like "Mark all as read" button).

---

---

# MODULE 13 — REPORTS
> *"Generating business reports for management, auditors, and regulators."*

---

### `GET /reports/financial-summary`
**What it does:** Monthly financial performance overview.

**Filter:** `?month=3&year=2026`

**You Get Back:**
- Total revenue, expenses, operating margin
- Total Assets Under Management (AUM)
- Member count, new members this month
- Revenue breakdown chart data (Loan Interest, Chit Commission, Deposit Spread, Fees)

---

### `GET /reports/member-growth`
**What it does:** How the member base is growing or shrinking over time.

**You Get Back:**
- Total members, new this month, churned this month
- Net growth and growth rate percentage
- STI distribution (how many members are Excellent / Good / Average / Poor)
- Month-by-month trend for last 3 months

---

### `GET /reports/loan-portfolio`
**What it does:** Health report of the entire loan book.

**You Get Back:**
- Total sanctioned, disbursed, outstanding amounts
- NPA percentage (bad loans as % of total)
- Recovery rate
- Breakdown by loan category

---

### `POST /reports/generate`
**What it does:** Generate a downloadable report in PDF or Excel format.

**Send:**
```json
{
  "reportType": "financial-summary",
  "format": "pdf",
  "month": 3,
  "year": 2026
}
```

**You Get Back:** A `downloadUrl` to download the generated report file. Link expires after 24 hours.

---

---

# MODULE 14 — CONFIGURATION
> *"System-wide settings that control how the Nidhi operates."*

---

### `GET /config`
**What it does:** Get all current system settings.

**Who can use it:** Super Admin and Admin only.

**Settings categories:**
| Category | What it Controls |
|----------|-----------------|
| `company` | Company name, CIN, address, financial year |
| `deposits` | Min FD amount, max interest rate, auto-renewal defaults |
| `loans` | Max loan amount, minimum STI for loan eligibility, default threshold |
| `chitFunds` | Foreman commission %, min bid decrement, max subscribers |
| `ai` | Risk model version, fraud sensitivity, STI recalculation frequency |
| `notifications` | SMS/email/WhatsApp enabled, reminder day settings |

---

### `PUT /config`
**What it does:** Update one or more system settings. Send only the fields you want to change.

**Send (partial update):**
```json
{
  "chitFunds": { "foremanCommission": 4.5 },
  "notifications": { "emiReminderDays": 5 }
}
```

**Important:** Every config change is logged in the audit log with who changed it and when.

---

### `GET /config/users`
**What it does:** Get all staff users (not members) in the system.

**You Get Back:** List of users with their role, status, and last login time.

---

### `POST /config/users`
**What it does:** Create a new staff user (e.g., hiring a new loan officer).

**Send:**
```json
{
  "name": "New Officer",
  "email": "officer@glimmora.com",
  "password": "Officer@123",
  "role": "LOAN_OFFICER"
}
```

---

### `PUT /config/users/{id}`
**What it does:** Update a staff user's role or activate/deactivate their account.

**Use cases:**
- Promote a Loan Officer to Branch Manager
- Deactivate an employee who has left the company

---

### `GET /config/roles`
**What it does:** Get all available roles and what permissions each role has.

**Used for:** Displaying role options in dropdowns, controlling what navigation links each user sees.

---

---

# MODULE 15 — DASHBOARD METRICS
> *"The executive dashboard — key performance indicators at a glance."*

---

### `GET /dashboard/metrics`
**What it does:** The main KPI numbers shown on the home dashboard.

**Who can use it:** Management and staff.

**You Get Back:**
| Metric | What it Means |
|--------|--------------|
| Active Members | Total registered active members |
| Total Loans | Total outstanding loan value |
| Total Deposits | Total deposits held by the Nidhi |
| Liquidity Ratio | Cash flow health (above 1.0 = healthy) |
| Risk Alerts | Number of high-risk members / active alerts |
| Compliance Score | % of regulatory rules being followed |

Each metric also includes `change` — the percentage increase/decrease from last month.

---

### `GET /dashboard/charts/liquidity`
**What it does:** Data for the Liquidity Trend chart — monthly inflow vs payout for last 6 months.

**Filter:** `?period=6months`

**Used for:** Drawing the line chart on the dashboard showing cash flow trends.

---

### `GET /dashboard/charts/deposits`
**What it does:** Data for the Deposit Growth chart — how FD, RD, and Savings accounts have grown month by month.

**Used for:** Drawing the deposits trend chart split by deposit type.

---

### `GET /dashboard/charts/risk-heatmap`
**What it does:** Distribution of members by risk level and STI score range.

**You Get Back:**
```json
{
  "low": 8200,
  "medium": 3100,
  "high": 1150,
  "distribution": [
    { "stiRange": "90-100", "count": 3200, "risk": "Low" },
    { "stiRange": "70-89", "count": 5000, "risk": "Low" },
    ...
  ]
}
```

**Used for:** Drawing the risk heatmap / donut chart on the dashboard.

---

---

# MODULE 16 — AI ASSISTANT
> *"An intelligent chatbot that can answer questions about the Nidhi's data in plain English."*

---

### `POST /ai-assistant/chat`
**What it does:** Ask a question in natural language and get an intelligent answer based on real data.

**Simple Analogy:** Like asking a knowledgeable colleague "What's our NPA right now?" and getting a proper answer, not just raw data.

**Send:**
```json
{
  "message": "What is the current NPA percentage?",
  "conversationId": "conv-001"
}
```

**You Get Back:**
```json
{
  "reply": "The current NPA percentage is 3.2%, which is within the acceptable range...",
  "conversationId": "conv-001",
  "sources": ["Loan Portfolio", "Risk Dashboard"],
  "suggestions": [
    "Show NPA trend for last 6 months",
    "Which members have highest default risk?"
  ]
}
```

**Note:** `conversationId` keeps context across multiple questions in the same conversation.

---

### `POST /ai-assistant/query`
**What it does:** Run a structured query using natural language and get back tabular data.

**Send:**
```json
{
  "query": "members with STI below 50 and active loans",
  "format": "table"
}
```

**You Get Back:** Data in a table format with column headers and rows — ready to display in the UI.

---

### `GET /ai-assistant/insights`
**What it does:** Get AI-generated proactive insights — things the AI noticed that management should pay attention to.

**Examples of insights generated:**
- "NPA has increased by 0.8% over last 3 months — 5 new accounts flagged"
- "18 members have pending KYC verifications"
- "High-risk member count has increased this week"

Each insight has: title, description, severity (Info / Warning / Critical), category, and suggested action.

---

---

# MODULE 17 — PROFILE
> *"Every user's personal account settings."*

---

### `GET /profile`
**What it does:** Get the currently logged-in user's own profile details.

**Simple Analogy:** Clicking on your profile icon to see your account info.

**You Get Back:** Name, email, phone, role, avatar, join date, last login time.

---

### `PUT /profile`
**What it does:** Update your own name, phone number, or profile picture.

**Send:**
```json
{
  "name": "Aryan Kumar",
  "phone": "9876543211",
  "avatar": "/avatars/aryan-new.jpg"
}
```

---

### `PUT /profile/change-password`
**What it does:** Change your own password. Must provide current password for verification.

**Send:**
```json
{
  "currentPassword": "Super@123",
  "newPassword": "NewSuper@456",
  "confirmPassword": "NewSuper@456"
}
```

**Errors:**
- `WRONG_PASSWORD` — Current password is incorrect
- `PASSWORD_MISMATCH` — New passwords don't match

---

---

# QUICK REFERENCE — All Endpoints

| # | Method | Endpoint | What it Does |
|---|--------|----------|-------------|
| 1 | POST | `/auth/login` | Login |
| 2 | POST | `/auth/google` | Google OAuth Login |
| 3 | POST | `/auth/register` | Register new user |
| 4 | POST | `/auth/forgot-password` | Send reset link |
| 5 | POST | `/auth/reset-password` | Reset password |
| 6 | POST | `/auth/logout` | Logout |
| 7 | GET | `/members` | List all members |
| 8 | GET | `/members/{id}` | Get one member |
| 9 | POST | `/members` | Add new member |
| 10 | PUT | `/members/{id}` | Update member |
| 11 | DELETE | `/members/{id}` | Deactivate member |
| 12 | GET | `/members/{id}/sti` | Get STI score |
| 13 | GET | `/chit-schemes` | List chit schemes |
| 14 | GET | `/chit-schemes/{id}` | Get scheme detail |
| 15 | POST | `/chit-schemes` | Create scheme |
| 16 | POST | `/chit-schemes/{id}/enroll` | Enroll in scheme |
| 17 | GET | `/members/{id}/chit-enrollments` | Member's enrollments |
| 18 | GET | `/chit-schemes/{id}/auctions` | List auctions |
| 19 | GET | `/auctions/{id}/live` | Live auction data |
| 20 | POST | `/auctions/{id}/bid` | Place a bid |
| 21 | POST | `/auctions/{id}/close` | Close auction |
| 22 | GET | `/loans/applications` | All loan apps |
| 23 | POST | `/loans/apply` | Apply for loan |
| 24 | PUT | `/loans/{id}/approve` | Approve loan |
| 25 | PUT | `/loans/{id}/reject` | Reject loan |
| 26 | PUT | `/loans/{id}/disburse` | Disburse loan |
| 27 | GET | `/loans/{id}/emi-schedule` | EMI schedule |
| 28 | GET | `/loans/portfolio` | Loan portfolio |
| 29 | GET | `/loans/defaults` | Defaulted loans |
| 30 | GET | `/members/{id}/loans` | Member's loans |
| 31 | GET | `/deposits/accounts` | All deposits |
| 32 | POST | `/deposits/accounts` | Open deposit |
| 33 | GET | `/deposits/schemes` | Deposit schemes |
| 34 | GET | `/deposits/maturity-tracker` | Maturing deposits |
| 35 | GET | `/members/{id}/deposits` | Member's deposits |
| 36 | GET | `/collections/dashboard` | Collections KPIs |
| 37 | GET | `/collections/schedule` | Payment schedule |
| 38 | GET | `/collections/overdue` | Overdue payments |
| 39 | POST | `/collections/{id}/record-payment` | Record collection |
| 40 | POST | `/members/{id}/make-payment` | Self-service payment |
| 41 | GET | `/members/{id}/payments` | Payment history |
| 42 | GET | `/collections/recovery` | Recovery cases |
| 43 | GET | `/compliance/dashboard` | Compliance score |
| 44 | GET | `/compliance/checklist` | Rules checklist |
| 45 | GET | `/compliance/kyc-monitoring` | KYC status |
| 46 | GET | `/compliance/aml-monitoring` | AML alerts |
| 47 | GET | `/compliance/regulatory-filings` | Filing status |
| 48 | GET | `/compliance/audit-logs` | Audit trail |
| 49 | GET | `/fraud/dashboard` | Fraud KPIs |
| 50 | GET | `/fraud/cases` | Fraud cases |
| 51 | PUT | `/fraud/cases/{id}` | Update fraud case |
| 52 | GET | `/fraud/patterns` | Fraud patterns |
| 53 | GET | `/ai-risk/dashboard` | AI agents status |
| 54 | GET | `/ai-risk/member-risk/{id}` | Member risk score |
| 55 | GET | `/ai-risk/liquidity` | Liquidity monitor |
| 56 | GET | `/ai-risk/transaction-anomalies` | Anomalies |
| 57 | GET | `/notifications` | Get notifications |
| 58 | PUT | `/notifications/{id}/read` | Mark one read |
| 59 | PUT | `/notifications/read-all` | Mark all read |
| 60 | GET | `/reports/financial-summary` | Financial report |
| 61 | GET | `/reports/member-growth` | Growth report |
| 62 | GET | `/reports/loan-portfolio` | Loan report |
| 63 | POST | `/reports/generate` | Generate PDF/Excel |
| 64 | GET | `/config` | System settings |
| 65 | PUT | `/config` | Update settings |
| 66 | GET | `/config/users` | All staff users |
| 67 | POST | `/config/users` | Create staff user |
| 68 | PUT | `/config/users/{id}` | Update user |
| 69 | GET | `/config/roles` | Roles & permissions |
| 70 | GET | `/dashboard/metrics` | KPI metrics |
| 71 | GET | `/dashboard/charts/liquidity` | Liquidity chart |
| 72 | GET | `/dashboard/charts/deposits` | Deposit chart |
| 73 | GET | `/dashboard/charts/risk-heatmap` | Risk heatmap |
| 74 | POST | `/ai-assistant/chat` | AI chat |
| 75 | POST | `/ai-assistant/query` | AI query |
| 76 | GET | `/ai-assistant/insights` | AI insights |
| 77 | GET | `/profile` | Get profile |
| 78 | PUT | `/profile` | Update profile |
| 79 | PUT | `/profile/change-password` | Change password |

---

**Total: 79 API endpoints across 17 modules**

---

*Glimmora Nidhi API — v1.0.0 | Built with FastAPI + SQLite*
