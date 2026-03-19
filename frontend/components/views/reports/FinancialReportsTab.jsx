import { useFinancialSummary } from "@/hooks/useData";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";

// Format raw rupee amount as Cr or L
function fmtAmt(n) {
  if (!n) return "₹0";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const PL_META = [
  { key: "totalIncome",        label: "Total Income",           color: "#059669", bg: "bg-success-50" },
  { key: "interestIncome",     label: "Interest Income",        color: "#0D9488", bg: "bg-teal-50" },
  { key: "operatingExpenses",  label: "Operating Expenses",     color: "#D97706", bg: "bg-warning-50" },
  { key: "provisions",         label: "Provisions & Write-offs",color: "#DC2626", bg: "bg-danger-50" },
  { key: "netProfit",          label: "Net Profit",             color: "#4F46E5", bg: "bg-primary-50" },
];

export default function FinancialReportsTab() {
  const { data: fd, loading: isLoading } = useFinancialSummary();

  const keyMetrics = fd ? [
    { label: "Total AUM",        value: fmtAmt(fd.totalAUM),             change: "" },
    { label: "Operating Margin", value: `${fd.operatingMargin}%`,         change: "" },
    { label: "Cost to Income",   value: `${fd.costToIncomeRatio}%`,       change: "" },
    { label: "Net Profit",       value: fmtAmt(fd.pl?.netProfit),         change: "" },
  ] : [];

  const revenueBreakdown = fd?.charts?.revenueBreakdown || [];
  const pl              = fd?.pl || {};
  const bs              = fd?.balanceSheet || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={keyMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue Breakdown */}
        <SectionCard title="Revenue Breakdown">
          <div className="flex flex-col gap-3">
            {revenueBreakdown.length === 0 && (
              <p className="text-[13px] text-slate-400 py-4 text-center">No revenue data available</p>
            )}
            {revenueBreakdown.map((r) => (
              <div key={r.source} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-body">{r.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{fmtAmt(r.amount)}</span>
                    <span className="text-[11px] text-heading font-mono">{r.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.pct}%`, background: "linear-gradient(to right, #4F46E5, #6366F1, #818CF8)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* P&L Summary */}
        <SectionCard title={`P&L Summary — ${fd?.month || "Current Period"}`}>
          <div className="flex flex-col gap-3">
            {PL_META.map(({ key, label, color, bg }) => {
              const val = pl[key] || 0;
              const monthly = val > 0 ? `${fmtAmt(val / 12)} avg/mo` : "—";
              return (
                <div key={key} className={`${bg} rounded-xl p-3.5`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[12px] text-slate-500">{label}</div>
                      <div className="text-[18px] font-bold font-mono" style={{ color }}>{fmtAmt(val)}</div>
                    </div>
                    <div className="text-[11px] text-heading font-mono">{monthly}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Balance Sheet Highlights */}
      <SectionCard title="Balance Sheet Highlights">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Assets"
            value={fmtAmt(bs.totalAssets)}
            sub="Deposits + Loans + Cash"
            color="#6B8ABF"
          />
          <StatCard
            label="Total Liabilities"
            value={fmtAmt(bs.totalLiabilities)}
            sub="Deposits + Borrowings"
            color="#9585B5"
          />
          <StatCard
            label="Net Worth"
            value={fmtAmt(bs.netWorth)}
            sub="Shareholders' Equity"
            color="#5B9E8A"
          />
          <StatCard
            label="Capital Adequacy"
            value={bs.capitalAdequacy != null ? `${bs.capitalAdequacy}%` : "—"}
            sub={bs.capitalAdequacy >= 15 ? "Above 15% threshold" : "Below threshold"}
            color="#C49A4C"
          />
        </div>
      </SectionCard>
    </div>
  );
}
