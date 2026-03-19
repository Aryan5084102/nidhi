import { useMemberGrowthReport } from "@/hooks/useData";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";
import MetricGrid from "@/components/ui/MetricGrid";

export default function MemberGrowthTab() {
  const { data: growthData, loading: isLoading } = useMemberGrowthReport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
      </div>
    );
  }

  const keyMetrics = growthData ? [
    { label: "Total Members",    value: String(growthData.totalMembers  || 0), change: "" },
    { label: "Active Members",   value: String(growthData.activeMembers || 0), change: "" },
    { label: "New This Month",   value: String(growthData.newThisMonth  || 0), change: "" },
    { label: "Churn This Month", value: String(growthData.churnThisMonth || 0), change: "" },
  ] : [];

  const monthlyGrowth = (growthData?.monthlyTrend || []).map((t) => ({
    month: t.month,
    newMembers: t.new,
    churned: t.churned,
  }));

  const demographics  = growthData?.demographics  || [];
  const locations     = growthData?.locations      || [];
  const churnByMonth  = growthData?.churnByMonth   || [];
  const channels      = growthData?.channels       || [];

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={keyMetrics} />

      {/* Member Growth Chart */}
      <SectionCard title="Member Growth Trend" className="mb-6">
        <BarChart
          data={monthlyGrowth}
          bars={[
            { key: "newMembers", label: "New Members", gradient: "linear-gradient(to top, #0D9488, #14B8A6)" },
            { key: "churned",    label: "Churned",     gradient: "linear-gradient(to top, #DC2626, #F87171)" },
          ]}
          maxVal={600}
          labelKey="month"
          height="120px"
        />
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Age Group Demographics */}
        <SectionCard title="Age Group Distribution">
          <div className="flex flex-col gap-3">
            {demographics.length === 0 && (
              <p className="text-[13px] text-slate-400 py-4 text-center">No demographic data available</p>
            )}
            {demographics.map((d) => (
              <div key={d.group} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-body">{d.group}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{(d.count || 0).toLocaleString()}</span>
                    <span className="text-[11px] text-heading font-mono">{d.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: "linear-gradient(to right, #0D9488, #14B8A6)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Geographic Distribution */}
        <SectionCard title="Geographic Distribution">
          <div className="flex flex-col gap-3">
            {locations.length === 0 && (
              <p className="text-[13px] text-slate-400 py-4 text-center">No location data available</p>
            )}
            {locations.map((l) => (
              <div key={l.city} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-body">{l.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{(l.members || 0).toLocaleString()}</span>
                    <span className="text-[11px] text-heading font-mono">{l.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${l.pct}%`, background: "linear-gradient(to right, #4F46E5, #818CF8)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Analysis */}
        <SectionCard title="Churn Analysis">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left">Month</th>
                  <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-right">Churned</th>
                  <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left">Primary Reason</th>
                  <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-right">Recovered</th>
                </tr>
              </thead>
              <tbody>
                {churnByMonth.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-[13px] text-slate-400 py-6 text-center">No churn data available</td>
                  </tr>
                )}
                {churnByMonth.map((c) => (
                  <tr key={c.month} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="text-[13px] font-medium text-body px-5 py-3">{c.month}</td>
                    <td className="text-[13px] font-mono text-danger-500 px-5 py-3 text-right">{c.churned}</td>
                    <td className="text-[12px] text-slate-500 px-5 py-3">{c.reason}</td>
                    <td className="text-[13px] font-mono text-success-500 px-5 py-3 text-right">{c.recovered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Acquisition Channels */}
        <SectionCard title="Acquisition Channel Performance">
          <div className="flex flex-col gap-3">
            {channels.length === 0 && (
              <p className="text-[13px] text-slate-400 py-4 text-center">No channel data available</p>
            )}
            {channels.map((ch) => (
              <div key={ch.channel} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-semibold text-body">{ch.channel}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-primary-50 border-primary-200 text-primary">{ch.pct}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-heading">{(ch.acquired || 0).toLocaleString()} members</span>
                  <span className="text-[11px] text-heading">CAC: {ch.cost}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${ch.pct}%`, background: "linear-gradient(to right, #7C3AED, #A78BFA)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
