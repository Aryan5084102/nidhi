import StatusBadge from "@/components/ui/StatusBadge";

const patterns = [
  { type: "Auction Manipulation", description: "Coordinated bidding by linked members to suppress auction prices and share undue benefits.", frequency: "8 cases", riskLevel: "Critical", indicators: ["Same IP/device for multiple bids", "Bids within 2-second window", "Shared bank accounts among bidders"] },
  { type: "Identity Fraud", description: "Use of fake or duplicate identity documents to create multiple member accounts.", frequency: "5 cases", riskLevel: "Critical", indicators: ["Duplicate PAN/Aadhaar across accounts", "Failed biometric verification", "Address proof inconsistencies"] },
  { type: "Deposit Layering", description: "Structuring deposits to avoid reporting thresholds, potential money laundering indicator.", frequency: "4 cases", riskLevel: "High", indicators: ["Multiple deposits just below \u20B910L threshold", "Rapid deposit-withdrawal cycles", "Cash deposits from multiple locations"] },
  { type: "Collusion Rings", description: "Groups of members coordinating to exploit chit fund auctions or loan disbursements.", frequency: "3 cases", riskLevel: "Critical", indicators: ["Shared contact details / addresses", "Sequential loan applications", "Cross-guarantees between ring members"] },
  { type: "Ghost Members", description: "Fictitious member accounts created using fabricated KYC documents.", frequency: "2 cases", riskLevel: "High", indicators: ["Failed address verification", "Unreachable contact numbers", "AI-generated document detection"] },
  { type: "Behavioural Anomaly", description: "Sudden changes in member activity patterns indicating potential financial distress or fraud.", frequency: "6 cases", riskLevel: "Medium", indicators: ["Rapid STI score decline", "Multiple simultaneous loan applications", "Abrupt deposit withdrawal pattern"] },
];

export default function PatternsTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-heading mb-1">AI-Powered Pattern Recognition</h3>
        <p className="text-[13px] text-heading">Our fraud detection system uses graph analytics, behavioural AI, and pattern matching to identify fraud typologies specific to Nidhi companies and chit fund operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map((p) => (
          <div key={p.type} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[15px] font-bold text-heading">{p.type}</div>
              <StatusBadge status={p.riskLevel} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{p.description}</p>
            <div className="text-[11px] text-heading mb-3">Detected: <strong className="text-body">{p.frequency}</strong> (last 6 months)</div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Key Indicators</div>
              <div className="flex flex-col gap-1.5">
                {p.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger-400 flex-shrink-0" />
                    {ind}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
