"use client";

import { loanDefaults } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import DataTable from "@/components/ui/DataTable";

const defaultColumns = [
  { key: "id", label: "Loan ID" },
  { key: "member", label: "Member" },
  { key: "outstanding", label: "Outstanding" },
  { key: "missedEmis", label: "Missed EMIs" },
  { key: "defaultDate", label: "Default Date" },
  { key: "status", label: "Status" },
];

export default function DefaultsTab() {
  const defaultMetrics = [
    { label: "Total Defaults", value: loanDefaults.length.toString(), color: "#DC2626" },
    { label: "Default Amount", value: "\u20B98.2L", color: "#BF6F6D" },
    { label: "Recovery Initiated", value: loanDefaults.filter((d) => d.status === "In Recovery").length.toString(), color: "#C49A4C" },
    { label: "Recovered", value: loanDefaults.filter((d) => d.status === "Recovered").length.toString(), color: "#059669" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Default Metrics */}
      <MetricGrid metrics={defaultMetrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Defaults Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Defaulted Loans</h3>
          <p className="text-[12px] text-heading mt-1">Track and manage loan defaults and recovery process</p>
        </div>
        <DataTable
          columns={defaultColumns}
          data={loanDefaults}
          renderRow={(d) => (
            <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
              <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{d.id}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-danger-50 border border-danger-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-danger-500">
                    {d.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-body">{d.memberName}</div>
                    <div className="text-[10px] text-heading">{d.memberId}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-[13px] font-bold text-danger-500 font-mono">{d.outstanding}</td>
              <td className="px-5 py-3 text-[13px] font-semibold text-body">{d.missedEmis}</td>
              <td className="px-5 py-3 text-[12px] text-heading">{d.defaultDate}</td>
              <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
