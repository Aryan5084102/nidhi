import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import AgentProfileCard from "@/components/ui/AgentProfileCard";
import FeedItem from "@/components/ui/FeedItem";

const agentMetrics = [
  { label: "Status", value: "Online", color: "#059669" },
  { label: "Uptime", value: "99.98%", color: "#4F46E5" },
  { label: "Tasks Processed", value: "4,821", color: "#6B8ABF" },
  { label: "Last Check", value: "2 min ago", color: "#6B7280" },
];

const currentAssessments = [
  { metric: "Cash Reserve Adequacy", value: "Sufficient", detail: "Rs 2.4 Cr available against Rs 1.8 Cr required minimum", status: "Active" },
  { metric: "Deposit Concentration Risk", value: "Moderate", detail: "Top 10 depositors hold 28% of total deposits. Threshold: 30%", status: "Warning" },
  { metric: "Loan-to-Deposit Ratio", value: "67.3%", detail: "Within acceptable range (max 80%). Trend: stable over 90 days", status: "Active" },
  { metric: "Maturity Mismatch", value: "Low Risk", detail: "Short-term liabilities covered 1.4x by short-term assets", status: "Active" },
];

const recentActions = [
  { action: "Auto-blocked withdrawal", detail: "Blocked Rs 5.2L withdrawal by M-1055 due to liquidity threshold breach. Alert raised to treasury.", time: "11 Mar, 08:45 AM", type: "Blocked" },
  { action: "Alert raised to CFO", detail: "Deposit concentration approaching 30% threshold. Recommended diversification outreach to top depositors.", time: "10 Mar, 06:00 PM", type: "Warning" },
  { action: "Rebalance suggestion", detail: "Suggested moving Rs 15L from current account to short-term FD to optimize liquid asset ratio.", time: "09 Mar, 10:30 AM", type: "Active" },
  { action: "Stress test triggered", detail: "Initiated automated stress test after detecting 12% increase in withdrawal requests over 48 hours.", time: "08 Mar, 03:15 PM", type: "Active" },
];

const configThresholds = [
  { param: "Min Cash Reserve", value: "Rs 1.8 Cr", description: "Minimum cash balance before alerts trigger" },
  { param: "Max Single Withdrawal", value: "Rs 5,00,000", description: "Auto-block threshold for single withdrawals" },
  { param: "Concentration Limit", value: "30%", description: "Max deposit share by top 10 members" },
  { param: "Check Frequency", value: "Every 5 min", description: "Interval for automated liquidity checks" },
  { param: "Stress Test Trigger", value: "10% withdrawal spike", description: "Threshold to initiate automated stress test" },
  { param: "Alert Escalation", value: "CFO, Board", description: "Notification recipients for critical alerts" },
];

const agentIcon = (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
  </svg>
);

export default function AgentLiquidityGuardTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Status Card */}
      <AgentProfileCard
        icon={agentIcon}
        iconBg="bg-blue-100"
        title="Liquidity Guard Agent"
        description="Autonomous liquidity monitoring and protection system"
        status="Online"
        metrics={agentMetrics}
      />

      {/* Current Assessment */}
      <SectionCard title="Current Liquidity Assessment" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAssessments.map((item) => (
            <div key={item.metric} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{item.metric}</span>
                <StatusBadge status={item.status} />
              </div>
              <div className="text-[15px] font-bold text-slate-900 mb-1">{item.value}</div>
              <div className="text-[12px] text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Actions Taken */}
      <SectionCard title="Recent Agent Actions" className="mb-6">
        <div className="flex flex-col gap-3">
          {recentActions.map((a, i) => (
            <FeedItem
              key={i}
              dotColor="bg-blue-500"
              title={a.action}
              time={a.time}
              badge={a.type}
              description={a.detail}
            />
          ))}
        </div>
      </SectionCard>

      {/* Configuration */}
      <SectionCard title="Agent Configuration & Thresholds">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {configThresholds.map((cfg) => (
            <div key={cfg.param} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center">
              <div>
                <div className="text-[13px] font-medium text-slate-700">{cfg.param}</div>
                <div className="text-[11px] text-slate-400">{cfg.description}</div>
              </div>
              <span className=" whitespace-nowrap font-mono text-xs text-indigo-600 font-semibold bg-indigo-50 rounded-lg px-2.5 py-1 border border-indigo-200/60">{cfg.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
