"use client";

import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import { paymentSchedule } from "./data";

function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: "bg-success-50 text-success border-success-200/60",
    Pending: "bg-blue-50 text-blue-600 border-blue-200/60",
    Overdue: "bg-danger-50 text-danger-500 border-danger-200/60",
    Partial: "bg-warning-50 text-warning border-warning-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

const columns = [
  { key: "id", label: "ID" },
  { key: "member", label: "Member" },
  { key: "scheme", label: "Scheme" },
  { key: "amountDue", label: "Amount Due" },
  { key: "dueDate", label: "Due Date" },
  { key: "status", label: "Status" },
];

export default function ScheduleTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = paymentSchedule.filter((p) => filterStatus === "All" || p.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-4" style={{ scrollbarWidth: "none" }}>
        {["All", "Paid", "Pending", "Overdue", "Partial"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterStatus === f ? "bg-primary-50 border-primary-300 text-primary font-semibold" : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"}`}>
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(p) => (
          <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{p.id}</td>
            <td className="px-5 py-3 text-[13px] font-medium text-body">{p.member}</td>
            <td className="px-5 py-3">
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{p.scheme}</span>
            </td>
            <td className="px-5 py-3 text-[13px] font-mono font-semibold text-body">{p.amountDue}</td>
            <td className="px-5 py-3 text-[12px] text-heading">{p.dueDate}</td>
            <td className="px-5 py-3"><PaymentStatusBadge status={p.status} /></td>
          </tr>
        )}
      />
      <div className="px-5 py-3 border-t border-slate-100 text-xs text-heading">
        Showing {filtered.length} of {paymentSchedule.length} payments
      </div>
    </div>
  );
}
