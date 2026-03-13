"use client";

import { useState } from "react";
import { reportsList } from "@/data/mockData";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PDFReportsTab() {
  const [filterCategory, setFilterCategory] = useState("All");
  const categories = ["All", ...new Set(reportsList.map((r) => r.category))];
  const filtered = reportsList.filter((r) => filterCategory === "All" || r.category === filterCategory);

  const recentReports = [
    { name: "Monthly Financial Summary", generated: "01 Mar 2026, 09:15", size: "2.4 MB", by: "Scheduled" },
    { name: "Loan Portfolio Health", generated: "08 Mar 2026, 14:30", size: "1.8 MB", by: "Ramesh (Admin)" },
    { name: "Fraud Intelligence Brief", generated: "08 Mar 2026, 16:00", size: "980 KB", by: "AI Agent" },
    { name: "Chit Fund Auction Report", generated: "05 Mar 2026, 11:45", size: "1.2 MB", by: "Scheduled" },
    { name: "Compliance & Regulatory", generated: "01 Mar 2026, 10:00", size: "3.1 MB", by: "Scheduled" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterCategory === c ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{r.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{r.id}</div>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{r.category}</span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{r.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Frequency</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.frequency}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Format</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.format}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Last Generated</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.lastGenerated}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors">
                Generate
              </button>
              <button className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[12px] font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                Download Last
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Report Scheduling */}
        <SectionCard title="Report Scheduling">
          <div className="flex flex-col gap-3">
            {[
              { report: "Monthly Financial Summary", schedule: "1st of every month, 09:00 AM", nextRun: "01 Apr 2026", status: "Active" },
              { report: "Loan Portfolio Health", schedule: "Every Monday, 08:00 AM", nextRun: "17 Mar 2026", status: "Active" },
              { report: "Compliance & Regulatory", schedule: "1st of every quarter, 10:00 AM", nextRun: "01 Apr 2026", status: "Active" },
              { report: "Fraud Intelligence Brief", schedule: "Every Friday, 04:00 PM", nextRun: "14 Mar 2026", status: "Active" },
              { report: "Member Growth Report", schedule: "1st of every month, 09:30 AM", nextRun: "01 Apr 2026", status: "Paused" },
            ].map((s) => (
              <div key={s.report} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{s.report}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="text-[11px] text-slate-400">{s.schedule}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Next: {s.nextRun}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Generated */}
        <SectionCard title="Recently Generated Reports">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Report</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Generated</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Size</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((rr) => (
                  <tr key={rr.name + rr.generated} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{rr.name}</td>
                    <td className="px-5 py-3">
                      <div className="text-[12px] text-slate-500">{rr.generated}</div>
                      <div className="text-[10px] text-slate-400">by {rr.by}</div>
                    </td>
                    <td className="text-[12px] font-mono text-slate-500 px-5 py-3 text-right">{rr.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Batch Generation */}
      <SectionCard title="Batch Report Generation" className="mt-4">
        <p className="text-[12px] text-slate-400 mb-4 -mt-2">Generate all monthly reports in one batch. Includes Financial Summary, Member Growth, Loan Portfolio, Deposit Maturity, and Compliance reports.</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button className="py-2.5 px-6 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors shrink-0">
            Generate All Monthly Reports
          </button>
          <span className="text-[11px] text-slate-400">Last batch: 01 Mar 2026 &nbsp;|&nbsp; 8 reports &nbsp;|&nbsp; 14.2 MB total</span>
        </div>
      </SectionCard>
    </div>
  );
}
