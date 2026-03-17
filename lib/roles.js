// ─── Role Definitions & Permissions for Glimmora Nidhi ───

export const ROLES = {
  ADMIN: "admin",
  BRANCH_MANAGER: "branch_manager",
  MEMBER: "member",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.BRANCH_MANAGER]: "Branch Manager",
  [ROLES.MEMBER]: "Member",
};

export const ROLE_COLORS = {
  [ROLES.ADMIN]: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  [ROLES.BRANCH_MANAGER]: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  [ROLES.MEMBER]: { bg: " dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-300", dot: "bg-emerald-500" },
};

// Navigation items accessible per role
export const ROLE_NAV_ACCESS = {
  [ROLES.ADMIN]: ["executive", "members", "chitfunds", "agents", "loans", "deposits", "collections", "compliance", "airisk", "fraud", "reports", "config", "collateral", "governance", "aiassistant", "profile"],
  [ROLES.BRANCH_MANAGER]: ["executive", "members", "chitfunds", "loans", "deposits", "collections", "compliance", "collateral", "reports", "profile"],
  [ROLES.MEMBER]: ["member_dashboard", "my_chitfunds", "my_loans", "my_deposits", "my_payments", "enroll_chitfund", "apply_loan", "open_deposit", "profile"],
};

// Action-level permissions
export const PERMISSIONS = {
  // Members
  VIEW_ALL_MEMBERS: "view_all_members",
  ADD_MEMBER: "add_member",
  EDIT_MEMBER: "edit_member",
  DELETE_MEMBER: "delete_member",
  // Loans
  VIEW_ALL_LOANS: "view_all_loans",
  APPROVE_LOAN: "approve_loan",
  DISBURSE_LOAN: "disburse_loan",
  // Deposits
  VIEW_ALL_DEPOSITS: "view_all_deposits",
  CREATE_DEPOSIT: "create_deposit",
  // Chit Funds
  VIEW_ALL_CHITFUNDS: "view_all_chitfunds",
  MANAGE_AUCTION: "manage_auction",
  ENROLL_CHITFUND: "enroll_chitfund",
  // Collections
  VIEW_ALL_COLLECTIONS: "view_all_collections",
  COLLECT_PAYMENT: "collect_payment",
  // Compliance & Risk
  VIEW_COMPLIANCE: "view_compliance",
  VIEW_RISK: "view_risk",
  VIEW_FRAUD: "view_fraud",
  // Config
  MANAGE_CONFIG: "manage_config",
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOG: "view_audit_log",
  // Reports
  VIEW_REPORTS: "view_reports",
  EXPORT_REPORTS: "export_reports",
  // AI
  USE_AI_ASSISTANT: "use_ai_assistant",
  // Member self-service
  VIEW_OWN_DASHBOARD: "view_own_dashboard",
  VIEW_OWN_LOANS: "view_own_loans",
  VIEW_OWN_DEPOSITS: "view_own_deposits",
  VIEW_OWN_CHITFUNDS: "view_own_chitfunds",
  APPLY_LOAN: "apply_loan",
  MAKE_PAYMENT: "make_payment",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.BRANCH_MANAGER]: [
    PERMISSIONS.VIEW_ALL_MEMBERS, PERMISSIONS.ADD_MEMBER, PERMISSIONS.EDIT_MEMBER,
    PERMISSIONS.VIEW_ALL_LOANS, PERMISSIONS.APPROVE_LOAN, PERMISSIONS.DISBURSE_LOAN,
    PERMISSIONS.VIEW_ALL_DEPOSITS, PERMISSIONS.CREATE_DEPOSIT,
    PERMISSIONS.VIEW_ALL_CHITFUNDS, PERMISSIONS.MANAGE_AUCTION, PERMISSIONS.ENROLL_CHITFUND,
    PERMISSIONS.VIEW_ALL_COLLECTIONS, PERMISSIONS.COLLECT_PAYMENT,
    PERMISSIONS.VIEW_COMPLIANCE, PERMISSIONS.VIEW_REPORTS, PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_OWN_DASHBOARD,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_OWN_DASHBOARD, PERMISSIONS.VIEW_OWN_LOANS,
    PERMISSIONS.VIEW_OWN_DEPOSITS, PERMISSIONS.VIEW_OWN_CHITFUNDS,
    PERMISSIONS.APPLY_LOAN, PERMISSIONS.MAKE_PAYMENT,
    PERMISSIONS.ENROLL_CHITFUND,
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasNavAccess(role, navId) {
  return ROLE_NAV_ACCESS[role]?.includes(navId) ?? false;
}

export function getDefaultNav(role) {
  if (role === ROLES.MEMBER) return "member_dashboard";
  return "executive";
}
