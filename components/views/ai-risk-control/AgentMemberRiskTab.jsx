import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import AgentProfileCard from "@/components/ui/AgentProfileCard";

const agentMetrics = [
  { label: "Status", value: "Active", color: "#059669" },
  { label: "Members Analyzed", value: "606", color: "#D97706" },
  { label: "Risk Accuracy", value: "94.1%", color: "#4F46E5" },
  { label: "Last Full Scan", value: "11 Mar, 05:30 AM", color: "#6B7280" },
];

const reassessmentQueue = [
  { id: "M-1042", name: "Rajesh Kumar Sharma", risk: "High", trigger: "Multiple structuring alerts", priority: "Critical", scheduled: "11 Mar, 10:00 AM" },
  { id: "M-1087", name: "Priya Nair", risk: "High", trigger: "KYC document mismatch", priority: "High", scheduled: "11 Mar, 10:30 AM" },
  { id: "M-1055", name: "Anand Patel", risk: "Medium", trigger: "3 missed deposits", priority: "Medium", scheduled: "11 Mar, 11:00 AM" },
  { id: "M-1091", name: "Sunita Devi", risk: "Medium", trigger: "Dormant reactivation", priority: "Medium", scheduled: "11 Mar, 11:30 AM" },
  { id: "M-1033", name: "Deepak Verma", risk: "Low", trigger: "Quarterly reassessment", priority: "Low", scheduled: "11 Mar, 02:00 PM" },
  { id: "M-1073", name: "Meena Kumari", risk: "Medium", trigger: "Large withdrawal pattern", priority: "High", scheduled: "11 Mar, 10:15 AM" },
];

const riskScoreChanges = [
  { id: "M-1042", name: "Rajesh Kumar Sharma", from: 72, to: 91, change: "+19", reason: "4 structuring alerts in 48 hours, cross-branch activity detected", time: "11 Mar, 09:20 AM" },
  { id: "M-1087", name: "Priya Nair", from: 65, to: 88, change: "+23", reason: "KYC document discrepancy flagged by identity verification model", time: "10 Mar, 04:45 PM" },
  { id: "M-1033", name: "Deepak Verma", from: 52, to: 38, change: "-14", reason: "Consistent deposit pattern restored, cleared pending dues", time: "10 Mar, 11:00 AM" },
  { id: "M-1055", name: "Anand Patel", from: 48, to: 67, change: "+19", reason: "3 consecutive missed deposits, withdrawal spike", time: "09 Mar, 03:30 PM" },
  { id: "M-1098", name: "Farhan Sheikh", from: 55, to: 71, change: "+16", reason: "45-day inactivity, pending dues accumulating", time: "08 Mar, 06:00 AM" },
];

const behavioralPatterns = [
  { pattern: "Deposit Regularity Decline", members: 14, description: "Members showing decreasing deposit frequency over past 3 months", severity: "Medium", action: "Engagement campaign recommended" },
  { pattern: "Loan Dependency Escalation", members: 8, description: "Members increasing loan amounts with each cycle, debt-to-income rising", severity: "High", action: "Credit limit review triggered" },
  { pattern: "Cross-Guarantee Clustering", members: 6, description: "Mutual guarantee network detected. Default contagion risk elevated.", severity: "High", action: "Guarantee chain analysis in progress" },
  { pattern: "Seasonal Activity Anomaly", members: 22, description: "Members with transaction patterns inconsistent with declared occupation", severity: "Low", action: "Background verification update queued" },
  { pattern: "Digital Behavior Shift", members: 11, description: "Sudden shift from branch to online transactions. Device fingerprint changes.", severity: "Medium", action: "Device authentication reinforced" },
  { pattern: "Dormancy Risk", members: 19, description: "Members with declining engagement metrics over 60+ days", severity: "Medium", action: "Retention outreach initiated" },
];

const agentIcon = (
  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export default function AgentMemberRiskTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <AgentProfileCard
        icon={agentIcon}
        iconBg="bg-warning-100"
        title="Member Risk Analyzer Agent"
        description="Continuous member risk profiling and behavioral analysis"
        status="Online"
        metrics={agentMetrics}
      />

      {/* Risk Reassessment Queue */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Risk Reassessment Queue</h3>
        </div>
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100">
              {["Member", "Name", "Current Risk", "Trigger", "Priority", "Scheduled"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reassessmentQueue.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-heading">{row.id}</td>
                <td className="px-5 py-3 text-[13px] text-body font-medium">{row.name}</td>
                <td className="px-5 py-3"><StatusBadge status={row.risk} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{row.trigger}</td>
                <td className="px-5 py-3"><StatusBadge status={row.priority} /></td>
                <td className="px-5 py-3 text-[11px] text-heading">{row.scheduled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Risk Score Changes */}
      <SectionCard title="Recent Risk Score Changes" className="mb-6">
        <div className="flex flex-col gap-3">
          {riskScoreChanges.map((rc) => (
            <div key={rc.id + rc.time} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${rc.change.startsWith("+") ? "bg-danger-100" : "bg-success-100"}`}>
                <span className={`text-sm font-bold ${rc.change.startsWith("+") ? "text-danger-500" : "text-success"}`}>{rc.change}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[13px] font-semibold text-body">{rc.name}</span>
                    <span className="text-[11px] text-heading font-mono ml-2">{rc.id}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-heading">{rc.from}</span>
                      <span className="text-subtle">{"\u2192"}</span>
                      <span className={`font-mono text-xs font-bold ${rc.to >= 70 ? "text-danger-500" : rc.to >= 50 ? "text-warning" : "text-success"}`}>{rc.to}</span>
                    </div>
                    <div className="text-[10px] text-heading">{rc.time}</div>
                  </div>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{rc.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Behavioral Pattern Flags */}
      <SectionCard title="Behavioral Pattern Flags">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {behavioralPatterns.map((bp) => (
            <div key={bp.pattern} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-semibold text-body">{bp.pattern}</span>
                <StatusBadge status={bp.severity} />
              </div>
              <div className="text-[12px] text-slate-500 mb-2">{bp.description}</div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-primary font-medium">{bp.members} members affected</span>
                <span className="text-[11px] text-heading">{bp.action}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
