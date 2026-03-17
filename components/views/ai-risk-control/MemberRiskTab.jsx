import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";

const riskDistribution = [
  { level: "Low Risk", count: 412, percentage: "68%", color: "#059669" },
  { level: "Medium Risk", count: 142, percentage: "23%", color: "#D97706" },
  { level: "High Risk", count: 38, percentage: "6%", color: "#DC2626" },
  { level: "Critical", count: 14, percentage: "3%", color: "#7C2D12" },
];

const highRiskMembers = [
  { id: "M-1042", name: "Rajesh Kumar Sharma", risk: 91, factors: ["Multiple sub-threshold deposits", "Rapid account activity increase", "Cross-branch transactions"], sti: 32, churn: "78%" },
  { id: "M-1087", name: "Priya Nair", risk: 88, factors: ["KYC document discrepancy", "Unusual loan repayment pattern", "Third-party fund sources"], sti: 41, churn: "65%" },
  { id: "M-1023", name: "Vikram Singh Rathore", risk: 85, factors: ["Collusion cluster member", "Bid pattern anomaly", "Guarantor for 4 high-risk members"], sti: 38, churn: "52%" },
  { id: "M-1091", name: "Sunita Devi", risk: 79, factors: ["Dormant account reactivation", "Large withdrawal after long inactivity", "Address verification failed"], sti: 45, churn: "44%" },
];

const stiAnalytics = [
  { range: "90-100 (Excellent)", count: 187, avgDeposit: "Rs 2.8L", defaultRate: "0.2%" },
  { range: "70-89 (Good)", count: 225, avgDeposit: "Rs 1.9L", defaultRate: "1.1%" },
  { range: "50-69 (Average)", count: 112, avgDeposit: "Rs 1.2L", defaultRate: "3.8%" },
  { range: "30-49 (Below Average)", count: 62, avgDeposit: "Rs 68K", defaultRate: "8.4%" },
  { range: "0-29 (Poor)", count: 20, avgDeposit: "Rs 25K", defaultRate: "18.7%" },
];

const churnWarnings = [
  { id: "M-1055", name: "Anand Patel", signal: "3 consecutive missed deposits", probability: "82%", lastActivity: "18 Feb 2026" },
  { id: "M-1073", name: "Meena Kumari", signal: "Withdrawal of 60% deposits", probability: "71%", lastActivity: "05 Mar 2026" },
  { id: "M-1098", name: "Farhan Sheikh", signal: "No login for 45 days, pending dues", probability: "67%", lastActivity: "24 Jan 2026" },
  { id: "M-1044", name: "Lakshmi Iyer", signal: "Closed 2 of 3 chit subscriptions", probability: "58%", lastActivity: "08 Mar 2026" },
];

const riskMigration = [
  { from: "Low", toLow: 385, toMedium: 24, toHigh: 3, toCritical: 0 },
  { from: "Medium", toLow: 18, toMedium: 112, toHigh: 10, toCritical: 2 },
  { from: "High", toLow: 2, toMedium: 8, toHigh: 24, toCritical: 4 },
  { from: "Critical", toLow: 0, toMedium: 1, toHigh: 3, toCritical: 10 },
];

export default function MemberRiskTab() {
  return (
    <div className="animate-fade-in">
      {/* Risk Distribution */}
      <SectionCard title="Member Risk Distribution" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {riskDistribution.map((rd) => (
            <StatCard
              key={rd.level}
              label={rd.level}
              value={rd.count}
              sub={`${rd.percentage} of total`}
              color={rd.color}
            />
          ))}
        </div>
      </SectionCard>

      {/* High Risk Member Profiling */}
      <SectionCard title="High-Risk Member Profiling" className="mb-6">
        <div className="flex flex-col gap-4">
          {highRiskMembers.map((hm) => (
            <div key={hm.id} className="bg-danger-50/40 rounded-xl p-4 border border-danger-100/60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13px] font-semibold text-body">{hm.name}</div>
                  <div className="text-[11px] text-heading font-mono">{hm.id} &middot; STI: {hm.sti} &middot; Churn: {hm.churn}</div>
                </div>
                <span className="text-[13px] font-bold font-mono text-danger-500">Risk: {hm.risk}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {hm.factors.map((f, i) => (
                  <span key={i} className="text-[10px] bg-danger-100 text-danger rounded-full px-2.5 py-0.5 border border-danger-200/60">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* STI Score Analytics */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">STI Score Analytics</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["Score Range", "Members", "Avg Deposit", "Default Rate"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stiAnalytics.map((row) => (
              <tr key={row.range} className="border-b whitespace-nowrap border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-body font-medium">{row.range}</td>
                <td className="px-5 py-3 font-mono text-xs text-primary font-semibold">{row.count}</td>
                <td className="px-5 py-3 font-mono text-xs text-body">{row.avgDeposit}</td>
                <td className="px-5 py-3 font-mono text-xs text-danger-500">{row.defaultRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Churn Prediction */}
      <SectionCard title="Churn Prediction & Early Warning" className="mb-6">
        <div className="flex flex-col gap-3">
          {churnWarnings.map((cw) => (
            <div key={cw.id} className="flex items-center gap-4 bg-warning-50/50 rounded-xl p-4 border border-warning-100/60">
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center text-warning font-bold text-sm flex-shrink-0">
                {cw.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-body">{cw.name} <span className="text-[11px] text-heading font-mono">({cw.id})</span></div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{cw.signal}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold font-mono text-warning">{cw.probability}</div>
                    <div className="text-[10px] text-heading">Last: {cw.lastActivity}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Risk Migration Matrix */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Risk Migration Matrix (Last 90 Days)</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["From \\ To", "Low", "Medium", "High", "Critical"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskMigration.map((row) => (
              <tr key={row.from} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-body font-semibold">{row.from}</td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Low" ? "font-bold text-success" : "text-slate-500"}>{row.toLow}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Medium" ? "font-bold text-warning" : "text-slate-500"}>{row.toMedium}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "High" ? "font-bold text-danger-500" : "text-slate-500"}>{row.toHigh}</span></td>
                <td className="px-5 py-3 font-mono text-xs"><span className={row.from === "Critical" ? "font-bold text-red-700" : "text-slate-500"}>{row.toCritical}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
