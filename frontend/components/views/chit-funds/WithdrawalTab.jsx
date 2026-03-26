"use client";

import { useState } from "react";
import { useChitEnrollments } from "@/hooks/useData";
import { put } from "@/lib/api";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";

const WORKFLOW_STEPS = [
  { step: 1, title: "Initiate Withdrawal", desc: "Member or manager initiates withdrawal request", color: "bg-warning-50 text-warning border-warning-200" },
  { step: 2, title: "Calculate Commission", desc: "System computes foreman commission deduction", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { step: 3, title: "Generate Refund", desc: "Refund amount calculated after deductions", color: "bg-primary-50 text-primary border-primary-200" },
  { step: 4, title: "Confirm Deregistration", desc: "Manager confirms and submits to Registrar", color: "bg-success-50 text-success border-success-200" },
];

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function WithdrawalTab() {
  const { data: enrollments = [], refetch } = useChitEnrollments();
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const withdrawn = enrollments.filter((e) => e.status === "Withdrawn" || e.status === "Cancelled");
  const pendingDereg = withdrawn.filter((e) => e.deregistrationStatus === "Pending Deregistration");
  const deregistered = withdrawn.filter((e) => e.deregistrationStatus === "Deregistered");

  const metrics = [
    { label: "Total Withdrawals", value: withdrawn.length.toString(), color: "#BF6F6D" },
    { label: "Pending Deregistration", value: pendingDereg.length.toString(), change: pendingDereg.length > 0 ? "Action Needed" : "", color: "#C49A4C" },
    { label: "Deregistered", value: deregistered.length.toString(), color: "#5B9E8A" },
    { label: "Active Enrollments", value: enrollments.filter((e) => e.status === "Active").length.toString(), color: "#6B8ABF" },
  ];

  const filtered = filterStatus === "All"
    ? withdrawn
    : withdrawn.filter((e) => e.deregistrationStatus === filterStatus);

  const handleDeregister = async (id) => {
    setActionLoading(id);
    try {
      await put(`/chit-enrollments/${id}/deregister`);
      refetch();
    } catch (err) {
      console.error("Deregistration failed:", err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Withdrawal Workflow */}
      <SectionCard title="Withdrawal Workflow — Chit Funds Act, 1982" className="mb-6">
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {WORKFLOW_STEPS.map((ps, idx) => (
            <div key={ps.step} className="flex items-start flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-10 h-10 rounded-2xl ${ps.color} border flex items-center justify-center text-[14px] font-bold mb-2`}>
                  {ps.step}
                </div>
                <div className="text-[12px] font-semibold text-body mb-1">{ps.title}</div>
                <div className="text-[10px] text-heading leading-relaxed px-2 max-w-[140px]">{ps.desc}</div>
              </div>
              {idx < WORKFLOW_STEPS.length - 1 && (
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

      {/* Registrar Notification Log */}
      <SectionCard title="Registrar Notification Log">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
          {["All", "Pending Deregistration", "Deregistered"].map((f) => (
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

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Enrollment ID", "Member", "Scheme", "Withdrawal Date", "Deregistration Status", "Actions"].map((col) => (
                  <th key={col} className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((enr) => (
                <tr key={enr.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 text-[12px] font-mono font-semibold text-primary">{enr.id}</td>
                  <td className="py-3 pr-4">
                    <div className="text-[12px] font-semibold text-body">{enr.memberName}</div>
                    <div className="text-[10px] text-heading">{enr.memberId}</div>
                  </td>
                  <td className="py-3 pr-4 text-[12px] text-body font-medium">{enr.schemeName}</td>
                  <td className="py-3 pr-4 text-[12px] text-heading">{enr.appliedDate}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={enr.deregistrationStatus === "Deregistered" ? "Active" : enr.deregistrationStatus === "Pending Deregistration" ? "Pending" : "—"} />
                  </td>
                  <td className="py-3 pr-4">
                    {enr.deregistrationStatus === "Pending Deregistration" ? (
                      <button
                        onClick={() => handleDeregister(enr.id)}
                        disabled={actionLoading === enr.id}
                        className="px-3 py-1.5 bg-success-50 border border-success-200 text-success rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-success-100 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === enr.id ? "Processing..." : "Confirm & Notify Registrar"}
                      </button>
                    ) : enr.deregistrationStatus === "Deregistered" ? (
                      <span className="text-[11px] text-success font-medium">Registrar Notified</span>
                    ) : (
                      <span className="text-[11px] text-heading">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px] text-heading">No withdrawal records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
