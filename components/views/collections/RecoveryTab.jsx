"use client";

import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import { recoveryCases } from "./data";

function RecoveryStatusBadge({ status }) {
  const styles = {
    Active: "bg-blue-50 text-blue-600 border-blue-200/60",
    Settled: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Legal: "bg-red-50 text-red-500 border-red-200/60",
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
  { key: "member", label: "Member" },
  { key: "type", label: "Type" },
  { key: "outstanding", label: "Outstanding" },
  { key: "stage", label: "Recovery Stage" },
  { key: "assignedAgent", label: "Assigned Agent" },
  { key: "lastAction", label: "Last Action" },
  { key: "status", label: "Status" },
];

export default function RecoveryTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = recoveryCases.filter((r) => filterStatus === "All" || r.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-0.5 mb-4" style={{ scrollbarWidth: "none" }}>
        {["All", "Active", "Settled", "Legal", "Written Off"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterStatus === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(r) => (
          <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{r.id}</td>
            <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{r.member}</td>
            <td className="px-5 py-3">
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r.type}</span>
            </td>
            <td className="px-5 py-3 text-[13px] font-mono font-semibold text-red-500">{r.outstanding}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                r.stage === "Legal" ? "bg-red-50 text-red-500 border-red-200/60"
                : r.stage === "Field Visit" ? "bg-orange-50 text-orange-600 border-orange-200/60"
                : r.stage === "Follow-up" ? "bg-amber-50 text-amber-600 border-amber-200/60"
                : r.stage === "Notice Sent" ? "bg-blue-50 text-blue-600 border-blue-200/60"
                : r.stage === "Settled" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                : r.stage === "Written Off" ? "bg-slate-100 text-slate-500 border-slate-200"
                : "bg-slate-50 text-slate-500 border-slate-200"
              }`}>
                {r.stage}
              </span>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-600">{r.assignedAgent}</td>
            <td className="px-5 py-3 text-[11px] text-slate-400 max-w-[200px]">{r.lastAction}</td>
            <td className="px-5 py-3"><RecoveryStatusBadge status={r.status} /></td>
          </tr>
        )}
      />
      <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
        Showing {filtered.length} of {recoveryCases.length} recovery cases
      </div>
    </div>
  );
}
