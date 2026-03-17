"use client";

import { useState } from "react";
import { fraudCases } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";

export default function CasesTab() {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");

  const filtered = fraudCases.filter((c) => {
    const matchesSearch = c.type.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === "All" || c.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cases..."
          className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle" />
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Critical", "High", "Medium"].map((f) => (
            <button key={f} onClick={() => setFilterSeverity(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterSeverity === f ? "bg-primary-50 border-primary-300 text-primary font-semibold" : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((fc) => (
          <div key={fc.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-bold text-heading">{fc.type}</span>
                  <StatusBadge status={fc.severity} />
                </div>
                <div className="text-[11px] text-heading font-mono">{fc.id} &middot; {fc.time} &middot; {fc.detectedBy}</div>
              </div>
              <StatusBadge status={fc.status} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{fc.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Involved Members</div>
                <div className="text-[12px] font-semibold text-body font-mono truncate">{fc.member}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Potential Loss</div>
                <div className="text-[13px] font-bold text-danger-500 font-mono">{fc.potentialLoss}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Detection Engine</div>
                <div className="text-[12px] font-semibold text-body">{fc.detectedBy}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
