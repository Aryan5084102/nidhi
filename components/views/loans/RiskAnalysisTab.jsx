"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import DataTable from "@/components/ui/DataTable";

/* ─── Risk Badge ─── */
function RiskTag({ level }) {
  const styles = {
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    High: "bg-red-50 text-red-500 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

const riskDistribution = [
  { level: "Low Risk", count: 3200, pct: 61.5, color: "#059669" },
  { level: "Medium Risk", count: 1400, pct: 26.9, color: "#D97706" },
  { level: "High Risk", count: 600, pct: 11.6, color: "#DC2626" },
];

const riskFactors = [
  { factor: "STI Score Below 50", impact: "High", affectedLoans: 340, trend: "Decreasing" },
  { factor: "Multiple Active Loans", impact: "Medium", affectedLoans: 520, trend: "Stable" },
  { factor: "Late Payment History", impact: "High", affectedLoans: 280, trend: "Increasing" },
  { factor: "Low Deposit-to-Loan Ratio", impact: "Medium", affectedLoans: 410, trend: "Stable" },
  { factor: "KYC Pending/Incomplete", impact: "High", affectedLoans: 150, trend: "Decreasing" },
  { factor: "Chit Fund Default History", impact: "High", affectedLoans: 90, trend: "Stable" },
];

const riskColumns = [
  { key: "factor", label: "Risk Factor" },
  { key: "impact", label: "Impact" },
  { key: "affectedLoans", label: "Affected Loans" },
  { key: "trend", label: "Trend" },
];

export default function RiskAnalysisTab() {
  return (
    <div className="animate-fade-in">
      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {riskDistribution.map((r) => (
          <div key={r.level} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[13px] font-semibold text-slate-700">{r.level}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: r.color }}>{r.count.toLocaleString()}</div>
            </div>
            <ProgressBar value={r.pct} max={100} color={r.color} height="h-2" />
            <div className="text-[11px] text-slate-400 text-right font-mono mt-2">{r.pct}%</div>
          </div>
        ))}
      </div>

      {/* Risk Factors Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Risk Factors Analysis</h3>
          <p className="text-[12px] text-slate-400 mt-1">AI-powered risk factor identification across the loan portfolio</p>
        </div>
        <DataTable
          columns={riskColumns}
          data={riskFactors}
          renderRow={(rf) => (
            <tr key={rf.factor} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
              <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{rf.factor}</td>
              <td className="px-5 py-3"><RiskTag level={rf.impact} /></td>
              <td className="px-5 py-3 text-[13px] font-mono text-slate-600">{rf.affectedLoans}</td>
              <td className="px-5 py-3">
                <span className={`text-[11px] font-medium ${
                  rf.trend === "Decreasing" ? "text-emerald-500" : rf.trend === "Increasing" ? "text-red-500" : "text-slate-400"
                }`}>
                  {rf.trend === "Decreasing" ? "\u2193" : rf.trend === "Increasing" ? "\u2191" : "\u2192"} {rf.trend}
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
