"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const featuredQueries = [
  {
    text: "Show high risk members",
    category: "Risk",
    responseType: "Table",
    response: "table",
    data: [
      { id: "M-1023", name: "Rajesh Malhotra", sti: 28, risk: 89, branch: "Whitefield" },
      { id: "M-1047", name: "Priya Venkatesh", sti: 31, risk: 84, branch: "Koramangala" },
      { id: "M-1089", name: "Sunil Agarwal", sti: 35, risk: 81, branch: "Indiranagar" },
      { id: "M-1112", name: "Kavitha Nair", sti: 38, risk: 78, branch: "Jayanagar" },
      { id: "M-1056", name: "Deepak Sharma", sti: 40, risk: 76, branch: "Whitefield" },
    ],
  },
  {
    text: "Explain liquidity risk",
    category: "Risk",
    responseType: "Text",
    response: "text",
    content:
      "Liquidity risk is the potential inability to meet cash obligations. Current ratio: 1.32 (healthy). Key concern: Rs.3.2 Cr FDs maturing in Q2. Maintain Rs.1.5 Cr buffer and monitor renewal rates closely.",
  },
  {
    text: "Generate compliance report",
    category: "Compliance",
    responseType: "Report",
    response: "status",
    content: "Compliance report generation initiated. Estimated time: 3 minutes. Sections: NDH-1 status, KYC compliance, deposit ratios, director qualifications.",
  },
  {
    text: "Predict loan defaults for next quarter",
    category: "Risk",
    responseType: "Chart",
    response: "text",
    content:
      "Prediction: 8-12 defaults expected (Rs.42-58L exposure). Business loans at highest risk (62%). 4 accounts with >80% default probability identified. Recommend early intervention for flagged accounts.",
  },
  {
    text: "Analyze member growth trends",
    category: "Growth",
    responseType: "Chart",
    response: "text",
    content:
      "Net member growth: +34 this quarter (vs +28 last quarter). Indiranagar leading with 18 new members. Whitefield showing negative trend (-6 net). Overall growth rate: 2.8% QoQ.",
  },
  {
    text: "Identify suspicious transactions",
    category: "Fraud",
    responseType: "Table",
    response: "table",
    data: [
      { id: "TXN-8821", name: "Arun Kumar", sti: 0, risk: 72, branch: "Whitefield" },
      { id: "TXN-8834", name: "Meena Reddy", sti: 0, risk: 68, branch: "Koramangala" },
      { id: "TXN-8847", name: "Vikram Joshi", sti: 0, risk: 65, branch: "Jayanagar" },
    ],
  },
];

const queryHistory = [
  { text: "Show high risk members", time: "11 Mar, 10:34 AM", type: "Table" },
  { text: "What is the current compliance score?", time: "11 Mar, 10:32 AM", type: "Text" },
  { text: "List overdue EMIs for March", time: "10 Mar, 04:45 PM", type: "Table" },
  { text: "Predict member churn for Q2", time: "10 Mar, 02:20 PM", type: "Chart" },
  { text: "Summarize loan portfolio health", time: "10 Mar, 11:10 AM", type: "Report" },
  { text: "Flag suspicious transactions this week", time: "09 Mar, 03:30 PM", type: "Table" },
  { text: "Calculate branch-wise deposit growth", time: "09 Mar, 01:15 PM", type: "Chart" },
  { text: "Generate board summary for Feb", time: "08 Mar, 05:00 PM", type: "Report" },
];

export default function AIQueriesTab() {
  const [activeQuery, setActiveQuery] = useState(null);

  return (
    <div className="space-y-5">
      {/* Featured queries */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Featured Queries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => setActiveQuery(activeQuery === i ? null : i)}
              className={`text-left bg-white rounded-2xl p-4 card-shadow border transition-all cursor-pointer ${
                activeQuery === i
                  ? "border-primary-300 ring-2 ring-primary-500/10"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <p className="text-[13px] text-body font-medium">{q.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  q.category === "Risk" ? "bg-rose-50 text-rose-600 border-rose-200" :
                  q.category === "Compliance" ? "bg-violet-50 text-violet-600 border-violet-200" :
                  q.category === "Growth" ? "bg-success-50 text-success border-success-200" :
                  "bg-danger-50 text-danger border-danger-200"
                }`}>
                  {q.category}
                </span>
                <StatusBadge status={q.responseType} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active query response */}
      {activeQuery !== null && (
        <SectionCard className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Response: {featuredQueries[activeQuery].text}</h3>
            <StatusBadge status="Completed" />
          </div>

          {featuredQueries[activeQuery].response === "table" && featuredQueries[activeQuery].data ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["ID", "Name", "STI/Alert", "Risk Score", "Branch"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] text-heading font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featuredQueries[activeQuery].data.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-heading">{row.id}</td>
                      <td className="px-4 py-2.5 text-[13px] text-body font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-warning">{row.sti || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          row.risk >= 80 ? "bg-danger-50 text-danger border-danger-200" :
                          row.risk >= 60 ? "bg-warning-50 text-warning border-warning-200" :
                          "bg-success-50 text-success border-success-200"
                        }`}>
                          {row.risk}/100
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-500">{row.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[13px] text-body leading-relaxed whitespace-pre-wrap">
                {featuredQueries[activeQuery].content}
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Quick actions */}
      <SectionCard title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          {[
            "Export high risk members",
            "Generate NPA report",
            "Run STI analysis",
            "Check compliance status",
            "Analyze deposit trends",
            "Review chit fund performance",
          ].map((action) => (
            <button
              key={action}
              className="text-[11px] font-medium px-3 py-2 rounded-xl border border-primary-200 bg-primary-50 text-primary cursor-pointer hover:bg-primary-100 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Query history */}
      <SectionCard title="Query History">
        <div className="space-y-2.5">
          {queryHistory.map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                <p className="text-[13px] text-body">{q.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={q.type} />
                <span className="text-[11px] text-heading whitespace-nowrap">{q.time}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
