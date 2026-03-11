"use client";

import { useState } from "react";
import { complianceChecklist, complianceScore, regulatoryFilings, auditLog } from "@/data/mockData";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "checklist", label: "Compliance Checklist" },
  { id: "kyc", label: "KYC Monitoring" },
  { id: "aml", label: "AML Monitoring" },
  { id: "filings", label: "Regulatory Reporting" },
  { id: "alerts", label: "Compliance Alerts" },
  { id: "audit", label: "Audit Logs" },
  { id: "panels", label: "Compliance Panels" },
  { id: "suspicious", label: "Suspicious Transactions" },
  { id: "highrisk", label: "High Risk Members" },
];

function ComplianceStatusBadge({ status }) {
  const styles = {
    Compliant: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Warning: "bg-amber-50 text-amber-600 border-amber-200/60",
    "Action Required": "bg-red-50 text-red-500 border-red-200/60",
    "Non-Compliant": "bg-red-50 text-red-500 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function FilingStatusBadge({ status }) {
  const styles = {
    Filed: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Upcoming: "bg-blue-50 text-blue-600 border-blue-200/60",
    Overdue: "bg-red-50 text-red-500 border-red-200/60",
    "Not Required": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }) {
  const styles = {
    Critical: "bg-red-50 text-red-600 border-red-200/60",
    High: "bg-orange-50 text-orange-600 border-orange-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    Low: "bg-blue-50 text-blue-600 border-blue-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[severity] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {severity}
    </span>
  );
}

function RiskBadge({ level }) {
  const styles = {
    High: "bg-red-50 text-red-600 border-red-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Critical: "bg-red-50 text-red-600 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[level] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {level}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Open: "bg-red-50 text-red-500 border-red-200/60",
    Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
    "Under Review": "bg-blue-50 text-blue-600 border-blue-200/60",
    Investigating: "bg-purple-50 text-purple-600 border-purple-200/60",
    Cleared: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Escalated: "bg-red-50 text-red-500 border-red-200/60",
    Filed: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Acknowledged: "bg-blue-50 text-blue-600 border-blue-200/60",
    Closed: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab() {
  const compliant = complianceChecklist.filter((c) => c.status === "Compliant").length;
  const warning = complianceChecklist.filter((c) => c.status === "Warning").length;
  const action = complianceChecklist.filter((c) => c.status === "Action Required").length;

  return (
    <div className="animate-fade-in">
      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 lg:col-span-1">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Overall Compliance Score</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={complianceScore.overall >= 90 ? "#059669" : complianceScore.overall >= 70 ? "#D97706" : "#DC2626"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${complianceScore.overall * 3.14} 314`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[28px] font-bold font-mono text-slate-900">{complianceScore.overall}%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Score</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-emerald-600">{compliant}</div>
              <div className="text-[10px] text-slate-400">Compliant</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-amber-600">{warning}</div>
              <div className="text-[10px] text-slate-400">Warning</div>
            </div>
            <div className="bg-red-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-red-500">{action}</div>
              <div className="text-[10px] text-slate-400">Action</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 lg:col-span-2">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Category-wise Compliance</h3>
          <div className="flex flex-col gap-3">
            {complianceScore.categories.map((cat) => (
              <div key={cat.name} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Weight: {cat.weight}%</span>
                    <span className={`text-[13px] font-bold font-mono ${cat.score >= 90 ? "text-emerald-600" : cat.score >= 70 ? "text-amber-600" : "text-red-500"}`}>{cat.score}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: cat.score >= 90 ? "#059669" : cat.score >= 70 ? "#D97706" : "#DC2626" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Items Requiring Attention</h3>
        <div className="flex flex-col gap-3">
          {complianceChecklist.filter((c) => c.status !== "Compliant").map((item) => (
            <div key={item.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === "Warning" ? "bg-amber-50 border border-amber-200/60" : "bg-red-50 border border-red-200/60"}`}>
                <svg className={`w-4 h-4 ${item.status === "Warning" ? "text-amber-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-semibold text-slate-700">{item.rule}</div>
                  <ComplianceStatusBadge status={item.status} />
                </div>
                <div className="text-[12px] text-slate-400 mt-1">{item.details}</div>
                <div className="text-[11px] text-slate-300 mt-2">Last Audit: {item.lastAudit} &middot; {item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Checklist Tab ─── */
function ChecklistTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = complianceChecklist.filter((c) => filterStatus === "All" || c.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {["All", "Compliant", "Warning", "Action Required"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterStatus === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Compliance Rule</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Category</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Last Audit</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{c.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700">{c.rule}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{c.details}</div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full whitespace-nowrap">{c.category}</span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{c.lastAudit}</td>
                <td className="px-5 py-3"><ComplianceStatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ─── KYC Monitoring Tab ─── */
function KycMonitoringTab() {
  const kycStats = [
    { label: "Verified", value: "11,842", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/60" },
    { label: "Pending", value: "342", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200/60" },
    { label: "Expired", value: "128", color: "text-red-500", bg: "bg-red-50", border: "border-red-200/60" },
    { label: "Under Review", value: "138", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60" },
  ];

  const kycMembers = [
    { id: "M-1003", name: "Vikram Nair", status: "Expired", lastVerified: "10 Mar 2025", dueDate: "10 Mar 2026", risk: "High" },
    { id: "M-1005", name: "Suresh Iyer", status: "Under Review", lastVerified: "12 May 2025", dueDate: "12 May 2026", risk: "High" },
    { id: "M-1009", name: "Arun Prasad", status: "Pending", lastVerified: "—", dueDate: "15 Mar 2026", risk: "High" },
    { id: "M-1017", name: "Vinod Shetty", status: "Pending", lastVerified: "—", dueDate: "18 Mar 2026", risk: "Medium" },
    { id: "M-1013", name: "Ganesh Hegde", status: "Under Review", lastVerified: "18 Jan 2025", dueDate: "18 Jan 2026", risk: "High" },
    { id: "M-1022", name: "Nandini Rao", status: "Expired", lastVerified: "05 Feb 2025", dueDate: "05 Feb 2026", risk: "Medium" },
    { id: "M-1028", name: "Ravi Shankar", status: "Pending", lastVerified: "—", dueDate: "20 Mar 2026", risk: "Low" },
    { id: "M-1034", name: "Sanjay Gupta", status: "Expired", lastVerified: "22 Dec 2024", dueDate: "22 Dec 2025", risk: "High" },
  ];

  const documentQueue = [
    { id: "DQ-001", memberId: "M-1003", memberName: "Vikram Nair", docType: "Aadhaar Card", submittedOn: "08 Mar 2026", status: "Pending Verification" },
    { id: "DQ-002", memberId: "M-1017", memberName: "Vinod Shetty", docType: "PAN Card", submittedOn: "09 Mar 2026", status: "Pending Verification" },
    { id: "DQ-003", memberId: "M-1005", memberName: "Suresh Iyer", docType: "Address Proof", submittedOn: "07 Mar 2026", status: "Under Review" },
    { id: "DQ-004", memberId: "M-1028", memberName: "Ravi Shankar", docType: "Aadhaar + PAN", submittedOn: "10 Mar 2026", status: "Pending Verification" },
    { id: "DQ-005", memberId: "M-1022", memberName: "Nandini Rao", docType: "Voter ID", submittedOn: "06 Mar 2026", status: "Rejected - Blurry" },
  ];

  const kycStatusStyle = {
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
    Expired: "bg-red-50 text-red-500 border-red-200/60",
    "Under Review": "bg-blue-50 text-blue-600 border-blue-200/60",
  };

  return (
    <div className="animate-fade-in">
      {/* KYC Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kycStats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100`}>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-[22px] font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Re-verification Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Members Due for KYC Re-verification</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Members requiring annual KYC update as per Nidhi (Amendment) Rules 2022</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Member ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Name</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">KYC Status</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Last Verified</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Due Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {kycMembers.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{m.id}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700 whitespace-nowrap">{m.name}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${kycStatusStyle[m.status] || ""}`}>{m.status}</span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.lastVerified}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.dueDate}</td>
                <td className="px-5 py-3"><RiskBadge level={m.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Document Verification Queue */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Document Verification Queue</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Pending KYC documents awaiting manual or AI-assisted verification</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Queue ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Document Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Submitted</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {documentQueue.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{doc.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700">{doc.memberName}</div>
                  <div className="text-[11px] text-slate-400">{doc.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{doc.docType}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{doc.submittedOn}</td>
                <td className="px-5 py-3"><StatusBadge status={doc.status.includes("Rejected") ? "Open" : doc.status.includes("Under") ? "Under Review" : "Pending"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── AML Monitoring Tab ─── */
function AmlMonitoringTab() {
  const amlMetrics = [
    { label: "STRs Filed (FY)", value: "14", color: "text-red-500", bg: "bg-red-50" },
    { label: "CTRs Filed (FY)", value: "87", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Suspicious Patterns", value: "23", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Blocked Transactions", value: "6", color: "text-slate-700", bg: "bg-slate-50" },
  ];

  const ctrReports = [
    { id: "CTR-001", memberId: "M-1004", memberName: "Priya Venkat", amount: "₹12,50,000", type: "Cash Deposit", date: "08 Mar 2026", branch: "Indiranagar", status: "Filed" },
    { id: "CTR-002", memberId: "M-1012", memberName: "Sunita Rao", amount: "₹15,00,000", type: "Cash Withdrawal", date: "05 Mar 2026", branch: "Malleshwaram", status: "Filed" },
    { id: "CTR-003", memberId: "M-1018", memberName: "Padma Krishnan", amount: "₹10,50,000", type: "Cash Deposit", date: "02 Mar 2026", branch: "Sadashivanagar", status: "Filed" },
    { id: "CTR-004", memberId: "M-1001", memberName: "Rajesh Kumar", amount: "₹11,00,000", type: "FD Creation", date: "28 Feb 2026", branch: "MG Road", status: "Filed" },
    { id: "CTR-005", memberId: "M-1006", memberName: "Meena Pillai", amount: "₹18,75,000", type: "Cash Deposit", date: "25 Feb 2026", branch: "Whitefield", status: "Filed" },
  ];

  const strReports = [
    { id: "STR-001", memberId: "M-1005", memberName: "Suresh Iyer", pattern: "Structuring", description: "Multiple cash deposits just below ₹10L threshold over 3 days", amount: "₹29,50,000", date: "09 Mar 2026", status: "Filed" },
    { id: "STR-002", memberId: "M-1003", memberName: "Vikram Nair", pattern: "Rapid Movement", description: "Deposit followed by immediate loan application and withdrawal", amount: "₹4,80,000", date: "06 Mar 2026", status: "Under Review" },
    { id: "STR-003", memberId: "M-1013", memberName: "Ganesh Hegde", pattern: "Unusual Volume", description: "Transaction volume 400% above historical average in single week", amount: "₹8,20,000", date: "01 Mar 2026", status: "Filed" },
    { id: "STR-004", memberId: "M-1033", memberName: "Prakash Jain", pattern: "Identity Concern", description: "Mismatched KYC documents used across multiple transactions", amount: "₹3,40,000", date: "25 Feb 2026", status: "Escalated" },
  ];

  const riskScoring = [
    { category: "Low Risk (0-30)", count: 10850, pct: 87 },
    { category: "Medium Risk (31-60)", count: 1120, pct: 9 },
    { category: "High Risk (61-80)", count: 380, pct: 3 },
    { category: "Critical Risk (81-100)", count: 100, pct: 1 },
  ];

  return (
    <div className="animate-fade-in">
      {/* AML Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {amlMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className={`text-[22px] font-bold font-mono ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* AML Risk Distribution */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">AML Risk Score Distribution</h3>
        <div className="flex flex-col gap-3">
          {riskScoring.map((r) => (
            <div key={r.category} className="bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{r.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-slate-400">{r.count.toLocaleString()} members</span>
                  <span className="text-[13px] font-bold font-mono text-slate-700">{r.pct}%</span>
                </div>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 bg-indigo-500" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTR Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Cash Transaction Reports (CTR)</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Transactions exceeding ₹10,00,000 reported to FIU-IND as per PMLA 2002</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">CTR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Branch</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ctrReports.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{c.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{c.memberName}</div>
                  <div className="text-[11px] text-slate-400">{c.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{c.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500 whitespace-nowrap">{c.type}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{c.date}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{c.branch}</td>
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* STR Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Suspicious Transaction Reports (STR)</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Filed with FIU-IND within 7 days of detection as per PMLA guidelines</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">STR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {strReports.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{s.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{s.memberName}</div>
                  <div className="text-[11px] text-slate-400">{s.memberId}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="text-[12px] font-medium text-slate-600 whitespace-nowrap">{s.pattern}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.description}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{s.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{s.date}</td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Regulatory Reporting (Filings) Tab ─── */
function FilingsTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Regulatory Filing Tracker</h3>
            <p className="text-[13px] text-slate-400">Track all mandatory filings with MCA/ROC as per Nidhi Company regulations.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center border border-emerald-200/60">
              <div className="text-lg font-bold text-emerald-600 font-mono">{regulatoryFilings.filter((f) => f.status === "Filed").length}</div>
              <div className="text-slate-400 text-[10px]">Filed</div>
            </div>
            <div className="bg-blue-50 rounded-xl px-3 py-2 text-center border border-blue-200/60">
              <div className="text-lg font-bold text-blue-600 font-mono">{regulatoryFilings.filter((f) => f.status === "Upcoming").length}</div>
              <div className="text-slate-400 text-[10px]">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulatoryFilings.map((f) => (
          <div key={f.form} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{f.form}</div>
                <div className="text-[12px] text-slate-400 mt-0.5">{f.description}</div>
              </div>
              <FilingStatusBadge status={f.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
                <div className="text-[13px] font-semibold text-slate-700">{f.dueDate}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Filed Date</div>
                <div className="text-[13px] font-semibold text-slate-700">{f.filedDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Compliance Alerts Tab ─── */
function AlertsTab() {
  const [filterSeverity, setFilterSeverity] = useState("All");

  const alerts = [
    { id: "CA-001", severity: "Critical", category: "Ratio Breach", description: "Unencumbered deposit ratio at 10.2%, approaching minimum 10% threshold under Nidhi Rules", affectedRule: "CL-004", date: "10 Mar 2026", status: "Open" },
    { id: "CA-002", severity: "Critical", category: "Regulatory Deadline", description: "NDH-1 annual compliance return due in 51 days. Data compilation pending for Section 406.", affectedRule: "CL-007", date: "09 Mar 2026", status: "Open" },
    { id: "CA-003", severity: "High", category: "KYC Expiry", description: "342 member KYC verifications expiring before 31 Mar 2026. Bulk re-verification required.", affectedRule: "CL-005", date: "08 Mar 2026", status: "Open" },
    { id: "CA-004", severity: "High", category: "Filing Due", description: "Form AOC-4 annual financial statements preparation must begin. Statutory audit scheduling needed.", affectedRule: "CL-007", date: "07 Mar 2026", status: "Acknowledged" },
    { id: "CA-005", severity: "Medium", category: "Rate Limit", description: "FD interest rate at 9.5% approaching RBI ceiling. Review rate structure before next quarter.", affectedRule: "CL-009", date: "06 Mar 2026", status: "Acknowledged" },
    { id: "CA-006", severity: "Medium", category: "Ratio Breach", description: "Loan-to-deposit ratio increased to 65% from 62%. Monitor for continued upward trend.", affectedRule: "CL-006", date: "05 Mar 2026", status: "Resolved" },
    { id: "CA-007", severity: "Low", category: "Regulatory Deadline", description: "MGT-7A annual return filing window opens in 8 months. Begin data preparation.", affectedRule: "CL-007", date: "04 Mar 2026", status: "Acknowledged" },
    { id: "CA-008", severity: "High", category: "KYC Expiry", description: "5 high-value depositors (FD > ₹5L) have KYC documents expiring within 15 days.", affectedRule: "CL-005", date: "10 Mar 2026", status: "Open" },
    { id: "CA-009", severity: "Critical", category: "Regulatory Deadline", description: "Board meeting minutes for Q3 not yet filed with ROC. Mandatory under Section 118.", affectedRule: "CL-008", date: "03 Mar 2026", status: "Open" },
    { id: "CA-010", severity: "Low", category: "Rate Limit", description: "Savings deposit rate of 4.0% is below market average. Review for member retention.", affectedRule: "CL-009", date: "01 Mar 2026", status: "Closed" },
  ];

  const filtered = alerts.filter((a) => filterSeverity === "All" || a.severity === filterSeverity);

  const severityCounts = {
    Critical: alerts.filter((a) => a.severity === "Critical").length,
    High: alerts.filter((a) => a.severity === "High").length,
    Medium: alerts.filter((a) => a.severity === "Medium").length,
    Low: alerts.filter((a) => a.severity === "Low").length,
  };

  return (
    <div className="animate-fade-in">
      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Critical</div>
          <div className="text-[22px] font-bold font-mono text-red-500">{severityCounts.Critical}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">High</div>
          <div className="text-[22px] font-bold font-mono text-orange-600">{severityCounts.High}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Medium</div>
          <div className="text-[22px] font-bold font-mono text-amber-600">{severityCounts.Medium}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Low</div>
          <div className="text-[22px] font-bold font-mono text-blue-600">{severityCounts.Low}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {["All", "Critical", "High", "Medium", "Low"].map((f) => (
          <button key={f} onClick={() => setFilterSeverity(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterSeverity === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-3">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={a.severity} />
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{a.category}</span>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="text-[13px] font-medium text-slate-700 mt-2">{a.description}</div>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[11px] text-slate-300">ID: {a.id}</span>
              <span className="text-[11px] text-slate-300">Rule: {a.affectedRule}</span>
              <span className="text-[11px] text-slate-300">{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Audit Logs Tab ─── */
function AuditLogsTab() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const extendedLogs = [
    ...auditLog,
    { id: "AL-007", action: "Loan Approved", user: "Branch Manager", detail: "Loan LA-001 approved for M-1001 (₹2,00,000)", timestamp: "06 Mar 2026, 15:45", category: "Loans" },
    { id: "AL-008", action: "KYC Verified", user: "KYC Agent", detail: "M-1014 Aadhaar and PAN verification completed", timestamp: "06 Mar 2026, 11:30", category: "KYC" },
    { id: "AL-009", action: "FD Created", user: "Teller", detail: "FD-005 created for M-1018 (₹3,00,000 @ 9.0%)", timestamp: "05 Mar 2026, 14:20", category: "Deposits" },
    { id: "AL-010", action: "STR Filed", user: "Compliance Officer", detail: "STR-003 filed with FIU-IND for M-1013", timestamp: "05 Mar 2026, 10:00", category: "AML" },
    { id: "AL-011", action: "Auction Completed", user: "System", detail: "CS-002 auction completed. Winner: M-1007, Bid: ₹2,40,000", timestamp: "04 Mar 2026, 18:00", category: "Chit Funds" },
    { id: "AL-012", action: "Password Reset", user: "Admin", detail: "Password reset for operator OP-003 (Kavitha)", timestamp: "04 Mar 2026, 09:15", category: "Security" },
    { id: "AL-013", action: "Rate Changed", user: "Admin", detail: "RD interest rate updated from 8.0% to 8.5%", timestamp: "03 Mar 2026, 16:00", category: "Config" },
    { id: "AL-014", action: "Member Onboarded", user: "Onboarding Agent", detail: "M-1018 Padma Krishnan onboarded with full KYC", timestamp: "03 Mar 2026, 11:45", category: "Members" },
    { id: "AL-015", action: "CTR Generated", user: "System", detail: "CTR-005 auto-generated for cash deposit ₹18,75,000", timestamp: "02 Mar 2026, 14:30", category: "AML" },
    { id: "AL-016", action: "Board Meeting Logged", user: "Company Secretary", detail: "Board meeting minutes recorded for 01 Mar 2026", timestamp: "02 Mar 2026, 10:00", category: "Governance" },
    { id: "AL-017", action: "EMI Default Alert", user: "System", detail: "M-1003 missed 4th consecutive EMI on loan LA-009", timestamp: "01 Mar 2026, 09:00", category: "Loans" },
    { id: "AL-018", action: "Fraud Alert Raised", user: "AI Agent", detail: "Coordinated bidding pattern detected in CS-002 auction", timestamp: "28 Feb 2026, 17:30", category: "Fraud" },
  ];

  const logCategories = ["All", "Config", "Security", "KYC", "AML", "Loans", "Deposits", "Members", "Chit Funds", "Governance", "Fraud"];

  const categorizedLogs = extendedLogs.map((log) => {
    if (log.category) return log;
    if (log.action.includes("Config")) return { ...log, category: "Config" };
    if (log.action.includes("User") || log.action.includes("Role")) return { ...log, category: "Security" };
    if (log.action.includes("Agent") || log.action.includes("Restart")) return { ...log, category: "Config" };
    if (log.action.includes("Backup")) return { ...log, category: "Security" };
    if (log.action.includes("Compliance")) return { ...log, category: "Governance" };
    if (log.action.includes("Member") || log.action.includes("Suspended")) return { ...log, category: "Members" };
    return { ...log, category: "Config" };
  });

  const filtered = categorizedLogs
    .filter((l) => filterCategory === "All" || l.category === filterCategory)
    .filter((l) => searchTerm === "" || l.action.toLowerCase().includes(searchTerm.toLowerCase()) || l.detail.toLowerCase().includes(searchTerm.toLowerCase()) || l.user.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fade-in">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search audit logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl px-4 py-2 text-xs border border-slate-200 bg-white text-slate-600 placeholder-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 flex-1"
        />
      </div>

      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {logCategories.map((f) => (
          <button key={f} onClick={() => setFilterCategory(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterCategory === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Timestamp</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">User</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Details</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{l.timestamp}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{l.action}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{l.user}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{l.detail}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{l.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Compliance Panels Tab ─── */
function PanelsTab() {
  const committees = [
    {
      name: "Audit Committee",
      chairperson: "CA Venkatesh Murthy",
      members: ["Smt. Lakshmi Narayan (Independent Director)", "Shri Ramachandran K. (Non-Executive Director)", "CA Priya Subramanian (External Expert)"],
      lastMeeting: "01 Mar 2026",
      nextMeeting: "01 Jun 2026",
      frequency: "Quarterly",
      mandate: "Review financial statements, internal controls, statutory audit observations, and compliance with Nidhi Rules 2014.",
    },
    {
      name: "Compliance Committee",
      chairperson: "Adv. Suresh Bhat",
      members: ["Shri Mohan Rao (Managing Director)", "Smt. Kavitha Nair (Compliance Officer)", "Shri Anil Kumar (Company Secretary)"],
      lastMeeting: "15 Feb 2026",
      nextMeeting: "15 May 2026",
      frequency: "Quarterly",
      mandate: "Ensure compliance with MCA regulations, Nidhi Rules, PMLA requirements, and RBI directives applicable to Nidhi companies.",
    },
    {
      name: "Risk Management Committee",
      chairperson: "Dr. Padma Krishnamurthy",
      members: ["Shri Rajesh Kumar (Chief Risk Officer)", "Smt. Deepa Hegde (Credit Head)", "Shri Vinod Kamath (Operations Head)"],
      lastMeeting: "20 Feb 2026",
      nextMeeting: "20 May 2026",
      frequency: "Quarterly",
      mandate: "Oversee credit risk, operational risk, liquidity risk, and fraud risk. Review risk appetite and tolerance levels.",
    },
    {
      name: "Grievance Redressal Committee",
      chairperson: "Smt. Annapurna Devi",
      members: ["Shri Prakash Joshi (Member Relations)", "Smt. Meena Iyer (Branch Head)", "Shri Harish Shenoy (Legal Advisor)"],
      lastMeeting: "10 Mar 2026",
      nextMeeting: "10 Apr 2026",
      frequency: "Monthly",
      mandate: "Address member complaints, resolve disputes, and ensure fair treatment as per Nidhi Company member charter.",
    },
  ];

  const boardMembers = [
    { name: "Shri Mohan Rao", designation: "Managing Director", since: "Jan 2024", din: "08765432" },
    { name: "Smt. Lakshmi Narayan", designation: "Independent Director", since: "Apr 2024", din: "09876543" },
    { name: "Shri Ramachandran K.", designation: "Non-Executive Director", since: "Jan 2024", din: "07654321" },
    { name: "CA Venkatesh Murthy", designation: "Director (Finance)", since: "Jul 2024", din: "08654321" },
    { name: "Adv. Suresh Bhat", designation: "Director (Legal)", since: "Oct 2024", din: "09543210" },
  ];

  const meetingMinutes = [
    { date: "01 Mar 2026", committee: "Audit Committee", agenda: "Q3 FY26 financial review, internal audit findings, compliance score discussion", status: "Minutes Filed" },
    { date: "20 Feb 2026", committee: "Risk Management", agenda: "NPA review, liquidity stress test results, fraud trend analysis", status: "Minutes Filed" },
    { date: "15 Feb 2026", committee: "Compliance Committee", agenda: "NDH-1 filing preparation, KYC re-verification drive planning, PMLA compliance update", status: "Minutes Filed" },
    { date: "10 Feb 2026", committee: "Board Meeting", agenda: "Q3 results approval, dividend declaration, director rotation", status: "Minutes Filed" },
    { date: "05 Feb 2026", committee: "Grievance Redressal", agenda: "12 pending complaints review, new grievance policy approval", status: "Minutes Filed" },
    { date: "15 Jan 2026", committee: "Board Meeting", agenda: "Annual budget FY27, branch expansion proposal, technology roadmap", status: "Minutes Filed" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Board Composition */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Board of Directors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {boardMembers.map((b) => (
            <div key={b.din} className="bg-slate-50 rounded-xl p-4">
              <div className="text-[13px] font-semibold text-slate-700">{b.name}</div>
              <div className="text-[12px] text-indigo-500 mt-0.5">{b.designation}</div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-slate-400">Since: {b.since}</span>
                <span className="text-[11px] text-slate-300">DIN: {b.din}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Committees */}
      <div className="flex flex-col gap-4 mb-6">
        {committees.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">{c.name}</h3>
                <div className="text-[12px] text-indigo-500 mt-0.5">Chairperson: {c.chairperson}</div>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c.frequency}</span>
            </div>
            <div className="text-[12px] text-slate-400 mb-3">{c.mandate}</div>
            <div className="flex flex-col gap-1 mb-3">
              {c.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  {m}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Meeting</div>
                <div className="text-[13px] font-semibold text-slate-700">{c.lastMeeting}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Next Meeting</div>
                <div className="text-[13px] font-semibold text-slate-700">{c.nextMeeting}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Minutes */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Meeting Minutes Tracker</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Minutes filed with ROC as per Section 118 of Companies Act 2013</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Committee</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Agenda Items</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {meetingMinutes.map((m, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.date}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{m.committee}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{m.agenda}</td>
                <td className="px-5 py-3"><StatusBadge status="Filed" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Suspicious Transactions Tab ─── */
function SuspiciousTransactionsTab() {
  const flaggedTransactions = [
    { id: "ST-001", memberId: "M-1005", memberName: "Suresh Iyer", amount: "₹9,95,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "09 Mar 2026" },
    { id: "ST-002", memberId: "M-1005", memberName: "Suresh Iyer", amount: "₹9,90,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "08 Mar 2026" },
    { id: "ST-003", memberId: "M-1005", memberName: "Suresh Iyer", amount: "₹9,65,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "07 Mar 2026" },
    { id: "ST-004", memberId: "M-1003", memberName: "Vikram Nair", amount: "₹4,80,000", type: "Loan Disbursement", pattern: "Rapid Movement", riskScore: 85, status: "Under Review", date: "06 Mar 2026" },
    { id: "ST-005", memberId: "M-1003", memberName: "Vikram Nair", amount: "₹4,50,000", type: "Cash Withdrawal", pattern: "Rapid Movement", riskScore: 85, status: "Under Review", date: "06 Mar 2026" },
    { id: "ST-006", memberId: "M-1013", memberName: "Ganesh Hegde", amount: "₹2,80,000", type: "Chit Fund Bid", pattern: "Unusual Volume", riskScore: 78, status: "Filed", date: "05 Mar 2026" },
    { id: "ST-007", memberId: "M-1033", memberName: "Prakash Jain", amount: "₹1,50,000", type: "FD Creation", pattern: "Identity Concern", riskScore: 95, status: "Escalated", date: "04 Mar 2026" },
    { id: "ST-008", memberId: "M-1033", memberName: "Prakash Jain", amount: "₹1,90,000", type: "Cash Deposit", pattern: "Identity Concern", riskScore: 95, status: "Escalated", date: "03 Mar 2026" },
    { id: "ST-009", memberId: "M-1008", memberName: "Deepa Reddy", amount: "₹75,000", type: "Fund Transfer", pattern: "Unusual Timing", riskScore: 62, status: "Cleared", date: "02 Mar 2026" },
    { id: "ST-010", memberId: "M-1011", memberName: "Ramesh Babu", amount: "₹1,20,000", type: "Cash Withdrawal", pattern: "Behavioural Anomaly", riskScore: 58, status: "Cleared", date: "28 Feb 2026" },
  ];

  const strCases = [
    { id: "STR-001", memberId: "M-1005", memberName: "Suresh Iyer", totalAmount: "₹29,50,000", transactions: 3, pattern: "Structuring below ₹10L threshold", filedDate: "09 Mar 2026", fiuRef: "FIU/STR/2026/1847", status: "Filed" },
    { id: "STR-002", memberId: "M-1003", memberName: "Vikram Nair", totalAmount: "₹9,30,000", transactions: 2, pattern: "Deposit-loan-withdrawal within 48 hours", filedDate: "—", fiuRef: "—", status: "Under Review" },
    { id: "STR-003", memberId: "M-1013", memberName: "Ganesh Hegde", totalAmount: "₹8,20,000", transactions: 5, pattern: "400% spike in transaction volume", filedDate: "01 Mar 2026", fiuRef: "FIU/STR/2026/1823", status: "Filed" },
    { id: "STR-004", memberId: "M-1033", memberName: "Prakash Jain", totalAmount: "₹3,40,000", transactions: 2, pattern: "Mismatched KYC across transactions", filedDate: "—", fiuRef: "—", status: "Escalated" },
  ];

  const patternSummary = [
    { pattern: "Structuring", count: 3, totalValue: "₹29,50,000", severity: "Critical" },
    { pattern: "Rapid Movement", count: 2, totalValue: "₹9,30,000", severity: "High" },
    { pattern: "Identity Concern", count: 2, totalValue: "₹3,40,000", severity: "Critical" },
    { pattern: "Unusual Volume", count: 1, totalValue: "₹2,80,000", severity: "Medium" },
    { pattern: "Unusual Timing", count: 1, totalValue: "₹75,000", severity: "Low" },
    { pattern: "Behavioural Anomaly", count: 1, totalValue: "₹1,20,000", severity: "Low" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Pattern Summary */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Transaction Pattern Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {patternSummary.map((p) => (
            <div key={p.pattern} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="text-[13px] font-semibold text-slate-700 leading-snug">{p.pattern}</div>
                <SeverityBadge severity={p.severity} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Flagged</div>
                  <div className="text-[16px] font-bold font-mono text-slate-700">{p.count}</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Value</div>
                  <div className="text-[12px] font-semibold font-mono text-slate-600">{p.totalValue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STR Cases */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">STR Case Listing</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Suspicious Transaction Reports filed or pending with FIU-IND</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">STR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Txns</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">FIU Ref</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {strCases.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{s.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{s.memberName}</div>
                  <div className="text-[11px] text-slate-400">{s.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{s.pattern}</td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{s.totalAmount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500 text-center">{s.transactions}</td>
                <td className="px-5 py-3 text-[11px] text-slate-400 font-mono whitespace-nowrap">{s.fiuRef}</td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Flagged Transactions Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Flagged Transactions</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Individual transactions flagged by AI pattern detection engine</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Score</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {flaggedTransactions.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{t.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700">{t.memberName}</div>
                  <div className="text-[11px] text-slate-400">{t.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono">{t.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{t.type}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t.pattern}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[13px] font-bold font-mono ${t.riskScore >= 80 ? "text-red-500" : t.riskScore >= 60 ? "text-amber-600" : "text-emerald-600"}`}>{t.riskScore}</span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── High Risk Members Tab ─── */
function HighRiskMembersTab() {
  const riskSummary = [
    { label: "Critical Risk", value: "4", color: "text-red-500", desc: "Immediate action required" },
    { label: "High Risk", value: "12", color: "text-orange-600", desc: "Enhanced monitoring" },
    { label: "Medium Risk", value: "38", color: "text-amber-600", desc: "Periodic review" },
    { label: "On Watch List", value: "8", color: "text-purple-600", desc: "Under observation" },
  ];

  const highRiskMembers = [
    { id: "M-1005", name: "Suresh Iyer", riskScore: 94, riskFactors: ["Structuring suspicion", "STR filed", "KYC under review", "STI score drop"], lastReview: "09 Mar 2026", actions: "Transaction monitoring, Account restriction pending" },
    { id: "M-1033", name: "Prakash Jain", riskScore: 92, riskFactors: ["Mismatched KYC", "Identity concern", "Account suspended"], lastReview: "07 Mar 2026", actions: "Account frozen, Police complaint filed" },
    { id: "M-1003", name: "Vikram Nair", riskScore: 88, riskFactors: ["Rapid fund movement", "4 missed EMIs", "KYC expired", "Auction manipulation link"], lastReview: "06 Mar 2026", actions: "Enhanced due diligence, Loan recovery initiated" },
    { id: "M-1013", name: "Ganesh Hegde", riskScore: 82, riskFactors: ["Unusual transaction volume", "KYC under review", "Linked to collusion ring"], lastReview: "05 Mar 2026", actions: "Transaction limits imposed, KYC re-verification" },
    { id: "M-1009", name: "Arun Prasad", riskScore: 78, riskFactors: ["Multiple loan defaults", "KYC pending", "High debt-to-deposit ratio"], lastReview: "04 Mar 2026", actions: "Loan applications blocked, KYC reminder sent" },
    { id: "M-1017", name: "Vinod Shetty", riskScore: 75, riskFactors: ["Loans exceed deposits", "KYC pending", "Low STI score"], lastReview: "03 Mar 2026", actions: "Loan cap enforced, Deposit requirement notification" },
    { id: "M-1022", name: "Nandini Rao", riskScore: 68, riskFactors: ["KYC expired", "Irregular deposit pattern"], lastReview: "01 Mar 2026", actions: "KYC renewal notice issued" },
    { id: "M-1029", name: "Deepak Sharma", riskScore: 65, riskFactors: ["Linked to collusion ring (FC-005)", "Shared address with M-1031"], lastReview: "28 Feb 2026", actions: "Address verification ordered, Chit scheme participation paused" },
    { id: "M-1031", name: "Manoj Patel", riskScore: 64, riskFactors: ["Linked to collusion ring (FC-005)", "Shared address with M-1029"], lastReview: "28 Feb 2026", actions: "Address verification ordered, Chit scheme participation paused" },
    { id: "M-1025", name: "Srinivas Reddy", riskScore: 62, riskFactors: ["Linked to collusion ring (FC-005)", "Bid pattern anomaly"], lastReview: "28 Feb 2026", actions: "Auction participation suspended pending investigation" },
  ];

  const watchList = [
    { id: "M-1008", name: "Deepa Reddy", reason: "Former high-risk, downgraded after resolution", addedOn: "15 Jan 2026", reviewDate: "15 Apr 2026" },
    { id: "M-1011", name: "Ramesh Babu", reason: "Behavioural anomaly in withdrawal pattern (cleared)", addedOn: "01 Feb 2026", reviewDate: "01 May 2026" },
    { id: "M-1002", name: "Anita Sharma", reason: "Multiple loan applications in short period", addedOn: "10 Mar 2026", reviewDate: "10 Apr 2026" },
    { id: "M-1016", name: "Savitha Kulkarni", reason: "Deposit pattern change, under observation", addedOn: "05 Mar 2026", reviewDate: "05 Apr 2026" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Risk Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {riskSummary.map((r) => (
          <div key={r.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{r.label}</div>
            <div className={`text-[22px] font-bold font-mono ${r.color}`}>{r.value}</div>
            <div className="text-[11px] text-slate-300 mt-1">{r.desc}</div>
          </div>
        ))}
      </div>

      {/* High Risk Members Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">High Risk Member Registry</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Members flagged for enhanced due diligence as per PMLA and internal risk policy</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Name</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Score</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Factors</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Review</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Actions Required</th>
              </tr>
            </thead>
            <tbody>
              {highRiskMembers.map((m) => (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{m.id}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{m.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[15px] font-bold font-mono ${m.riskScore >= 80 ? "text-red-500" : m.riskScore >= 60 ? "text-amber-600" : "text-emerald-600"}`}>{m.riskScore}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.riskFactors.map((f, i) => (
                        <span key={i} className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-200/60">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.lastReview}</td>
                  <td className="px-5 py-3 text-[12px] text-slate-500">{m.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watch List */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Watch List</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Members under continued observation after risk de-escalation or emerging concerns</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Name</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Reason</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Added On</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Next Review</th>
            </tr>
          </thead>
          <tbody>
            {watchList.map((w) => (
              <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{w.id}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{w.name}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{w.reason}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{w.addedOn}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{w.reviewDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Nidhi Rules Tab ─── */
function RegulationsTab() {
  const nidhiRules = [
    { title: "Nidhi Rules 2014", sections: [
      "Rule 3: Membership minimum 200 within 1 year of incorporation.",
      "Rule 4: Net Owned Funds shall not be less than ₹10 Lakhs (revised to ₹20 Lakhs).",
      "Rule 5: Ratio of Net Owned Funds to deposits shall not exceed 1:20.",
      "Rule 6: Unencumbered term deposits must be at least 10% of outstanding deposits.",
    ]},
    { title: "Nidhi (Amendment) Rules 2022", sections: [
      "Net Owned Funds requirement increased to ₹20 Lakhs.",
      "Introduction of NDH-4 form for Nidhi declaration application.",
      "Revised timelines for meeting membership and NOF requirements.",
      "Enhanced KYC and due diligence requirements for members.",
    ]},
    { title: "Lending & Deposit Limits", sections: [
      "Loans only to members (min 1 year membership for secured, 3 years for unsecured).",
      "Maximum unsecured loan: ₹2,00,000 per member.",
      "Deposits accepted only from members enrolled for at least 1 year.",
      "Interest on deposits must not exceed ceiling prescribed by RBI.",
    ]},
    { title: "Governance Requirements", sections: [
      "Board of Directors must have minimum 3 directors.",
      "Annual filing of NDH-1 (compliance return) and NDH-3 (half-yearly return).",
      "Annual General Meeting within 6 months of financial year end.",
      "Statutory audit by qualified Chartered Accountant.",
    ]},
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 mb-6 text-[12px] text-amber-700">
        This section provides a reference summary of key Nidhi Company regulations. For complete rules, refer to the Companies Act 2013, Nidhi Rules 2014, and subsequent amendments.
      </div>

      <div className="flex flex-col gap-4">
        {nidhiRules.map((rule) => (
          <div key={rule.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-900 mb-3">{rule.title}</h3>
            <div className="flex flex-col gap-2">
              {rule.sections.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] text-slate-500">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-indigo-500">
                    {i + 1}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ComplianceView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "checklist": return <ChecklistTab />;
      case "kyc": return <KycMonitoringTab />;
      case "aml": return <AmlMonitoringTab />;
      case "filings": return <FilingsTab />;
      case "alerts": return <AlertsTab />;
      case "audit": return <AuditLogsTab />;
      case "panels": return <PanelsTab />;
      case "suspicious": return <SuspiciousTransactionsTab />;
      case "highrisk": return <HighRiskMembersTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Compliance Center</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Monitor regulatory compliance status across all Nidhi Company rules.
              AI-powered compliance tracking ensures adherence to Nidhi Rules 2014,
              Nidhi (Amendment) Rules 2022, and MCA filing requirements.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">{complianceScore.overall}%</div>
              <div className="text-slate-400 text-[10px]">Compliance Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
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
