import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import AgentProfileCard from "@/components/ui/AgentProfileCard";

const agentMetrics = [
  { label: "Status", value: "Active", color: "#059669" },
  { label: "Rules Monitored", value: "47", color: "#7C3AED" },
  { label: "Last Audit", value: "11 Mar, 06:00 AM", color: "#6B7280" },
  { label: "Compliance Score", value: "91.2%", color: "#059669" },
];

const complianceChecks = [
  { check: "Net Owned Fund Adequacy", category: "Financial", result: "Pass", score: 98, next: "12 Mar, 06:00 AM" },
  { check: "Member Count Ratio (200 minimum)", category: "Membership", result: "Pass", score: 100, next: "12 Mar, 06:00 AM" },
  { check: "Deposit-to-NOF Ratio", category: "Financial", result: "Pass", score: 95, next: "12 Mar, 06:00 AM" },
  { check: "KYC Verification Coverage", category: "AML/KYC", result: "Fail", score: 48, next: "11 Mar, 12:00 PM" },
  { check: "Loan Ceiling Compliance", category: "Lending", result: "Warning", score: 72, next: "12 Mar, 06:00 AM" },
  { check: "Board Meeting Minutes Filed", category: "Governance", result: "Pass", score: 100, next: "01 Apr, 06:00 AM" },
  { check: "Auditor Appointment", category: "Governance", result: "Pass", score: 100, next: "01 Jul, 06:00 AM" },
  { check: "Interest Rate Compliance", category: "Lending", result: "Pass", score: 92, next: "12 Mar, 06:00 AM" },
];

const autoFiledReports = [
  { report: "NDH-1 Half-Yearly Return (Draft)", filed: "10 Mar 2026", type: "Regulatory", status: "Draft Ready", detail: "Auto-populated from system data. Pending CFO review." },
  { report: "Monthly STR Report - Feb 2026", filed: "05 Mar 2026", type: "AML", status: "Filed", detail: "2 suspicious transactions reported to FIU-IND." },
  { report: "Quarterly Prudential Return", filed: "01 Mar 2026", type: "RBI", status: "Filed", detail: "All prudential norms within limits. No exceptions." },
  { report: "KYC Gap Analysis Report", filed: "28 Feb 2026", type: "Internal", status: "Filed", detail: "52 members with incomplete KYC identified. Auto-reminders sent." },
];

const exceptionLog = [
  { time: "11 Mar, 06:02 AM", exception: "KYC check failed for 52 members", action: "Auto-generated remediation plan. Email reminders queued for members.", resolution: "In Progress" },
  { time: "10 Mar, 06:01 AM", exception: "Loan ceiling approaching for 3 members", action: "Preemptive alerts sent to loan officers. Block rule activated at 95% threshold.", resolution: "Mitigated" },
  { time: "08 Mar, 06:00 AM", exception: "Board meeting minutes not uploaded (Feb)", action: "Reminder sent to Company Secretary. Escalation scheduled for 12 Mar.", resolution: "Pending" },
  { time: "05 Mar, 06:03 AM", exception: "Interest rate on 2 FD schemes above RBI cap", action: "Auto-flagged to CFO. Rate adjustment recommendation generated.", resolution: "Resolved" },
];

const agentIcon = (
  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75" />
  </svg>
);

export default function AgentComplianceAuditorTab() {
  return (
    <div className="animate-fade-in">
      {/* Agent Profile */}
      <AgentProfileCard
        icon={agentIcon}
        iconBg="bg-purple-100"
        title="Compliance Auditor Agent"
        description="Automated regulatory compliance monitoring and reporting"
        status="Online"
        metrics={agentMetrics}
      />

      {/* Compliance Check Results */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Latest Compliance Check Results</h3>
        </div>
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100">
              {["Check", "Category", "Result", "Score", "Next Check"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complianceChecks.map((row) => (
              <tr key={row.check} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.check}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{row.category}</td>
                <td className="px-5 py-3"><StatusBadge status={row.result === "Pass" ? "Active" : row.result === "Fail" ? "Critical" : "Warning"} /></td>
                <td className="px-5 py-3"><span className={`font-mono text-xs font-bold ${row.score >= 90 ? "text-emerald-600" : row.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{row.score}</span></td>
                <td className="px-5 py-3 text-[11px] text-slate-400">{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auto-Filed Reports */}
      <SectionCard title="Auto-Filed Reports" className="mb-6">
        <div className="flex flex-col gap-3">
          {autoFiledReports.map((r) => (
            <div key={r.report} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{r.report}</div>
                    <div className="text-[11px] text-slate-400">Filed: {r.filed} &middot; Type: {r.type}</div>
                  </div>
                  <StatusBadge status={r.status === "Filed" ? "Active" : "Pending"} />
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Exception Handling Log */}
      <SectionCard title="Exception Handling Log">
        <div className="flex flex-col gap-3">
          {exceptionLog.map((ex, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ex.resolution === "Resolved" ? "bg-emerald-500" : ex.resolution === "Mitigated" ? "bg-blue-500" : ex.resolution === "Pending" ? "bg-amber-500" : "bg-red-500"}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] font-semibold text-slate-700">{ex.exception}</span>
                  <span className="text-[10px] text-slate-400">{ex.time}</span>
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{ex.action}</div>
                <div className="mt-2">
                  <StatusBadge status={ex.resolution === "Resolved" ? "Active" : ex.resolution === "Mitigated" ? "Cleared" : ex.resolution === "Pending" ? "Warning" : "Pending"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
