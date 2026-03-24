import { useOverdueCollections } from "@/hooks/useData";

export default function OverdueTab() {
  const { data: overdueLoans = [], loading } = useOverdueCollections();

  if (loading) {
    return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>;
  }

  const getSeverityColor = (days) => {
    if (days >= 90) return { bg: "bg-danger-50/50", border: "border-danger-100/60", text: "text-danger-500", label: "Critical" };
    if (days >= 60) return { bg: "bg-orange-50/50", border: "border-orange-100/60", text: "text-orange-600", label: "High" };
    if (days >= 30) return { bg: "bg-warning-50/50", border: "border-warning-100/60", text: "text-warning", label: "Medium" };
    return { bg: "bg-blue-50/50", border: "border-blue-100/60", text: "text-blue-600", label: "Low" };
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-heading mb-1">Overdue Loan Tracker</h3>
            <p className="text-[13px] text-heading">Monitor overdue loans with severity-based prioritisation.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="bg-danger-50 rounded-xl px-3 py-2 text-center border border-danger-200/60">
              <div className="text-lg font-bold text-danger-500 font-mono">{overdueLoans.filter((l) => (l.daysOverdue || 0) >= 90).length}</div>
              <div className="text-heading text-[10px]">90+ Days</div>
            </div>
            <div className="bg-orange-50 rounded-xl px-3 py-2 text-center border border-orange-200/60">
              <div className="text-lg font-bold text-orange-600 font-mono">{overdueLoans.filter((l) => (l.daysOverdue || 0) >= 60 && (l.daysOverdue || 0) < 90).length}</div>
              <div className="text-heading text-[10px]">60–90 Days</div>
            </div>
            <div className="bg-warning-50 rounded-xl px-3 py-2 text-center border border-warning-200/60">
              <div className="text-lg font-bold text-warning font-mono">{overdueLoans.filter((l) => (l.daysOverdue || 0) < 60).length}</div>
              <div className="text-heading text-[10px]">&lt;60 Days</div>
            </div>
          </div>
        </div>
      </div>

      {overdueLoans.length === 0 ? (
        <div className="text-center py-12 text-[13px] text-slate-400">No overdue loans found</div>
      ) : (
        <div className="flex flex-col gap-4">
          {[...overdueLoans].sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0)).map((loan) => {
            const severity = getSeverityColor(loan.daysOverdue || 0);
            return (
              <div key={loan.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-full ${severity.bg} ${severity.border} border flex items-center justify-center ${severity.text} font-bold text-sm shrink-0`}>
                      {(loan.memberName || "?").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-heading">{loan.memberName}</span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${severity.bg} ${severity.text} ${severity.border}`}>
                          {severity.label} — {loan.daysOverdue || 0}d overdue
                        </span>
                      </div>
                      <div className="text-[11px] text-heading font-mono mt-0.5 truncate">{loan.memberId} · {loan.id} · {loan.type}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Outstanding</div>
                    <div className="text-[18px] font-bold text-danger-500 font-mono">{loan.outstanding}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ["Total Amount", loan.totalAmount || "—"],
                    ["EMI / Due", loan.amount || "—"],
                    ["Last Payment", loan.lastPayment || "—"],
                    ["Assigned Agent", loan.assignedAgent || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">{label}</div>
                      <div className="text-[13px] font-semibold text-body">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
