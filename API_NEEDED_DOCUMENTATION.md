# Glimmora Nidhi — Required API Documentation

**Date:** 26 March 2026
**Total APIs Needed:** 14
**Status:** All currently served by frontend mock data — backend endpoints to be built

---

## HIGH PRIORITY

---

### API 1: Initiate Enrollment Withdrawal

> Backend endpoint exists (`PUT /chit-enrollments/{id}/withdraw`), but frontend "Initiate Withdrawal" button is not wired.

**Endpoint:** `PUT /api/v1/chit-enrollments/{enrollment_id}/withdraw`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/chit-funds/WithdrawalTab.jsx`

#### Request

```
PUT /api/v1/chit-enrollments/EN-006/withdraw
Authorization: Bearer <jwt_token>
Content-Type: application/json

No request body required
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enrollment_id` | string | Yes | Enrollment ID (e.g., `EN-006`) |

#### Response — 200 OK

```json
{
  "success": true,
  "message": "Enrollment withdrawn successfully",
  "data": {
    "totalPaid": 200000,
    "commissionDeducted": 10000,
    "refundAmount": 190000,
    "deregistrationStatus": "Pending Deregistration"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalPaid` | float | Total amount paid by subscriber till date |
| `commissionDeducted` | float | 5% foreman commission deducted from total paid |
| `refundAmount` | float | Net refund = totalPaid - commissionDeducted |
| `deregistrationStatus` | string | Always `"Pending Deregistration"` on withdraw |

#### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 404 | `NOT_FOUND` | Enrollment ID does not exist |
| 400 | `INVALID_STATUS` | Enrollment is not Active (already withdrawn/cancelled) |

---

## MEDIUM PRIORITY — Chit Fund Reports

---

### API 2: Scheme-wise Collection Summary

**Endpoint:** `GET /api/v1/reports/chit-fund/collection-summary`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/collection-summary?month=3&year=2026
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `month` | int | No | Current month | Month number (1-12) |
| `year` | int | No | Current year | Year (e.g., 2026) |
| `bracket` | string | No | All | Filter by bracket: `Low`, `Medium`, `Upper Medium`, `High` |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "period": "March 2026",
    "summary": {
      "totalExpected": 8240000,
      "totalCollected": 7775000,
      "totalShortfall": 465000,
      "overallCollectionPct": 94.3
    },
    "schemes": [
      {
        "schemeId": "CS-001",
        "schemeName": "Vasuprada Sahaya 2L",
        "bracket": "Low",
        "expected": 200000,
        "collected": 180000,
        "shortfall": 20000,
        "collectionPct": 90.0,
        "subscribersPaid": 18,
        "subscribersTotal": 20,
        "defaulters": 2
      },
      {
        "schemeId": "CS-003",
        "schemeName": "Vasuprada Samruddhi 10L",
        "bracket": "Medium",
        "expected": 750000,
        "collected": 700000,
        "shortfall": 50000,
        "collectionPct": 93.3,
        "subscribersPaid": 14,
        "subscribersTotal": 15,
        "defaulters": 1
      }
    ]
  }
}
```

#### Response Fields — `schemes[]`

| Field | Type | Description |
|-------|------|-------------|
| `schemeId` | string | Scheme identifier |
| `schemeName` | string | Full scheme name |
| `bracket` | string | Bracket classification: Low / Medium / Upper Medium / High |
| `expected` | float | Expected collection = monthlyAmount × enrolledMembers |
| `collected` | float | Actual amount collected this period |
| `shortfall` | float | expected - collected |
| `collectionPct` | float | (collected / expected) × 100 |
| `subscribersPaid` | int | Number of subscribers who paid this month |
| `subscribersTotal` | int | Total enrolled subscribers |
| `defaulters` | int | Subscribers who did not pay |

---

### API 3: Dividend Distribution Report

**Endpoint:** `GET /api/v1/reports/chit-fund/dividend-distribution`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/dividend-distribution?schemeId=CS-003
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All schemes | Filter by specific scheme |
| `cycle` | int | No | All cycles | Filter by specific cycle/month number |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "schemeId": "CS-003",
    "schemeName": "Vasuprada Samruddhi 10L",
    "totalCycles": 4,
    "distributions": [
      {
        "cycle": 1,
        "drawDate": "2025-12-10",
        "potSize": 1000000,
        "winnerMemberId": "M-1002",
        "winnerName": "Priya Mehta",
        "winningBid": 780000,
        "foremanCommission": 50000,
        "discount": 170000,
        "dividendPerSubscriber": 11333,
        "totalSubscribers": 15,
        "payoutMethod": "Auction"
      },
      {
        "cycle": 2,
        "drawDate": "2026-01-10",
        "potSize": 1000000,
        "winnerMemberId": "M-1007",
        "winnerName": "Neha Singh",
        "winningBid": 820000,
        "foremanCommission": 50000,
        "discount": 130000,
        "dividendPerSubscriber": 8667,
        "totalSubscribers": 15,
        "payoutMethod": "Auction"
      }
    ]
  }
}
```

#### Response Fields — `distributions[]`

| Field | Type | Description |
|-------|------|-------------|
| `cycle` | int | Cycle/month number in the scheme |
| `drawDate` | string | Date of draw/auction (ISO format) |
| `potSize` | float | Total pot size for the cycle |
| `winnerMemberId` | string | Member ID of the winner |
| `winnerName` | string | Name of the winner |
| `winningBid` | float | Winning bid amount (for auction) or pot size (for lucky draw) |
| `foremanCommission` | float | 5% foreman commission amount |
| `discount` | float | potSize - winningBid - foremanCommission |
| `dividendPerSubscriber` | float | discount / totalSubscribers |
| `totalSubscribers` | int | Number of enrolled subscribers |
| `payoutMethod` | string | `Auction` or `Lucky Draw` |

---

### API 4: Auction Discount Register

**Endpoint:** `GET /api/v1/reports/chit-fund/discount-register`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/discount-register?schemeId=CS-005
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All schemes | Filter by scheme |
| `from` | string | No | — | Start date (ISO format) |
| `to` | string | No | — | End date (ISO format) |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "totalAuctions": 12,
    "avgDiscountPct": 22.5,
    "maxDiscountPct": 34.8,
    "complianceViolations": 0,
    "auctions": [
      {
        "auctionId": "AUC-001",
        "schemeId": "CS-005",
        "schemeName": "Vasuprada Unnati 15L",
        "date": "2026-03-15",
        "potSize": 1500000,
        "winningBid": 1050000,
        "foremanCommission": 75000,
        "discountAmount": 375000,
        "discountPct": 25.0,
        "maxAllowedPct": 35.0,
        "compliance": "Within Limit",
        "winnerMemberId": "M-1009",
        "winnerName": "Suresh Babu"
      }
    ]
  }
}
```

#### Response Fields — `auctions[]`

| Field | Type | Description |
|-------|------|-------------|
| `auctionId` | string | Auction identifier |
| `schemeId` | string | Scheme identifier |
| `schemeName` | string | Scheme name |
| `date` | string | Auction date |
| `potSize` | float | Total pot size |
| `winningBid` | float | Winning bid amount |
| `foremanCommission` | float | Commission deducted |
| `discountAmount` | float | potSize - winningBid |
| `discountPct` | float | (discountAmount / potSize) × 100 |
| `maxAllowedPct` | float | Max discount cap configured for this scheme |
| `compliance` | string | `Within Limit` or `Exceeded Cap` |
| `winnerMemberId` | string | Winner member ID |
| `winnerName` | string | Winner name |

---

### API 5: Subscriber Overdue Instalment Report

**Endpoint:** `GET /api/v1/reports/chit-fund/overdue-instalments`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/overdue-instalments
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All | Filter by scheme |
| `severity` | string | No | All | `1_month`, `2_months`, `3_plus_months` |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "totalOverdue": 5,
    "totalOverdueAmount": 340000,
    "overdueMembers": [
      {
        "memberId": "M-1003",
        "memberName": "Vikram Nair",
        "phone": "9876543212",
        "schemeId": "CS-002",
        "schemeName": "Vasuprada Sahaya 5L",
        "monthlyAmount": 20000,
        "missedInstalments": 3,
        "totalOverdue": 60000,
        "lastPaidDate": "2025-12-20",
        "stiScore": 45,
        "riskLevel": "High",
        "status": "Overdue"
      },
      {
        "memberId": "M-1008",
        "memberName": "Meera Reddy",
        "phone": "9876543217",
        "schemeId": "CS-001",
        "schemeName": "Vasuprada Sahaya 2L",
        "monthlyAmount": 10000,
        "missedInstalments": 1,
        "totalOverdue": 10000,
        "lastPaidDate": "2026-02-15",
        "stiScore": 58,
        "riskLevel": "Medium",
        "status": "Overdue"
      }
    ]
  }
}
```

---

### API 6: Withdrawal & Refund Summary Report

**Endpoint:** `GET /api/v1/reports/chit-fund/withdrawal-summary`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/withdrawal-summary?from=2026-01-01&to=2026-03-31
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from` | string | No | Start of current FY | Start date (ISO) |
| `to` | string | No | Today | End date (ISO) |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "period": "01 Jan 2026 — 31 Mar 2026",
    "totalWithdrawals": 3,
    "totalCommissionDeducted": 85000,
    "totalRefunded": 520000,
    "pendingDeregistrations": 1,
    "withdrawals": [
      {
        "enrollmentId": "EN-006",
        "memberId": "M-1003",
        "memberName": "Vikram Nair",
        "schemeId": "CS-002",
        "schemeName": "Vasuprada Sahaya 5L",
        "enrolledDate": "2025-10-01",
        "withdrawalDate": "2026-03-15",
        "totalPaid": 200000,
        "commissionDeducted": 50000,
        "refundAmount": 150000,
        "deregistrationStatus": "Pending Deregistration",
        "registrarNotified": false,
        "refundStatus": "Pending"
      }
    ]
  }
}
```

---

### API 7: Registrar Return Format Report

**Endpoint:** `GET /api/v1/reports/chit-fund/registrar-return`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/registrar-return?schemeId=CS-003&quarter=Q3&year=2026
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | Yes | — | Scheme ID |
| `quarter` | string | No | Current | `Q1`, `Q2`, `Q3`, `Q4` |
| `year` | int | No | Current year | Year |
| `format` | string | No | `json` | `json` or `pdf` |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "schemeId": "CS-003",
    "schemeName": "Vasuprada Samruddhi 10L",
    "registrationNo": "RoC/TS/2025/A003",
    "quarter": "Q3 FY 2025-26",
    "filingDate": null,
    "foremanName": "Glimmora Nidhi Limited",
    "totalSubscribers": 15,
    "totalChitValue": 1000000,
    "duration": 20,
    "monthlySubscription": 50000,
    "drawsConducted": 4,
    "prizesDistributed": 3200000,
    "commissionEarned": 200000,
    "defaulters": 1,
    "defaultAmount": 50000,
    "withdrawals": 0,
    "newEnrollments": 2,
    "balanceInHand": 450000,
    "securityDeposit": 500000,
    "complianceStatus": "Compliant",
    "downloadUrl": null
  }
}
```

---

### API 8: Cash Flow Projections

**Endpoint:** `GET /api/v1/reports/chit-fund/cash-flow-projections`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/reports/ChitFundReportsTab.jsx`

#### Request

```
GET /api/v1/reports/chit-fund/cash-flow-projections?months=6
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `months` | int | No | 6 | Number of months to project (1-12) |
| `schemeId` | string | No | All | Filter by scheme |

#### Response — 200 OK

```json
{
  "success": true,
  "data": {
    "projectionMonths": 6,
    "totalExpectedCollections": 49440000,
    "totalExpectedPayouts": 30500000,
    "netCashFlow": 18940000,
    "monthly": [
      {
        "month": "Apr 2026",
        "expectedCollection": 8240000,
        "expectedPayout": 5000000,
        "netFlow": 3240000,
        "cumulativeFlow": 3240000,
        "schemesWithPayout": ["CS-003", "CS-005"]
      },
      {
        "month": "May 2026",
        "expectedCollection": 8240000,
        "expectedPayout": 5500000,
        "netFlow": 2740000,
        "cumulativeFlow": 5980000,
        "schemesWithPayout": ["CS-006", "CS-007"]
      }
    ]
  }
}
```

---

### API 9: Draw Minutes

**Endpoint:** `GET /api/v1/chit-funds/draw-minutes`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/chit-funds/DrawMinutesTab.jsx`

#### Request

```
GET /api/v1/chit-funds/draw-minutes?type=Lucky+Draw&limit=50
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All | Filter by scheme |
| `type` | string | No | All | `Lucky Draw` or `Auction` |
| `status` | string | No | All | `Recorded` or `Scheduled` |
| `page` | int | No | 1 | Page number |
| `limit` | int | No | 50 | Items per page |

#### Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "DM-001",
      "schemeId": "CS-001",
      "schemeName": "Vasuprada Sahaya 2L",
      "drawDate": "2026-03-05",
      "type": "Lucky Draw",
      "winnerMemberId": "M-1001",
      "winnerName": "Rajesh Kumar",
      "amountDisbursed": 185000,
      "discountOffered": null,
      "ticketDrawn": "Ticket #14",
      "witnesses": "Anita Desai, Suresh Babu",
      "approvedBy": "Aryan Kumar",
      "status": "Recorded",
      "createdAt": "2026-03-05T10:30:00Z"
    },
    {
      "id": "DM-003",
      "schemeId": "CS-003",
      "schemeName": "Vasuprada Samruddhi 10L",
      "drawDate": "2026-03-10",
      "type": "Auction",
      "winnerMemberId": "M-1002",
      "winnerName": "Priya Mehta",
      "amountDisbursed": 780000,
      "discountOffered": 22.0,
      "ticketDrawn": null,
      "witnesses": "Anita Desai, Arun Pillai",
      "approvedBy": "Aryan Kumar",
      "status": "Recorded",
      "createdAt": "2026-03-10T14:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 6,
    "totalPages": 1
  }
}
```

#### Response Fields — `data[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Draw minutes ID (e.g., `DM-001`) |
| `schemeId` | string | Scheme identifier |
| `schemeName` | string | Scheme name |
| `drawDate` | string | Date of draw (ISO format) |
| `type` | string | `Lucky Draw` or `Auction` |
| `winnerMemberId` | string | Winner member ID (null if Scheduled) |
| `winnerName` | string | Winner name (null if Scheduled) |
| `amountDisbursed` | float | Amount given to winner (0 if Scheduled) |
| `discountOffered` | float \| null | Discount % for auction, null for lucky draw |
| `ticketDrawn` | string \| null | Ticket number for lucky draw, null for auction |
| `witnesses` | string | Comma-separated witness names |
| `approvedBy` | string | Name of approver |
| `status` | string | `Recorded` or `Scheduled` |
| `createdAt` | string | ISO timestamp |

---

## LOW PRIORITY — Statutory Register APIs

---

### API 10: Subscriber Register

**Endpoint:** `GET /api/v1/compliance/statutory-registers/subscriber`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/compliance/StatutoryRegisters.jsx`

#### Request

```
GET /api/v1/compliance/statutory-registers/subscriber?schemeId=CS-001
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All | Filter by scheme |

#### Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "sl": 1,
      "memberId": "M-1001",
      "name": "Rajesh Kumar",
      "address": "12, MG Road, Bengaluru",
      "phone": "9876543210",
      "dateOfAdmission": "2025-01-15",
      "schemesEnrolled": 2,
      "nominee": "Priya Kumar",
      "nomineeRelation": "Spouse",
      "nomineeAadhaar": "XXXX-XXXX-1234",
      "kycStatus": "Compliant"
    }
  ],
  "lastUpdated": "2026-03-15T10:30:00Z"
}
```

---

### API 11: Chit Agreement Register

**Endpoint:** `GET /api/v1/compliance/statutory-registers/chit-agreement`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/compliance/StatutoryRegisters.jsx`

#### Request

```
GET /api/v1/compliance/statutory-registers/chit-agreement
Authorization: Bearer <jwt_token>
```

#### Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "sl": 1,
      "schemeId": "CS-001",
      "schemeName": "Vasuprada Sahaya 2L",
      "agreementDate": "2025-10-01",
      "filedWithRegistrar": true,
      "filingDate": "2025-10-10",
      "registrationNo": "RoC/TS/2025/A001",
      "potSize": 200000,
      "duration": 20,
      "totalSubscribers": 20,
      "status": "Filed"
    },
    {
      "sl": 6,
      "schemeId": "CS-008",
      "schemeName": "Vasuprada Shikhar 30L",
      "agreementDate": "2026-03-01",
      "filedWithRegistrar": false,
      "filingDate": null,
      "registrationNo": null,
      "potSize": 3000000,
      "duration": 20,
      "totalSubscribers": 20,
      "status": "Pending"
    }
  ],
  "lastUpdated": "2026-03-15T10:30:00Z"
}
```

---

### API 12: Draw Minutes Register

**Endpoint:** `GET /api/v1/compliance/statutory-registers/draw-minutes`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/compliance/StatutoryRegisters.jsx`

#### Request

```
GET /api/v1/compliance/statutory-registers/draw-minutes?schemeId=CS-001
Authorization: Bearer <jwt_token>
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `schemeId` | string | No | All | Filter by scheme |

#### Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "sl": 1,
      "drawId": "DM-001",
      "schemeId": "CS-001",
      "schemeName": "Vasuprada Sahaya 2L",
      "date": "2026-03-05",
      "type": "Lucky Draw",
      "winnerMemberId": "M-1001",
      "winnerName": "Rajesh Kumar",
      "amountDisbursed": 185000,
      "witnesses": "Anita Desai, Suresh Babu",
      "minutesRecorded": true,
      "status": "Recorded"
    }
  ],
  "lastUpdated": "2026-03-18T15:00:00Z"
}
```

---

### API 13: Foreman Security Deposit Register

**Endpoint:** `GET /api/v1/compliance/statutory-registers/security-deposit`
**Auth:** ADMIN, BRANCH_MANAGER
**Frontend File:** `components/views/compliance/StatutoryRegisters.jsx`

#### Request

```
GET /api/v1/compliance/statutory-registers/security-deposit
Authorization: Bearer <jwt_token>
```

#### Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "sl": 1,
      "depositType": "Fixed Deposit",
      "bankName": "State Bank of India",
      "branch": "MG Road, Hyderabad",
      "fdrNo": "FDR-2025-78901",
      "amount": 500000,
      "depositDate": "2025-09-01",
      "maturityDate": "2026-09-01",
      "filedWithRegistrar": true,
      "status": "Active"
    },
    {
      "sl": 2,
      "depositType": "Bank Guarantee",
      "bankName": "HDFC Bank",
      "branch": "Jubilee Hills, Hyderabad",
      "fdrNo": "BG-2025-34567",
      "amount": 300000,
      "depositDate": "2025-10-15",
      "maturityDate": "2026-10-15",
      "filedWithRegistrar": true,
      "status": "Active"
    }
  ],
  "totalSecurityDeposit": 800000,
  "lastUpdated": "2026-03-10T11:00:00Z"
}
```

---

### API 14: Create Chit Scheme (Admin)

> Backend exists (`POST /chit-schemes`), but no admin form in the frontend.

**Endpoint:** `POST /api/v1/chit-schemes`
**Auth:** ADMIN
**Frontend File:** Needs new "Create Scheme" form in `ChitFundsView`

#### Request

```
POST /api/v1/chit-schemes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Vasuprada Sahaya 3L",
  "monthlyAmount": 15000,
  "duration": 20,
  "totalMembers": 20,
  "description": "Entry-level chit for small savings",
  "minSTI": 50,
  "kycRequired": "Verified",
  "bracket": "Low",
  "payoutMethod": "Lucky Draw",
  "maxDiscountPct": 30.0
}
```

#### Request Body Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | — | Scheme name |
| `monthlyAmount` | float | Yes | — | Monthly subscription amount (₹) |
| `duration` | int | Yes | — | Duration in months |
| `totalMembers` | int | Yes | — | Maximum subscribers allowed |
| `description` | string | No | null | Scheme description |
| `minSTI` | int | No | 50 | Minimum STI score required |
| `kycRequired` | string | No | `Verified` | `Verified` or `Pending` |
| `bracket` | string | No | `Low` | `Low`, `Medium`, `Upper Medium`, `High` |
| `payoutMethod` | string | No | `Auction` | `Auction`, `Lucky Draw`, `Both` |
| `maxDiscountPct` | float | No | 30.0 | Max auction discount cap (%) |

#### Response — 201 Created

```json
{
  "success": true,
  "data": {
    "id": "CS-009",
    "name": "Vasuprada Sahaya 3L",
    "monthlyAmount": 15000,
    "duration": 20,
    "totalMembers": 20,
    "enrolledMembers": 0,
    "potSize": 300000,
    "nextAuction": null,
    "status": "Open",
    "description": "Entry-level chit for small savings",
    "minSTI": 50,
    "kycRequired": "Verified",
    "spotsLeft": 20,
    "bracket": "Low",
    "payoutMethod": "Lucky Draw",
    "maxDiscountPct": 30.0,
    "currentMonth": 0
  },
  "message": "Chit scheme created successfully"
}
```

#### Notes
- `potSize` is auto-calculated: `monthlyAmount × totalMembers`
- `id` is auto-generated: `CS-001`, `CS-002`, etc.

---

## COMMON RESPONSE PATTERNS

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 120,
    "totalPages": 3
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `INVALID_STATUS` | Operation not allowed for current status |
| 400 | `STI_TOO_LOW` | Member STI below scheme minimum |
| 400 | `KYC_NOT_VERIFIED` | KYC verification required |
| 400 | `SCHEME_FULL` | No spots available |
| 400 | `SCHEME_CLOSED` | Scheme not open for enrollment |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT token |
| 403 | `FORBIDDEN` | Insufficient role permissions |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `ALREADY_ENROLLED` | Member already enrolled in scheme |
| 409 | `EMAIL_EXISTS` | Email already registered |
| 422 | `VALIDATION_ERROR` | Request body validation failed |

---

## AUTHENTICATION

All endpoints (except auth routes) require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

Obtain token via `POST /api/v1/auth/login`:

```json
{
  "email": "admin@glimmora.com",
  "password": "Admin@123"
}
```

---

*Generated for Vasuprada Chits Pvt Ltd Demo | 26 March 2026*
