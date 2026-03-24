import { useCollectionsDashboard } from "@/hooks/useData";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";

export default function DashboardTab() {
  const { data: d, loading } = useCollectionsDashboard();

  if (loading || !d) {
    return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>;
  }

  const metrics = [
    { label: "Total Due", value: d.totalDue || "₹0", color: "#6B8ABF" },
    { label: "Collected", value: d.totalCollected || "₹0", color: "#059669" },
    { label: "Collection Rate", value: d.collectionRate || "0%", color: "#10B981" },
    { label: "Overdue Amount", value: d.overdueAmount || "₹0", color: "#DC2626" },
    { label: "Recovery Rate", value: d.recoveryRate || "0%", color: "#C49A4C" },
    { label: "Overdue Cases", value: d.overdueCount || 0, color: "#9585B5" },
  ];

  const trend = d.monthlyTrend || [];
  const maxVal = Math.max(...trend.map((t) => Math.max(t.due || 0, t.collected || 0, t.overdue || 0)), 1);
  const topDefaulters = d.topDefaulters || [];

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      {trend.length > 0 && (
        <SectionCard title="Monthly Collection Trend" className="mb-6">
          <div className="flex items-end gap-3 h-44">
            {trend.map((t) => (
              <div key={t.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${((t.due || 0) / maxVal) * 100}%`, background: "linear-gradient(to top, #6366F1, #818CF8)" }} />
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${((t.collected || 0) / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} />
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${((t.overdue || 0) / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} />
                </div>
                <span className="text-[10px] text-heading">{t.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #6366F1, #818CF8)" }} /><span className="text-[11px] text-slate-500">Due</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Collected</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Overdue</span></div>
          </div>
        </SectionCard>
      )}

      {topDefaulters.length > 0 && (
        <SectionCard title="Top Defaulters">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topDefaulters.map((d) => (
              <div key={d.memberId || d.id} className="flex items-start gap-3 bg-danger-50/50 rounded-xl p-4 border border-danger-100/60">
                <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center text-danger-500 font-bold text-sm shrink-0">
                  {(d.name || "?").charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[13px] font-semibold text-body">{d.name}</div>
                      <div className="text-[11px] text-heading font-mono">{d.memberId}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${(d.daysOverdue || 0) >= 90 ? "bg-danger-50 text-danger-500 border-danger-200/60" : (d.daysOverdue || 0) >= 60 ? "bg-orange-50 text-orange-600 border-orange-200/60" : "bg-warning-50 text-warning border-warning-200/60"}`}>
                      {d.daysOverdue || 0}d overdue
                    </span>
                  </div>
                  <div className="text-[14px] font-bold text-danger-500 font-mono mt-1">{d.outstanding}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
