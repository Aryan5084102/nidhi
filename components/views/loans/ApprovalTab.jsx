"use client";

import { loanApplications } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";

/* ─── Risk Badge ─── */
function RiskTag({ level }) {
  const styles = {
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    High: "bg-red-50 text-red-500 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

export default function ApprovalTab() {
  const pendingApprovals = loanApplications.filter((a) => a.status === "Pending" || a.status === "Under Review");

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Pending Approvals</h3>
            <p className="text-[13px] text-slate-400">Review and approve or reject pending loan applications.</p>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2 text-center border border-amber-200/60">
            <div className="text-lg font-bold text-amber-600 font-mono">{pendingApprovals.length}</div>
            <div className="text-slate-400 text-[10px]">Pending</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingApprovals.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{app.memberName}</div>
                <span className="text-[11px] text-slate-400 font-mono">{app.id}</span>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amount</div>
                <div className="text-[16px] font-bold text-indigo-600 font-mono">{app.amount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tenure</div>
                <div className="text-[13px] font-semibold text-slate-700">{app.tenure}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Purpose</div>
                <div className="text-[13px] font-semibold text-slate-700">{app.purpose}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Risk Level</div>
                <RiskTag level={app.risk} />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 text-[11px] text-slate-400">
              <span>STI Score: <strong className="text-slate-600">{app.stiScore}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Interest: <strong className="text-slate-600">{app.interestRate}</strong></span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-emerald-100 transition-colors">
                Approve
              </button>
              <button className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-red-100 transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingApprovals.length === 0 && (
        <div className="bg-white rounded-2xl p-10 card-shadow border border-slate-100 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold text-slate-700">All caught up!</div>
          <div className="text-[13px] text-slate-400 mt-1">No pending approvals at the moment.</div>
        </div>
      )}
    </div>
  );
}
