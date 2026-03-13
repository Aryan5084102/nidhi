import SectionCard from "@/components/ui/SectionCard";
import { collectionsWorkflow } from "./data";

export default function WorkflowTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Collections Workflow Pipeline</h3>
        <p className="text-[13px] text-slate-400">Track cases through each stage of the collections process — from initial notice to recovery action.</p>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {collectionsWorkflow.stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className="bg-white rounded-2xl px-4 py-3 card-shadow border border-slate-100 text-center min-w-[140px]">
              <div className="text-[20px] font-bold font-mono" style={{ color: stage.color }}>{stage.count}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{stage.name}</div>
            </div>
            {i < collectionsWorkflow.stages.length - 1 && (
              <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Stage Details */}
      <div className="flex flex-col gap-4">
        {collectionsWorkflow.stages.map((stage) => (
          <SectionCard key={stage.name}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: stage.color }} />
              <h3 className="text-[15px] font-bold text-slate-900">{stage.name}</h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">{stage.count} cases</span>
            </div>
            <div className="flex flex-col gap-3">
              {stage.cases.map((c) => (
                <div key={c.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold" style={{ background: stage.color }}>
                    {c.member.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-700">{c.member}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.id} &middot; {c.daysOverdue}d overdue</div>
                      </div>
                      <div className="text-[14px] font-bold font-mono text-slate-700">{c.amount}</div>
                    </div>
                    <div className="text-[12px] text-slate-500 mt-2 bg-white rounded-lg px-3 py-2 border border-slate-100">
                      {c.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
