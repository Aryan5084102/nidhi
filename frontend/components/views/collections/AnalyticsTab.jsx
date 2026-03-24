import { useCollectionsDashboard, useRecoveryCases } from "@/hooks/useData";
import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";

export default function AnalyticsTab() {
  const { data: dashData, loading: l1 } = useCollectionsDashboard();
  const { data: recoveryCases = [], loading: l2 } = useRecoveryCases();

  if (l1 || l2) {
    return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>;
  }

  // Derive analytics from real data
  const trend = dashData?.monthlyTrend || [];
  const efficiencyTrend = trend.map((t) => ({
    month: t.month,
    efficiency: t.due > 0 ? Math.round((t.collected / t.due) * 100 * 10) / 10 : 0,
    target: 92,
  }));

  // Recovery by status
  const statusGroups = {};
  recoveryCases.forEach((r) => {
    const s = r.status || "Other";
    if (!statusGroups[s]) statusGroups[s] = { total: 0, count: 0 };
    statusGroups[s].total += parseInt(String(r.outstanding || "0").replace(/[^\d]/g, "")) || 0;
    statusGroups[s].count += 1;
  });
  const recoveryByStatus = Object.entries(statusGroups).map(([status, data]) => ({
    category: status,
    count: data.count,
    total: `₹${(data.total / 100000).toFixed(1)}L`,
    totalRaw: data.total,
  }));

  const maxEfficiency = 100;

  return (
    <div className="animate-fade-in">
      {/* Collection Efficiency */}
      {efficiencyTrend.length > 0 && (
        <SectionCard title="Collection Efficiency Over Time" className="mb-6">
          <div className="flex items-end gap-3 h-44">
            {efficiencyTrend.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.efficiency / maxEfficiency) * 100}%`, background: d.efficiency >= d.target ? "linear-gradient(to top, #059669, #10B981)" : "linear-gradient(to top, #DC2626, #F87171)" }} title={`Efficiency: ${d.efficiency}%`} />
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.target / maxEfficiency) * 100}%`, background: "linear-gradient(to top, #94A3B8, #CBD5E1)" }} title={`Target: ${d.target}%`} />
                </div>
                <span className="text-[10px] text-heading group-hover:text-body transition-colors">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Met Target</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Below Target</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #94A3B8, #CBD5E1)" }} /><span className="text-[11px] text-slate-500">Target (92%)</span></div>
          </div>
        </SectionCard>
      )}

      {/* Recovery by Status */}
      {recoveryByStatus.length > 0 && (
        <SectionCard title="Recovery by Status" className="mb-6">
          <div className="flex flex-col gap-3">
            {recoveryByStatus.map((cat) => {
              const maxRaw = Math.max(...recoveryByStatus.map((c) => c.totalRaw), 1);
              const pct = Math.round((cat.totalRaw / maxRaw) * 100);
              return (
                <div key={cat.category} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-semibold text-body">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-heading">{cat.count} cases</span>
                      <span className="text-[13px] font-bold font-mono text-body">{cat.total}</span>
                    </div>
                  </div>
                  <ProgressBar value={pct} max={100} color={cat.category === "Settled" ? "#059669" : cat.category === "Written Off" ? "#94A3B8" : "#6366F1"} />
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Overall Stats */}
      <SectionCard title="Overall Metrics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Collection Rate", value: dashData?.collectionRate || "—", color: "#059669" },
            { label: "Recovery Rate", value: dashData?.recoveryRate || "—", color: "#6366F1" },
            { label: "Total Overdue", value: dashData?.overdueAmount || "₹0", color: "#DC2626" },
            { label: "Recovery Cases", value: recoveryCases.length, color: "#7C3AED" },
          ].map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[18px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
