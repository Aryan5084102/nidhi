"use client";

import { useState } from "react";
import { useDepositApplications } from "@/hooks/useData";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";

const processSteps = [
  { step: 1, title: "Member Applies", desc: "Member selects deposit type, amount, tenure, and provides nominee details.", color: "bg-primary-50 text-primary border-primary-200" },
  { step: 2, title: "KYC Verification", desc: "System verifies member KYC status and eligibility for the scheme.", color: "bg-warning-50 text-warning border-warning-200" },
  { step: 3, title: "Manager Approval", desc: "Branch manager reviews and approves or rejects the application.", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { step: 4, title: "Account Active", desc: "Deposit account is created and funds are accepted. Interest accrual begins.", color: "bg-success-50 text-success border-success-200" },
];

export default function ApplicationsTab() {
  const { data: applications = [] } = useDepositApplications();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const pending = applications.filter((a) => a.status === "Pending" || a.status === "Under Review");
  const active = applications.filter((a) => a.status === "Active");
  const rejected = applications.filter((a) => a.status === "Rejected");

  const metrics = [
    { label: "Total Applications", value: applications.length.toString(), color: "#6B8ABF" },
    { label: "Pending Approval", value: pending.length.toString(), change: pending.length > 0 ? "Needs Action" : "", color: "#C49A4C" },
    { label: "Active Accounts", value: active.length.toString(), color: "#5B9E8A" },
    { label: "Rejected", value: rejected.length.toString(), color: "#BF6F6D" },
  ];

  const filtered = applications.filter((a) => {
    const matchesSearch = a.memberName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      {/* Metrics */}
      <MetricGrid metrics={metrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Deposit Account Opening Process */}
      <SectionCard title="Deposit Account Opening Process" className="mb-6">
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {processSteps.map((ps, idx) => (
            <div key={ps.step} className="flex items-start flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-10 h-10 rounded-2xl ${ps.color} border flex items-center justify-center text-[14px] font-bold mb-2`}>
                  {ps.step}
                </div>
                <div className="text-[12px] font-semibold text-body mb-1">{ps.title}</div>
                <div className="text-[10px] text-heading leading-relaxed px-2 max-w-[140px]">{ps.desc}</div>
              </div>
              {idx < processSteps.length - 1 && (
                <div className="flex items-center pt-5 -mx-1">
                  <div className="w-8 h-0.5 bg-slate-300" />
                  <svg className="w-3 h-3 text-subtle -ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* All Applications Table */}
      <SectionCard title="All Deposit Applications">
        <div className="flex flex-col gap-3 mb-5">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or application ID..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-heading hover:text-body transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {["All", "Pending", "Under Review", "Active", "Rejected"].map((f) => (
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

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Application ID", "Member", "Type", "Amount", "Rate", "Tenure", "Nominee", "Applied", "Status", "Account"].map((col) => (
                  <th key={col} className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 text-[12px] font-mono font-semibold text-primary">{app.id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-secondary-50 border border-secondary-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-secondary">
                        {app.memberName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-body">{app.memberName}</div>
                        <div className="text-[10px] text-heading">{app.memberId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[12px] text-body font-medium">{app.type}</td>
                  <td className="py-3 pr-4 text-[12px] font-mono font-bold text-body">{app.amount}</td>
                  <td className="py-3 pr-4 text-[12px] font-mono text-success font-semibold">{app.rate}</td>
                  <td className="py-3 pr-4 text-[12px] text-heading">{app.tenure}</td>
                  <td className="py-3 pr-4 text-[11px] text-heading">{app.nomineeName}</td>
                  <td className="py-3 pr-4 text-[12px] text-heading">{app.appliedDate}</td>
                  <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                  <td className="py-3 pr-4">
                    {app.status === "Active" ? (
                      <span className="text-[11px] text-success font-medium font-mono">{app.accountId}</span>
                    ) : (
                      <span className="text-[11px] text-heading">{app.status}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[13px] text-heading">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
