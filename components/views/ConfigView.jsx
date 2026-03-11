"use client";

import { useState } from "react";
import { systemConfig, auditLog } from "@/data/mockData";

const tabs = [
  { id: "users", label: "User Management" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "general", label: "General" },
  { id: "deposits", label: "Deposits" },
  { id: "loans", label: "Loans" },
  { id: "chitfunds", label: "Chit Funds" },
  { id: "ai", label: "AI Agent Configuration" },
  { id: "risk", label: "Risk Threshold Settings" },
  { id: "notifications", label: "Notifications" },
  { id: "system", label: "System Configuration" },
  { id: "audit", label: "Audit Log" },
];

/* ─── Inline Data: User Management ─── */
const adminUsers = [
  { id: "USR-001", name: "Arjun Mehta", email: "arjun.mehta@glimmora.in", role: "Super Admin", department: "IT", status: "Active", lastLogin: "11 Mar 2026, 09:12" },
  { id: "USR-002", name: "Priya Sharma", email: "priya.sharma@glimmora.in", role: "Admin", department: "Operations", status: "Active", lastLogin: "11 Mar 2026, 08:45" },
  { id: "USR-003", name: "Ramesh Gupta", email: "ramesh.gupta@glimmora.in", role: "Manager", department: "Branch - Jayanagar", status: "Active", lastLogin: "10 Mar 2026, 17:30" },
  { id: "USR-004", name: "Sunita Desai", email: "sunita.desai@glimmora.in", role: "Operator", department: "Loans", status: "Active", lastLogin: "11 Mar 2026, 10:05" },
  { id: "USR-005", name: "Kiran Patel", email: "kiran.patel@glimmora.in", role: "Viewer", department: "Compliance", status: "Inactive", lastLogin: "28 Feb 2026, 14:22" },
  { id: "USR-006", name: "Deepak Joshi", email: "deepak.joshi@glimmora.in", role: "Manager", department: "Branch - Koramangala", status: "Active", lastLogin: "10 Mar 2026, 16:48" },
  { id: "USR-007", name: "Anjali Reddy", email: "anjali.reddy@glimmora.in", role: "Operator", department: "Deposits", status: "Locked", lastLogin: "05 Mar 2026, 11:30" },
  { id: "USR-008", name: "Vikash Singh", email: "vikash.singh@glimmora.in", role: "Admin", department: "Risk & Fraud", status: "Active", lastLogin: "11 Mar 2026, 07:55" },
  { id: "USR-009", name: "Meera Krishnan", email: "meera.krishnan@glimmora.in", role: "Operator", department: "Chit Funds", status: "Active", lastLogin: "10 Mar 2026, 15:10" },
  { id: "USR-010", name: "Rohit Verma", email: "rohit.verma@glimmora.in", role: "Viewer", department: "Audit", status: "Inactive", lastLogin: "20 Feb 2026, 09:00" },
];

/* ─── Inline Data: Roles & Permissions ─── */
const roleDefinitions = [
  {
    name: "Super Admin", description: "Full system access with ability to manage all configurations, users, and override any restriction.", userCount: 1,
    permissions: {
      Members: ["Read", "Write", "Delete"], Loans: ["Read", "Write", "Delete"], Deposits: ["Read", "Write", "Delete"],
      "Chit Funds": ["Read", "Write", "Delete"], Compliance: ["Read", "Write", "Delete"], Reports: ["Read", "Write", "Delete"],
      Config: ["Read", "Write", "Delete"], "AI Agents": ["Read", "Write", "Delete"],
    },
  },
  {
    name: "Admin", description: "Administrative access to manage operations, users, and most configurations. Cannot delete system-level configs.", userCount: 2,
    permissions: {
      Members: ["Read", "Write", "Delete"], Loans: ["Read", "Write"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read", "Write"], Compliance: ["Read", "Write"], Reports: ["Read", "Write"],
      Config: ["Read", "Write"], "AI Agents": ["Read", "Write"],
    },
  },
  {
    name: "Branch Manager", description: "Manages branch-level operations including member onboarding, loan approvals, and deposit accounts.", userCount: 2,
    permissions: {
      Members: ["Read", "Write"], Loans: ["Read", "Write"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read", "Write"], Compliance: ["Read"], Reports: ["Read"],
      Config: ["Read"], "AI Agents": ["Read"],
    },
  },
  {
    name: "Operations", description: "Handles day-to-day operations such as processing deposits, loan EMIs, and member queries.", userCount: 3,
    permissions: {
      Members: ["Read", "Write"], Loans: ["Read"], Deposits: ["Read", "Write"],
      "Chit Funds": ["Read"], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": ["Read"],
    },
  },
  {
    name: "Loan Officer", description: "Manages loan applications, approvals, disbursements, and recovery operations.", userCount: 4,
    permissions: {
      Members: ["Read"], Loans: ["Read", "Write"], Deposits: ["Read"],
      "Chit Funds": [], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": ["Read"],
    },
  },
  {
    name: "Compliance Officer", description: "Monitors regulatory compliance, audit trails, and filing requirements under Nidhi Rules.", userCount: 2,
    permissions: {
      Members: ["Read"], Loans: ["Read"], Deposits: ["Read"],
      "Chit Funds": ["Read"], Compliance: ["Read", "Write"], Reports: ["Read", "Write"],
      Config: ["Read"], "AI Agents": ["Read"],
    },
  },
  {
    name: "Viewer", description: "Read-only access to dashboards and reports. Cannot modify any data or configurations.", userCount: 2,
    permissions: {
      Members: ["Read"], Loans: ["Read"], Deposits: ["Read"],
      "Chit Funds": ["Read"], Compliance: ["Read"], Reports: ["Read"],
      Config: [], "AI Agents": [],
    },
  },
];

/* ─── Inline Data: AI Agent Configuration ─── */
const aiAgents = [
  { name: "Onboarding Agent", status: "Active", model: "v2.4.1", lastTrained: "08 Mar 2026", accuracy: 96.2, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Compliance Agent", status: "Active", model: "v2.3.8", lastTrained: "05 Mar 2026", accuracy: 98.1, autoEscalation: true, autoApprove: false, learningMode: false },
  { name: "Risk Review Agent", status: "Warning", model: "v2.4.0", lastTrained: "01 Mar 2026", accuracy: 91.5, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Liquidity Agent", status: "Active", model: "v2.2.5", lastTrained: "06 Mar 2026", accuracy: 94.8, autoEscalation: false, autoApprove: true, learningMode: false },
  { name: "Fraud Triage Agent", status: "Alert", model: "v2.4.2", lastTrained: "10 Mar 2026", accuracy: 89.3, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Executive Reporting", status: "Active", model: "v2.1.0", lastTrained: "03 Mar 2026", accuracy: 97.6, autoEscalation: false, autoApprove: true, learningMode: false },
];

const agentThresholds = [
  { agent: "Onboarding Agent", metric: "KYC Verification Timeout", value: "30 sec", limit: "60 sec" },
  { agent: "Compliance Agent", metric: "Regulatory Check Interval", value: "6 hours", limit: "24 hours" },
  { agent: "Risk Review Agent", metric: "STI Recalculation Delay", value: "15 min", limit: "60 min" },
  { agent: "Liquidity Agent", metric: "Cash Reserve Alert Threshold", value: "12%", limit: "10%" },
  { agent: "Fraud Triage Agent", metric: "False Positive Tolerance", value: "15%", limit: "20%" },
  { agent: "Executive Reporting", metric: "Report Generation Timeout", value: "5 min", limit: "15 min" },
];

/* ─── Inline Data: Risk Threshold Settings ─── */
const riskCategories = [
  {
    name: "Credit Risk", color: "indigo",
    settings: [
      { label: "Max Loan Amount", current: "₹15,00,000", recommended: "₹10,00,000", lastUpdated: "01 Mar 2026", nearLimit: false },
      { label: "Min STI Score for Approval", current: "50", recommended: "55", lastUpdated: "15 Feb 2026", nearLimit: true },
      { label: "NPA Threshold (Missed EMIs)", current: "3", recommended: "3", lastUpdated: "01 Jan 2026", nearLimit: false },
      { label: "Default EMI Limit per Member", current: "₹50,000", recommended: "₹40,000", lastUpdated: "20 Feb 2026", nearLimit: false },
    ],
  },
  {
    name: "Liquidity Risk", color: "amber",
    settings: [
      { label: "Min Liquidity Ratio", current: "1.45", recommended: "1.50", lastUpdated: "10 Mar 2026", nearLimit: true },
      { label: "Unencumbered Deposit %", current: "11.2%", recommended: "15%", lastUpdated: "28 Feb 2026", nearLimit: true },
      { label: "Cash Reserve Requirement", current: "12%", recommended: "12%", lastUpdated: "01 Mar 2026", nearLimit: false },
    ],
  },
  {
    name: "Fraud Risk", color: "red",
    settings: [
      { label: "Fraud Sensitivity Level", current: "High", recommended: "High", lastUpdated: "10 Mar 2026", nearLimit: false },
      { label: "Max Transaction Limit", current: "₹5,00,000", recommended: "₹5,00,000", lastUpdated: "01 Feb 2026", nearLimit: false },
      { label: "Structuring Threshold", current: "₹2,00,000", recommended: "₹1,50,000", lastUpdated: "15 Feb 2026", nearLimit: true },
      { label: "Collusion Detection Sensitivity", current: "Medium", recommended: "High", lastUpdated: "05 Mar 2026", nearLimit: true },
    ],
  },
  {
    name: "Compliance Risk", color: "emerald",
    settings: [
      { label: "KYC Re-verification Period", current: "12 months", recommended: "12 months", lastUpdated: "01 Jan 2026", nearLimit: false },
      { label: "Filing Reminder Days", current: "30 days", recommended: "45 days", lastUpdated: "01 Feb 2026", nearLimit: false },
      { label: "Rate Cap Margin (above bank rate)", current: "3.5%", recommended: "3.0%", lastUpdated: "01 Mar 2026", nearLimit: true },
    ],
  },
  {
    name: "Member Risk", color: "violet",
    settings: [
      { label: "STI Recalculation Frequency", current: "Weekly", recommended: "Weekly", lastUpdated: "01 Mar 2026", nearLimit: false },
      { label: "Churn Prediction Threshold", current: "65%", recommended: "60%", lastUpdated: "15 Feb 2026", nearLimit: false },
      { label: "Watch List Criteria (STI below)", current: "40", recommended: "45", lastUpdated: "01 Mar 2026", nearLimit: true },
    ],
  },
];

/* ─── Inline Data: System Configuration ─── */
const systemHealth = [
  { label: "Uptime", value: "99.97%", detail: "Last downtime: 02 Mar 2026, 02:15 (3 min)" },
  { label: "DB Size", value: "2.4 GB", detail: "PostgreSQL 15.4 | 142 tables" },
  { label: "Backup Status", value: "Healthy", detail: "Last backup: 11 Mar 2026, 02:00 IST" },
  { label: "API Response Time", value: "128 ms", detail: "Avg over last 24h | P99: 340 ms" },
];

const integrations = [
  { name: "Banking API (ICICI)", status: "Connected", lastSync: "11 Mar 2026, 09:00", provider: "ICICI Bank OpenAPI" },
  { name: "KYC Provider", status: "Connected", lastSync: "11 Mar 2026, 08:30", provider: "Digio / CKYC Registry" },
  { name: "SMS Gateway", status: "Connected", lastSync: "11 Mar 2026, 09:10", provider: "MSG91" },
  { name: "Email Service", status: "Degraded", lastSync: "10 Mar 2026, 22:15", provider: "AWS SES (ap-south-1)" },
  { name: "WhatsApp Business", status: "Connected", lastSync: "11 Mar 2026, 08:55", provider: "Meta Business API" },
];

const retentionPolicies = [
  { dataType: "Transaction Logs", retention: "7 years", lastPurge: "01 Jan 2026", status: "Active" },
  { dataType: "Audit Trails", retention: "10 years", lastPurge: "Never", status: "Active" },
  { dataType: "Session Logs", retention: "90 days", lastPurge: "01 Mar 2026", status: "Active" },
  { dataType: "Temporary Files", retention: "7 days", lastPurge: "10 Mar 2026", status: "Active" },
  { dataType: "Archived Members", retention: "5 years", lastPurge: "01 Jan 2026", status: "Active" },
];

const backupSchedule = [
  { type: "Full Database Backup", frequency: "Daily at 02:00 IST", lastRun: "11 Mar 2026, 02:00", size: "2.4 GB", status: "Success" },
  { type: "Incremental Backup", frequency: "Every 6 hours", lastRun: "11 Mar 2026, 08:00", size: "180 MB", status: "Success" },
  { type: "Configuration Backup", frequency: "Weekly (Sunday)", lastRun: "09 Mar 2026, 03:00", size: "12 MB", status: "Success" },
  { type: "Off-site Replication", frequency: "Daily at 04:00 IST", lastRun: "11 Mar 2026, 04:00", size: "2.4 GB", status: "Success" },
];

/* ─── Reusable Components ─── */
function ConfigSection({ title, description, configs }) {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-[13px] text-slate-400">{description}</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="flex flex-col divide-y divide-slate-100">
          {configs.map((config) => (
            <div key={config.key} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-700">{config.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{config.key}</div>
              </div>
              <div className="flex items-center gap-3">
                {config.type === "toggle" ? (
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${config.value === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${config.value === "Enabled" ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-slate-700 font-mono min-w-[200px] text-right">
                    {config.value}
                  </div>
                )}
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLogTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">System Audit Log</h3>
        <p className="text-[13px] text-slate-400">Track all administrative actions, configuration changes, and system events.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">User</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Details</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((log) => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{log.id}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    log.action.includes("Alert") || log.action.includes("Suspended")
                      ? "bg-red-50 text-red-500 border-red-200/60"
                      : log.action.includes("Updated") || log.action.includes("Changed")
                      ? "bg-blue-50 text-blue-600 border-blue-200/60"
                      : log.action.includes("Completed") || log.action.includes("Restarted")
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[12px] font-medium ${log.user === "System" ? "text-slate-400" : log.user === "AI Agent" ? "text-indigo-500" : "text-slate-700"}`}>
                    {log.user}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[300px]">{log.detail}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagementTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = adminUsers.filter((u) => u.status === "Inactive").length;
  const lockedUsers = adminUsers.filter((u) => u.status === "Locked").length;

  const roles = ["All", "Super Admin", "Admin", "Manager", "Operator", "Viewer"];

  const filtered = adminUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">User Management</h3>
        <p className="text-[13px] text-slate-400">Manage system users, assign roles, and control access across the Glimmora Nidhi platform.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Users", value: totalUsers, color: "text-slate-700" },
          { label: "Active", value: activeUsers, color: "text-emerald-600" },
          { label: "Inactive", value: inactiveUsers, color: "text-amber-600" },
          { label: "Locked", value: lockedUsers, color: "text-red-500" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 text-center">
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-[11px] text-slate-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 mb-5 card-shadow border border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13px] text-slate-700 w-72 outline-none focus:border-indigo-300 transition-colors"
          />
          <div className="flex gap-1.5">
            {roles.map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`rounded-xl px-3 py-1.5 text-[11px] cursor-pointer transition-all border ${roleFilter === r ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Name</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Email</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Role</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Department</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{u.id}</td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700">{u.name}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    u.role === "Super Admin" ? "bg-violet-50 text-violet-600 border-violet-200/60"
                    : u.role === "Admin" ? "bg-indigo-50 text-indigo-600 border-indigo-200/60"
                    : u.role === "Manager" ? "bg-blue-50 text-blue-600 border-blue-200/60"
                    : u.role === "Operator" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{u.department}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    u.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                    : u.status === "Locked" ? "bg-red-50 text-red-500 border-red-200/60"
                    : "bg-amber-50 text-amber-600 border-amber-200/60"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesPermissionsTab() {
  const permBadge = (perm) => {
    if (perm === "Read") return "bg-emerald-50 text-emerald-600 border-emerald-200/60";
    if (perm === "Write") return "bg-amber-50 text-amber-600 border-amber-200/60";
    if (perm === "Delete") return "bg-red-50 text-red-500 border-red-200/60";
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  const modules = ["Members", "Loans", "Deposits", "Chit Funds", "Compliance", "Reports", "Config", "AI Agents"];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Roles & Permissions</h3>
        <p className="text-[13px] text-slate-400">Define access levels and permission sets for each role in the organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {roleDefinitions.map((role) => (
          <div key={role.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900">{role.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{role.description}</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200/60">
                {role.userCount} {role.userCount === 1 ? "user" : "users"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {modules.map((mod) => {
                const perms = role.permissions[mod] || [];
                if (perms.length === 0) return null;
                return (
                  <div key={mod} className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 mr-0.5">{mod}:</span>
                    {perms.map((p) => (
                      <span key={`${mod}-${p}`} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${permBadge(p)}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Permission Matrix</h3>
        <p className="text-[13px] text-slate-400">Overview of all roles and their access across modules.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Module</th>
              {roleDefinitions.map((r) => (
                <th key={r.name} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-3 py-3">{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{mod}</td>
                {roleDefinitions.map((role) => {
                  const perms = role.permissions[mod] || [];
                  return (
                    <td key={`${role.name}-${mod}`} className="px-3 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {perms.length === 0 ? (
                          <span className="text-[10px] text-slate-300">--</span>
                        ) : (
                          perms.map((p) => (
                            <span key={p} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${permBadge(p)}`}>{p}</span>
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AIAgentConfigTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">AI Agent Configuration</h3>
        <p className="text-[13px] text-slate-400">Manage AI model versions, fraud detection sensitivity, and autonomous agent configurations.</p>
      </div>

      {/* Existing AI config rows */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-slate-100">
          <h4 className="text-[13px] font-bold text-slate-700">Global AI Settings</h4>
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {systemConfig.ai.map((config) => (
            <div key={config.key} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-700">{config.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{config.key}</div>
              </div>
              <div className="flex items-center gap-3">
                {config.type === "toggle" ? (
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${config.value === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${config.value === "Enabled" ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-slate-700 font-mono min-w-[200px] text-right">
                    {config.value}
                  </div>
                )}
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Cards */}
      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Agent Instances</h4>
        <p className="text-[11px] text-slate-400">Individual AI agent status, model versions, and behaviour toggles.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {aiAgents.map((ag) => (
          <div key={ag.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900">{ag.name}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5">Model: <span className="font-mono text-slate-600">{ag.model}</span></div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                ag.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                : ag.status === "Warning" ? "bg-amber-50 text-amber-600 border-amber-200/60"
                : "bg-red-50 text-red-500 border-red-200/60"
              }`}>
                {ag.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-[18px] font-bold text-indigo-600">{ag.accuracy}%</div>
                <div className="text-[10px] text-slate-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-slate-500">{ag.lastTrained}</div>
                <div className="text-[10px] text-slate-400">Last Trained</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Auto-escalation", enabled: ag.autoEscalation },
                { label: "Auto-approve", enabled: ag.autoApprove },
                { label: "Learning mode", enabled: ag.learningMode },
              ].map((toggle) => (
                <div key={toggle.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-600">{toggle.label}</span>
                  <div className={`w-9 h-[18px] rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${toggle.enabled ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${toggle.enabled ? "translate-x-[18px]" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Behaviour Thresholds */}
      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Agent Behaviour Thresholds</h4>
        <p className="text-[11px] text-slate-400">Performance and operational limits for each agent.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Agent</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Metric</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Current Value</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Limit</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {agentThresholds.map((t, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{t.agent}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{t.metric}</td>
                <td className="px-5 py-3 text-[12px] font-mono text-slate-700">{t.value}</td>
                <td className="px-5 py-3 text-[12px] font-mono text-slate-400">{t.limit}</td>
                <td className="px-5 py-3">
                  <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskThresholdTab() {
  const colorMap = {
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200/60", text: "text-indigo-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-200/60", text: "text-amber-600" },
    red: { bg: "bg-red-50", border: "border-red-200/60", text: "text-red-500" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-600" },
    violet: { bg: "bg-violet-50", border: "border-violet-200/60", text: "text-violet-600" },
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Risk Threshold Settings</h3>
        <p className="text-[13px] text-slate-400">Configure risk parameters across Credit, Liquidity, Fraud, Compliance, and Member risk categories. Values near regulatory limits are flagged.</p>
      </div>

      <div className="flex flex-col gap-5">
        {riskCategories.map((cat) => {
          const c = colorMap[cat.color];
          return (
            <div key={cat.name}>
              <div className="bg-white rounded-2xl p-5 mb-3 card-shadow border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                    {cat.name}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
                <div className="flex flex-col divide-y divide-slate-100">
                  {cat.settings.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-slate-700">{s.label}</span>
                          {s.nearLimit && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-600 border-amber-200/60">
                              Near Limit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Last updated: {s.lastUpdated}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-slate-700 font-mono min-w-[120px] text-right">
                            {s.current}
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="text-[10px] text-slate-400">Recommended</div>
                          <div className="text-[12px] font-mono text-slate-500">{s.recommended}</div>
                        </div>
                        <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SystemConfigTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">System Configuration</h3>
        <p className="text-[13px] text-slate-400">System health, third-party integrations, data retention policies, and backup schedules.</p>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {systemHealth.map((h) => (
          <div key={h.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[20px] font-bold text-slate-700">{h.value}</div>
            <div className="text-[12px] font-semibold text-slate-600 mt-1">{h.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{h.detail}</div>
          </div>
        ))}
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Integration Status</h4>
        <p className="text-[11px] text-slate-400">Third-party service connections and sync status.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {integrations.map((int) => (
          <div key={int.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-[13px] font-bold text-slate-900">{int.name}</h4>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                int.status === "Connected" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                : int.status === "Degraded" ? "bg-amber-50 text-amber-600 border-amber-200/60"
                : "bg-red-50 text-red-500 border-red-200/60"
              }`}>
                {int.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Provider: <span className="text-slate-600">{int.provider}</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Last Sync: <span className="text-slate-600">{int.lastSync}</span></div>
          </div>
        ))}
      </div>

      {/* Data Retention Policies */}
      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Data Retention Policies</h4>
        <p className="text-[11px] text-slate-400">Retention periods and purge schedules for different data categories.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Data Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Retention Period</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Purge</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {retentionPolicies.map((p, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{p.dataType}</td>
                <td className="px-5 py-3 text-[12px] font-mono text-slate-600">{p.retention}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{p.lastPurge}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200/60">{p.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backup Schedule */}
      <div className="bg-white rounded-2xl p-5 mb-4 card-shadow border border-slate-100">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Backup Schedule</h4>
        <p className="text-[11px] text-slate-400">Automated backup configuration and execution history.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Backup Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Frequency</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Run</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Size</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {backupSchedule.map((b, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{b.type}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{b.frequency}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{b.lastRun}</td>
                <td className="px-5 py-3 text-[12px] font-mono text-slate-600">{b.size}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200/60">{b.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ConfigView() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "users":
        return <UserManagementTab />;
      case "roles":
        return <RolesPermissionsTab />;
      case "general":
        return <ConfigSection title="General Settings" description="Core company information and system-wide configuration for Glimmora Nidhi Limited." configs={systemConfig.general} />;
      case "deposits":
        return <ConfigSection title="Deposit Configuration" description="Configure interest rates, limits, and rules for Fixed, Recurring, and Savings deposit schemes." configs={systemConfig.deposits} />;
      case "loans":
        return <ConfigSection title="Loan Configuration" description="Set lending parameters, interest rate caps, and risk thresholds as per Nidhi Rules." configs={systemConfig.loans} />;
      case "chitfunds":
        return <ConfigSection title="Chit Fund Configuration" description="Configure auction rules, foreman commission, and subscriber limits governed by Chit Funds Act 1982." configs={systemConfig.chitFunds} />;
      case "ai":
        return <AIAgentConfigTab />;
      case "risk":
        return <RiskThresholdTab />;
      case "notifications":
        return <ConfigSection title="Notification Settings" description="Configure member communication channels and alert thresholds for EMIs, maturities, and events." configs={systemConfig.notifications} />;
      case "system":
        return <SystemConfigTab />;
      case "audit":
        return <AuditLogTab />;
      default:
        return <ConfigSection title="General Settings" description="Core company settings." configs={systemConfig.general} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Admin & Configuration</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              System-wide settings for Glimmora Nidhi operations. Configure deposit schemes,
              loan parameters, chit fund rules, AI agent behaviour, and notification preferences.
              All settings are audited and comply with Nidhi Company regulatory requirements.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-slate-600 font-mono">v2.4</div>
              <div className="text-slate-400 text-[10px]">System Version</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${activeTab === t.id ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
