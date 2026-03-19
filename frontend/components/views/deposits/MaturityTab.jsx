"use client";

import { useMaturityTracker } from "@/hooks/useData";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";

const columns = [
  { key: "id", label: "Account" },
  { key: "memberName", label: "Member" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "maturityDate", label: "Maturity Date" },
  { key: "status", label: "Status" },
];

export default function MaturityTab() {
  const { data: depositAccounts = [] } = useMaturityTracker();
  const maturing = depositAccounts.filter((a) => a.status === "Maturing Soon" || a.status === "Matured");
  const upcoming = depositAccounts.filter((a) => a.status === "Active" && a.maturityDate !== "\u2014");

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Maturing This Month</div>
          <div className="text-[22px] font-bold font-mono text-warning">48</div>
          <div className="text-[11px] text-heading mt-1">Worth \u20B91.2 Cr</div>
        </div>
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Renewal Rate</div>
          <div className="text-[22px] font-bold font-mono text-success">72%</div>
          <div className="text-[11px] text-heading mt-1">Last 3 months average</div>
        </div>
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Auto-Renewal Enabled</div>
          <div className="text-[22px] font-bold font-mono text-primary">68%</div>
          <div className="text-[11px] text-heading mt-1">Of all FD accounts</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Maturity Schedule</h3>
          <p className="text-[12px] text-heading mt-1">Track upcoming deposit maturities and plan liquidity accordingly</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...maturing, ...upcoming].map((a) => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.id}</td>
                <td className="px-5 py-3 text-[13px] font-semibold text-body">{a.memberName}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{a.type}</td>
                <td className="px-5 py-3 text-[13px] font-bold text-body font-mono">{a.amount}</td>
                <td className="px-5 py-3 text-[12px] text-heading">{a.maturityDate}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
