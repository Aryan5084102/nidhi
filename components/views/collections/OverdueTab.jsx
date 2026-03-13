import SectionCard from "@/components/ui/SectionCard";
import { overdueLoans } from "./data";

export default function OverdueTab() {
  const getSeverityColor = (days) => {
    if (days >= 90) return { bg: "bg-red-50/50", border: "border-red-100/60", text: "text-red-500", label: "Critical" };
    if (days >= 60) return { bg: "bg-orange-50/50", border: "border-orange-100/60", text: "text-orange-600", label: "High" };
    if (days >= 30) return { bg: "bg-amber-50/50", border: "border-amber-100/60", text: "text-amber-600", label: "Medium" };
    return { bg: "bg-blue-50/50", border: "border-blue-100/60", text: "text-blue-600", label: "Low" };
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Overdue Loan Tracker</h3>
            <p className="text-[13px] text-slate-400">Monitor all overdue loans with severity-based prioritisation for collection action.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="bg-red-50 rounded-xl px-3 py-2 text-center border border-red-200/60">
              <div className="text-lg font-bold text-red-500 font-mono">{overdueLoans.filter((l) => l.daysOverdue >= 90).length}</div>
              <div className="text-slate-400 text-[10px]">90+ Days</div>
            </div>
            <div className="bg-orange-50 rounded-xl px-3 py-2 text-center border border-orange-200/60">
              <div className="text-lg font-bold text-orange-600 font-mono">{overdueLoans.filter((l) => l.daysOverdue >= 60 && l.daysOverdue < 90).length}</div>
              <div className="text-slate-400 text-[10px]">60–90 Days</div>
            </div>
            <div className="bg-amber-50 rounded-xl px-3 py-2 text-center border border-amber-200/60">
              <div className="text-lg font-bold text-amber-600 font-mono">{overdueLoans.filter((l) => l.daysOverdue < 60).length}</div>
              <div className="text-slate-400 text-[10px]">&lt;60 Days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {overdueLoans.sort((a, b) => b.daysOverdue - a.daysOverdue).map((loan) => {
          const severity = getSeverityColor(loan.daysOverdue);
          return (
            <div key={loan.id} className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300`}>
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-full ${severity.bg} ${severity.border} border flex items-center justify-center ${severity.text} font-bold text-sm flex-shrink-0`}>
                    {loan.member.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-slate-900">{loan.member}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${severity.bg} ${severity.text} ${severity.border}`}>
                        {severity.label} — {loan.daysOverdue}d overdue
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{loan.memberId} &middot; {loan.id} &middot; {loan.loanType}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Outstanding</div>
                  <div className="text-[18px] font-bold text-red-500 font-mono">{loan.outstanding}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Loan</div>
                  <div className="text-[13px] font-semibold text-slate-700 font-mono">{loan.totalLoan}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">EMI Amount</div>
                  <div className="text-[13px] font-semibold text-slate-700 font-mono">{loan.emiAmount}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Payment</div>
                  <div className="text-[13px] font-semibold text-slate-700">{loan.lastPayment}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Collateral</div>
                  <div className="text-[13px] font-semibold text-slate-700">{loan.collateral}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
