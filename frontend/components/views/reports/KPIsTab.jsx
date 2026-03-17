import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function KPIsTab() {
  const kpis = [
    { title: "Deposit Growth Rate", value: "6.1%", target: "5.0%", status: "Above Target", color: "#059669" },
    { title: "Loan Default Rate", value: "2.1%", target: "3.0%", status: "Within Target", color: "#059669" },
    { title: "Member Retention", value: "97.8%", target: "95.0%", status: "Above Target", color: "#059669" },
    { title: "Compliance Score", value: "94%", target: "90%", status: "Above Target", color: "#059669" },
    { title: "Revenue Growth", value: "8.6%", target: "10.0%", status: "Below Target", color: "#D97706" },
    { title: "Cost Efficiency", value: "44%", target: "45%", status: "Within Target", color: "#059669" },
    { title: "AI Agent Accuracy", value: "96.2%", target: "95%", status: "Above Target", color: "#059669" },
    { title: "Fraud Detection Rate", value: "88%", target: "85%", status: "Above Target", color: "#059669" },
  ];

  const departmentKPIs = [
    { dept: "Operations", kpis: [{ name: "TAT \u2014 Loan Approval", actual: "2.1 days", target: "3 days" }, { name: "Member Onboarding", actual: "45 min", target: "60 min" }] },
    { dept: "Finance", kpis: [{ name: "Collection Efficiency", actual: "96.8%", target: "95%" }, { name: "Cost-to-Income", actual: "44%", target: "45%" }] },
    { dept: "Compliance", kpis: [{ name: "Filing Timeliness", actual: "100%", target: "100%" }, { name: "KYC Completion", actual: "97.3%", target: "100%" }] },
    { dept: "Technology", kpis: [{ name: "System Uptime", actual: "99.8%", target: "99.5%" }, { name: "AI Model Accuracy", actual: "96.2%", target: "95%" }] },
  ];

  const strategicGoals = [
    { goal: "Reach 15,000 members by FY27", progress: 83, current: "12,450", target: "15,000", status: "On Track" },
    { goal: "Achieve \u20B960 Cr AUM", progress: 75, current: "\u20B945.2 Cr", target: "\u20B960 Cr", status: "On Track" },
    { goal: "Expand to 5 branches in Karnataka", progress: 40, current: "2 branches", target: "5 branches", status: "In Progress" },
    { goal: "Reduce NPA below 1.5%", progress: 60, current: "2.1%", target: "1.5%", status: "Needs Focus" },
    { goal: "100% digital KYC adoption", progress: 88, current: "88%", target: "100%", status: "On Track" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-6 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-heading mb-1">Key Performance Indicators</h3>
        <p className="text-[13px] text-heading">Track organizational performance against strategic targets for FY 2025-26.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[12px] text-heading mb-3">{kpi.title}</div>
            <div className="text-[26px] font-bold font-mono text-heading mb-1">{kpi.value}</div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-heading">Target: {kpi.target}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kpi.status === "Below Target" ? "bg-warning-50 text-warning" : "bg-success-50 text-success"}`}>
                {kpi.status}
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(parseFloat(kpi.value) / parseFloat(kpi.target) * 100, 100)}%`, background: kpi.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Department KPIs */}
        <SectionCard title="Department-wise KPIs">
          <div className="flex flex-col gap-4">
            {departmentKPIs.map((d) => (
              <div key={d.dept} className="bg-slate-50 rounded-xl p-4">
                <div className="text-[13px] font-bold text-body mb-3">{d.dept}</div>
                <div className="flex flex-col gap-2">
                  {d.kpis.map((k) => (
                    <div key={k.name} className="flex justify-between items-center">
                      <span className="text-[12px] text-slate-500">{k.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-semibold text-body">{k.actual}</span>
                        <span className="text-[10px] text-heading">/ {k.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Strategic Goals */}
        <SectionCard title="Strategic Goals Tracking">
          <div className="flex flex-col gap-3">
            {strategicGoals.map((sg) => (
              <div key={sg.goal} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[13px] font-semibold text-body">{sg.goal}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sg.status === "On Track" ? "bg-success-50 border-success-200 text-success" : sg.status === "In Progress" ? "bg-warning-50 border-warning-200 text-warning" : "bg-danger-50 border-danger-200 text-danger"}`}>
                    {sg.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] text-heading">Current: {sg.current}</span>
                  <span className="text-[11px] text-heading">Target: {sg.target}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sg.progress}%`, background: sg.progress >= 80 ? "linear-gradient(to right, #059669, #34D399)" : sg.progress >= 50 ? "linear-gradient(to right, #D97706, #FBBF24)" : "linear-gradient(to right, #DC2626, #F87171)" }} />
                </div>
                <div className="text-[11px] font-mono text-heading mt-1 text-right">{sg.progress}%</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Performance Trend */}
      <SectionCard title="Performance Trend \u2014 Key Metrics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenue (MoM)", value: "+8.6%", trend: "up", prev: "+6.2%", color: "#059669" },
            { label: "NPA Rate", value: "2.1%", trend: "down", prev: "2.5%", color: "#059669" },
            { label: "Member Growth", value: "+540", trend: "up", prev: "+480", color: "#4F46E5" },
            { label: "Compliance", value: "94%", trend: "up", prev: "93%", color: "#0D9488" },
          ].map((t) => (
            <StatCard key={t.label} label={t.label} value={t.value} sub={`Prev: ${t.prev} ${t.trend === "up" ? "\u2191" : "\u2193"}`} color={t.color} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
