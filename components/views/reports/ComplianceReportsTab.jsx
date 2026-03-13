import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function ComplianceReportsTab() {
  const complianceHistory = [
    { month: "Oct 2025", score: 89 },
    { month: "Nov 2025", score: 90 },
    { month: "Dec 2025", score: 91 },
    { month: "Jan 2026", score: 92 },
    { month: "Feb 2026", score: 93 },
    { month: "Mar 2026", score: 94 },
  ];

  const filingStatus = [
    { form: "NDH-1", description: "Return of Statutory Compliances", dueDate: "30 Apr 2026", status: "Upcoming" },
    { form: "NDH-3", description: "Half-Yearly Return", dueDate: "30 Sep 2026", status: "Upcoming" },
    { form: "NDH-4", description: "Declaration as Nidhi", dueDate: "\u2014", status: "Filed" },
    { form: "AOC-4", description: "Annual Financial Statements", dueDate: "30 Oct 2026", status: "Upcoming" },
    { form: "MGT-7A", description: "Annual Return", dueDate: "28 Nov 2026", status: "Upcoming" },
    { form: "DIR-3 KYC", description: "Director KYC", dueDate: "30 Sep 2026", status: "Upcoming" },
  ];

  const auditFindings = [
    { id: "AF-001", finding: "KYC re-verification backlog for 342 members", severity: "High", status: "Open", raisedDate: "15 Feb 2026", owner: "Compliance Team" },
    { id: "AF-002", finding: "Unencumbered deposit ratio at 11.2%, approaching threshold", severity: "Medium", status: "Monitoring", raisedDate: "28 Feb 2026", owner: "Treasury" },
    { id: "AF-003", finding: "Two loan accounts exceed individual exposure limit", severity: "Low", status: "Resolved", raisedDate: "10 Jan 2026", owner: "Credit Team" },
    { id: "AF-004", finding: "Board meeting minutes not digitised for Q3", severity: "Low", status: "In Progress", raisedDate: "05 Mar 2026", owner: "Company Secretary" },
  ];

  const gapAnalysis = [
    { area: "Capital Adequacy", required: "NOF \u2265 \u20B920L", current: "\u20B91.2 Cr", gap: "None", status: "Compliant" },
    { area: "Deposit Ratio", required: "NOF:Deposits \u2264 1:20", current: "1:14.5", gap: "None", status: "Compliant" },
    { area: "Unencumbered Deposits", required: "\u2265 10%", current: "11.2%", gap: "1.2% buffer", status: "Warning" },
    { area: "KYC Compliance", required: "100% verified", current: "97.3%", gap: "342 pending", status: "Action Required" },
    { area: "Loan-to-Deposit", required: "\u2264 80%", current: "62%", gap: "None", status: "Compliant" },
    { area: "Interest Rate Cap", required: "\u2264 Bank Rate + 12.5%", current: "9.5% max", gap: "None", status: "Compliant" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Compliance Score History */}
        <SectionCard title="Compliance Score Trend">
          <div className="flex items-end gap-3 h-40">
            {complianceHistory.map((d) => {
              const minVal = 85;
              const maxVal = 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{d.score}%</div>
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${((d.score - minVal) / (maxVal - minVal)) * 100}%`, background: d.score >= 93 ? "linear-gradient(to top, #059669, #34D399)" : "linear-gradient(to top, #D97706, #FBBF24)" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Filing Status */}
        <SectionCard title="Regulatory Filing Status">
          <div className="flex flex-col gap-2.5">
            {filingStatus.map((f) => (
              <div key={f.form} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{f.form}</div>
                  <div className="text-[11px] text-slate-400">{f.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  {f.dueDate !== "\u2014" && <span className="text-[11px] text-slate-400 font-mono">{f.dueDate}</span>}
                  <StatusBadge status={f.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Audit Findings */}
      <SectionCard title="Audit Findings Summary" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">ID</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Finding</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Severity</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Status</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {auditFindings.map((af) => (
                <tr key={af.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[12px] font-mono text-slate-400 px-5 py-3">{af.id}</td>
                  <td className="text-[13px] text-slate-700 px-5 py-3 max-w-xs">{af.finding}</td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={af.severity} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${af.status === "Resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : af.status === "Open" ? "bg-red-50 border-red-200 text-red-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                      {af.status}
                    </span>
                  </td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{af.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Compliance Gap Analysis */}
      <SectionCard title="Compliance Gap Analysis">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Area</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Required</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Current</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Gap</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {gapAnalysis.map((g) => (
                <tr key={g.area} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[13px] font-semibold text-slate-700 px-5 py-3">{g.area}</td>
                  <td className="text-[12px] font-mono text-slate-500 px-5 py-3">{g.required}</td>
                  <td className="text-[12px] font-mono text-slate-600 px-5 py-3">{g.current}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{g.gap}</td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={g.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
