import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";

const flaggedTransactions = [
  { id: "ST-001", memberId: "M-1005", memberName: "Suresh Iyer", amount: "\u20B99,95,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "09 Mar 2026" },
  { id: "ST-002", memberId: "M-1005", memberName: "Suresh Iyer", amount: "\u20B99,90,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "08 Mar 2026" },
  { id: "ST-003", memberId: "M-1005", memberName: "Suresh Iyer", amount: "\u20B99,65,000", type: "Cash Deposit", pattern: "Structuring", riskScore: 92, status: "Investigating", date: "07 Mar 2026" },
  { id: "ST-004", memberId: "M-1003", memberName: "Vikram Nair", amount: "\u20B94,80,000", type: "Loan Disbursement", pattern: "Rapid Movement", riskScore: 85, status: "Under Review", date: "06 Mar 2026" },
  { id: "ST-005", memberId: "M-1003", memberName: "Vikram Nair", amount: "\u20B94,50,000", type: "Cash Withdrawal", pattern: "Rapid Movement", riskScore: 85, status: "Under Review", date: "06 Mar 2026" },
  { id: "ST-006", memberId: "M-1013", memberName: "Ganesh Hegde", amount: "\u20B92,80,000", type: "Chit Fund Bid", pattern: "Unusual Volume", riskScore: 78, status: "Filed", date: "05 Mar 2026" },
  { id: "ST-007", memberId: "M-1033", memberName: "Prakash Jain", amount: "\u20B91,50,000", type: "FD Creation", pattern: "Identity Concern", riskScore: 95, status: "Escalated", date: "04 Mar 2026" },
  { id: "ST-008", memberId: "M-1033", memberName: "Prakash Jain", amount: "\u20B91,90,000", type: "Cash Deposit", pattern: "Identity Concern", riskScore: 95, status: "Escalated", date: "03 Mar 2026" },
  { id: "ST-009", memberId: "M-1008", memberName: "Deepa Reddy", amount: "\u20B975,000", type: "Fund Transfer", pattern: "Unusual Timing", riskScore: 62, status: "Cleared", date: "02 Mar 2026" },
  { id: "ST-010", memberId: "M-1011", memberName: "Ramesh Babu", amount: "\u20B91,20,000", type: "Cash Withdrawal", pattern: "Behavioural Anomaly", riskScore: 58, status: "Cleared", date: "28 Feb 2026" },
];

const strCases = [
  { id: "STR-001", memberId: "M-1005", memberName: "Suresh Iyer", totalAmount: "\u20B929,50,000", transactions: 3, pattern: "Structuring below \u20B910L threshold", filedDate: "09 Mar 2026", fiuRef: "FIU/STR/2026/1847", status: "Filed" },
  { id: "STR-002", memberId: "M-1003", memberName: "Vikram Nair", totalAmount: "\u20B99,30,000", transactions: 2, pattern: "Deposit-loan-withdrawal within 48 hours", filedDate: "\u2014", fiuRef: "\u2014", status: "Under Review" },
  { id: "STR-003", memberId: "M-1013", memberName: "Ganesh Hegde", totalAmount: "\u20B98,20,000", transactions: 5, pattern: "400% spike in transaction volume", filedDate: "01 Mar 2026", fiuRef: "FIU/STR/2026/1823", status: "Filed" },
  { id: "STR-004", memberId: "M-1033", memberName: "Prakash Jain", totalAmount: "\u20B93,40,000", transactions: 2, pattern: "Mismatched KYC across transactions", filedDate: "\u2014", fiuRef: "\u2014", status: "Escalated" },
];

const patternSummary = [
  { pattern: "Structuring", count: 3, totalValue: "\u20B929,50,000", severity: "Critical" },
  { pattern: "Rapid Movement", count: 2, totalValue: "\u20B99,30,000", severity: "High" },
  { pattern: "Identity Concern", count: 2, totalValue: "\u20B93,40,000", severity: "Critical" },
  { pattern: "Unusual Volume", count: 1, totalValue: "\u20B92,80,000", severity: "Medium" },
  { pattern: "Unusual Timing", count: 1, totalValue: "\u20B975,000", severity: "Low" },
  { pattern: "Behavioural Anomaly", count: 1, totalValue: "\u20B91,20,000", severity: "Low" },
];

export default function SuspiciousTransactionsTab() {
  return (
    <div className="animate-fade-in">
      {/* Pattern Summary */}
      <SectionCard title="Transaction Pattern Summary" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {patternSummary.map((p) => (
            <div key={p.pattern} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="text-[13px] font-semibold text-slate-700 leading-snug">{p.pattern}</div>
                <StatusBadge status={p.severity} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Flagged</div>
                  <div className="text-[16px] font-bold font-mono text-slate-700">{p.count}</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Value</div>
                  <div className="text-[12px] font-semibold font-mono text-slate-600">{p.totalValue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* STR Cases */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">STR Case Listing</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Suspicious Transaction Reports filed or pending with FIU-IND</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">STR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Txns</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">FIU Ref</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {strCases.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{s.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{s.memberName}</div>
                  <div className="text-[11px] text-slate-400">{s.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">
                  <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={s.pattern}>{s.pattern}</span>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{s.totalAmount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500 text-center">{s.transactions}</td>
                <td className="px-5 py-3 text-[11px] text-slate-400 font-mono whitespace-nowrap">{s.fiuRef}</td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Flagged Transactions Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Flagged Transactions</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Individual transactions flagged by AI pattern detection engine</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Score</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {flaggedTransactions.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{t.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700">{t.memberName}</div>
                  <div className="text-[11px] text-slate-400">{t.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono">{t.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{t.type}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t.pattern}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[13px] font-bold font-mono ${t.riskScore >= 80 ? "text-red-500" : t.riskScore >= 60 ? "text-amber-600" : "text-emerald-600"}`}>{t.riskScore}</span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
