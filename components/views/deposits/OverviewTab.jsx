import { depositSchemes, depositTrend } from "@/data/mockData";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";

const metrics = [
  { label: "Total Deposit Pool", value: "\u20B939.5 Cr", change: "+6.1%", color: "#9585B5" },
  { label: "Fixed Deposits", value: "\u20B918.5 Cr", change: "+8.4%", color: "#6B8ABF" },
  { label: "Recurring Deposits", value: "\u20B98.2 Cr", change: "+5.2%", color: "#5B9E8A" },
  { label: "Savings Deposits", value: "\u20B912.8 Cr", change: "+4.8%", color: "#C49A4C" },
  { label: "Active Accounts", value: "12,450", change: "+320", color: "#6B9E89" },
  { label: "Maturing This Month", value: "48", change: "\u20B91.2 Cr", color: "#BF6F6D" },
];

const bars = [
  { key: "fd", label: "Fixed Deposit", gradient: "linear-gradient(to top, #4F46E5, #818CF8)", suffix: "L" },
  { key: "rd", label: "Recurring Deposit", gradient: "linear-gradient(to top, #0D9488, #14B8A6)", suffix: "L" },
  { key: "savings", label: "Savings", gradient: "linear-gradient(to top, #C9982E, #E8C65A)", suffix: "L" },
];

export default function OverviewTab() {
  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      <SectionCard title="Deposit Inflow Trend (\u20B9 Lakhs)" className="mb-6">
        <BarChart data={depositTrend} bars={bars} maxVal={600} labelKey="month" />
      </SectionCard>

      {/* Scheme Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {depositSchemes.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[15px] font-bold text-slate-900 mb-1">{s.name}</div>
            <div className="text-[11px] text-slate-400 mb-4">{s.members.toLocaleString()} active members</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Rate</div>
                <div className="text-[14px] font-bold text-indigo-600 font-mono">{s.rate}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Corpus</div>
                <div className="text-[14px] font-bold text-emerald-600 font-mono">{s.totalCorpus}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Min: <strong className="text-slate-600">{s.minAmount}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Tenure: <strong className="text-slate-600">{s.tenures}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
