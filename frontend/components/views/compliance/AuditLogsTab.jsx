"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/useData";
import TabBar from "@/components/ui/TabBar";
import DataTable from "@/components/ui/DataTable";

const extraLogs = [
  { id: "AL-007", action: "Loan Approved", user: "Branch Manager", detail: "Loan LA-001 approved for M-1001 (\u20B92,00,000)", timestamp: "06 Mar 2026, 15:45", category: "Loans" },
  { id: "AL-008", action: "KYC Verified", user: "KYC Agent", detail: "M-1014 Aadhaar and PAN verification completed", timestamp: "06 Mar 2026, 11:30", category: "KYC" },
  { id: "AL-009", action: "FD Created", user: "Teller", detail: "FD-005 created for M-1018 (\u20B93,00,000 @ 9.0%)", timestamp: "05 Mar 2026, 14:20", category: "Deposits" },
  { id: "AL-010", action: "STR Filed", user: "Compliance Officer", detail: "STR-003 filed with FIU-IND for M-1013", timestamp: "05 Mar 2026, 10:00", category: "AML" },
  { id: "AL-011", action: "Auction Completed", user: "System", detail: "CS-002 auction completed. Winner: M-1007, Bid: \u20B92,40,000", timestamp: "04 Mar 2026, 18:00", category: "Chit Funds" },
  { id: "AL-012", action: "Password Reset", user: "Admin", detail: "Password reset for operator OP-003 (Kavitha)", timestamp: "04 Mar 2026, 09:15", category: "Security" },
  { id: "AL-013", action: "Rate Changed", user: "Admin", detail: "RD interest rate updated from 8.0% to 8.5%", timestamp: "03 Mar 2026, 16:00", category: "Config" },
  { id: "AL-014", action: "Member Onboarded", user: "Onboarding Agent", detail: "M-1018 Padma Krishnan onboarded with full KYC", timestamp: "03 Mar 2026, 11:45", category: "Members" },
  { id: "AL-015", action: "CTR Generated", user: "System", detail: "CTR-005 auto-generated for cash deposit \u20B918,75,000", timestamp: "02 Mar 2026, 14:30", category: "AML" },
  { id: "AL-016", action: "Board Meeting Logged", user: "Company Secretary", detail: "Board meeting minutes recorded for 01 Mar 2026", timestamp: "02 Mar 2026, 10:00", category: "Governance" },
  { id: "AL-017", action: "EMI Default Alert", user: "System", detail: "M-1003 missed 4th consecutive EMI on loan LA-009", timestamp: "01 Mar 2026, 09:00", category: "Loans" },
  { id: "AL-018", action: "Fraud Alert Raised", user: "AI Agent", detail: "Coordinated bidding pattern detected in CS-002 auction", timestamp: "28 Feb 2026, 17:30", category: "Fraud" },
];

const logCategories = ["All", "Config", "Security", "KYC", "AML", "Loans", "Deposits", "Members", "Chit Funds", "Governance", "Fraud"];

const columns = [
  { key: "timestamp", label: "Timestamp" },
  { key: "action", label: "Action" },
  { key: "user", label: "User" },
  { key: "detail", label: "Details" },
  { key: "category", label: "Category" },
];

export default function AuditLogsTab() {
  const { data: auditLog = [] } = useAuditLogs();
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const extendedLogs = [...auditLog, ...extraLogs];

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

  const categoryTabs = logCategories.map((c) => ({ id: c, label: c }));

  return (
    <div className="animate-fade-in">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search audit logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl px-4 py-2 text-xs border border-slate-200 bg-white text-body placeholder-slate-300 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 flex-1"
        />
      </div>

      <TabBar tabs={categoryTabs} activeTab={filterCategory} onChange={setFilterCategory} />

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(l) => (
          <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] text-heading whitespace-nowrap">{l.timestamp}</td>
            <td className="px-5 py-3 text-[13px] font-medium text-body whitespace-nowrap">{l.action}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{l.user}</td>
            <td className="px-5 py-3 text-[12px] text-heading">
              <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={l.detail}>{l.detail}</span>
            </td>
            <td className="px-5 py-3">
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{l.category}</span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
