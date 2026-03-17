import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import AgentProfileCard from "@/components/ui/AgentProfileCard";
import MetricGrid from "@/components/ui/MetricGrid";

const agentMetrics = [
  { label: "Status", value: "Active", color: "#059669" },
  { label: "Accuracy", value: "96.8%", color: "#4F46E5" },
  { label: "Cases Handled", value: "1,247", color: "#DC2626" },
  { label: "Avg Response", value: "0.8s", color: "#D97706" },
];

const investigations = [
  { id: "INV-301", title: "Coordinated Bid Ring - CG-2024-07", members: "M-1023, M-1042, M-1067", stage: "Evidence Collection", progress: 65, severity: "Critical" },
  { id: "INV-298", title: "Deposit Layering - Structuring Pattern", members: "M-1042", stage: "Pattern Confirmation", progress: 82, severity: "High" },
  { id: "INV-295", title: "Identity Duplication Investigation", members: "M-1087, M-1023", stage: "KYC Re-verification", progress: 40, severity: "High" },
  { id: "INV-292", title: "Dormant Account Exploitation", members: "M-1091", stage: "Activity Analysis", progress: 55, severity: "Medium" },
];

const detectionLog = [
  { time: "09:14 AM", event: "Structuring detected", member: "M-1042", action: "Auto-block + Alert", confidence: "97%" },
  { time: "08:52 AM", event: "Volume spike flagged", member: "M-1055", action: "Alert raised", confidence: "89%" },
  { time: "08:30 AM", event: "New device login", member: "M-1023", action: "MFA enforced", confidence: "72%" },
  { time: "08:15 AM", event: "Cross-account transfer", member: "M-1087", action: "Held for review", confidence: "91%" },
  { time: "07:45 AM", event: "Bid pattern anomaly", member: "M-1067", action: "Flagged", confidence: "85%" },
  { time: "07:22 AM", event: "KYC mismatch detected", member: "M-1099", action: "Account restricted", confidence: "94%" },
  { time: "06:58 AM", event: "Duplicate PAN detected", member: "M-1101", action: "Alert + Block", confidence: "99%" },
  { time: "06:30 AM", event: "Unusual guarantor chain", member: "M-1044", action: "Investigation opened", confidence: "78%" },
  { time: "06:15 AM", event: "Off-hours transaction", member: "M-1033", action: "Logged", confidence: "65%" },
  { time: "06:00 AM", event: "Daily scan complete", member: "All", action: "Report generated", confidence: "100%" },
];

const performanceMetrics = [
  { label: "Total Loss Prevented", value: "Rs 42.8L", color: "#059669" },
  { label: "Cases Auto-Resolved", value: "68%", color: "#4F46E5" },
  { label: "False Positive Rate", value: "3.2%", color: "#D97706" },
  { label: "Avg Investigation Time", value: "4.2 hrs", color: "#6B8ABF" },
  { label: "Escalation Rate", value: "12%", color: "#9585B5" },
  { label: "Member Impact Score", value: "Low", color: "#059669" },
];

const agentIcon = (
  <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

export default function AgentFraudSentinelTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <AgentProfileCard
        icon={agentIcon}
        iconBg="bg-danger-100"
        title="Fraud Sentinel Agent"
        description="Real-time fraud detection and investigation automation"
        status="Online"
        metrics={agentMetrics}
      />

      {/* Active Investigations */}
      <SectionCard title="Active Investigations" className="mb-6">
        <div className="flex flex-col gap-3">
          {investigations.map((inv) => (
            <div key={inv.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13px] font-semibold text-body">{inv.title}</div>
                  <div className="text-[11px] text-heading font-mono">{inv.id} &middot; Members: {inv.members}</div>
                </div>
                <StatusBadge status={inv.severity} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-slate-500">{inv.stage}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-500 transition-all duration-700" style={{ width: `${inv.progress}%` }} />
                </div>
                <span className="font-mono text-[11px] text-primary font-semibold">{inv.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Detection Log */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Detection Log (Recent 10)</h3>
        </div>
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100">
              {["Time", "Event", "Member", "Action", "Confidence"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detectionLog.map((log, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-heading">{log.time}</td>
                <td className="px-5 py-3 text-[13px] text-body">{log.event}</td>
                <td className="px-5 py-3 font-mono text-xs text-body">{log.member}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{log.action}</td>
                <td className="px-5 py-3 font-mono text-xs text-primary font-semibold">{log.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Metrics */}
      <SectionCard title="Performance Metrics">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {performanceMetrics.map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
