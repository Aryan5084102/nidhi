import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";

const amlMetrics = [
  { label: "STRs Filed (FY)", value: "14", color: "text-red-500", bg: "bg-red-50" },
  { label: "CTRs Filed (FY)", value: "87", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Suspicious Patterns", value: "23", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Blocked Transactions", value: "6", color: "text-slate-700", bg: "bg-slate-50" },
];

const ctrReports = [
  { id: "CTR-001", memberId: "M-1004", memberName: "Priya Venkat", amount: "\u20B912,50,000", type: "Cash Deposit", date: "08 Mar 2026", branch: "Indiranagar", status: "Filed" },
  { id: "CTR-002", memberId: "M-1012", memberName: "Sunita Rao", amount: "\u20B915,00,000", type: "Cash Withdrawal", date: "05 Mar 2026", branch: "Malleshwaram", status: "Filed" },
  { id: "CTR-003", memberId: "M-1018", memberName: "Padma Krishnan", amount: "\u20B910,50,000", type: "Cash Deposit", date: "02 Mar 2026", branch: "Sadashivanagar", status: "Filed" },
  { id: "CTR-004", memberId: "M-1001", memberName: "Rajesh Kumar", amount: "\u20B911,00,000", type: "FD Creation", date: "28 Feb 2026", branch: "MG Road", status: "Filed" },
  { id: "CTR-005", memberId: "M-1006", memberName: "Meena Pillai", amount: "\u20B918,75,000", type: "Cash Deposit", date: "25 Feb 2026", branch: "Whitefield", status: "Filed" },
];

const strReports = [
  { id: "STR-001", memberId: "M-1005", memberName: "Suresh Iyer", pattern: "Structuring", description: "Multiple cash deposits just below \u20B910L threshold over 3 days", amount: "\u20B929,50,000", date: "09 Mar 2026", status: "Filed" },
  { id: "STR-002", memberId: "M-1003", memberName: "Vikram Nair", pattern: "Rapid Movement", description: "Deposit followed by immediate loan application and withdrawal", amount: "\u20B94,80,000", date: "06 Mar 2026", status: "Under Review" },
  { id: "STR-003", memberId: "M-1013", memberName: "Ganesh Hegde", pattern: "Unusual Volume", description: "Transaction volume 400% above historical average in single week", amount: "\u20B98,20,000", date: "01 Mar 2026", status: "Filed" },
  { id: "STR-004", memberId: "M-1033", memberName: "Prakash Jain", pattern: "Identity Concern", description: "Mismatched KYC documents used across multiple transactions", amount: "\u20B93,40,000", date: "25 Feb 2026", status: "Escalated" },
];

const riskScoring = [
  { category: "Low Risk (0-30)", count: 10850, pct: 87 },
  { category: "Medium Risk (31-60)", count: 1120, pct: 9 },
  { category: "High Risk (61-80)", count: 380, pct: 3 },
  { category: "Critical Risk (81-100)", count: 100, pct: 1 },
];

export default function AmlMonitoringTab() {
  return (
    <div className="animate-fade-in">
      {/* AML Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {amlMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className={`text-[22px] font-bold font-mono ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* AML Risk Distribution */}
      <SectionCard title="AML Risk Score Distribution" className="mb-6">
        <div className="flex flex-col gap-3">
          {riskScoring.map((r) => (
            <div key={r.category} className="bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-slate-700">{r.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-slate-400">{r.count.toLocaleString()} members</span>
                  <span className="text-[13px] font-bold font-mono text-slate-700">{r.pct}%</span>
                </div>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 bg-indigo-500" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* CTR Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Cash Transaction Reports (CTR)</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Transactions exceeding \u20B910,00,000 reported to FIU-IND as per PMLA 2002</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">CTR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Branch</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ctrReports.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{c.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{c.memberName}</div>
                  <div className="text-[11px] text-slate-400">{c.memberId}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{c.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500 whitespace-nowrap">{c.type}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{c.date}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{c.branch}</td>
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* STR Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Suspicious Transaction Reports (STR)</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Filed with FIU-IND within 7 days of detection as per PMLA guidelines</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">STR ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Pattern</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 whitespace-nowrap">Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {strReports.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono whitespace-nowrap">{s.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{s.memberName}</div>
                  <div className="text-[11px] text-slate-400">{s.memberId}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="text-[12px] font-medium text-slate-600 whitespace-nowrap">{s.pattern}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.description}</div>
                </td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700 font-mono whitespace-nowrap">{s.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{s.date}</td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
