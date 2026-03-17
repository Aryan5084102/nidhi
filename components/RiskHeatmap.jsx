"use client";

const riskData = [
  { category: "Loan Default", low: 72, medium: 18, high: 8, critical: 2 },
  { category: "Auction Fraud", low: 65, medium: 20, high: 10, critical: 5 },
  { category: "KYC Non-Compliance", low: 58, medium: 25, high: 12, critical: 5 },
  { category: "Deposit Flight", low: 80, medium: 14, high: 4, critical: 2 },
  { category: "Collusion Ring", low: 70, medium: 15, high: 10, critical: 5 },
  { category: "Identity Fraud", low: 75, medium: 15, high: 7, critical: 3 },
];

const levels = [
  { key: "low", label: "Low", color: "bg-success-100 text-success-700" },
  { key: "medium", label: "Med", color: "bg-warning-100 text-amber-700" },
  { key: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { key: "critical", label: "Crit", color: "bg-danger-100 text-red-700" },
];

function getCellColor(level, value) {
  if (level === "low") {
    return value > 70 ? "bg-success-400" : value > 50 ? "bg-success-300" : "bg-success-200";
  }
  if (level === "medium") {
    return value > 20 ? "bg-warning-400" : value > 15 ? "bg-warning-300" : "bg-warning-200";
  }
  if (level === "high") {
    return value > 10 ? "bg-orange-400" : value > 7 ? "bg-orange-300" : "bg-orange-200";
  }
  return value > 5 ? "bg-danger-500" : value > 3 ? "bg-danger-400" : "bg-danger-300";
}

export default function RiskHeatmap() {
  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Risk Heatmap</h3>
        <div className="flex items-center gap-2">
          {levels.map((l) => (
            <span
              key={l.key}
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${l.color}`}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {riskData.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-body w-[110px] shrink-0 truncate">
              {row.category}
            </span>
            <div className="flex gap-1 flex-1">
              {levels.map((l) => (
                <div
                  key={l.key}
                  className={`flex-1 h-7 rounded-md flex items-center justify-center ${getCellColor(l.key, row[l.key])} transition-all duration-200 hover:scale-105 cursor-default`}
                  title={`${row.category} - ${l.label}: ${row[l.key]}%`}
                >
                  <span className="text-[10px] font-semibold text-white/90">
                    {row[l.key]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
