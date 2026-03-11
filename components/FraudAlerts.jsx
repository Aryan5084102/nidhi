import RiskBadge from "./badges/RiskBadge";
import { fraudAlerts } from "@/data/mockData";

export default function FraudAlerts() {
  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        Active Fraud Alerts
      </h3>

      <div className="flex flex-col gap-2.5">
        {fraudAlerts.map((fa, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 hover:bg-slate-100/60 transition-all duration-200 group gap-2 sm:gap-0"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="font-mono text-[11px] text-slate-400 shrink-0">
                {fa.id}
              </span>
              <span className="text-[13px] text-slate-700 font-medium truncate">
                {fa.type}
              </span>
              <span className="text-[11px] text-slate-400 shrink-0">
                &middot; {fa.member}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <RiskBadge risk={fa.severity} />
              <span className="text-[11px] text-slate-400">{fa.time}</span>
              <button className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-500 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
