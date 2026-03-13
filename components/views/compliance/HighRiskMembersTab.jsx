import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

const riskSummary = [
  { label: "Critical Risk", value: "4", color: "text-red-500", desc: "Immediate action required" },
  { label: "High Risk", value: "12", color: "text-orange-600", desc: "Enhanced monitoring" },
  { label: "Medium Risk", value: "38", color: "text-amber-600", desc: "Periodic review" },
  { label: "On Watch List", value: "8", color: "text-purple-600", desc: "Under observation" },
];

const highRiskMembers = [
  { id: "M-1005", name: "Suresh Iyer", riskScore: 94, riskFactors: ["Structuring suspicion", "STR filed", "KYC under review", "STI score drop"], lastReview: "09 Mar 2026", actions: "Transaction monitoring, Account restriction pending" },
  { id: "M-1033", name: "Prakash Jain", riskScore: 92, riskFactors: ["Mismatched KYC", "Identity concern", "Account suspended"], lastReview: "07 Mar 2026", actions: "Account frozen, Police complaint filed" },
  { id: "M-1003", name: "Vikram Nair", riskScore: 88, riskFactors: ["Rapid fund movement", "4 missed EMIs", "KYC expired", "Auction manipulation link"], lastReview: "06 Mar 2026", actions: "Enhanced due diligence, Loan recovery initiated" },
  { id: "M-1013", name: "Ganesh Hegde", riskScore: 82, riskFactors: ["Unusual transaction volume", "KYC under review", "Linked to collusion ring"], lastReview: "05 Mar 2026", actions: "Transaction limits imposed, KYC re-verification" },
  { id: "M-1009", name: "Arun Prasad", riskScore: 78, riskFactors: ["Multiple loan defaults", "KYC pending", "High debt-to-deposit ratio"], lastReview: "04 Mar 2026", actions: "Loan applications blocked, KYC reminder sent" },
  { id: "M-1017", name: "Vinod Shetty", riskScore: 75, riskFactors: ["Loans exceed deposits", "KYC pending", "Low STI score"], lastReview: "03 Mar 2026", actions: "Loan cap enforced, Deposit requirement notification" },
  { id: "M-1022", name: "Nandini Rao", riskScore: 68, riskFactors: ["KYC expired", "Irregular deposit pattern"], lastReview: "01 Mar 2026", actions: "KYC renewal notice issued" },
  { id: "M-1029", name: "Deepak Sharma", riskScore: 65, riskFactors: ["Linked to collusion ring (FC-005)", "Shared address with M-1031"], lastReview: "28 Feb 2026", actions: "Address verification ordered, Chit scheme participation paused" },
  { id: "M-1031", name: "Manoj Patel", riskScore: 64, riskFactors: ["Linked to collusion ring (FC-005)", "Shared address with M-1029"], lastReview: "28 Feb 2026", actions: "Address verification ordered, Chit scheme participation paused" },
  { id: "M-1025", name: "Srinivas Reddy", riskScore: 62, riskFactors: ["Linked to collusion ring (FC-005)", "Bid pattern anomaly"], lastReview: "28 Feb 2026", actions: "Auction participation suspended pending investigation" },
];

const watchList = [
  { id: "M-1008", name: "Deepa Reddy", reason: "Former high-risk, downgraded after resolution", addedOn: "15 Jan 2026", reviewDate: "15 Apr 2026" },
  { id: "M-1011", name: "Ramesh Babu", reason: "Behavioural anomaly in withdrawal pattern (cleared)", addedOn: "01 Feb 2026", reviewDate: "01 May 2026" },
  { id: "M-1002", name: "Anita Sharma", reason: "Multiple loan applications in short period", addedOn: "10 Mar 2026", reviewDate: "10 Apr 2026" },
  { id: "M-1016", name: "Savitha Kulkarni", reason: "Deposit pattern change, under observation", addedOn: "05 Mar 2026", reviewDate: "05 Apr 2026" },
];

const watchListColumns = [
  { key: "id", label: "Member ID" },
  { key: "name", label: "Name" },
  { key: "reason", label: "Reason" },
  { key: "addedOn", label: "Added On" },
  { key: "reviewDate", label: "Next Review" },
];

export default function HighRiskMembersTab() {
  return (
    <div className="animate-fade-in">
      {/* Risk Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {riskSummary.map((r) => (
          <div key={r.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{r.label}</div>
            <div className={`text-[22px] font-bold font-mono ${r.color}`}>{r.value}</div>
            <div className="text-[11px] text-slate-300 mt-1">{r.desc}</div>
          </div>
        ))}
      </div>

      {/* High Risk Members Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">High Risk Member Registry</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Members flagged for enhanced due diligence as per PMLA and internal risk policy</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 whitespace-nowrap">
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Name</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Score</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Factors</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Review</th>
                <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Actions Required</th>
              </tr>
            </thead>
            <tbody>
              {highRiskMembers.map((m) => (
                <tr key={m.id} className="border-b whitespace-nowrap border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{m.id}</td>
                  <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{m.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[15px] font-bold font-mono ${m.riskScore >= 80 ? "text-red-500" : m.riskScore >= 60 ? "text-amber-600" : "text-emerald-600"}`}>{m.riskScore}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1 line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={m.riskFactors.join(", ")}>
                      {m.riskFactors.map((f, i) => (
                        <span key={i} className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-200/60">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.lastReview}</td>
                  <td className="px-5 py-3 text-[12px] text-slate-500">
                    <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={m.actions}>{m.actions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watch List */}
      <DataTable
        columns={watchListColumns}
        data={watchList}
        renderRow={(w) => (
          <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{w.id}</td>
            <td className="px-5 py-3 text-[13px] font-medium text-slate-700 whitespace-nowrap">{w.name}</td>
            <td className="px-5 py-3 text-[12px] text-slate-400">
              <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={w.reason}>{w.reason}</span>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{w.addedOn}</td>
            <td className="px-5 py-3 text-[12px] text-slate-400">{w.reviewDate}</td>
          </tr>
        )}
      />
    </div>
  );
}
