"use client";

import { auditLog } from "@/data/mockData";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";

const auditColumns = [
  { key: "id", label: "ID" },
  { key: "action", label: "Action" },
  { key: "user", label: "User" },
  { key: "detail", label: "Details" },
  { key: "timestamp", label: "Timestamp" },
];

export default function AuditLogTab() {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">System Audit Log</h3>
        <p className="text-[13px] text-slate-400">Track all administrative actions, configuration changes, and system events.</p>
      </SectionCard>

      <DataTable
        columns={auditColumns}
        data={auditLog}
        renderRow={(log) => (
          <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{log.id}</td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                log.action.includes("Alert") || log.action.includes("Suspended")
                  ? "bg-red-50 text-red-500 border-red-200/60"
                  : log.action.includes("Updated") || log.action.includes("Changed")
                  ? "bg-blue-50 text-blue-600 border-blue-200/60"
                  : log.action.includes("Completed") || log.action.includes("Restarted")
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {log.action}
              </span>
            </td>
            <td className="px-5 py-3">
              <span className={`text-[12px] font-medium ${log.user === "System" ? "text-slate-400" : log.user === "AI Agent" ? "text-indigo-500" : "text-slate-700"}`}>
                {log.user}
              </span>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[300px]">{log.detail}</td>
            <td className="px-5 py-3 text-[12px] text-slate-400">{log.timestamp}</td>
          </tr>
        )}
      />
    </div>
  );
}
