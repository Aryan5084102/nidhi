"use client";

import { useState } from "react";
import { loanApplications } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

/* ─── Risk Badge ─── */
function RiskTag({ level }) {
  const styles = {
    Low: "bg-success-50 text-success border-success-200/60",
    Medium: "bg-warning-50 text-warning border-warning-200/60",
    High: "bg-danger-50 text-danger-500 border-danger-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

const columns = [
  { key: "id", label: "Application" },
  { key: "member", label: "Member" },
  { key: "amount", label: "Amount" },
  { key: "purpose", label: "Purpose" },
  { key: "risk", label: "Risk" },
  { key: "status", label: "Status" },
  { key: "applied", label: "Applied" },
];

export default function ApplicationsTab() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = loanApplications.filter((app) => {
    const matchesSearch = app.memberName.toLowerCase().includes(search.toLowerCase()) || app.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-heading hover:text-body transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Pending", "Under Review", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${
                filterStatus === f
                  ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                  : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(app) => (
          <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3">
              <span className="text-[12px] text-slate-500 font-mono">{app.id}</span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary-50 border border-primary-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                  {app.memberName.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-body">{app.memberName}</div>
                  <div className="text-[10px] text-heading">{app.memberId}</div>
                </div>
              </div>
            </td>
            <td className="px-5 py-3 text-[13px] font-bold text-body font-mono">{app.amount}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{app.purpose}</td>
            <td className="px-5 py-3"><RiskTag level={app.risk} /></td>
            <td className="px-5 py-3"><StatusBadge status={app.status} /></td>
            <td className="px-5 py-3 text-[12px] text-heading">{app.appliedDate}</td>
          </tr>
        )}
      />
      {filtered.length === 0 && (
        <div className="text-center py-10 text-[13px] text-heading">No applications found</div>
      )}
    </div>
  );
}
