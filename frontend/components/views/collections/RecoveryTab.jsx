"use client";

import { useState } from "react";
import { useRecoveryCases } from "@/hooks/useData";
import DataTable from "@/components/ui/DataTable";

function RecoveryStatusBadge({ status }) {
  const styles = {
    Active: "bg-blue-50 text-blue-600 border-blue-200/60",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-200/60",
    Settled: "bg-success-50 text-success border-success-200/60",
    Legal: "bg-danger-50 text-danger-500 border-danger-200/60",
    "Written Off": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

const columns = [
  { key: "id", label: "ID" },
  { key: "memberName", label: "Member" },
  { key: "outstanding", label: "Outstanding" },
  { key: "missedEmis", label: "Missed EMIs" },
  { key: "assignedAgent", label: "Agent" },
  { key: "status", label: "Status" },
];

export default function RecoveryTab() {
  const { data: recoveryCases = [], loading } = useRecoveryCases();
  const [filterStatus, setFilterStatus] = useState("All");

  if (loading) {
    return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>;
  }

  const filtered = recoveryCases.filter((r) => filterStatus === "All" || r.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-4" style={{ scrollbarWidth: "none" }}>
        {["All", "In Progress", "Settled", "Written Off"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterStatus === f ? "bg-primary-50 border-primary-300 text-primary font-semibold" : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"}`}>
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(r) => (
          <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{r.id}</td>
            <td className="px-5 py-3 text-[13px] font-medium text-body">{r.memberName}</td>
            <td className="px-5 py-3 text-[13px] font-mono font-semibold text-danger-500">{r.outstanding}</td>
            <td className="px-5 py-3 text-[13px] font-mono text-body">{r.missedEmis}</td>
            <td className="px-5 py-3 text-[12px] text-body">{r.assignedAgent || "—"}</td>
            <td className="px-5 py-3"><RecoveryStatusBadge status={r.status} /></td>
          </tr>
        )}
      />
      <div className="px-5 py-3 border-t border-slate-100 text-xs text-heading">
        Showing {filtered.length} of {recoveryCases.length} recovery cases
      </div>
    </div>
  );
}
