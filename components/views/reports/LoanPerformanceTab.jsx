import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";
import BarChart from "@/components/ui/BarChart";

export default function LoanPerformanceTab() {
  const loanMetrics = [
    { label: "Total Disbursed", value: "\u20B928.6 Cr", change: "+18.3%" },
    { label: "NPA Rate", value: "2.1%", change: "-0.4%" },
    { label: "Recovery Rate", value: "96.8%", change: "+1.2%" },
    { label: "Avg Interest", value: "11.8%", change: "-0.2%" },
  ];

  const loanCategories = [
    { category: "Personal Loans", disbursed: "\u20B99.0 Cr", active: 1800, npa: "1.8%", recovery: "97.2%", avgTicket: "\u20B950,000", color: "#6366F1" },
    { category: "Business Loans", disbursed: "\u20B910.5 Cr", active: 1400, npa: "2.8%", recovery: "95.4%", avgTicket: "\u20B975,000", color: "#0D9488" },
    { category: "Gold Loans", disbursed: "\u20B95.2 Cr", active: 900, npa: "0.5%", recovery: "99.1%", avgTicket: "\u20B958,000", color: "#C9982E" },
    { category: "Education Loans", disbursed: "\u20B92.8 Cr", active: 650, npa: "3.2%", recovery: "94.8%", avgTicket: "\u20B943,000", color: "#7C3AED" },
    { category: "Emergency Loans", disbursed: "\u20B91.6 Cr", active: 350, npa: "4.1%", recovery: "93.5%", avgTicket: "\u20B946,000", color: "#DC2626" },
    { category: "Vehicle Loans", disbursed: "\u20B90.65 Cr", active: 100, npa: "2.4%", recovery: "96.0%", avgTicket: "\u20B965,000", color: "#059669" },
  ];

  const npaTrend = [
    { month: "Oct", npa: 2.8 },
    { month: "Nov", npa: 2.6 },
    { month: "Dec", npa: 2.5 },
    { month: "Jan", npa: 2.4 },
    { month: "Feb", npa: 2.3 },
    { month: "Mar", npa: 2.1 },
  ];

  const loanColumns = [
    { key: "category", label: "Category", align: "left" },
    { key: "disbursed", label: "Disbursed", align: "right" },
    { key: "active", label: "Active", align: "right" },
    { key: "npa", label: "NPA", align: "right" },
    { key: "recovery", label: "Recovery", align: "right" },
    { key: "avgTicket", label: "Avg Ticket", align: "right" },
  ];

  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={loanMetrics} />

      {/* Loan Category Table */}
      <div className="mb-6">
        <SectionCard title="Loan Category Performance">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Category</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Disbursed</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Active</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">NPA</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Recovery</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                {loanCategories.map((l) => (
                  <tr key={l.category} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: l.color }} />
                        <span className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">{l.category}</span>
                      </div>
                    </td>
                    <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.disbursed}</td>
                    <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.active.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${parseFloat(l.npa) > 3 ? "bg-red-50 border-red-200 text-red-600" : parseFloat(l.npa) > 2 ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                        {l.npa}
                      </span>
                    </td>
                    <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.recovery}</td>
                    <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.avgTicket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* NPA Trend */}
        <SectionCard title="NPA Trend (6 Months)">
          <div className="flex items-end gap-3 h-40">
            {npaTrend.map((d) => {
              const maxVal = 4;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{d.npa}%</div>
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.npa / maxVal) * 100}%`, background: d.npa > 2.5 ? "linear-gradient(to top, #DC2626, #F87171)" : "linear-gradient(to top, #059669, #34D399)" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Disbursement vs Recovery */}
        <SectionCard title="Disbursement vs Recovery">
          <BarChart
            data={[
              { month: "Oct", disbursed: 420, recovered: 380 },
              { month: "Nov", disbursed: 480, recovered: 440 },
              { month: "Dec", disbursed: 510, recovered: 470 },
              { month: "Jan", disbursed: 460, recovered: 450 },
              { month: "Feb", disbursed: 530, recovered: 500 },
              { month: "Mar", disbursed: 560, recovered: 520 },
            ]}
            bars={[
              { key: "disbursed", label: "Disbursed", gradient: "linear-gradient(to top, #4F46E5, #818CF8)", suffix: "L" },
              { key: "recovered", label: "Recovered", gradient: "linear-gradient(to top, #059669, #34D399)", suffix: "L" },
            ]}
            maxVal={600}
            labelKey="month"
            height="120px"
          />
        </SectionCard>
      </div>
    </div>
  );
}
