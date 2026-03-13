import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";

export default function BoardReportsTab() {
  const boardMeetings = [
    { quarter: "Q4 FY26 (Jan-Mar)", date: "28 Mar 2026", status: "Upcoming", agenda: "Annual budget review, NPA resolution, expansion plan", attendees: 7 },
    { quarter: "Q3 FY26 (Oct-Dec)", date: "22 Dec 2025", status: "Completed", agenda: "Half-year performance, compliance audit, digital transformation", attendees: 6 },
    { quarter: "Q2 FY26 (Jul-Sep)", date: "25 Sep 2025", status: "Completed", agenda: "Member growth strategy, new scheme launch, risk framework", attendees: 7 },
    { quarter: "Q1 FY26 (Apr-Jun)", date: "28 Jun 2025", status: "Completed", agenda: "Annual plan approval, director appointment, policy updates", attendees: 5 },
  ];

  const executiveMetrics = [
    { label: "Total AUM Growth", value: "+14.2%", target: "+12%", color: "#059669" },
    { label: "Member Base", value: "12,450", target: "12,000", color: "#4F46E5" },
    { label: "Net Profit Margin", value: "32.5%", target: "28%", color: "#059669" },
    { label: "Regulatory Score", value: "94%", target: "90%", color: "#0D9488" },
  ];

  const decisions = [
    { id: "BR-001", decision: "Approved expansion to Hubli-Dharwad with \u20B950L capital allocation", date: "22 Dec 2025", status: "In Progress", owner: "Suresh Menon (MD)" },
    { id: "BR-002", decision: "Approved new Gold Loan scheme with 9.5% interest rate", date: "22 Dec 2025", status: "Implemented", owner: "Kavitha Nair (CFO)" },
    { id: "BR-003", decision: "Mandated 100% digital KYC for all new members from Jan 2026", date: "25 Sep 2025", status: "Implemented", owner: "Ramesh Babu (CTO)" },
    { id: "BR-004", decision: "Approved \u20B925L budget for AI-powered fraud detection system", date: "25 Sep 2025", status: "In Progress", owner: "Ramesh Babu (CTO)" },
    { id: "BR-005", decision: "Resolved to maintain NOF at 2x regulatory minimum", date: "28 Jun 2025", status: "Ongoing", owner: "Kavitha Nair (CFO)" },
  ];

  const shareholderComms = [
    { type: "Annual General Meeting Notice", date: "15 Mar 2026", recipients: "All Shareholders (245)", status: "Scheduled" },
    { type: "Quarterly Performance Update", date: "05 Jan 2026", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Dividend Declaration Notice", date: "20 Dec 2025", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Special Resolution \u2014 Branch Expansion", date: "10 Nov 2025", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Half-Yearly Financial Summary", date: "05 Oct 2025", recipients: "All Shareholders (238)", status: "Sent" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Board Meeting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {boardMeetings.map((bm) => (
          <div key={bm.quarter} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{bm.quarter}</div>
                <div className="text-[12px] text-slate-400 font-mono mt-0.5">{bm.date}</div>
              </div>
              <StatusBadge status={bm.status === "Completed" ? "Active" : "Upcoming"} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{bm.agenda}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">{bm.attendees} directors attended</span>
              {bm.status === "Completed" && (
                <button className="ml-auto py-1.5 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[11px] font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                  View Minutes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Summary */}
      <SectionCard title="Executive Summary \u2014 Board Deck Metrics" className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {executiveMetrics.map((em) => (
            <StatCard key={em.label} label={em.label} value={em.value} sub={`Target: ${em.target}`} color={em.color} />
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Decisions */}
        <SectionCard title="Key Decisions & Resolutions">
          <div className="flex flex-col gap-3">
            {decisions.map((d) => (
              <div key={d.id} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-mono text-slate-400">{d.id}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${d.status === "Implemented" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : d.status === "In Progress" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-indigo-50 border-indigo-200 text-indigo-600"}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-[13px] text-slate-700 mb-1">{d.decision}</div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{d.date}</span>
                  <span className="text-[11px] text-slate-400">{d.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Shareholder Communications */}
        <SectionCard title="Shareholder Communication Log">
          <div className="flex flex-col gap-3">
            {shareholderComms.map((sc) => (
              <div key={sc.type + sc.date} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{sc.type}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sc.status === "Sent" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                    {sc.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-400 font-mono">{sc.date}</span>
                  <span className="text-[11px] text-slate-400">{sc.recipients}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
