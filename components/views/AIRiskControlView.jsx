"use client";

import { useState } from "react";

const tabs = [
  { id: "dashboard", label: "AI Risk Dashboard" },
  { id: "fraud", label: "AI Fraud Detection" },
  { id: "liquidity", label: "Liquidity Risk Monitor" },
  { id: "compliance", label: "Compliance Risk Engine" },
  { id: "member-risk", label: "Member Risk Engine" },
  { id: "anomaly", label: "Transaction Anomaly" },
  { id: "agent-liquidity", label: "Agent Liquidity Guard" },
  { id: "agent-fraud", label: "Agent Fraud Sentinel" },
  { id: "agent-compliance", label: "Agent Compliance Auditor" },
  { id: "agent-member", label: "Agent Member Analyzer" },
];

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Online: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Warning: "bg-amber-50 text-amber-600 border-amber-200/60",
    Critical: "bg-red-50 text-red-500 border-red-200/60",
    High: "bg-red-50 text-red-500 border-red-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Resolved: "bg-slate-100 text-slate-500 border-slate-200",
    Blocked: "bg-red-50 text-red-500 border-red-200/60",
    Flagged: "bg-orange-50 text-orange-600 border-orange-200/60",
    Cleared: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Pending: "bg-blue-50 text-blue-600 border-blue-200/60",
    Idle: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

// ─── Tab 1: AI Risk Dashboard ───
function DashboardTab() {
  const metrics = [
    { label: "Total Risk Score", value: "72.4", color: "#D97706" },
    { label: "Active AI Alerts", value: "18", color: "#DC2626" },
    { label: "Model Accuracy", value: "96.8%", color: "#059669" },
    { label: "False Positive Rate", value: "3.2%", color: "#6B8ABF" },
    { label: "Threats Blocked", value: "142", color: "#9585B5" },
    { label: "System Health", value: "99.7%", color: "#059669" },
  ];

  const riskCategories = [
    { name: "Fraud Risk", score: 68, weight: 25, trend: "+2.3" },
    { name: "Liquidity Risk", score: 45, weight: 20, trend: "-1.8" },
    { name: "Compliance Risk", score: 82, weight: 20, trend: "+0.5" },
    { name: "Credit Risk", score: 57, weight: 20, trend: "+3.1" },
    { name: "Operational Risk", score: 39, weight: 15, trend: "-0.7" },
  ];

  const modelPerformance = [
    { month: "Sep", accuracy: 94, precision: 91, recall: 88 },
    { month: "Oct", accuracy: 95, precision: 93, recall: 90 },
    { month: "Nov", accuracy: 95, precision: 92, recall: 91 },
    { month: "Dec", accuracy: 96, precision: 94, recall: 92 },
    { month: "Jan", accuracy: 97, precision: 95, recall: 93 },
    { month: "Feb", accuracy: 97, precision: 96, recall: 94 },
  ];

  const maxVal = 100;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Risk Category Breakdown */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Risk Category Breakdown</h3>
        <div className="flex flex-col gap-3">
          {riskCategories.map((cat) => (
            <div key={cat.name} className="bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Weight: {cat.weight}%</span>
                  <span className={`text-[11px] font-semibold ${cat.trend.startsWith("+") ? "text-red-500" : "text-emerald-600"}`}>{cat.trend}</span>
                  <span className={`text-[13px] font-bold font-mono ${cat.score >= 70 ? "text-red-500" : cat.score >= 50 ? "text-amber-600" : "text-emerald-600"}`}>{cat.score}</span>
                </div>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: cat.score >= 70 ? "#DC2626" : cat.score >= 50 ? "#D97706" : "#059669" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Performance Trend */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">AI Model Performance Trend</h3>
        <div className="flex items-end gap-3 h-44">
          {modelPerformance.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.accuracy / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} title={`Accuracy: ${d.accuracy}%`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.precision / maxVal) * 100}%`, background: "linear-gradient(to top, #4F46E5, #818CF8)" }} title={`Precision: ${d.precision}%`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.recall / maxVal) * 100}%`, background: "linear-gradient(to top, #C9982E, #E8C65A)" }} title={`Recall: ${d.recall}%`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Accuracy</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #4F46E5, #818CF8)" }} /><span className="text-[11px] text-slate-500">Precision</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #C9982E, #E8C65A)" }} /><span className="text-[11px] text-slate-500">Recall</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: AI Fraud Detection ───
function FraudDetectionTab() {
  const fraudMetrics = [
    { label: "Real-Time Score", value: "87.3", color: "#DC2626" },
    { label: "Patterns Active", value: "12", color: "#D97706" },
    { label: "Models Deployed", value: "5", color: "#4F46E5" },
    { label: "Avg Detection Time", value: "0.8s", color: "#059669" },
  ];

  const fraudPatterns = [
    { id: "FP-001", name: "Auction Bid Manipulation", description: "Coordinated bidding among 3+ members in Chit Group CG-2024-07 detected. Bids consistently within 2% of each other.", severity: "Critical", detectedAt: "11 Mar 2026, 09:14 AM" },
    { id: "FP-002", name: "Deposit Layering", description: "Member M-1042 making multiple deposits under Rs 10,000 threshold across 4 branches within 48 hours.", severity: "High", detectedAt: "10 Mar 2026, 03:47 PM" },
    { id: "FP-003", name: "Identity Duplication", description: "KYC documents of M-1087 show 94.2% facial match with M-1023. Potential duplicate identity registration.", severity: "High", detectedAt: "10 Mar 2026, 11:22 AM" },
    { id: "FP-004", name: "Collusion Ring", description: "Graph analysis identified 6-member cluster with unusual cross-guarantee patterns and synchronized loan requests.", severity: "Medium", detectedAt: "09 Mar 2026, 06:15 PM" },
  ];

  const accuracyByType = [
    { type: "Auction Manipulation", precision: "94.2%", recall: "91.8%", f1: "93.0%", cases: 34 },
    { type: "Deposit Layering", precision: "97.1%", recall: "88.5%", f1: "92.6%", cases: 21 },
    { type: "Identity Fraud", precision: "99.3%", recall: "95.7%", f1: "97.5%", cases: 8 },
    { type: "Collusion Detection", precision: "88.7%", recall: "82.3%", f1: "85.4%", cases: 12 },
    { type: "Benami Transactions", precision: "91.5%", recall: "86.9%", f1: "89.1%", cases: 15 },
  ];

  const flaggedTxns = [
    { id: "TXN-90821", member: "M-1042", type: "Deposit", amount: "Rs 9,800", risk: 92, reason: "Structuring pattern - 4th sub-threshold deposit", time: "11 Mar, 09:02 AM", status: "Blocked" },
    { id: "TXN-90817", member: "M-1087", type: "Loan Request", amount: "Rs 2,50,000", risk: 88, reason: "Identity mismatch detected in KYC", time: "10 Mar, 04:31 PM", status: "Flagged" },
    { id: "TXN-90812", member: "M-1023", type: "Chit Bid", amount: "Rs 48,200", risk: 79, reason: "Bid pattern correlates with collusion cluster", time: "10 Mar, 02:15 PM", status: "Flagged" },
    { id: "TXN-90808", member: "M-1055", type: "Withdrawal", amount: "Rs 4,75,000", risk: 74, reason: "Unusual withdrawal amount, 3x monthly average", time: "09 Mar, 11:45 AM", status: "Cleared" },
    { id: "TXN-90801", member: "M-1091", type: "Transfer", amount: "Rs 1,20,000", risk: 71, reason: "First-time large transfer to non-member account", time: "09 Mar, 09:30 AM", status: "Pending" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {fraudMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Active Fraud Patterns */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Active Fraud Patterns Detected</h3>
        <div className="flex flex-col gap-3">
          {fraudPatterns.map((fp) => (
            <div key={fp.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${fp.severity === "Critical" ? "bg-red-100" : fp.severity === "High" ? "bg-orange-100" : "bg-amber-100"}`}>
                <svg className={`w-4 h-4 ${fp.severity === "Critical" ? "text-red-500" : fp.severity === "High" ? "text-orange-500" : "text-amber-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{fp.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{fp.id} &middot; {fp.detectedAt}</div>
                  </div>
                  <StatusBadge status={fp.severity} />
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{fp.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Accuracy by Fraud Type */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Detection Accuracy by Fraud Type</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Fraud Type", "Precision", "Recall", "F1 Score", "Cases"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accuracyByType.map((row) => (
              <tr key={row.type} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-emerald-600">{row.precision}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600">{row.recall}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-700 font-semibold">{row.f1}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent AI-Flagged Transactions */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Recent AI-Flagged Transactions</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Txn ID", "Member", "Type", "Amount", "Risk", "Reason", "Status"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flaggedTxns.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{txn.id}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{txn.member}</td>
                <td className="px-5 py-3 text-[13px] text-slate-700">{txn.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-700">{txn.amount}</td>
                <td className="px-5 py-3"><span className={`font-mono text-xs font-bold ${txn.risk >= 85 ? "text-red-500" : txn.risk >= 70 ? "text-amber-600" : "text-slate-500"}`}>{txn.risk}</span></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[240px]">{txn.reason}</td>
                <td className="px-5 py-3"><StatusBadge status={txn.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: Liquidity Risk Monitor ───
function LiquidityRiskTab() {
  const liquidityMetrics = [
    { label: "Current Ratio", value: "1.82", color: "#059669" },
    { label: "Cash Reserve", value: "Rs 2.4 Cr", color: "#4F46E5" },
    { label: "Net Liquidity", value: "Rs 1.1 Cr", color: "#059669" },
    { label: "Stress Score", value: "34/100", color: "#D97706" },
  ];

  const cashFlowProjections = [
    { period: "Next 7 Days", inflow: "Rs 18.5L", outflow: "Rs 12.3L", net: "Rs 6.2L", status: "Healthy" },
    { period: "Next 30 Days", inflow: "Rs 72.8L", outflow: "Rs 65.1L", net: "Rs 7.7L", status: "Adequate" },
    { period: "Next 90 Days", inflow: "Rs 2.1 Cr", outflow: "Rs 1.9 Cr", net: "Rs 20L", status: "Watch" },
  ];

  const depositMaturity = [
    { bucket: "0-30 Days", amount: "Rs 45.2L", percentage: "18%", count: 124 },
    { bucket: "31-90 Days", amount: "Rs 68.7L", percentage: "28%", count: 203 },
    { bucket: "91-180 Days", amount: "Rs 52.3L", percentage: "21%", count: 167 },
    { bucket: "181-365 Days", amount: "Rs 48.9L", percentage: "20%", count: 145 },
    { bucket: "365+ Days", amount: "Rs 32.1L", percentage: "13%", count: 89 },
  ];

  const stressTests = [
    { scenario: "Normal Operations", withdrawalRate: "5%", liquidityRatio: "1.82", survivalDays: "180+", result: "Pass", color: "text-emerald-600" },
    { scenario: "Moderate Stress", withdrawalRate: "15%", liquidityRatio: "1.34", survivalDays: "92", result: "Pass", color: "text-amber-600" },
    { scenario: "Severe Stress", withdrawalRate: "30%", liquidityRatio: "0.87", survivalDays: "41", result: "Fail", color: "text-red-500" },
  ];

  const inflowOutflow = [
    { month: "Oct", inflow: 62, outflow: 48 },
    { month: "Nov", inflow: 71, outflow: 55 },
    { month: "Dec", inflow: 58, outflow: 67 },
    { month: "Jan", inflow: 75, outflow: 52 },
    { month: "Feb", inflow: 68, outflow: 61 },
    { month: "Mar", inflow: 73, outflow: 59 },
  ];

  const maxFlow = 80;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {liquidityMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Cash Flow Projections */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Cash Flow Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cashFlowProjections.map((cf) => (
            <div key={cf.period} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-semibold text-slate-700">{cf.period}</span>
                <StatusBadge status={cf.status === "Healthy" ? "Active" : cf.status === "Watch" ? "Warning" : "Active"} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Inflow</div>
                  <div className="text-[13px] font-mono font-semibold text-emerald-600">{cf.inflow}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Outflow</div>
                  <div className="text-[13px] font-mono font-semibold text-red-500">{cf.outflow}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Net</div>
                  <div className="text-[13px] font-mono font-semibold text-indigo-600">{cf.net}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Maturity Analysis */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Deposit Maturity Analysis</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Maturity Bucket", "Amount", "Share", "Deposit Count"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {depositMaturity.map((row) => (
              <tr key={row.bucket} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.bucket}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600">{row.amount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 rounded-full h-1.5 w-20 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: row.percentage }} />
                    </div>
                    <span className="font-mono text-xs text-slate-500">{row.percentage}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stress Test Scenarios */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Stress Test Scenarios</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Scenario", "Withdrawal Rate", "Liquidity Ratio", "Survival Days", "Result"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stressTests.map((st) => (
              <tr key={st.scenario} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{st.scenario}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.withdrawalRate}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.liquidityRatio}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.survivalDays}</td>
                <td className="px-5 py-3"><span className={`text-xs font-bold ${st.color}`}>{st.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inflow vs Outflow */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Inflow vs Outflow (in Lakhs)</h3>
        <div className="flex items-end gap-3 h-44">
          {inflowOutflow.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.inflow / maxFlow) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} title={`Inflow: Rs ${d.inflow}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.outflow / maxFlow) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`Outflow: Rs ${d.outflow}L`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Inflow</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Outflow</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Compliance Risk Engine ───
function ComplianceRiskTab() {
  const complianceRules = [
    { id: "CR-01", rule: "Net Owned Fund Ratio (NOF >= Rs 10L)", score: 98, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
    { id: "CR-02", rule: "Unencumbered Term Deposits (>= 10% of deposits)", score: 95, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
    { id: "CR-03", rule: "Member Loan Limit (<= Rs 2L per member)", score: 72, status: "Warning", lastCheck: "11 Mar 2026, 06:00 AM" },
    { id: "CR-04", rule: "Deposit Acceptance (members only)", score: 100, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
    { id: "CR-05", rule: "Annual Return Filing (NBS-4)", score: 88, status: "Compliant", lastCheck: "10 Mar 2026, 06:00 AM" },
    { id: "CR-06", rule: "Prudential Norms Adherence", score: 65, status: "Warning", lastCheck: "11 Mar 2026, 06:00 AM" },
    { id: "CR-07", rule: "KYC Compliance (100% verified)", score: 48, status: "Critical", lastCheck: "11 Mar 2026, 06:00 AM" },
  ];

  const predictedViolations = [
    { rule: "Member Loan Limit", probability: "78%", eta: "~14 days", impact: "High", description: "3 members approaching Rs 2L loan ceiling. Current trajectory suggests breach by month-end." },
    { rule: "Liquid Asset Ratio", probability: "45%", eta: "~30 days", impact: "Medium", description: "Seasonal deposit withdrawals may push liquid assets below 15% threshold in April." },
    { rule: "Director Shareholding", probability: "32%", eta: "~60 days", impact: "Low", description: "Pending share transfer of outgoing director may trigger non-compliance if not processed." },
  ];

  const regulatoryChanges = [
    { regulation: "Nidhi Amendment Rules 2026", effective: "01 Apr 2026", impact: "High", areas: "NOF increase to Rs 20L, digital KYC mandatory", status: "Preparing" },
    { regulation: "RBI AML Guidelines Update", effective: "01 Jul 2026", impact: "Medium", areas: "Enhanced due diligence for Rs 50K+ transactions", status: "Analyzing" },
    { regulation: "MCA Annual Compliance Calendar", effective: "Ongoing", impact: "Low", areas: "Updated filing schedule for FY 2026-27", status: "Reviewed" },
  ];

  const filingDeadlines = [
    { filing: "NDH-1 (Half-yearly Return)", deadline: "31 Mar 2026", status: "In Progress", aiReminder: "Auto-reminder sent on 01 Mar. 72% complete." },
    { filing: "NDH-2 (Intimation for NOF)", deadline: "30 Apr 2026", status: "Upcoming", aiReminder: "Scheduled reminder for 01 Apr. Data pre-filled." },
    { filing: "NDH-3 (Extension Application)", deadline: "N/A", status: "Not Required", aiReminder: "No extension needed. All ratios within limits." },
    { filing: "NBS-4 (Annual Return)", deadline: "30 Jun 2026", status: "Upcoming", aiReminder: "Preliminary data collection initiated by AI." },
    { filing: "Form AOC-4 (Financial Statements)", deadline: "30 Sep 2026", status: "Upcoming", aiReminder: "Will begin preparation after audit completion." },
  ];

  return (
    <div className="animate-fade-in">
      {/* AI-Monitored Compliance Rules */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">AI-Monitored Compliance Rules</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["ID", "Rule", "AI Score", "Status", "Last Check"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complianceRules.map((cr) => (
              <tr key={cr.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{cr.id}</td>
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{cr.rule}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 rounded-full h-1.5 w-16 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cr.score}%`, background: cr.score >= 90 ? "#059669" : cr.score >= 60 ? "#D97706" : "#DC2626" }} />
                    </div>
                    <span className={`font-mono text-xs font-bold ${cr.score >= 90 ? "text-emerald-600" : cr.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{cr.score}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><StatusBadge status={cr.status} /></td>
                <td className="px-5 py-3 text-[11px] text-slate-400">{cr.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Predicted Compliance Violations */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Predicted Compliance Violations</h3>
        <div className="flex flex-col gap-3">
          {predictedViolations.map((pv) => (
            <div key={pv.rule} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[13px] font-semibold text-slate-700">{pv.rule}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">ETA: {pv.eta}</span>
                  <StatusBadge status={pv.impact} />
                </div>
              </div>
              <div className="text-[12px] text-slate-500">{pv.description}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase">Probability</span>
                <div className="bg-slate-200 rounded-full h-1.5 w-24 overflow-hidden">
                  <div className="h-full rounded-full bg-red-400" style={{ width: pv.probability }} />
                </div>
                <span className="font-mono text-xs text-red-500 font-semibold">{pv.probability}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Change Impact */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Regulatory Change Impact Analysis</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Regulation", "Effective Date", "Impact", "Key Areas", "Status"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regulatoryChanges.map((rc) => (
              <tr key={rc.regulation} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{rc.regulation}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{rc.effective}</td>
                <td className="px-5 py-3"><StatusBadge status={rc.impact} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[240px]">{rc.areas}</td>
                <td className="px-5 py-3 text-[12px] text-indigo-600 font-medium">{rc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filing Deadline Tracker */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Filing Deadline Tracker with AI Reminders</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Filing", "Deadline", "Status", "AI Reminder"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filingDeadlines.map((fd) => (
              <tr key={fd.filing} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{fd.filing}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{fd.deadline}</td>
                <td className="px-5 py-3"><StatusBadge status={fd.status === "In Progress" ? "Warning" : fd.status === "Not Required" ? "Resolved" : "Pending"} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[280px]">{fd.aiReminder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 5: Member Risk Engine ───
function MemberRiskTab() {
  const riskDistribution = [
    { level: "Low Risk", count: 412, percentage: "68%", color: "#059669" },
    { level: "Medium Risk", count: 142, percentage: "23%", color: "#D97706" },
    { level: "High Risk", count: 38, percentage: "6%", color: "#DC2626" },
    { level: "Critical", count: 14, percentage: "3%", color: "#7C2D12" },
  ];

  const highRiskMembers = [
    { id: "M-1042", name: "Rajesh Kumar Sharma", risk: 91, factors: ["Multiple sub-threshold deposits", "Rapid account activity increase", "Cross-branch transactions"], sti: 32, churn: "78%" },
    { id: "M-1087", name: "Priya Nair", risk: 88, factors: ["KYC document discrepancy", "Unusual loan repayment pattern", "Third-party fund sources"], sti: 41, churn: "65%" },
    { id: "M-1023", name: "Vikram Singh Rathore", risk: 85, factors: ["Collusion cluster member", "Bid pattern anomaly", "Guarantor for 4 high-risk members"], sti: 38, churn: "52%" },
    { id: "M-1091", name: "Sunita Devi", risk: 79, factors: ["Dormant account reactivation", "Large withdrawal after long inactivity", "Address verification failed"], sti: 45, churn: "44%" },
  ];

  const stiAnalytics = [
    { range: "90-100 (Excellent)", count: 187, avgDeposit: "Rs 2.8L", defaultRate: "0.2%" },
    { range: "70-89 (Good)", count: 225, avgDeposit: "Rs 1.9L", defaultRate: "1.1%" },
    { range: "50-69 (Average)", count: 112, avgDeposit: "Rs 1.2L", defaultRate: "3.8%" },
    { range: "30-49 (Below Average)", count: 62, avgDeposit: "Rs 68K", defaultRate: "8.4%" },
    { range: "0-29 (Poor)", count: 20, avgDeposit: "Rs 25K", defaultRate: "18.7%" },
  ];

  const churnWarnings = [
    { id: "M-1055", name: "Anand Patel", signal: "3 consecutive missed deposits", probability: "82%", lastActivity: "18 Feb 2026" },
    { id: "M-1073", name: "Meena Kumari", signal: "Withdrawal of 60% deposits", probability: "71%", lastActivity: "05 Mar 2026" },
    { id: "M-1098", name: "Farhan Sheikh", signal: "No login for 45 days, pending dues", probability: "67%", lastActivity: "24 Jan 2026" },
    { id: "M-1044", name: "Lakshmi Iyer", signal: "Closed 2 of 3 chit subscriptions", probability: "58%", lastActivity: "08 Mar 2026" },
  ];

  const riskMigration = [
    { from: "Low", toLow: 385, toMedium: 24, toHigh: 3, toCritical: 0 },
    { from: "Medium", toLow: 18, toMedium: 112, toHigh: 10, toCritical: 2 },
    { from: "High", toLow: 2, toMedium: 8, toHigh: 24, toCritical: 4 },
    { from: "Critical", toLow: 0, toMedium: 1, toHigh: 3, toCritical: 10 },
  ];

  return (
    <div className="animate-fade-in">
      {/* Risk Distribution */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Member Risk Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {riskDistribution.map((rd) => (
            <div key={rd.level} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <div className="text-[24px] font-bold font-mono" style={{ color: rd.color }}>{rd.count}</div>
              <div className="text-[12px] text-slate-500 font-medium">{rd.level}</div>
              <div className="text-[10px] text-slate-400 mt-1">{rd.percentage} of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* High Risk Member Profiling */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">High-Risk Member Profiling</h3>
        <div className="flex flex-col gap-4">
          {highRiskMembers.map((hm) => (
            <div key={hm.id} className="bg-red-50/40 rounded-xl p-4 border border-red-100/60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{hm.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{hm.id} &middot; STI: {hm.sti} &middot; Churn: {hm.churn}</div>
                </div>
                <span className="text-[13px] font-bold font-mono text-red-500">Risk: {hm.risk}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {hm.factors.map((f, i) => (
                  <span key={i} className="text-[10px] bg-red-100 text-red-600 rounded-full px-2.5 py-0.5 border border-red-200/60">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STI Score Analytics */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">STI Score Analytics</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Score Range", "Members", "Avg Deposit", "Default Rate"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stiAnalytics.map((row) => (
              <tr key={row.range} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.range}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-semibold">{row.count}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{row.avgDeposit}</td>
                <td className="px-5 py-3 font-mono text-xs text-red-500">{row.defaultRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Churn Prediction */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Churn Prediction & Early Warning</h3>
        <div className="flex flex-col gap-3">
          {churnWarnings.map((cw) => (
            <div key={cw.id} className="flex items-center gap-4 bg-amber-50/50 rounded-xl p-4 border border-amber-100/60">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">
                {cw.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{cw.name} <span className="text-[11px] text-slate-400 font-mono">({cw.id})</span></div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{cw.signal}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold font-mono text-amber-600">{cw.probability}</div>
                    <div className="text-[10px] text-slate-400">Last: {cw.lastActivity}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Migration Matrix */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Risk Migration Matrix (Last 90 Days)</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["From \\ To", "Low", "Medium", "High", "Critical"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskMigration.map((row) => (
              <tr key={row.from} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-semibold">{row.from}</td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Low" ? "font-bold text-emerald-600" : "text-slate-500"}>{row.toLow}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Medium" ? "font-bold text-amber-600" : "text-slate-500"}>{row.toMedium}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "High" ? "font-bold text-red-500" : "text-slate-500"}>{row.toHigh}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Critical" ? "font-bold text-red-700" : "text-slate-500"}>{row.toCritical}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Transaction Anomaly Detection ───
function AnomalyDetectionTab() {
  const anomalyFeed = [
    { id: "ANM-4021", time: "11 Mar, 09:14 AM", type: "Structuring", member: "M-1042", description: "4th deposit of Rs 9,800 within 48 hours across branches", severity: "Critical" },
    { id: "ANM-4020", time: "11 Mar, 08:52 AM", type: "Unusual Volume", member: "M-1055", description: "Withdrawal volume 340% above 30-day average", severity: "High" },
    { id: "ANM-4019", time: "10 Mar, 04:31 PM", type: "Cross-Account", member: "M-1087", description: "Funds routed through 3 member accounts within 2 hours", severity: "High" },
    { id: "ANM-4018", time: "10 Mar, 02:15 PM", type: "Time Anomaly", member: "M-1023", description: "Transaction initiated at 2:15 AM IST from new device", severity: "Medium" },
    { id: "ANM-4017", time: "10 Mar, 11:30 AM", type: "Structuring", member: "M-1091", description: "Split deposit pattern: 3 deposits totaling Rs 28K in 30 mins", severity: "Medium" },
    { id: "ANM-4016", time: "09 Mar, 06:45 PM", type: "Unusual Volume", member: "M-1033", description: "Loan prepayment of Rs 4.2L, no prior history of early repayment", severity: "Low" },
  ];

  // Heatmap data: hours (rows) x days (columns)
  const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const heatmapData = [
    [0, 1, 0, 0, 1, 0],
    [1, 2, 1, 0, 0, 1],
    [2, 3, 4, 2, 1, 3],
    [3, 2, 3, 5, 2, 1],
    [4, 5, 3, 4, 6, 2],
    [2, 3, 2, 3, 4, 1],
    [1, 1, 2, 1, 2, 3],
    [0, 0, 1, 0, 1, 0],
  ];

  const heatColor = (val) => {
    if (val === 0) return "bg-slate-100";
    if (val <= 1) return "bg-amber-100";
    if (val <= 2) return "bg-amber-200";
    if (val <= 3) return "bg-orange-300";
    if (val <= 4) return "bg-red-300";
    return "bg-red-500";
  };

  const anomalyClassification = [
    { type: "Structuring", detected: 28, confirmed: 22, falsePositive: 6, accuracy: "78.6%" },
    { type: "Unusual Volume", detected: 45, confirmed: 39, falsePositive: 6, accuracy: "86.7%" },
    { type: "Cross-Account", detected: 14, confirmed: 12, falsePositive: 2, accuracy: "85.7%" },
    { type: "Time Anomaly", detected: 31, confirmed: 24, falsePositive: 7, accuracy: "77.4%" },
  ];

  const modelMetrics = [
    { label: "Anomalies Detected (MTD)", value: "118", color: "#DC2626" },
    { label: "True Positive Rate", value: "82.4%", color: "#059669" },
    { label: "Avg Detection Latency", value: "1.2s", color: "#4F46E5" },
    { label: "Model Version", value: "v3.7.2", color: "#6B7280" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Detection Model Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {modelMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Real-Time Anomaly Feed */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Real-Time Anomaly Feed</h3>
        <div className="flex flex-col gap-3">
          {anomalyFeed.map((af) => (
            <div key={af.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${af.severity === "Critical" ? "bg-red-500" : af.severity === "High" ? "bg-orange-500" : af.severity === "Medium" ? "bg-amber-500" : "bg-slate-400"}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[13px] font-semibold text-slate-700">{af.type}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">{af.id} &middot; {af.member}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{af.time}</span>
                    <StatusBadge status={af.severity} />
                  </div>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{af.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Pattern Heatmap */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Transaction Anomaly Heatmap (Hour x Day)</h3>
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="flex gap-1 mb-1 ml-12">
              {days.map((d) => (
                <div key={d} className="w-10 text-center text-[10px] text-slate-400 font-medium">{d}</div>
              ))}
            </div>
            {hours.map((h, hi) => (
              <div key={h} className="flex gap-1 items-center mb-1">
                <div className="w-10 text-right text-[10px] text-slate-400 pr-2">{h}</div>
                {heatmapData[hi].map((val, di) => (
                  <div key={di} className={`w-10 h-8 rounded ${heatColor(val)} flex items-center justify-center`}>
                    <span className="text-[10px] font-mono text-slate-600">{val}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 ml-12">
              <span className="text-[10px] text-slate-400">Low</span>
              <div className="w-6 h-3 rounded bg-slate-100" />
              <div className="w-6 h-3 rounded bg-amber-100" />
              <div className="w-6 h-3 rounded bg-amber-200" />
              <div className="w-6 h-3 rounded bg-orange-300" />
              <div className="w-6 h-3 rounded bg-red-300" />
              <div className="w-6 h-3 rounded bg-red-500" />
              <span className="text-[10px] text-slate-400">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Classification */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Anomaly Classification Breakdown</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Type", "Detected", "Confirmed", "False Positive", "Accuracy"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {anomalyClassification.map((row) => (
              <tr key={row.type} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{row.detected}</td>
                <td className="px-5 py-3 font-mono text-xs text-emerald-600">{row.confirmed}</td>
                <td className="px-5 py-3 font-mono text-xs text-red-500">{row.falsePositive}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-semibold">{row.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 7: Agent Liquidity Guard ───
function AgentLiquidityGuardTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Status Card */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Liquidity Guard Agent</h3>
            <p className="text-[12px] text-slate-400">Autonomous liquidity monitoring and protection system</p>
          </div>
          <div className="ml-auto"><StatusBadge status="Online" /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Status", value: "Online", color: "#059669" },
            { label: "Uptime", value: "99.98%", color: "#4F46E5" },
            { label: "Tasks Processed", value: "4,821", color: "#6B8ABF" },
            { label: "Last Check", value: "2 min ago", color: "#6B7280" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Assessment */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Current Liquidity Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { metric: "Cash Reserve Adequacy", value: "Sufficient", detail: "Rs 2.4 Cr available against Rs 1.8 Cr required minimum", status: "Active" },
            { metric: "Deposit Concentration Risk", value: "Moderate", detail: "Top 10 depositors hold 28% of total deposits. Threshold: 30%", status: "Warning" },
            { metric: "Loan-to-Deposit Ratio", value: "67.3%", detail: "Within acceptable range (max 80%). Trend: stable over 90 days", status: "Active" },
            { metric: "Maturity Mismatch", value: "Low Risk", detail: "Short-term liabilities covered 1.4x by short-term assets", status: "Active" },
          ].map((item) => (
            <div key={item.metric} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{item.metric}</span>
                <StatusBadge status={item.status} />
              </div>
              <div className="text-[15px] font-bold text-slate-900 mb-1">{item.value}</div>
              <div className="text-[12px] text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Taken */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recent Agent Actions</h3>
        <div className="flex flex-col gap-3">
          {[
            { action: "Auto-blocked withdrawal", detail: "Blocked Rs 5.2L withdrawal by M-1055 due to liquidity threshold breach. Alert raised to treasury.", time: "11 Mar, 08:45 AM", type: "Blocked" },
            { action: "Alert raised to CFO", detail: "Deposit concentration approaching 30% threshold. Recommended diversification outreach to top depositors.", time: "10 Mar, 06:00 PM", type: "Warning" },
            { action: "Rebalance suggestion", detail: "Suggested moving Rs 15L from current account to short-term FD to optimize liquid asset ratio.", time: "09 Mar, 10:30 AM", type: "Active" },
            { action: "Stress test triggered", detail: "Initiated automated stress test after detecting 12% increase in withdrawal requests over 48 hours.", time: "08 Mar, 03:15 PM", type: "Active" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-semibold text-slate-700">{a.action}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{a.time}</span>
                    <StatusBadge status={a.type} />
                  </div>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Agent Configuration & Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { param: "Min Cash Reserve", value: "Rs 1.8 Cr", description: "Minimum cash balance before alerts trigger" },
            { param: "Max Single Withdrawal", value: "Rs 5,00,000", description: "Auto-block threshold for single withdrawals" },
            { param: "Concentration Limit", value: "30%", description: "Max deposit share by top 10 members" },
            { param: "Check Frequency", value: "Every 5 min", description: "Interval for automated liquidity checks" },
            { param: "Stress Test Trigger", value: "10% withdrawal spike", description: "Threshold to initiate automated stress test" },
            { param: "Alert Escalation", value: "CFO, Board", description: "Notification recipients for critical alerts" },
          ].map((cfg) => (
            <div key={cfg.param} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center">
              <div>
                <div className="text-[13px] font-medium text-slate-700">{cfg.param}</div>
                <div className="text-[11px] text-slate-400">{cfg.description}</div>
              </div>
              <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50 rounded-lg px-2.5 py-1 border border-indigo-200/60">{cfg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 8: Agent Fraud Sentinel ───
function AgentFraudSentinelTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Fraud Sentinel Agent</h3>
            <p className="text-[12px] text-slate-400">Real-time fraud detection and investigation automation</p>
          </div>
          <div className="ml-auto"><StatusBadge status="Online" /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Status", value: "Active", color: "#059669" },
            { label: "Accuracy", value: "96.8%", color: "#4F46E5" },
            { label: "Cases Handled", value: "1,247", color: "#DC2626" },
            { label: "Avg Response", value: "0.8s", color: "#D97706" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Investigations */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Active Investigations</h3>
        <div className="flex flex-col gap-3">
          {[
            { id: "INV-301", title: "Coordinated Bid Ring - CG-2024-07", members: "M-1023, M-1042, M-1067", stage: "Evidence Collection", progress: 65, severity: "Critical" },
            { id: "INV-298", title: "Deposit Layering - Structuring Pattern", members: "M-1042", stage: "Pattern Confirmation", progress: 82, severity: "High" },
            { id: "INV-295", title: "Identity Duplication Investigation", members: "M-1087, M-1023", stage: "KYC Re-verification", progress: 40, severity: "High" },
            { id: "INV-292", title: "Dormant Account Exploitation", members: "M-1091", stage: "Activity Analysis", progress: 55, severity: "Medium" },
          ].map((inv) => (
            <div key={inv.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{inv.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{inv.id} &middot; Members: {inv.members}</div>
                </div>
                <StatusBadge status={inv.severity} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-slate-500">{inv.stage}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${inv.progress}%` }} />
                </div>
                <span className="font-mono text-[11px] text-indigo-600 font-semibold">{inv.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Log */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Detection Log (Recent 10)</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Time", "Event", "Member", "Action", "Confidence"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { time: "09:14 AM", event: "Structuring detected", member: "M-1042", action: "Auto-block + Alert", confidence: "97%" },
              { time: "08:52 AM", event: "Volume spike flagged", member: "M-1055", action: "Alert raised", confidence: "89%" },
              { time: "08:30 AM", event: "New device login", member: "M-1023", action: "MFA enforced", confidence: "72%" },
              { time: "08:15 AM", event: "Cross-account transfer", member: "M-1087", action: "Held for review", confidence: "91%" },
              { time: "07:45 AM", event: "Bid pattern anomaly", member: "M-1067", action: "Flagged", confidence: "85%" },
              { time: "07:22 AM", event: "KYC mismatch detected", member: "M-1099", action: "Account restricted", confidence: "94%" },
              { time: "06:58 AM", event: "Duplicate PAN detected", member: "M-1101", action: "Alert + Block", confidence: "99%" },
              { time: "06:30 AM", event: "Unusual guarantor chain", member: "M-1044", action: "Investigation opened", confidence: "78%" },
              { time: "06:15 AM", event: "Off-hours transaction", member: "M-1033", action: "Logged", confidence: "65%" },
              { time: "06:00 AM", event: "Daily scan complete", member: "All", action: "Report generated", confidence: "100%" },
            ].map((log, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{log.time}</td>
                <td className="px-5 py-3 text-[13px] text-slate-700">{log.event}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{log.member}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{log.action}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-semibold">{log.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Loss Prevented", value: "Rs 42.8L", color: "#059669" },
            { label: "Cases Auto-Resolved", value: "68%", color: "#4F46E5" },
            { label: "False Positive Rate", value: "3.2%", color: "#D97706" },
            { label: "Avg Investigation Time", value: "4.2 hrs", color: "#6B8ABF" },
            { label: "Escalation Rate", value: "12%", color: "#9585B5" },
            { label: "Member Impact Score", value: "Low", color: "#059669" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 9: Agent Compliance Auditor ───
function AgentComplianceAuditorTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Compliance Auditor Agent</h3>
            <p className="text-[12px] text-slate-400">Automated regulatory compliance monitoring and reporting</p>
          </div>
          <div className="ml-auto"><StatusBadge status="Online" /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Status", value: "Active", color: "#059669" },
            { label: "Rules Monitored", value: "47", color: "#7C3AED" },
            { label: "Last Audit", value: "11 Mar, 06:00 AM", color: "#6B7280" },
            { label: "Compliance Score", value: "91.2%", color: "#059669" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Check Results */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Latest Compliance Check Results</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Check", "Category", "Result", "Score", "Next Check"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { check: "Net Owned Fund Adequacy", category: "Financial", result: "Pass", score: 98, next: "12 Mar, 06:00 AM" },
              { check: "Member Count Ratio (200 minimum)", category: "Membership", result: "Pass", score: 100, next: "12 Mar, 06:00 AM" },
              { check: "Deposit-to-NOF Ratio", category: "Financial", result: "Pass", score: 95, next: "12 Mar, 06:00 AM" },
              { check: "KYC Verification Coverage", category: "AML/KYC", result: "Fail", score: 48, next: "11 Mar, 12:00 PM" },
              { check: "Loan Ceiling Compliance", category: "Lending", result: "Warning", score: 72, next: "12 Mar, 06:00 AM" },
              { check: "Board Meeting Minutes Filed", category: "Governance", result: "Pass", score: 100, next: "01 Apr, 06:00 AM" },
              { check: "Auditor Appointment", category: "Governance", result: "Pass", score: 100, next: "01 Jul, 06:00 AM" },
              { check: "Interest Rate Compliance", category: "Lending", result: "Pass", score: 92, next: "12 Mar, 06:00 AM" },
            ].map((row) => (
              <tr key={row.check} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.check}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{row.category}</td>
                <td className="px-5 py-3"><StatusBadge status={row.result === "Pass" ? "Active" : row.result === "Fail" ? "Critical" : "Warning"} /></td>
                <td className="px-5 py-3"><span className={`font-mono text-xs font-bold ${row.score >= 90 ? "text-emerald-600" : row.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{row.score}</span></td>
                <td className="px-5 py-3 text-[11px] text-slate-400">{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auto-Filed Reports */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Auto-Filed Reports</h3>
        <div className="flex flex-col gap-3">
          {[
            { report: "NDH-1 Half-Yearly Return (Draft)", filed: "10 Mar 2026", type: "Regulatory", status: "Draft Ready", detail: "Auto-populated from system data. Pending CFO review." },
            { report: "Monthly STR Report - Feb 2026", filed: "05 Mar 2026", type: "AML", status: "Filed", detail: "2 suspicious transactions reported to FIU-IND." },
            { report: "Quarterly Prudential Return", filed: "01 Mar 2026", type: "RBI", status: "Filed", detail: "All prudential norms within limits. No exceptions." },
            { report: "KYC Gap Analysis Report", filed: "28 Feb 2026", type: "Internal", status: "Filed", detail: "52 members with incomplete KYC identified. Auto-reminders sent." },
          ].map((r) => (
            <div key={r.report} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{r.report}</div>
                    <div className="text-[11px] text-slate-400">Filed: {r.filed} &middot; Type: {r.type}</div>
                  </div>
                  <StatusBadge status={r.status === "Filed" ? "Active" : "Pending"} />
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exception Handling Log */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Exception Handling Log</h3>
        <div className="flex flex-col gap-3">
          {[
            { time: "11 Mar, 06:02 AM", exception: "KYC check failed for 52 members", action: "Auto-generated remediation plan. Email reminders queued for members.", resolution: "In Progress" },
            { time: "10 Mar, 06:01 AM", exception: "Loan ceiling approaching for 3 members", action: "Preemptive alerts sent to loan officers. Block rule activated at 95% threshold.", resolution: "Mitigated" },
            { time: "08 Mar, 06:00 AM", exception: "Board meeting minutes not uploaded (Feb)", action: "Reminder sent to Company Secretary. Escalation scheduled for 12 Mar.", resolution: "Pending" },
            { time: "05 Mar, 06:03 AM", exception: "Interest rate on 2 FD schemes above RBI cap", action: "Auto-flagged to CFO. Rate adjustment recommendation generated.", resolution: "Resolved" },
          ].map((ex, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ex.resolution === "Resolved" ? "bg-emerald-500" : ex.resolution === "Mitigated" ? "bg-blue-500" : ex.resolution === "Pending" ? "bg-amber-500" : "bg-red-500"}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-semibold text-slate-700">{ex.exception}</span>
                  <span className="text-[10px] text-slate-400">{ex.time}</span>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{ex.action}</div>
                <div className="mt-2">
                  <StatusBadge status={ex.resolution === "Resolved" ? "Active" : ex.resolution === "Mitigated" ? "Cleared" : ex.resolution === "Pending" ? "Warning" : "Pending"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 10: Agent Member Risk Analyzer ───
function AgentMemberRiskTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Member Risk Analyzer Agent</h3>
            <p className="text-[12px] text-slate-400">Continuous member risk profiling and behavioral analysis</p>
          </div>
          <div className="ml-auto"><StatusBadge status="Online" /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Status", value: "Active", color: "#059669" },
            { label: "Members Analyzed", value: "606", color: "#D97706" },
            { label: "Risk Accuracy", value: "94.1%", color: "#4F46E5" },
            { label: "Last Full Scan", value: "11 Mar, 05:30 AM", color: "#6B7280" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Reassessment Queue */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Risk Reassessment Queue</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Member", "Name", "Current Risk", "Trigger", "Priority", "Scheduled"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: "M-1042", name: "Rajesh Kumar Sharma", risk: "High", trigger: "Multiple structuring alerts", priority: "Critical", scheduled: "11 Mar, 10:00 AM" },
              { id: "M-1087", name: "Priya Nair", risk: "High", trigger: "KYC document mismatch", priority: "High", scheduled: "11 Mar, 10:30 AM" },
              { id: "M-1055", name: "Anand Patel", risk: "Medium", trigger: "3 missed deposits", priority: "Medium", scheduled: "11 Mar, 11:00 AM" },
              { id: "M-1091", name: "Sunita Devi", risk: "Medium", trigger: "Dormant reactivation", priority: "Medium", scheduled: "11 Mar, 11:30 AM" },
              { id: "M-1033", name: "Deepak Verma", risk: "Low", trigger: "Quarterly reassessment", priority: "Low", scheduled: "11 Mar, 02:00 PM" },
              { id: "M-1073", name: "Meena Kumari", risk: "Medium", trigger: "Large withdrawal pattern", priority: "High", scheduled: "11 Mar, 10:15 AM" },
            ].map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{row.id}</td>
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.name}</td>
                <td className="px-5 py-3"><StatusBadge status={row.risk} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{row.trigger}</td>
                <td className="px-5 py-3"><StatusBadge status={row.priority} /></td>
                <td className="px-5 py-3 text-[11px] text-slate-400">{row.scheduled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Risk Score Changes */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recent Risk Score Changes</h3>
        <div className="flex flex-col gap-3">
          {[
            { id: "M-1042", name: "Rajesh Kumar Sharma", from: 72, to: 91, change: "+19", reason: "4 structuring alerts in 48 hours, cross-branch activity detected", time: "11 Mar, 09:20 AM" },
            { id: "M-1087", name: "Priya Nair", from: 65, to: 88, change: "+23", reason: "KYC document discrepancy flagged by identity verification model", time: "10 Mar, 04:45 PM" },
            { id: "M-1033", name: "Deepak Verma", from: 52, to: 38, change: "-14", reason: "Consistent deposit pattern restored, cleared pending dues", time: "10 Mar, 11:00 AM" },
            { id: "M-1055", name: "Anand Patel", from: 48, to: 67, change: "+19", reason: "3 consecutive missed deposits, withdrawal spike", time: "09 Mar, 03:30 PM" },
            { id: "M-1098", name: "Farhan Sheikh", from: 55, to: 71, change: "+16", reason: "45-day inactivity, pending dues accumulating", time: "08 Mar, 06:00 AM" },
          ].map((rc) => (
            <div key={rc.id + rc.time} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${rc.change.startsWith("+") ? "bg-red-100" : "bg-emerald-100"}`}>
                <span className={`text-sm font-bold ${rc.change.startsWith("+") ? "text-red-500" : "text-emerald-600"}`}>{rc.change}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[13px] font-semibold text-slate-700">{rc.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">{rc.id}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-slate-400">{rc.from}</span>
                      <span className="text-slate-300">→</span>
                      <span className={`font-mono text-xs font-bold ${rc.to >= 70 ? "text-red-500" : rc.to >= 50 ? "text-amber-600" : "text-emerald-600"}`}>{rc.to}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{rc.time}</div>
                  </div>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{rc.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Pattern Flags */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Behavioral Pattern Flags</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { pattern: "Deposit Regularity Decline", members: 14, description: "Members showing decreasing deposit frequency over past 3 months", severity: "Medium", action: "Engagement campaign recommended" },
            { pattern: "Loan Dependency Escalation", members: 8, description: "Members increasing loan amounts with each cycle, debt-to-income rising", severity: "High", action: "Credit limit review triggered" },
            { pattern: "Cross-Guarantee Clustering", members: 6, description: "Mutual guarantee network detected. Default contagion risk elevated.", severity: "High", action: "Guarantee chain analysis in progress" },
            { pattern: "Seasonal Activity Anomaly", members: 22, description: "Members with transaction patterns inconsistent with declared occupation", severity: "Low", action: "Background verification update queued" },
            { pattern: "Digital Behavior Shift", members: 11, description: "Sudden shift from branch to online transactions. Device fingerprint changes.", severity: "Medium", action: "Device authentication reinforced" },
            { pattern: "Dormancy Risk", members: 19, description: "Members with declining engagement metrics over 60+ days", severity: "Medium", action: "Retention outreach initiated" },
          ].map((bp) => (
            <div key={bp.pattern} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{bp.pattern}</span>
                <StatusBadge status={bp.severity} />
              </div>
              <div className="text-[12px] text-slate-500 mb-2">{bp.description}</div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-indigo-600 font-medium">{bp.members} members affected</span>
                <span className="text-[11px] text-slate-400">{bp.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ───
export default function AIRiskControlView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "fraud": return <FraudDetectionTab />;
      case "liquidity": return <LiquidityRiskTab />;
      case "compliance": return <ComplianceRiskTab />;
      case "member-risk": return <MemberRiskTab />;
      case "anomaly": return <AnomalyDetectionTab />;
      case "agent-liquidity": return <AgentLiquidityGuardTab />;
      case "agent-fraud": return <AgentFraudSentinelTab />;
      case "agent-compliance": return <AgentComplianceAuditorTab />;
      case "agent-member": return <AgentMemberRiskTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">AI Risk Control Center</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Agentic AI-powered risk monitoring and control system for Nidhi company operations.
              Autonomous agents continuously monitor fraud, liquidity, compliance, and member risk
              across all operational dimensions.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px]">
            <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center border border-emerald-200/60">
              <div className="text-lg font-bold text-emerald-600 font-mono">4</div>
              <div className="text-slate-400 text-[10px]">Agents Online</div>
            </div>
            <div className="bg-red-50 rounded-xl px-3 py-2 text-center border border-red-200/60">
              <div className="text-lg font-bold text-red-500 font-mono">18</div>
              <div className="text-slate-400 text-[10px]">Active Alerts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
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
