"use client";

import { useState } from "react";
import { depositAccounts } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

const columns = [
  { key: "id", label: "Account" },
  { key: "memberName", label: "Member" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "rate", label: "Rate" },
  { key: "maturityDate", label: "Maturity" },
  { key: "status", label: "Status" },
];

export default function AccountsTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = depositAccounts.filter((a) => {
    const matchesSearch = a.memberName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or account ID..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Fixed Deposit", "Recurring Deposit", "Savings Deposit"].map((f) => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterType === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
              {f === "All" ? "All Types" : f.replace("Deposit", "").trim()}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        renderRow={(a) => (
          <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.id}</td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-purple-50 border border-purple-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-600">
                  {a.memberName.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{a.memberName}</div>
                  <div className="text-[10px] text-slate-400">{a.memberId}</div>
                </div>
              </div>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{a.type}</td>
            <td className="px-5 py-3 text-[13px] font-bold text-slate-700 font-mono">{a.amount}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.rate}</td>
            <td className="px-5 py-3 text-[12px] text-slate-400">{a.maturityDate}</td>
            <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
          </tr>
        )}
      />
      {filtered.length === 0 && (
        <div className="text-center py-10 text-[13px] text-slate-400">No deposit accounts found</div>
      )}
    </div>
  );
}
