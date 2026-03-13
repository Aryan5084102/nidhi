"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import TabBar from "@/components/ui/TabBar";

const alerts = [
  { id: "CA-001", severity: "Critical", category: "Ratio Breach", description: "Unencumbered deposit ratio at 10.2%, approaching minimum 10% threshold under Nidhi Rules", affectedRule: "CL-004", date: "10 Mar 2026", status: "Open" },
  { id: "CA-002", severity: "Critical", category: "Regulatory Deadline", description: "NDH-1 annual compliance return due in 51 days. Data compilation pending for Section 406.", affectedRule: "CL-007", date: "09 Mar 2026", status: "Open" },
  { id: "CA-003", severity: "High", category: "KYC Expiry", description: "342 member KYC verifications expiring before 31 Mar 2026. Bulk re-verification required.", affectedRule: "CL-005", date: "08 Mar 2026", status: "Open" },
  { id: "CA-004", severity: "High", category: "Filing Due", description: "Form AOC-4 annual financial statements preparation must begin. Statutory audit scheduling needed.", affectedRule: "CL-007", date: "07 Mar 2026", status: "Acknowledged" },
  { id: "CA-005", severity: "Medium", category: "Rate Limit", description: "FD interest rate at 9.5% approaching RBI ceiling. Review rate structure before next quarter.", affectedRule: "CL-009", date: "06 Mar 2026", status: "Acknowledged" },
  { id: "CA-006", severity: "Medium", category: "Ratio Breach", description: "Loan-to-deposit ratio increased to 65% from 62%. Monitor for continued upward trend.", affectedRule: "CL-006", date: "05 Mar 2026", status: "Resolved" },
  { id: "CA-007", severity: "Low", category: "Regulatory Deadline", description: "MGT-7A annual return filing window opens in 8 months. Begin data preparation.", affectedRule: "CL-007", date: "04 Mar 2026", status: "Acknowledged" },
  { id: "CA-008", severity: "High", category: "KYC Expiry", description: "5 high-value depositors (FD > \u20B95L) have KYC documents expiring within 15 days.", affectedRule: "CL-005", date: "10 Mar 2026", status: "Open" },
  { id: "CA-009", severity: "Critical", category: "Regulatory Deadline", description: "Board meeting minutes for Q3 not yet filed with ROC. Mandatory under Section 118.", affectedRule: "CL-008", date: "03 Mar 2026", status: "Open" },
  { id: "CA-010", severity: "Low", category: "Rate Limit", description: "Savings deposit rate of 4.0% is below market average. Review for member retention.", affectedRule: "CL-009", date: "01 Mar 2026", status: "Closed" },
];

export default function AlertsTab() {
  const [filterSeverity, setFilterSeverity] = useState("All");

  const filtered = alerts.filter((a) => filterSeverity === "All" || a.severity === filterSeverity);

  const severityCounts = {
    Critical: alerts.filter((a) => a.severity === "Critical").length,
    High: alerts.filter((a) => a.severity === "High").length,
    Medium: alerts.filter((a) => a.severity === "Medium").length,
    Low: alerts.filter((a) => a.severity === "Low").length,
  };

  const filterTabs = [
    { id: "All", label: "All" },
    { id: "Critical", label: "Critical" },
    { id: "High", label: "High" },
    { id: "Medium", label: "Medium" },
    { id: "Low", label: "Low" },
  ];

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
      <TabBar tabs={filterTabs} activeTab={filterSeverity} onChange={setFilterSeverity} />

      {/* Alerts List */}
      <div className="flex flex-col gap-3">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <StatusBadge status={a.severity} />
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
