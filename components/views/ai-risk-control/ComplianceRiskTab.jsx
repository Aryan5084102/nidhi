import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";

const complianceRules = [
  { id: "CR-01", rule: "Net Owned Fund Ratio (NOF >= Rs 10L)", score: 98, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
  { id: "CR-02", rule: "Unencumbered Term Deposits (>= 10% of deposits)", score: 95, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
  { id: "CR-03", rule: "Member Loan Limit (<= Rs 2L per member)", score: 72, status: "Warning", lastCheck: "11 Mar 2026, 06:00 AM" },
  { id: "CR-04", rule: "Deposit Acceptance (members only)", score: 100, status: "Compliant", lastCheck: "11 Mar 2026, 06:00 AM" },
  { id: "CR-05", rule: "Annual Return Filing (NBS-4)", score: 88, status: "Compliant", lastCheck: "10 Mar 2026, 06:00 AM" },
  { id: "CR-06", rule: "Prudential Norms Adherence", score: 65, status: "Warning", lastCheck: "11 Mar 2026, 06:00 AM" },
  { id: "CR-07", rule: "KYC Compliance (100% verified)", score: 48, status: "Critical", lastCheck: "11 Mar 2026, 06:00 AM" },
];

const predictedViolations = [
  { rule: "Member Loan Limit", probability: "78%", eta: "~14 days", impact: "High", description: "3 members approaching Rs 2L loan ceiling. Current trajectory suggests breach by month-end." },
  { rule: "Liquid Asset Ratio", probability: "45%", eta: "~30 days", impact: "Medium", description: "Seasonal deposit withdrawals may push liquid assets below 15% threshold in April." },
  { rule: "Director Shareholding", probability: "32%", eta: "~60 days", impact: "Low", description: "Pending share transfer of outgoing director may trigger non-compliance if not processed." },
];

const regulatoryChanges = [
  { regulation: "Nidhi Amendment Rules 2026", effective: "01 Apr 2026", impact: "High", areas: "NOF increase to Rs 20L, digital KYC mandatory", status: "Preparing" },
  { regulation: "RBI AML Guidelines Update", effective: "01 Jul 2026", impact: "Medium", areas: "Enhanced due diligence for Rs 50K+ transactions", status: "Analyzing" },
  { regulation: "MCA Annual Compliance Calendar", effective: "Ongoing", impact: "Low", areas: "Updated filing schedule for FY 2026-27", status: "Reviewed" },
];

const filingDeadlines = [
  { filing: "NDH-1 (Half-yearly Return)", deadline: "31 Mar 2026", status: "In Progress", aiReminder: "Auto-reminder sent on 01 Mar. 72% complete." },
  { filing: "NDH-2 (Intimation for NOF)", deadline: "30 Apr 2026", status: "Upcoming", aiReminder: "Scheduled reminder for 01 Apr. Data pre-filled." },
  { filing: "NDH-3 (Extension Application)", deadline: "N/A", status: "Not Required", aiReminder: "No extension needed. All ratios within limits." },
  { filing: "NBS-4 (Annual Return)", deadline: "30 Jun 2026", status: "Upcoming", aiReminder: "Preliminary data collection initiated by AI." },
  { filing: "Form AOC-4 (Financial Statements)", deadline: "30 Sep 2026", status: "Upcoming", aiReminder: "Will begin preparation after audit completion." },
];

export default function ComplianceRiskTab() {
  return (
    <div className="animate-fade-in">
      {/* AI-Monitored Compliance Rules */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">AI-Monitored Compliance Rules</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["ID", "Rule", "AI Score", "Status", "Last Check"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complianceRules.map((cr) => (
              <tr key={cr.id} className="border-b border-slate-50 hover:bg-slate-50/60 whitespace-nowrap transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{cr.id}</td>
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{cr.rule}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 rounded-full h-1.5 w-16 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cr.score}%`, background: cr.score >= 90 ? "#059669" : cr.score >= 60 ? "#D97706" : "#DC2626" }} />
                    </div>
                    <span className={`font-mono text-xs font-bold ${cr.score >= 90 ? "text-emerald-600" : cr.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{cr.score}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><StatusBadge status={cr.status} /></td>
                <td className="px-5 py-3 text-[11px] text-slate-400">{cr.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Predicted Compliance Violations */}
      <SectionCard title="Predicted Compliance Violations" className="mb-6">
        <div className="flex flex-col gap-3">
          {predictedViolations.map((pv) => (
            <div key={pv.rule} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[13px] font-semibold text-slate-700">{pv.rule}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">ETA: {pv.eta}</span>
                  <StatusBadge status={pv.impact} />
                </div>
              </div>
              <div className="text-[12px] text-slate-500">{pv.description}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase">Probability</span>
                <div className="bg-slate-200 rounded-full h-1.5 w-24 overflow-hidden">
                  <div className="h-full rounded-full bg-red-400" style={{ width: pv.probability }} />
                </div>
                <span className="font-mono text-xs text-red-500 font-semibold">{pv.probability}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Regulatory Change Impact */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Regulatory Change Impact Analysis</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["Regulation", "Effective Date", "Impact", "Key Areas", "Status"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regulatoryChanges.map((rc) => (
              <tr key={rc.regulation} className="border-b  border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium whitespace-nowrap">{rc.regulation}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{rc.effective}</td>
                <td className="px-5 py-3"><StatusBadge status={rc.impact} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[240px]">
                  <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none">{rc.areas}</span>
                </td>
                <td className="px-5 py-3 text-[12px] text-indigo-600 font-medium">{rc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filing Deadline Tracker */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Filing Deadline Tracker with AI Reminders</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["Filing", "Deadline", "Status", "AI Reminder"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filingDeadlines.map((fd) => (
              <tr key={fd.filing} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium whitespace-nowrap">{fd.filing}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{fd.deadline}</td>
                <td className="px-5 py-3"><StatusBadge status={fd.status === "In Progress" ? "Warning" : fd.status === "Not Required" ? "Resolved" : "Pending"} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[280px]">
                  <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none">{fd.aiReminder}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
