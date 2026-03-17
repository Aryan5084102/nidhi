/**
 * REST API Endpoint Reference for Glimmora Nidhi Backend
 * ======================================================
 * This file defines all required API endpoints for the backend developer.
 * Each endpoint includes: method, path, description, request body, and response format.
 *
 * Base URL: /api/v1
 * Auth: All endpoints (except auth) require Bearer token in Authorization header.
 */

export const API_BASE = "/api/v1";

export const ENDPOINTS = {
  // ─── Authentication ─────────────────────────────────────────────────────
  AUTH: {
    LOGIN: {
      method: "POST",
      path: "/auth/login",
      description: "Authenticate user and return JWT token",
      body: { email: "string", password: "string" },
      response: { token: "string", refreshToken: "string", user: { id: "string", name: "string", email: "string", role: "string", memberId: "string|null" } },
    },
    REGISTER: {
      method: "POST",
      path: "/auth/register",
      description: "Register new user account",
      body: { fullName: "string", email: "string", phone: "string", password: "string", role: "member|branch_manager|admin" },
      response: { success: "boolean", message: "string" },
    },
    LOGOUT: { method: "POST", path: "/auth/logout", description: "Invalidate user session", body: {}, response: { success: "boolean" } },
    REFRESH_TOKEN: { method: "POST", path: "/auth/refresh-token", description: "Refresh JWT token", body: { refreshToken: "string" }, response: { token: "string", refreshToken: "string" } },
    ME: { method: "GET", path: "/auth/me", description: "Get current user profile", response: { id: "string", name: "string", email: "string", role: "string", memberId: "string|null", phone: "string" } },
    CHANGE_PASSWORD: { method: "POST", path: "/auth/change-password", description: "Change user password", body: { currentPassword: "string", newPassword: "string" } },
    FORGOT_PASSWORD: { method: "POST", path: "/auth/forgot-password", description: "Send OTP for password reset", body: { email: "string" } },
    RESET_PASSWORD: { method: "POST", path: "/auth/reset-password", description: "Reset password with OTP", body: { email: "string", otp: "string", newPassword: "string" } },
    GOOGLE_AUTH: { method: "POST", path: "/auth/google", description: "Authenticate with Google OAuth token", body: { credential: "string" } },
  },

  // ─── Members ────────────────────────────────────────────────────────────
  MEMBERS: {
    LIST: { method: "GET", path: "/members", description: "List all members with pagination & filters", query: "?page=1&limit=20&risk=Low|Medium|High&search=name&status=Active|Inactive&kyc=Verified|Pending|Review", response: { data: "Member[]", total: "number", page: "number", limit: "number" } },
    GET: { method: "GET", path: "/members/:id", description: "Get single member by ID", response: "Member" },
    CREATE: { method: "POST", path: "/members", description: "Create new member", body: { name: "string", phone: "string", email: "string", address: "string", riskLevel: "Low|Medium|High", kycStatus: "Pending|Verified|Review" } },
    UPDATE: { method: "PUT", path: "/members/:id", description: "Update member details", body: "Partial<Member>" },
    DELETE: { method: "DELETE", path: "/members/:id", description: "Soft delete a member" },
    KYC_VERIFY: { method: "POST", path: "/members/:id/kyc-verify", description: "Submit/verify KYC documents", body: { documents: "File[]", verificationType: "aadhaar|pan|address" } },
    TRANSACTIONS: { method: "GET", path: "/members/:id/transactions", description: "Get member transaction history", query: "?type=loan|deposit|chit|payment&from=date&to=date" },
    DOCUMENTS: { method: "GET", path: "/members/:id/documents", description: "Get member uploaded documents" },
    UPLOAD_DOCUMENT: { method: "POST", path: "/members/:id/documents", description: "Upload document for member", body: "FormData(file, type)" },
    STI_HISTORY: { method: "GET", path: "/members/:id/sti-history", description: "Get STI score history for member" },
  },

  // ─── Loans ──────────────────────────────────────────────────────────────
  LOANS: {
    LIST: { method: "GET", path: "/loans", description: "List all loan applications", query: "?status=Pending|Approved|Disbursed|Rejected&memberId=M-1001&page=1&limit=20" },
    GET: { method: "GET", path: "/loans/:id", description: "Get loan application details" },
    CREATE: { method: "POST", path: "/loans", description: "Submit new loan application", body: { memberId: "string", amount: "number", purpose: "string", tenure: "number" } },
    UPDATE: { method: "PUT", path: "/loans/:id", description: "Update loan application" },
    APPROVE: { method: "POST", path: "/loans/:id/approve", description: "Approve loan application (Loan Officer+)", body: { approvedAmount: "number", interestRate: "number", remarks: "string" } },
    REJECT: { method: "POST", path: "/loans/:id/reject", description: "Reject loan application", body: { reason: "string" } },
    DISBURSE: { method: "POST", path: "/loans/:id/disburse", description: "Disburse approved loan", body: { disbursementDate: "date", bankDetails: "object" } },
    REPAYMENT_SCHEDULE: { method: "GET", path: "/loans/:id/repayment-schedule", description: "Get EMI schedule for a loan" },
    REPAY: { method: "POST", path: "/loans/:id/repay", description: "Record EMI payment", body: { amount: "number", paymentMethod: "string", transactionId: "string" } },
    PAYMENT_HISTORY: { method: "GET", path: "/loans/:id/payments", description: "Get payment history for loan" },
    PORTFOLIO: { method: "GET", path: "/loans/portfolio/summary", description: "Get loan portfolio summary (admin)" },
    DEFAULTS: { method: "GET", path: "/loans/defaults", description: "Get defaulted loans list" },
  },

  // ─── Deposits ───────────────────────────────────────────────────────────
  DEPOSITS: {
    LIST: { method: "GET", path: "/deposits", description: "List all deposit accounts", query: "?type=FD|RD|Savings&status=Active|Matured&memberId=M-1001" },
    GET: { method: "GET", path: "/deposits/:id", description: "Get deposit account details" },
    CREATE: { method: "POST", path: "/deposits", description: "Open new deposit account", body: { memberId: "string", type: "FD|RD|Savings", amount: "number", tenure: "number" } },
    UPDATE: { method: "PUT", path: "/deposits/:id", description: "Update deposit account" },
    CLOSE: { method: "POST", path: "/deposits/:id/close", description: "Close/premature close deposit" },
    RENEW: { method: "POST", path: "/deposits/:id/renew", description: "Renew matured deposit", body: { tenure: "number", amount: "number" } },
    SCHEMES: { method: "GET", path: "/deposit-schemes", description: "Get available deposit schemes" },
    UPDATE_SCHEME: { method: "PUT", path: "/deposit-schemes/:id", description: "Update deposit scheme config" },
    MATURITY_SCHEDULE: { method: "GET", path: "/deposits/maturity-schedule", description: "Get upcoming maturity schedule", query: "?days=30|60|90" },
    SUMMARY: { method: "GET", path: "/deposits/summary", description: "Get deposit summary/analytics" },
  },

  // ─── Chit Funds ─────────────────────────────────────────────────────────
  CHIT_FUNDS: {
    LIST_SCHEMES: { method: "GET", path: "/chit-schemes", description: "List all chit fund schemes", query: "?status=Open|Full|Closed" },
    GET_SCHEME: { method: "GET", path: "/chit-schemes/:id", description: "Get chit scheme details" },
    CREATE_SCHEME: { method: "POST", path: "/chit-schemes", description: "Create new chit scheme (admin)", body: { name: "string", monthlyAmount: "number", duration: "number", totalMembers: "number", minSTI: "number" } },
    UPDATE_SCHEME: { method: "PUT", path: "/chit-schemes/:id", description: "Update chit scheme" },
    SUBSCRIBERS: { method: "GET", path: "/chit-schemes/:id/subscribers", description: "List subscribers for a scheme" },
    ENROLL: { method: "POST", path: "/chit-schemes/:id/enroll", description: "Enroll member in scheme", body: { memberId: "string" } },
    UNENROLL: { method: "POST", path: "/chit-schemes/:id/unenroll", description: "Remove member from scheme", body: { memberId: "string", reason: "string" } },
    AUCTIONS: { method: "GET", path: "/chit-schemes/:id/auctions", description: "List all auctions for scheme" },
    START_AUCTION: { method: "POST", path: "/chit-schemes/:id/auctions", description: "Start new auction for scheme" },
    PLACE_BID: { method: "POST", path: "/chit-schemes/:id/auctions/:auctionId/bid", description: "Place bid in auction", body: { memberId: "string", amount: "number" } },
    AUCTION_RESULT: { method: "GET", path: "/chit-schemes/:id/auctions/:auctionId/result", description: "Get auction result" },
  },

  // ─── Collections ────────────────────────────────────────────────────────
  COLLECTIONS: {
    LIST: { method: "GET", path: "/collections", description: "List all collection records", query: "?status=Pending|Collected|Overdue&memberId=M-1001" },
    GET: { method: "GET", path: "/collections/:id", description: "Get collection details" },
    RECORD_PAYMENT: { method: "POST", path: "/collections/:id/payment", description: "Record payment collection", body: { amount: "number", method: "cash|upi|bank_transfer|auto_debit", transactionId: "string" } },
    SCHEDULE: { method: "GET", path: "/collections/schedule", description: "Get payment collection schedule", query: "?from=date&to=date" },
    OVERDUE: { method: "GET", path: "/collections/overdue", description: "List overdue collections" },
    RECOVERY_ACTION: { method: "POST", path: "/collections/:id/recovery", description: "Initiate recovery action", body: { actionType: "reminder|notice|legal", notes: "string" } },
    ANALYTICS: { method: "GET", path: "/collections/analytics", description: "Get collection analytics" },
  },

  // ─── Compliance ─────────────────────────────────────────────────────────
  COMPLIANCE: {
    DASHBOARD: { method: "GET", path: "/compliance/dashboard", description: "Get compliance dashboard data" },
    CHECKLIST: { method: "GET", path: "/compliance/checklist", description: "Get compliance checklist items" },
    UPDATE_ITEM: { method: "PUT", path: "/compliance/checklist/:id", description: "Update compliance item status" },
    KYC_STATUS: { method: "GET", path: "/compliance/kyc-status", description: "Get KYC verification status overview" },
    AML_CHECK: { method: "POST", path: "/compliance/aml-check", description: "Run AML check on member", body: { memberId: "string" } },
    FILINGS: { method: "GET", path: "/compliance/filings", description: "Get regulatory filing status" },
    SUBMIT_FILING: { method: "POST", path: "/compliance/filings/:formId/submit", description: "Submit regulatory filing" },
    ALERTS: { method: "GET", path: "/compliance/alerts", description: "Get compliance alerts" },
    SCORE: { method: "GET", path: "/compliance/score", description: "Get compliance score breakdown" },
  },

  // ─── Risk & Fraud ──────────────────────────────────────────────────────
  RISK: {
    DASHBOARD: { method: "GET", path: "/risk/dashboard", description: "Get risk control dashboard" },
    ASSESSMENT: { method: "GET", path: "/risk/assessment/:memberId", description: "Get risk assessment for member" },
    ALERTS: { method: "GET", path: "/risk/alerts", description: "Get active risk alerts" },
    RESOLVE_ALERT: { method: "POST", path: "/risk/alerts/:id/resolve", description: "Resolve risk alert", body: { resolution: "string", action: "string" } },
  },
  FRAUD: {
    DASHBOARD: { method: "GET", path: "/fraud/dashboard", description: "Get fraud intelligence dashboard" },
    CASES: { method: "GET", path: "/fraud/cases", description: "List fraud cases", query: "?status=Open|Investigating|Resolved&severity=Critical|High|Medium" },
    GET_CASE: { method: "GET", path: "/fraud/cases/:id", description: "Get fraud case details" },
    UPDATE_CASE: { method: "PUT", path: "/fraud/cases/:id", description: "Update fraud case status", body: { status: "string", notes: "string" } },
    PATTERNS: { method: "GET", path: "/fraud/patterns", description: "Get detected fraud patterns" },
    METRICS: { method: "GET", path: "/fraud/metrics", description: "Get fraud metrics summary" },
  },

  // ─── Reports ────────────────────────────────────────────────────────────
  REPORTS: {
    LIST: { method: "GET", path: "/reports", description: "List available reports" },
    FINANCIAL: { method: "GET", path: "/reports/financial", description: "Get financial summary report", query: "?period=monthly|quarterly|yearly&from=date&to=date" },
    LOANS: { method: "GET", path: "/reports/loans", description: "Get loan portfolio report" },
    DEPOSITS: { method: "GET", path: "/reports/deposits", description: "Get deposit analytics report" },
    MEMBERS: { method: "GET", path: "/reports/members", description: "Get member growth report" },
    COMPLIANCE: { method: "GET", path: "/reports/compliance", description: "Get compliance report" },
    EXPORT_PDF: { method: "POST", path: "/reports/:id/export/pdf", description: "Export report as PDF" },
    EXPORT_CSV: { method: "POST", path: "/reports/:id/export/csv", description: "Export report as CSV" },
    KPIS: { method: "GET", path: "/reports/kpis", description: "Get KPI summary" },
  },

  // ─── Configuration ─────────────────────────────────────────────────────
  CONFIG: {
    GET: { method: "GET", path: "/config", description: "Get all system configuration" },
    UPDATE: { method: "PUT", path: "/config", description: "Update system configuration", body: { key: "string", value: "string" } },
    SYSTEM_STATUS: { method: "GET", path: "/config/system-status", description: "Get system health status" },
  },

  // ─── User Management ───────────────────────────────────────────────────
  USERS: {
    LIST: { method: "GET", path: "/users", description: "List all users (admin)", query: "?role=admin|branch_manager|member" },
    GET: { method: "GET", path: "/users/:id", description: "Get user details" },
    CREATE: { method: "POST", path: "/users", description: "Create user (admin)", body: { name: "string", email: "string", phone: "string", role: "string", password: "string" } },
    UPDATE: { method: "PUT", path: "/users/:id", description: "Update user (admin)" },
    DELETE: { method: "DELETE", path: "/users/:id", description: "Deactivate user (admin)" },
    UPDATE_ROLE: { method: "PUT", path: "/users/:id/role", description: "Change user role (admin)", body: { role: "string" } },
  },

  // ─── Roles & Permissions ───────────────────────────────────────────────
  ROLES: {
    LIST: { method: "GET", path: "/roles", description: "List all roles with permissions" },
    GET: { method: "GET", path: "/roles/:id", description: "Get role details with permissions" },
    UPDATE: { method: "PUT", path: "/roles/:id", description: "Update role permissions" },
  },

  // ─── Audit Log ─────────────────────────────────────────────────────────
  AUDIT: {
    LIST: { method: "GET", path: "/audit-logs", description: "List audit log entries", query: "?action=string&user=string&from=date&to=date&page=1&limit=50" },
  },

  // ─── Notifications ─────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST: { method: "GET", path: "/notifications", description: "Get user notifications", query: "?read=true|false&page=1&limit=20" },
    MARK_READ: { method: "POST", path: "/notifications/:id/read", description: "Mark notification as read" },
    MARK_ALL_READ: { method: "POST", path: "/notifications/mark-all-read", description: "Mark all notifications as read" },
    DELETE: { method: "DELETE", path: "/notifications/:id", description: "Delete notification" },
    PREFERENCES: { method: "GET", path: "/notifications/preferences", description: "Get notification preferences" },
    UPDATE_PREFERENCES: { method: "PUT", path: "/notifications/preferences", description: "Update notification preferences", body: { sms: "boolean", email: "boolean", whatsapp: "boolean", push: "boolean" } },
  },

  // ─── AI Features ───────────────────────────────────────────────────────
  AI: {
    CHAT: { method: "POST", path: "/ai/chat", description: "Send message to AI assistant", body: { message: "string", context: "string" } },
    QUERY: { method: "POST", path: "/ai/query", description: "Run structured AI query", body: { queryType: "string", parameters: "object" } },
    GENERATE_REPORT: { method: "POST", path: "/ai/generate-report", description: "Generate AI-powered report", body: { reportType: "string", dateRange: "object" } },
    INSIGHTS: { method: "GET", path: "/ai/insights", description: "Get AI-generated insights" },
    RISK_EXPLAIN: { method: "POST", path: "/ai/risk-explain", description: "Get AI explanation for risk score", body: { memberId: "string" } },
    AGENTS_STATUS: { method: "GET", path: "/ai/agents", description: "Get AI agent status" },
    AGENT_ACTION: { method: "POST", path: "/ai/agents/:agentId/action", description: "Trigger agent action", body: { action: "start|stop|restart" } },
  },

  // ─── Dashboard ─────────────────────────────────────────────────────────
  DASHBOARD: {
    EXECUTIVE: { method: "GET", path: "/dashboard/executive", description: "Get executive dashboard metrics" },
    MEMBER: { method: "GET", path: "/dashboard/member/:memberId", description: "Get member dashboard data" },
    METRICS: { method: "GET", path: "/dashboard/metrics", description: "Get key metrics for dashboard cards" },
    CHARTS: { method: "GET", path: "/dashboard/charts", description: "Get chart data for dashboard", query: "?type=liquidity|deposits|loans|fraud&period=6m|1y" },
  },
};

/**
 * Helper to build full API URL
 * @param {string} path - Endpoint path (e.g., "/members")
 * @param {Object} params - URL params to replace (e.g., { id: "M-1001" })
 * @returns {string} Full URL
 */
export function buildUrl(path, params = {}) {
  let url = `${API_BASE}${path}`;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
}

/**
 * Example API call helper (for backend dev reference)
 *
 * const response = await fetch(buildUrl("/members/:id", { id: "M-1001" }), {
 *   method: "GET",
 *   headers: {
 *     "Authorization": `Bearer ${token}`,
 *     "Content-Type": "application/json",
 *   },
 * });
 */
