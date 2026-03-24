import { useOverdueCollections } from "@/hooks/useData";
import SectionCard from "@/components/ui/SectionCard";

export default function WorkflowTab() {
  const { data: overdue = [], loading } = useOverdueCollections();

  if (loading) {
    return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>;
  }

  // Derive workflow stages from overdue data
  const stages = [
    { name: "Notice Sent", color: "#6366F1", min: 0, max: 15 },
    { name: "Follow-up Call", color: "#F59E0B", min: 15, max: 45 },
    { name: "Field Visit", color: "#EF4444", min: 45, max: 90 },
    { name: "Legal Notice", color: "#DC2626", min: 90, max: 180 },
    { name: "Recovery", color: "#7C3AED", min: 180, max: Infinity },
  ].map((stage) => ({
    ...stage,
    cases: overdue.filter((o) => (o.daysOverdue || 0) >= stage.min && (o.daysOverdue || 0) < stage.max),
  }));

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-heading mb-1">Collections Workflow Pipeline</h3>
        <p className="text-[13px] text-heading">Track cases through each stage of the collections process.</p>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className="bg-white rounded-2xl px-4 py-3 card-shadow border border-slate-100 text-center min-w-[140px]">
              <div className="text-[20px] font-bold font-mono" style={{ color: stage.color }}>{stage.cases.length}</div>
              <div className="text-[10px] text-heading uppercase tracking-wider mt-1">{stage.name}</div>
            </div>
            {i < stages.length - 1 && (
              <svg className="w-5 h-5 text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Stage Details */}
      <div className="flex flex-col gap-4">
        {stages.filter((s) => s.cases.length > 0).map((stage) => (
          <SectionCard key={stage.name}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: stage.color }} />
              <h3 className="text-[15px] font-bold text-heading">{stage.name}</h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">{stage.cases.length} cases</span>
            </div>
            <div className="flex flex-col gap-3">
              {stage.cases.map((c) => (
                <div key={c.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold" style={{ background: stage.color }}>
                    {(c.memberName || "?").charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[13px] font-semibold text-body">{c.memberName}</div>
                        <div className="text-[11px] text-heading font-mono">{c.memberId} · {c.daysOverdue || 0}d overdue</div>
                      </div>
                      <div className="text-[14px] font-bold font-mono text-body">{c.outstanding}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
        {stages.every((s) => s.cases.length === 0) && (
          <div className="text-center py-12 text-[13px] text-slate-400">No overdue cases in the pipeline</div>
        )}
      </div>
    </div>
  );
}
