import { complianceChecklist, complianceScore } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";

export default function DashboardTab() {
  const compliant = complianceChecklist.filter((c) => c.status === "Compliant").length;
  const warning = complianceChecklist.filter((c) => c.status === "Warning").length;
  const action = complianceChecklist.filter((c) => c.status === "Action Required").length;

  return (
    <div className="animate-fade-in">
      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SectionCard title="Overall Compliance Score" className="lg:col-span-1">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={complianceScore.overall >= 90 ? "#059669" : complianceScore.overall >= 70 ? "#D97706" : "#DC2626"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${complianceScore.overall * 3.14} 314`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[28px] font-bold font-mono text-slate-900">{complianceScore.overall}%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Score</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-emerald-600">{compliant}</div>
              <div className="text-[10px] text-slate-400">Compliant</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-amber-600">{warning}</div>
              <div className="text-[10px] text-slate-400">Warning</div>
            </div>
            <div className="bg-red-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-red-500">{action}</div>
              <div className="text-[10px] text-slate-400">Action</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Category-wise Compliance" className="lg:col-span-2">
          <div className="flex flex-col gap-3">
            {complianceScore.categories.map((cat) => (
              <div key={cat.name} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Weight: {cat.weight}%</span>
                    <span className={`text-[13px] font-bold font-mono ${cat.score >= 90 ? "text-emerald-600" : cat.score >= 70 ? "text-amber-600" : "text-red-500"}`}>{cat.score}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: cat.score >= 90 ? "#059669" : cat.score >= 70 ? "#D97706" : "#DC2626" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Action Items */}
      <SectionCard title="Items Requiring Attention">
        <div className="flex flex-col gap-3">
          {complianceChecklist.filter((c) => c.status !== "Compliant").map((item) => (
            <div key={item.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === "Warning" ? "bg-amber-50 border border-amber-200/60" : "bg-red-50 border border-red-200/60"}`}>
                <svg className={`w-4 h-4 ${item.status === "Warning" ? "text-amber-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-semibold text-slate-700">{item.rule}</div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="text-[12px] text-slate-400 mt-1">{item.details}</div>
                <div className="text-[11px] text-slate-300 mt-2">Last Audit: {item.lastAudit} &middot; {item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
