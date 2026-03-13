"use client";

import { loanPortfolio } from "@/data/mockData";
import ProgressBar from "@/components/ui/ProgressBar";

export default function PortfolioTab() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loanPortfolio.map((item) => {
          const pct = (item.disbursed / item.sanctioned) * 100;
          const npaRate = ((item.npa / item.count) * 100).toFixed(1);
          return (
            <div key={item.category} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[15px] font-bold text-slate-900">{item.category}</div>
                  <span className="text-[11px] text-slate-400">{item.count} active loans</span>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <svg className="w-5 h-5" style={{ color: item.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sanctioned</div>
                  <div className="text-[14px] font-bold text-indigo-600 font-mono">{"\u20B9"}{(item.sanctioned / 100000).toFixed(1)}L</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Disbursed</div>
                  <div className="text-[14px] font-bold text-emerald-600 font-mono">{"\u20B9"}{(item.disbursed / 100000).toFixed(1)}L</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400">Utilization</span>
                  <span className="text-[11px] text-slate-400 font-mono">{pct.toFixed(0)}%</span>
                </div>
                <ProgressBar value={pct} max={100} color={item.color} />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Avg Rate: <strong className="text-slate-600">{item.avgRate}</strong></span>
                <span className="text-slate-300">|</span>
                <span>NPA: <strong className={parseFloat(npaRate) > 5 ? "text-red-500" : "text-slate-600"}>{npaRate}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
