"use client";

import { useState } from "react";
import { reportsList, reportAnalytics } from "@/data/mockData";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "reports", label: "Report Library" },
  { id: "analytics", label: "Analytics" },
];

function OverviewTab() {
  return (
    <div className="animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {reportAnalytics.keyMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono text-slate-900">{m.value}</div>
            <div className={`text-[11px] mt-1 font-medium ${m.change.startsWith("+") ? "text-emerald-500" : m.change.startsWith("-") ? "text-red-500" : "text-slate-400"}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Member Growth */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Member Growth Trend</h3>
          <div className="flex items-end gap-3 h-40">
            {reportAnalytics.memberGrowth.map((d) => {
              const maxVal = 600;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                    <div className="flex-1 bg-indigo-200 rounded-t-lg transition-all duration-500" style={{ height: `${(d.newMembers / maxVal) * 100}%` }} title={`New: ${d.newMembers}`} />
                    <div className="flex-1 bg-red-200 rounded-t-lg transition-all duration-500" style={{ height: `${(d.churned / maxVal) * 100}%` }} title={`Churned: ${d.churned}`} />
                  </div>
                  <span className="text-[10px] text-slate-400">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-200" /><span className="text-[11px] text-slate-400">New Members</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-200" /><span className="text-[11px] text-slate-400">Churned</span></div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Revenue Breakdown</h3>
          <div className="flex flex-col gap-3">
            {reportAnalytics.revenueBreakdown.map((r) => (
              <div key={r.source} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{r.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">₹{(r.amount / 100000).toFixed(1)}L</span>
                    <span className="text-[11px] text-slate-400 font-mono">{r.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-400 transition-all duration-700" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: reportAnalytics.totalMembers.toLocaleString(), sub: "Active accounts", color: "#6B8ABF" },
            { label: "Net Member Growth", value: "+2,525", sub: "Last 6 months", color: "#5B9E8A" },
            { label: "Monthly Revenue", value: "₹1.18 Cr", sub: "March 2026", color: "#9585B5" },
            { label: "Chit Fund AUM", value: "₹22.5 Cr", sub: "Across 6 schemes", color: "#C49A4C" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportLibraryTab() {
  const [filterCategory, setFilterCategory] = useState("All");
  const categories = ["All", ...new Set(reportsList.map((r) => r.category))];

  const filtered = reportsList.filter((r) => filterCategory === "All" || r.category === filterCategory);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterCategory === c ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}

function AnalyticsTab() {
  const kpis = [
    { title: "Deposit Growth Rate", value: "6.1%", target: "5.0%", status: "Above Target", color: "#059669" },
    { title: "Loan Default Rate", value: "2.1%", target: "3.0%", status: "Within Target", color: "#059669" },
    { title: "Member Retention", value: "97.8%", target: "95.0%", status: "Above Target", color: "#059669" },
    { title: "Compliance Score", value: "94%", target: "90%", status: "Above Target", color: "#059669" },
    { title: "Revenue Growth", value: "8.6%", target: "10.0%", status: "Below Target", color: "#D97706" },
    { title: "Cost Efficiency", value: "44%", target: "45%", status: "Within Target", color: "#059669" },
    { title: "AI Agent Accuracy", value: "96.2%", target: "95%", status: "Above Target", color: "#059669" },
    { title: "Fraud Detection Rate", value: "88%", target: "85%", status: "Above Target", color: "#059669" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-6 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Key Performance Indicators</h3>
        <p className="text-[13px] text-slate-400">Track organizational performance against strategic targets for FY 2025-26.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[12px] text-slate-400 mb-3">{kpi.title}</div>
            <div className="text-[26px] font-bold font-mono text-slate-900 mb-1">{kpi.value}</div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-400">Target: {kpi.target}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kpi.status === "Below Target" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                {kpi.status}
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(parseFloat(kpi.value) / parseFloat(kpi.target) * 100, 100)}%`, background: kpi.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "reports": return <ReportLibraryTab />;
      case "analytics": return <AnalyticsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Reports & Analytics</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Comprehensive reporting suite for Glimmora Nidhi operations. Generate financial statements,
              member reports, compliance summaries, and AI-powered business intelligence analytics.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-indigo-600 font-mono">{reportsList.length}</div>
              <div className="text-slate-400 text-[10px]">Available Reports</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${activeTab === t.id ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
