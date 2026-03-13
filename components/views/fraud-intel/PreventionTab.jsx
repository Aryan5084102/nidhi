import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";

const preventionMeasures = [
  { title: "Real-time Auction Monitoring", description: "AI monitors all chit fund auctions in real-time, detecting bid manipulation, price suppression, and coordinated bidding patterns.", status: "Active", effectiveness: "94%" },
  { title: "KYC Document Verification", description: "Multi-layer verification using OCR, biometric matching, and government database cross-referencing for all new member registrations.", status: "Active", effectiveness: "98%" },
  { title: "AML Transaction Screening", description: "Automated screening of all deposits and withdrawals against anti-money laundering rules, including CTR and STR filing.", status: "Active", effectiveness: "91%" },
  { title: "Network Graph Analysis", description: "Graph-based detection of collusion rings by analyzing member relationships, shared contacts, addresses, and transaction patterns.", status: "Active", effectiveness: "87%" },
  { title: "Behavioural Risk Scoring", description: "Continuous monitoring of member behaviour against their historical profile, flagging anomalies in deposit, loan, and auction activity.", status: "Active", effectiveness: "89%" },
  { title: "Device & Location Intelligence", description: "Track and analyse device fingerprints and geolocation data to detect account takeover and multi-accounting attempts.", status: "Beta", effectiveness: "82%" },
];

export default function PreventionTab() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preventionMeasures.map((pm) => (
          <div key={pm.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[15px] font-bold text-slate-900">{pm.title}</div>
              <StatusBadge status={pm.status === "Beta" ? "Upcoming" : pm.status} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{pm.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Detection Effectiveness</span>
              <span className="text-[14px] font-bold text-emerald-600 font-mono">{pm.effectiveness}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={parseInt(pm.effectiveness)} max={100} color="#34D399" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
