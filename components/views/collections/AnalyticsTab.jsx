import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { collectionsAnalytics } from "./data";

export default function AnalyticsTab() {
  const maxEfficiency = 100;

  return (
    <div className="animate-fade-in">
      {/* Collection Efficiency Over Time */}
      <SectionCard title="Collection Efficiency Over Time" className="mb-6">
        <div className="flex items-end gap-3 h-44">
          {collectionsAnalytics.efficiencyTrend.map((d) => (
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
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Actual (Met Target)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Actual (Below Target)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #94A3B8, #CBD5E1)" }} /><span className="text-[11px] text-slate-500">Target</span></div>
        </div>
      </SectionCard>

      {/* Recovery by Category */}
      <SectionCard title="Recovery by Category" className="mb-6">
        <div className="flex flex-col gap-3">
          {collectionsAnalytics.recoveryByCategory.map((cat) => {
            const rateNum = parseFloat(cat.rate);
            return (
              <div key={cat.category} className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-body">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-heading">Total: <strong className="text-body font-mono">{cat.total}</strong></span>
                    <span className="text-[11px] text-heading">Recovered: <strong className="text-success font-mono">{cat.recovered}</strong></span>
                    <span className={`text-[13px] font-bold font-mono ${rateNum >= 90 ? "text-success" : rateNum >= 75 ? "text-warning" : "text-danger-500"}`}>{cat.rate}</span>
                  </div>
                </div>
                <ProgressBar
                  value={rateNum}
                  max={100}
                  color={rateNum >= 90 ? "#059669" : rateNum >= 75 ? "#D97706" : "#DC2626"}
                />
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Agent Performance */}
      <SectionCard title="Agent Performance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectionsAnalytics.agentPerformance.map((agent) => {
            const effNum = parseFloat(agent.efficiency);
            return (
              <div key={agent.name} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-body">{agent.name}</div>
                    <div className="text-[11px] text-heading">{agent.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider">Cases</div>
                    <div className="text-[14px] font-bold font-mono text-body">{agent.casesHandled}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider">Resolved</div>
                    <div className="text-[14px] font-bold font-mono text-success">{agent.resolved}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider">Efficiency</div>
                    <div className={`text-[14px] font-bold font-mono ${effNum >= 80 ? "text-success" : effNum >= 65 ? "text-warning" : "text-danger-500"}`}>{agent.efficiency}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider">Avg Resolution</div>
                    <div className="text-[14px] font-bold font-mono text-body">{agent.avgResolution}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
