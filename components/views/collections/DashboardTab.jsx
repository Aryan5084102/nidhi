import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import { collectionsDashboard } from "./data";

export default function DashboardTab() {
  const metrics = [
    { label: "Total Due", value: collectionsDashboard.totalDue, color: "#6B8ABF" },
    { label: "Collected This Month", value: collectionsDashboard.collectedThisMonth, color: "#059669" },
    { label: "Collection Rate", value: collectionsDashboard.collectionRate, color: "#10B981" },
    { label: "Overdue Amount", value: collectionsDashboard.overdueAmount, color: "#DC2626" },
    { label: "Recovery Rate", value: collectionsDashboard.recoveryRate, color: "#C49A4C" },
    { label: "Active Cases", value: collectionsDashboard.activeCases, color: "#9585B5" },
  ];

  const maxVal = 2000000;

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      {/* Monthly Collection Trend */}
      <SectionCard title="Monthly Collection Trend" className="mb-6">
        <div className="flex items-end gap-3 h-44">
          {collectionsDashboard.monthlyTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.due / maxVal) * 100}%`, background: "linear-gradient(to top, #6366F1, #818CF8)" }} title={`Due: ₹${(d.due / 100000).toFixed(1)}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.collected / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} title={`Collected: ₹${(d.collected / 100000).toFixed(1)}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.overdue / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`Overdue: ₹${(d.overdue / 100000).toFixed(1)}L`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #6366F1, #818CF8)" }} /><span className="text-[11px] text-slate-500">Total Due</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Collected</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Overdue</span></div>
        </div>
      </SectionCard>

      {/* Top Defaulters */}
      <SectionCard title="Top Defaulters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collectionsDashboard.topDefaulters.map((d) => (
            <div key={d.id} className="flex items-start gap-3 bg-red-50/50 rounded-xl p-4 border border-red-100/60">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.id} &middot; {d.scheme}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${d.daysOverdue >= 90 ? "bg-red-50 text-red-500 border-red-200/60" : d.daysOverdue >= 60 ? "bg-orange-50 text-orange-600 border-orange-200/60" : "bg-amber-50 text-amber-600 border-amber-200/60"}`}>
                    {d.daysOverdue}d overdue
                  </span>
                </div>
                <div className="text-[14px] font-bold text-red-500 font-mono mt-1">{d.outstanding}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
