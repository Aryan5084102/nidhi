# Glimmora Nidhi — API Gap Analysis Report

**Date:** 26 March 2026
**Prepared for:** Vasuprada Chits Demo Readiness
**Total Backend Endpoints:** 96
**Total Frontend API Calls:** 72

---

## SECTION 1: FULLY CONNECTED APIs (Frontend ↔ Backend Working)

These endpoints are called from the frontend AND have a working backend implementation.

### Authentication (4/7 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 1 | `/auth/login` | POST | `lib/api.js`, `LoginPage.jsx` | ✅ Connected |
| 2 | `/auth/register` | POST | `SignupForm.jsx` | ✅ Connected |
| 3 | `/auth/forgot-password` | POST | `ForgotPasswordForm.jsx` | ✅ Connected |
| 4 | `/auth/reset-password` | POST | `ResetPasswordForm.jsx` | ✅ Connected |
| 5 | `/auth/me` | GET | `AuthContext.jsx` (session restore) | ✅ Connected |

### Members (6/6 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 6 | `/members` | GET | `useData.js → useMembers()` | ✅ Connected |
| 7 | `/members/{id}` | GET | `useData.js → useMember()` | ✅ Connected |
| 8 | `/members` | POST | `members/index.jsx` | ✅ Connected |
| 9 | `/members/{id}` | PUT | `members/index.jsx` | ✅ Connected |
| 10 | `/members/{id}` | DELETE | Not called from frontend | ⚠️ Backend only |
| 11 | `/members/{id}/sti` | GET | `useData.js → useMemberSTI()` | ✅ Connected |

### Dashboard (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 12 | `/dashboard/metrics` | GET | `useData.js → useDashboardMetrics()` | ✅ Connected |
| 13 | `/dashboard/charts/liquidity` | GET | `useData.js → useLiquidityChart()` | ✅ Connected |
| 14 | `/dashboard/charts/deposits` | GET | `useData.js → useDepositChart()` | ✅ Connected |
| 15 | `/dashboard/charts/risk-heatmap` | GET | `useData.js → useRiskHeatmap()` | ✅ Connected |

### Chit Schemes (3/3 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 16 | `/chit-schemes` | GET | `useData.js → useChitSchemes()` | ✅ Connected |
| 17 | `/chit-schemes/{id}` | GET | `useData.js → useChitScheme()` | ✅ Connected |
| 18 | `/chit-schemes` | POST | Not called from admin UI | ⚠️ Backend only |

### Chit Enrollments (7/7 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 19 | `/chit-enrollments` | GET | `useData.js → useChitEnrollments()` | ✅ Connected |
| 20 | `/chit-enrollments/{id}/approve` | PUT | `EnrollmentsTab.jsx` | ✅ Connected |
| 21 | `/chit-enrollments/{id}/reject` | PUT | `EnrollmentsTab.jsx` | ✅ Connected |
| 22 | `/chit-schemes/{id}/enroll` | POST | `EnrollmentModal.jsx` | ✅ Connected |
| 23 | `/members/{id}/chit-enrollments` | GET | `useData.js → useMemberEnrollments()` | ✅ Connected |
| 24 | `/chit-enrollments/{id}/withdraw` | PUT | Not called yet | ❌ **NEEDS FRONTEND** |
| 25 | `/chit-enrollments/{id}/deregister` | PUT | `WithdrawalTab.jsx` | ✅ Connected |

### Auctions (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 26 | `/chit-schemes/{id}/auctions` | GET | `useData.js → useSchemeAuctions()` | ✅ Connected |
| 27 | `/auctions/{id}/live` | GET | `AuctionModal.jsx` (mock) | ⚠️ Partially connected |
| 28 | `/auctions/{id}/bid` | POST | `AuctionModal.jsx` (mock) | ⚠️ Partially connected |
| 29 | `/auctions/{id}/close` | POST | Not called from UI | ⚠️ Backend only |

### Loans (9/9 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 30 | `/loans/applications` | GET | `useData.js → useLoanApplications()` | ✅ Connected |
| 31 | `/loans/apply` | POST | `ApplyLoanView.jsx` | ✅ Connected |
| 32 | `/loans/{id}/approve` | PUT | `ApprovalTab.jsx` | ✅ Connected |
| 33 | `/loans/{id}/reject` | PUT | `ApprovalTab.jsx` | ✅ Connected |
| 34 | `/loans/{id}/disburse` | PUT | Not called from UI | ⚠️ Backend only |
| 35 | `/loans/{id}/emi-schedule` | GET | `useData.js → useEMISchedule()` | ✅ Connected |
| 36 | `/loans/portfolio` | GET | `useData.js → useLoanPortfolio()` | ✅ Connected |
| 37 | `/loans/defaults` | GET | `useData.js → useLoanDefaults()` | ✅ Connected |
| 38 | `/members/{id}/loans` | GET | `useData.js → useMemberLoans()` | ✅ Connected |

### Deposits (5/5 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 39 | `/deposits/accounts` | GET | `useData.js → useDepositAccounts()` | ✅ Connected |
| 40 | `/deposits/accounts` | POST | `OpenDepositView.jsx` | ✅ Connected |
| 41 | `/deposits/schemes` | GET | `useData.js → useDepositSchemes()` | ✅ Connected |
| 42 | `/deposits/maturity-tracker` | GET | `useData.js → useMaturityTracker()` | ✅ Connected |
| 43 | `/members/{id}/deposits` | GET | `useData.js → useMemberDeposits()` | ✅ Connected |

### Collections & Payments (7/7 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 44 | `/collections/dashboard` | GET | `useData.js → useCollectionsDashboard()` | ✅ Connected |
| 45 | `/collections/schedule` | GET | `useData.js → useCollectionsSchedule()` | ✅ Connected |
| 46 | `/collections/overdue` | GET | `useData.js → useOverdueCollections()` | ✅ Connected |
| 47 | `/collections/recovery` | GET | `useData.js → useRecoveryCases()` | ✅ Connected |
| 48 | `/collections/{id}/record-payment` | POST | Not called from UI | ⚠️ Backend only |
| 49 | `/members/{id}/make-payment` | POST | `MyLoans.jsx`, `MyPayments.jsx` | ✅ Connected |
| 50 | `/members/{id}/payments` | GET | `useData.js → useMemberPayments()` | ✅ Connected |

### Compliance (6/6 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 51 | `/compliance/dashboard` | GET | `useData.js → useComplianceDashboard()` | ✅ Connected |
| 52 | `/compliance/checklist` | GET | `useData.js → useComplianceChecklist()` | ✅ Connected |
| 53 | `/compliance/kyc-monitoring` | GET | `useData.js → useKYCMonitoring()` | ✅ Connected |
| 54 | `/compliance/aml-monitoring` | GET | `useData.js → useAMLMonitoring()` | ✅ Connected |
| 55 | `/compliance/regulatory-filings` | GET | `useData.js → useRegulatoryFilings()` | ✅ Connected |
| 56 | `/compliance/audit-logs` | GET | `useData.js → useAuditLogs()` | ✅ Connected |

### Fraud Intelligence (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 57 | `/fraud/dashboard` | GET | `useData.js → useFraudDashboard()` | ✅ Connected |
| 58 | `/fraud/cases` | GET | `useData.js → useFraudCases()` | ✅ Connected |
| 59 | `/fraud/cases/{id}` | PUT | Not called from UI | ⚠️ Backend only |
| 60 | `/fraud/patterns` | GET | `useData.js → useFraudPatterns()` | ✅ Connected |

### AI Risk Control (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 61 | `/ai-risk/dashboard` | GET | `useData.js → useAgents()` | ✅ Connected |
| 62 | `/ai-risk/member-risk/{id}` | GET | `useData.js → useMemberRisk()` | ✅ Connected |
| 63 | `/ai-risk/liquidity` | GET | `useData.js → useLiquidityRisk()` | ✅ Connected |
| 64 | `/ai-risk/transaction-anomalies` | GET | `useData.js → useTransactionAnomalies()` | ✅ Connected |

### Collateral (3/3 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 65 | `/collateral/registry` | GET | `useData.js → useCollateralRegistry()` | ✅ Connected |
| 66 | `/collateral/guarantors` | GET | `useData.js → useGuarantors()` | ✅ Connected |
| 67 | `/collateral/exposure` | GET | `useData.js → useExposureAnalysis()` | ✅ Connected |

### Governance (3/3 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 68 | `/governance/board-pack` | GET | `useData.js → useBoardPack()` | ✅ Connected |
| 69 | `/governance/compliance-review` | GET | `useData.js → useComplianceReview()` | ✅ Connected |
| 70 | `/governance/audit-trail` | GET | `useData.js → useGovernanceAuditTrail()` | ✅ Connected |

### Notifications (3/3 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 71 | `/notifications` | GET | `useData.js → useNotifications()` | ✅ Connected |
| 72 | `/notifications/{id}/read` | PUT | `NotificationContext.jsx` | ✅ Connected |
| 73 | `/notifications/read-all` | PUT | `NotificationContext.jsx` | ✅ Connected |

### Reports (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 74 | `/reports/financial-summary` | GET | `useData.js → useFinancialSummary()` | ✅ Connected |
| 75 | `/reports/member-growth` | GET | `useData.js → useMemberGrowthReport()` | ✅ Connected |
| 76 | `/reports/loan-portfolio` | GET | `useData.js → useLoanPortfolioReport()` | ✅ Connected |
| 77 | `/reports/generate` | POST | Not called from UI | ⚠️ Backend only |

### Configuration (6/6 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 78 | `/config` | GET | `useData.js → useSystemConfig()` | ✅ Connected |
| 79 | `/config` | PUT | Not called from UI (Edit buttons exist) | ⚠️ Backend only |
| 80 | `/config/users` | GET | `useData.js → useUsers()` | ✅ Connected |
| 81 | `/config/users` | POST | `UserManagementTab.jsx` | ✅ Connected |
| 82 | `/config/users/{id}` | PUT | `UserManagementTab.jsx` | ✅ Connected |
| 83 | `/config/roles` | GET | `useData.js` | ✅ Connected |

### AI Assistant (3/3 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 84 | `/ai-assistant/chat` | POST | `FloatingAIButton.jsx` | ✅ Connected |
| 85 | `/ai-assistant/query` | POST | `FloatingAIButton.jsx` | ✅ Connected |
| 86 | `/ai-assistant/insights` | GET | `useData.js → useAIInsights()` | ✅ Connected |

### Profile (4/4 backend endpoints used)
| # | Endpoint | Method | Frontend File | Status |
|---|----------|--------|---------------|--------|
| 87 | `/profile` | GET | `useData.js → useProfile()` | ✅ Connected |
| 88 | `/profile` | PUT | `ProfileView.jsx` | ✅ Connected |
| 89 | `/profile/kyc-upload` | POST | `ProfileView.jsx` | ✅ Connected |
| 90 | `/profile/change-password` | PUT | `ProfileView.jsx` | ✅ Connected |

---

## SECTION 2: APIs NEEDED BUT MISSING (Frontend expects, Backend doesn't have)

These are API calls the frontend makes but the backend does NOT have an endpoint for.

| # | Endpoint Needed | Method | Called From | Current Workaround | Priority |
|---|----------------|--------|-------------|-------------------|----------|
| 1 | `/chit-enrollments/{id}/withdraw` | PUT | `WithdrawalTab.jsx` (needs button) | Backend exists, frontend button missing | **HIGH** |
| 2 | `/chit-schemes` | POST | Admin should create schemes | Backend exists, no admin UI form | MEDIUM |
| 3 | `/reports/chit-fund/collection-summary` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 4 | `/reports/chit-fund/dividend-distribution` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 5 | `/reports/chit-fund/discount-register` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 6 | `/reports/chit-fund/overdue-instalments` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 7 | `/reports/chit-fund/withdrawal-summary` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 8 | `/reports/chit-fund/registrar-return` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 9 | `/reports/chit-fund/cash-flow-projections` | GET | `ChitFundReportsTab.jsx` | Uses mock data | MEDIUM |
| 10 | `/chit-funds/draw-minutes` | GET | `DrawMinutesTab.jsx` | Uses mock data | MEDIUM |
| 11 | `/compliance/statutory-registers/subscriber` | GET | `StatutoryRegisters.jsx` | Uses mock data | LOW |
| 12 | `/compliance/statutory-registers/chit-agreement` | GET | `StatutoryRegisters.jsx` | Uses mock data | LOW |
| 13 | `/compliance/statutory-registers/draw-minutes` | GET | `StatutoryRegisters.jsx` | Uses mock data | LOW |
| 14 | `/compliance/statutory-registers/security-deposit` | GET | `StatutoryRegisters.jsx` | Uses mock data | LOW |

---

## SECTION 3: BACKEND ENDPOINTS WITH NO FRONTEND CALLER

These exist in the backend but are never called from the frontend.

| # | Endpoint | Method | Router File | Reason |
|---|----------|--------|-------------|--------|
| 1 | `/auth/google` | POST | `auth.py` | Google OAuth button exists but may not be fully wired |
| 2 | `/auth/logout` | POST | `auth.py` | Frontend does client-side logout (clears localStorage) |
| 3 | `/members/{id}` | DELETE | `members.py` | No delete button in UI |
| 4 | `/auctions/{id}/close` | POST | `auctions.py` | No close auction button in UI |
| 5 | `/loans/{id}/disburse` | PUT | `loans.py` | No disburse button in UI |
| 6 | `/collections/{id}/record-payment` | POST | `collections.py` | Admin payment recording not in UI |
| 7 | `/fraud/cases/{id}` | PUT | `fraud.py` | No case status update in UI |
| 8 | `/config` | PUT | `config.py` | Edit buttons exist but don't call API |
| 9 | `/reports/generate` | POST | `reports.py` | Generate/download buttons don't call API |

---

## SECTION 4: SUMMARY

### Connection Status
| Category | Connected | Backend Only | Needs Backend | Total |
|----------|-----------|-------------|---------------|-------|
| Auth | 5 | 2 | 0 | 7 |
| Members | 5 | 1 | 0 | 6 |
| Dashboard | 4 | 0 | 0 | 4 |
| Chit Schemes | 2 | 1 | 0 | 3 |
| Chit Enrollments | 5 | 1 | 1 | 7 |
| Auctions | 2 | 2 | 0 | 4 |
| Loans | 7 | 2 | 0 | 9 |
| Deposits | 5 | 0 | 0 | 5 |
| Collections | 5 | 1 | 0 | 7 |
| Compliance | 6 | 0 | 4 | 6+4 |
| Fraud | 3 | 1 | 0 | 4 |
| AI Risk | 4 | 0 | 0 | 4 |
| Collateral | 3 | 0 | 0 | 3 |
| Governance | 3 | 0 | 0 | 3 |
| Notifications | 3 | 0 | 0 | 3 |
| Reports | 3 | 1 | 7 | 4+7 |
| Config | 5 | 1 | 0 | 6 |
| AI Assistant | 3 | 0 | 0 | 3 |
| Profile | 4 | 0 | 0 | 4 |
| Chit Draw Minutes | 0 | 0 | 1 | 1 |
| **TOTAL** | **77** | **13** | **13** | **96+13** |

### Priority Actions Required

**HIGH PRIORITY (Demo Blockers):**
1. Wire up the "Initiate Withdrawal" button in `WithdrawalTab.jsx` to call `PUT /chit-enrollments/{id}/withdraw`

**MEDIUM PRIORITY (Functional Gaps):**
2. Build backend APIs for Chit Fund Reports (7 endpoints) — currently using mock data
3. Build backend API for Draw Minutes (`GET /chit-funds/draw-minutes`) — currently mock data
4. Add "Create Scheme" form in admin UI calling `POST /chit-schemes`

**LOW PRIORITY (Nice to Have):**
5. Build backend APIs for Statutory Registers (4 endpoints) — currently mock data
6. Wire up Config "Edit" buttons to call `PUT /config`
7. Add "Close Auction" button calling `POST /auctions/{id}/close`
8. Add "Disburse Loan" button calling `PUT /loans/{id}/disburse`
9. Wire up "Generate Report" / "Export PDF" buttons to `POST /reports/generate`

---

*Generated by Comet AI | 26 March 2026*
