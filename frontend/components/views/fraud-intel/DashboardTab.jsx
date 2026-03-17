import { fraudCases, fraudMetrics, fraudTrend } from "@/data/mockData";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";
import StatusBadge from "@/components/ui/StatusBadge";

const metrics = [
  { label: "Active Alerts", value: fraudMetrics.totalAlerts, color: "#BF6F6D" },
  { label: "Critical Alerts", value: fraudMetrics.criticalAlerts, color: "#DC2626" },
  { label: "Resolved This Month", value: fraudMetrics.resolvedThisMonth, color: "#059669" },
  { label: "Avg Resolution Time", value: fraudMetrics.avgResolutionTime, color: "#6B8ABF" },
  { label: "False Positive Rate", value: fraudMetrics.falsePositiveRate, color: "#C49A4C" },
  { label: "Total Prevented Loss", value: fraudMetrics.totalPreventedLoss, color: "#9585B5" },
];

const bars = [
  { key: "alerts", label: "Total Alerts", gradient: "linear-gradient(to top, #DC2626, #F87171)" },
  { key: "resolved", label: "Resolved", gradient: "linear-gradient(to top, #059669, #10B981)" },
  { key: "falsePositive", label: "False Positive", gradient: "linear-gradient(to top, #C9982E, #E8C65A)" },
];

export default function DashboardTab() {
  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      <SectionCard title="Fraud Alert Trend" className="mb-6">
        <BarChart data={fraudTrend} bars={bars} maxVal={25} labelKey="month" />
      </SectionCard>

      {/* Recent Critical Cases */}
      <SectionCard title="Critical Cases">
        <div className="flex flex-col gap-4">
          {fraudCases.filter((c) => c.severity === "Critical").map((fc) => (
            <div key={fc.id} className="bg-danger-50/60 rounded-2xl p-4 border border-danger-100 shadow-sm">
              {/* Header row: icon + type + badge */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-danger-100 border border-danger-200/60 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-slate-800 leading-tight">{fc.type}</div>
                      <div className="text-[11px] text-heading font-mono mt-0.5 truncate">{fc.id} &middot; {fc.time}</div>
                    </div>
                    <div className="shrink-0"><StatusBadge status={fc.status} /></div>
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-slate-500 leading-relaxed mb-3">{fc.description}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/80 rounded-xl p-2.5 border border-danger-100">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Member</div>
                  <div className="text-[12px] font-semibold text-body font-mono truncate">{fc.member}</div>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-danger-100">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Potential Loss</div>
                  <div className="text-[12px] font-bold text-danger-500 font-mono">{fc.potentialLoss}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
