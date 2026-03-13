import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BarChart from "@/components/ui/BarChart";

export default function RiskAnalyticsTab() {
  const riskDistribution = [
    { score: "0-20 (Critical)", count: 120, pct: 1, color: "#DC2626" },
    { score: "21-40 (High)", count: 485, pct: 4, color: "#F97316" },
    { score: "41-60 (Medium)", count: 1870, pct: 15, color: "#D97706" },
    { score: "61-80 (Low)", count: 4975, pct: 40, color: "#0D9488" },
    { score: "81-100 (Minimal)", count: 5000, pct: 40, color: "#059669" },
  ];

  const riskTrend = [
    { month: "Oct", high: 85, medium: 240, low: 680 },
    { month: "Nov", high: 78, medium: 225, low: 710 },
    { month: "Dec", high: 92, medium: 260, low: 690 },
    { month: "Jan", high: 70, medium: 210, low: 740 },
    { month: "Feb", high: 65, medium: 195, low: 760 },
    { month: "Mar", high: 60, medium: 185, low: 780 },
  ];

  const riskFactors = [
    { factor: "Loan-to-Deposit Ratio > 70%", affected: 342, impact: "High", trend: "Declining", mitigation: "EMI restructuring" },
    { factor: "Missed EMI Payments (2+)", affected: 218, impact: "Critical", trend: "Stable", mitigation: "Recovery team assigned" },
    { factor: "Low STI Score (<50)", affected: 605, impact: "Medium", trend: "Improving", mitigation: "Member counselling" },
    { factor: "KYC Expired / Pending", affected: 342, impact: "High", trend: "Action Needed", mitigation: "Re-verification drive" },
    { factor: "Dormant Account (>90 days)", affected: 890, impact: "Low", trend: "Increasing", mitigation: "Engagement campaigns" },
  ];

  const heatmap = [
    { category: "Credit Risk", low: 72, medium: 20, high: 6, critical: 2 },
    { category: "Liquidity Risk", low: 65, medium: 25, high: 8, critical: 2 },
    { category: "Operational Risk", low: 80, medium: 14, high: 5, critical: 1 },
    { category: "Compliance Risk", low: 85, medium: 10, high: 4, critical: 1 },
    { category: "Fraud Risk", low: 78, medium: 15, high: 5, critical: 2 },
  ];

  return (
    <div className="animate-fade-in">
      {/* Risk Score Distribution */}
      <SectionCard title="Risk Score Distribution" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {riskDistribution.map((r) => (
            <div key={r.score} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{r.score}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: r.color }}>{r.count.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-1">{r.pct}% of members</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Risk Trends */}
        <SectionCard title="Risk Trends (New Alerts)">
          <BarChart
            data={riskTrend}
            bars={[
              { key: "high", label: "High", gradient: "linear-gradient(to top, #DC2626, #F87171)" },
              { key: "medium", label: "Medium", gradient: "linear-gradient(to top, #D97706, #FBBF24)" },
              { key: "low", label: "Low", gradient: "linear-gradient(to top, #059669, #34D399)" },
            ]}
            maxVal={800}
            labelKey="month"
            height="120px"
          />
        </SectionCard>

        {/* Predictive Risk */}
        <SectionCard title="Predictive Risk Indicators">
          <div className="flex flex-col gap-3">
            {[
              { indicator: "Projected NPA (Next Quarter)", value: "1.9%", direction: "Improving", color: "#059669" },
              { indicator: "Liquidity Stress Probability", value: "12%", direction: "Stable", color: "#D97706" },
              { indicator: "Member Default Likelihood", value: "3.2%", direction: "Improving", color: "#059669" },
              { indicator: "Deposit Flight Risk", value: "8%", direction: "Needs Watch", color: "#F97316" },
              { indicator: "Regulatory Breach Risk", value: "Low", direction: "Stable", color: "#059669" },
            ].map((p) => (
              <div key={p.indicator} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[12px] text-slate-500">{p.indicator}</div>
                    <div className="text-[18px] font-bold font-mono mt-0.5" style={{ color: p.color }}>{p.value}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${p.direction === "Improving" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : p.direction === "Stable" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                    {p.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Risk Factors Table */}
      <SectionCard title="Top Risk Factors" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Risk Factor</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Affected</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Impact</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Trend</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {riskFactors.map((rf) => (
                <tr key={rf.factor} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{rf.factor}</td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{rf.affected}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rf.impact === "Critical" ? "bg-red-50 border-red-200 text-red-600" : rf.impact === "High" ? "bg-amber-50 border-amber-200 text-amber-600" : rf.impact === "Medium" ? "bg-yellow-50 border-yellow-200 text-yellow-600" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                      {rf.impact}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold ${rf.trend === "Improving" || rf.trend === "Declining" ? "text-emerald-500" : rf.trend === "Stable" ? "text-slate-500" : "text-red-500"}`}>
                      {rf.trend}
                    </span>
                  </td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{rf.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Risk Heatmap */}
      <SectionCard title="Risk Heatmap by Category">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">Category</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Low %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Medium %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">High %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Critical %</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((h) => (
                <tr key={h.category} className="border-b border-slate-50">
                  <td className="text-[13px] font-semibold text-slate-700 px-5 py-3">{h.category}</td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-emerald-100 text-emerald-700">{h.low}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-amber-100 text-amber-700">{h.medium}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-orange-100 text-orange-700">{h.high}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-red-100 text-red-700">{h.critical}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
