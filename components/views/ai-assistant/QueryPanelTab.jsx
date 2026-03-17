"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const queryCategories = [
  {
    name: "Members",
    color: "indigo",
    queries: [
      "Top 10 members by deposit value",
      "Members with KYC pending > 30 days",
      "Members with STI score below 50",
      "New members this month",
    ],
  },
  {
    name: "Loans",
    color: "emerald",
    queries: [
      "Overdue loans > 60 days",
      "Loans with high NPA risk",
      "EMI collection rate this month",
    ],
  },
  {
    name: "Deposits",
    color: "amber",
    queries: [
      "FDs maturing this quarter",
      "RD default list",
      "Deposit growth vs target",
    ],
  },
  {
    name: "Compliance",
    color: "violet",
    queries: [
      "NDH-1 filing checklist",
      "KYC non-compliant members",
      "Regulatory deadline tracker",
    ],
  },
  {
    name: "Risk",
    color: "rose",
    queries: [
      "Members with declining STI",
      "Fraud risk hotspots",
      "Liquidity stress test results",
    ],
  },
  {
    name: "Fraud",
    color: "red",
    queries: [
      "Suspicious transaction alerts",
      "Duplicate KYC detection",
      "Unusual withdrawal patterns",
    ],
  },
];

const recentQueryHistory = [
  { text: "Show all overdue loans > 60 days", time: "11 Mar, 10:15 AM", category: "Loans" },
  { text: "Members with declining STI trend", time: "11 Mar, 09:48 AM", category: "Risk" },
  { text: "FD maturity schedule for April", time: "10 Mar, 04:22 PM", category: "Deposits" },
  { text: "Branch-wise collection summary", time: "10 Mar, 02:10 PM", category: "Members" },
  { text: "KYC pending list — Whitefield", time: "10 Mar, 11:30 AM", category: "Compliance" },
  { text: "NPA classification report", time: "09 Mar, 03:45 PM", category: "Loans" },
];

export default function QueryPanelTab() {
  const [selectedCategory, setSelectedCategory] = useState("Members");
  const [selectedQuery, setSelectedQuery] = useState(null);

  const sampleResults = {
    "Top 10 members by deposit value": [
      { id: "M-1001", name: "Anand Krishnan", deposits: "Rs.14.8 Lakhs", branch: "Indiranagar" },
      { id: "M-1015", name: "Sunita Rao", deposits: "Rs.12.3 Lakhs", branch: "Koramangala" },
      { id: "M-1008", name: "Venkatesh Iyer", deposits: "Rs.11.7 Lakhs", branch: "Jayanagar" },
      { id: "M-1022", name: "Lakshmi Devi", deposits: "Rs.10.5 Lakhs", branch: "Whitefield" },
      { id: "M-1034", name: "Mohan Reddy", deposits: "Rs.9.8 Lakhs", branch: "Indiranagar" },
    ],
    "Members with KYC pending > 30 days": [
      { id: "M-1047", name: "Priya Venkatesh", deposits: "KYC Pending 45 days", branch: "Koramangala" },
      { id: "M-1089", name: "Sunil Agarwal", deposits: "KYC Pending 38 days", branch: "Indiranagar" },
      { id: "M-1134", name: "Ramesh Babu", deposits: "KYC Pending 62 days", branch: "Whitefield" },
      { id: "M-1156", name: "Geeta Sharma", deposits: "KYC Pending 51 days", branch: "Jayanagar" },
    ],
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
  };

  const currentCategory = queryCategories.find((c) => c.name === selectedCategory);
  const resultData = sampleResults[selectedQuery] || null;

  return (
    <div className="space-y-5">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {queryCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => { setSelectedCategory(cat.name); setSelectedQuery(null); }}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              selectedCategory === cat.name
                ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Query cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentCategory?.queries.map((q) => (
          <button
            key={q}
            onClick={() => handleQueryClick(q)}
            className={`text-left bg-white rounded-2xl p-4 card-shadow border transition-all cursor-pointer ${
              selectedQuery === q
                ? "border-primary-300 ring-2 ring-primary-500/10"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <p className="text-[13px] text-body font-medium">{q}</p>
            <p className="text-[11px] text-heading mt-1">Click to execute query</p>
          </button>
        ))}
      </div>

      {/* Results area */}
      {selectedQuery && (
        <SectionCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Query Results: {selectedQuery}</h3>
            <StatusBadge status="Completed" />
          </div>
          {resultData ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["ID", "Name", "Value", "Branch"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] text-heading font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-heading">{row.id}</td>
                      <td className="px-4 py-2.5 text-[13px] text-body font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-success">{row.deposits}</td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-500">{row.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-heading">
              Processing query... Results will appear here.
            </div>
          )}
        </SectionCard>
      )}

      {/* Recent queries */}
      <SectionCard title="Recent Queries">
        <div className="space-y-2.5">
          {recentQueryHistory.map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                <p className="text-[13px]  text-body">{q.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={q.category} />
                <span className="text-[11px] text-heading whitespace-nowrap">{q.time}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
