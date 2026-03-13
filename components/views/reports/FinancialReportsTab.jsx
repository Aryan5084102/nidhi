import { reportAnalytics } from "@/data/mockData";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function FinancialReportsTab() {
  return (
    <div className="animate-fade-in">
      {/* Key Financial Metrics */}
      <MetricGrid metrics={reportAnalytics.keyMetrics} />

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SectionCard title="Revenue Breakdown">
          <div className="flex flex-col gap-3">
            {reportAnalytics.revenueBreakdown.map((r) => (
              <div key={r.source} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{r.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{"\u20B9"}{(r.amount / 100000).toFixed(1)}L</span>
                    <span className="text-[11px] text-slate-400 font-mono">{r.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: "linear-gradient(to right, #4F46E5, #6366F1, #818CF8)" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* P&L Summary */}
        <SectionCard title="P&L Summary — March 2026">
          <div className="flex flex-col gap-3">
            {[
              { label: "Total Income", value: "\u20B91.18 Cr", monthly: "\u20B998.3L avg/mo", color: "#059669", bg: "bg-emerald-50" },
              { label: "Interest Income", value: "\u20B972.4L", monthly: "\u20B960.3L avg/mo", color: "#0D9488", bg: "bg-teal-50" },
              { label: "Operating Expenses", value: "\u20B938.2L", monthly: "\u20B931.8L avg/mo", color: "#D97706", bg: "bg-amber-50" },
              { label: "Provisions & Write-offs", value: "\u20B94.8L", monthly: "\u20B94.0L avg/mo", color: "#DC2626", bg: "bg-red-50" },
              { label: "Net Profit", value: "\u20B938.4L", monthly: "\u20B932.0L avg/mo", color: "#4F46E5", bg: "bg-indigo-50" },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-xl p-3.5`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[12px] text-slate-500">{item.label}</div>
                    <div className="text-[18px] font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.monthly}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Balance Sheet Highlights */}
      <SectionCard title="Balance Sheet Highlights">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Assets", value: "\u20B952.8 Cr", sub: "Up 14.2% YoY", color: "#6B8ABF" },
            { label: "Total Liabilities", value: "\u20B941.6 Cr", sub: "Deposits + Borrowings", color: "#9585B5" },
            { label: "Net Worth", value: "\u20B911.2 Cr", sub: "Shareholders' Equity", color: "#5B9E8A" },
            { label: "Capital Adequacy", value: "18.4%", sub: "Above 15% threshold", color: "#C49A4C" },
          ].map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} sub={stat.sub} color={stat.color} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
