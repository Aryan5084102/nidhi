import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import AlertCard from "@/components/ui/AlertCard";

const fraudMetrics = [
  { label: "Real-Time Score", value: "87.3", color: "#DC2626" },
  { label: "Patterns Active", value: "12", color: "#D97706" },
  { label: "Models Deployed", value: "5", color: "#4F46E5" },
  { label: "Avg Detection Time", value: "0.8s", color: "#059669" },
];

const fraudPatterns = [
  { id: "FP-001", name: "Auction Bid Manipulation", description: "Coordinated bidding among 3+ members in Chit Group CG-2024-07 detected. Bids consistently within 2% of each other.", severity: "Critical", detectedAt: "11 Mar 2026, 09:14 AM" },
  { id: "FP-002", name: "Deposit Layering", description: "Member M-1042 making multiple deposits under Rs 10,000 threshold across 4 branches within 48 hours.", severity: "High", detectedAt: "10 Mar 2026, 03:47 PM" },
  { id: "FP-003", name: "Identity Duplication", description: "KYC documents of M-1087 show 94.2% facial match with M-1023. Potential duplicate identity registration.", severity: "High", detectedAt: "10 Mar 2026, 11:22 AM" },
  { id: "FP-004", name: "Collusion Ring", description: "Graph analysis identified 6-member cluster with unusual cross-guarantee patterns and synchronized loan requests.", severity: "Medium", detectedAt: "09 Mar 2026, 06:15 PM" },
];

const accuracyByType = [
  { type: "Auction Manipulation", precision: "94.2%", recall: "91.8%", f1: "93.0%", cases: 34 },
  { type: "Deposit Layering", precision: "97.1%", recall: "88.5%", f1: "92.6%", cases: 21 },
  { type: "Identity Fraud", precision: "99.3%", recall: "95.7%", f1: "97.5%", cases: 8 },
  { type: "Collusion Detection", precision: "88.7%", recall: "82.3%", f1: "85.4%", cases: 12 },
  { type: "Benami Transactions", precision: "91.5%", recall: "86.9%", f1: "89.1%", cases: 15 },
];

const flaggedTxns = [
  { id: "TXN-90821", member: "M-1042", type: "Deposit", amount: "Rs 9,800", risk: 92, reason: "Structuring pattern - 4th sub-threshold deposit", time: "11 Mar, 09:02 AM", status: "Blocked" },
  { id: "TXN-90817", member: "M-1087", type: "Loan Request", amount: "Rs 2,50,000", risk: 88, reason: "Identity mismatch detected in KYC", time: "10 Mar, 04:31 PM", status: "Flagged" },
  { id: "TXN-90812", member: "M-1023", type: "Chit Bid", amount: "Rs 48,200", risk: 79, reason: "Bid pattern correlates with collusion cluster", time: "10 Mar, 02:15 PM", status: "Flagged" },
  { id: "TXN-90808", member: "M-1055", type: "Withdrawal", amount: "Rs 4,75,000", risk: 74, reason: "Unusual withdrawal amount, 3x monthly average", time: "09 Mar, 11:45 AM", status: "Cleared" },
  { id: "TXN-90801", member: "M-1091", type: "Transfer", amount: "Rs 1,20,000", risk: 71, reason: "First-time large transfer to non-member account", time: "09 Mar, 09:30 AM", status: "Pending" },
];

export default function FraudDetectionTab() {
  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={fraudMetrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Active Fraud Patterns */}
      <SectionCard title="Active Fraud Patterns Detected" className="mb-6">
        <div className="flex flex-col gap-3">
          {fraudPatterns.map((fp) => (
            <AlertCard
              key={fp.id}
              severity={fp.severity}
              title={fp.name}
              subtitle={`${fp.id} \u00b7 ${fp.detectedAt}`}
              description={fp.description}
            />
          ))}
        </div>
      </SectionCard>

      {/* Detection Accuracy by Fraud Type */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Detection Accuracy by Fraud Type</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Fraud Type", "Precision", "Recall", "F1 Score", "Cases"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accuracyByType.map((row) => (
              <tr key={row.type} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-body font-medium">{row.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-success">{row.precision}</td>
                <td className="px-5 py-3 font-mono text-xs text-primary">{row.recall}</td>
                <td className="px-5 py-3 font-mono text-xs text-body font-semibold">{row.f1}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent AI-Flagged Transactions */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-heading">Recent AI-Flagged Transactions</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["Txn ID", "Member", "Type", "Amount", "Risk", "Reason", "Status"].map((h) => (
                <th key={h} className="text-left text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flaggedTxns.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-heading whitespace-nowrap">{txn.id}</td>
                <td className="px-5 py-3 font-mono text-xs text-body">{txn.member}</td>
                <td className="px-5 py-3 text-[13px] whitespace-nowrap text-body">{txn.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-body whitespace-nowrap">{txn.amount}</td>
                <td className="px-5 py-3"><span className={`font-mono text-xs font-bold ${txn.risk >= 85 ? "text-danger-500" : txn.risk >= 70 ? "text-warning" : "text-slate-500"}`}>{txn.risk}</span></td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[240px]">
                  <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={txn.reason}>{txn.reason}</span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={txn.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
