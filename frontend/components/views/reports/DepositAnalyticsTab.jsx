import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BarChart from "@/components/ui/BarChart";

export default function DepositAnalyticsTab() {
  const depositMetrics = [
    { label: "Total Deposits", value: "\u20B939.5 Cr", change: "+6.1%" },
    { label: "FD Portfolio", value: "\u20B918.5 Cr", change: "+8.2%" },
    { label: "RD Portfolio", value: "\u20B98.2 Cr", change: "+5.4%" },
    { label: "Savings Deposits", value: "\u20B912.8 Cr", change: "+4.8%" },
  ];

  const depositGrowth = [
    { month: "Oct", fd: 320, rd: 180, savings: 420 },
    { month: "Nov", fd: 380, rd: 200, savings: 450 },
    { month: "Dec", fd: 420, rd: 220, savings: 480 },
    { month: "Jan", fd: 390, rd: 240, savings: 510 },
    { month: "Feb", fd: 460, rd: 260, savings: 540 },
    { month: "Mar", fd: 510, rd: 280, savings: 560 },
  ];

  const maturities = [
    { period: "Apr 2026", count: 42, amount: "\u20B91.8 Cr", type: "FD", urgency: "Immediate" },
    { period: "May 2026", count: 38, amount: "\u20B91.5 Cr", type: "FD + RD", urgency: "Upcoming" },
    { period: "Jun 2026", count: 55, amount: "\u20B92.2 Cr", type: "FD + RD", urgency: "Planned" },
    { period: "Jul-Sep 2026", count: 120, amount: "\u20B95.8 Cr", type: "Mixed", urgency: "Future" },
  ];

  const tierConcentration = [
    { tier: "Platinum (>\u20B95L)", members: 280, deposits: "\u20B914.2 Cr", pct: 36 },
    { tier: "Gold (\u20B92L-\u20B95L)", members: 620, deposits: "\u20B911.8 Cr", pct: 30 },
    { tier: "Silver (\u20B950K-\u20B92L)", members: 1850, deposits: "\u20B98.6 Cr", pct: 22 },
    { tier: "Bronze (<\u20B950K)", members: 4700, deposits: "\u20B94.9 Cr", pct: 12 },
  ];

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={depositMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Deposit Growth Trend */}
        <SectionCard title="Deposit Growth Trend (\u20B9 Lakhs)">
          <BarChart
            data={depositGrowth}
            bars={[
              { key: "fd", label: "FD", gradient: "linear-gradient(to top, #4F46E5, #818CF8)", suffix: "L" },
              { key: "rd", label: "RD", gradient: "linear-gradient(to top, #0D9488, #14B8A6)", suffix: "L" },
              { key: "savings", label: "Savings", gradient: "linear-gradient(to top, #C9982E, #F59E0B)", suffix: "L" },
            ]}
            maxVal={600}
            labelKey="month"
            height="120px"
          />
        </SectionCard>

        {/* Maturity Calendar */}
        <SectionCard title="Upcoming Maturities">
          <div className="flex flex-col gap-3">
            {maturities.map((m) => (
              <div key={m.period} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-body">{m.period}</span>
                  <StatusBadge status={m.urgency} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[12px] text-slate-500 whitespace-nowrap">{m.count} accounts</span>
                  <span className="text-[14px] font-bold font-mono text-slate-800 whitespace-nowrap">{m.amount}</span>
                  <span className="text-[11px] text-heading whitespace-nowrap">{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Deposit Concentration */}
      <SectionCard title="Deposit Concentration by Member Tier">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tierConcentration.map((t) => (
            <div key={t.tier} className="bg-slate-50 rounded-xl p-4">
              <div className="text-[12px] font-semibold text-body mb-2">{t.tier}</div>
              <div className="text-[20px] font-bold font-mono text-primary">{t.deposits}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-heading">{t.members.toLocaleString()} members</span>
                <span className="text-[11px] font-semibold text-slate-500">{t.pct}%</span>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.pct}%`, background: "linear-gradient(to right, #4F46E5, #818CF8)" }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
