"use client";

import { useState } from "react";
import { useComplianceChecklist } from "@/hooks/useData";
import StatusBadge from "@/components/ui/StatusBadge";
import TabBar from "@/components/ui/TabBar";
import DataTable from "@/components/ui/DataTable";

export default function ChecklistTab() {
  const { data: complianceChecklist = [] } = useComplianceChecklist();
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = complianceChecklist.filter((c) => filterStatus === "All" || c.status === filterStatus);

  const filterTabs = [
    { id: "All", label: "All" },
    { id: "Compliant", label: "Compliant" },
    { id: "Warning", label: "Warning" },
    { id: "Action Required", label: "Action Required" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "rule", label: "Compliance Rule" },
    { key: "category", label: "Category" },
    { key: "lastAudit", label: "Last Audit" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="animate-fade-in">
      <TabBar tabs={filterTabs} activeTab={filterStatus} onChange={setFilterStatus} />

      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(c) => (
          <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{c.id}</td>
            <td className="px-5 py-3">
              <div className="text-[13px] font-medium text-body">{c.rule}</div>
              <div className="text-[11px] text-heading mt-0.5">{c.details}</div>
            </td>
            <td className="px-5 py-3">
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full whitespace-nowrap">{c.category}</span>
            </td>
            <td className="px-5 py-3 text-[12px] text-heading whitespace-nowrap">{c.lastAudit}</td>
            <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
          </tr>
        )}
      />
    </div>
  );
}
