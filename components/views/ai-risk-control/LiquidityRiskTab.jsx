import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";

const liquidityMetrics = [
  { label: "Current Ratio", value: "1.82", color: "#059669" },
  { label: "Cash Reserve", value: "Rs 2.4 Cr", color: "#4F46E5" },
  { label: "Net Liquidity", value: "Rs 1.1 Cr", color: "#059669" },
  { label: "Stress Score", value: "34/100", color: "#D97706" },
];

const cashFlowProjections = [
  { period: "Next 7 Days", inflow: "Rs 18.5L", outflow: "Rs 12.3L", net: "Rs 6.2L", status: "Healthy" },
  { period: "Next 30 Days", inflow: "Rs 72.8L", outflow: "Rs 65.1L", net: "Rs 7.7L", status: "Adequate" },
  { period: "Next 90 Days", inflow: "Rs 2.1 Cr", outflow: "Rs 1.9 Cr", net: "Rs 20L", status: "Watch" },
];

const depositMaturity = [
  { bucket: "0-30 Days", amount: "Rs 45.2L", percentage: "18%", count: 124 },
  { bucket: "31-90 Days", amount: "Rs 68.7L", percentage: "28%", count: 203 },
  { bucket: "91-180 Days", amount: "Rs 52.3L", percentage: "21%", count: 167 },
  { bucket: "181-365 Days", amount: "Rs 48.9L", percentage: "20%", count: 145 },
  { bucket: "365+ Days", amount: "Rs 32.1L", percentage: "13%", count: 89 },
];

const stressTests = [
  { scenario: "Normal Operations", withdrawalRate: "5%", liquidityRatio: "1.82", survivalDays: "180+", result: "Pass", color: "text-emerald-600" },
  { scenario: "Moderate Stress", withdrawalRate: "15%", liquidityRatio: "1.34", survivalDays: "92", result: "Pass", color: "text-amber-600" },
  { scenario: "Severe Stress", withdrawalRate: "30%", liquidityRatio: "0.87", survivalDays: "41", result: "Fail", color: "text-red-500" },
];

const inflowOutflow = [
  { month: "Oct", inflow: 62, outflow: 48 },
  { month: "Nov", inflow: 71, outflow: 55 },
  { month: "Dec", inflow: 58, outflow: 67 },
  { month: "Jan", inflow: 75, outflow: 52 },
  { month: "Feb", inflow: 68, outflow: 61 },
  { month: "Mar", inflow: 73, outflow: 59 },
];

export default function LiquidityRiskTab() {
  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={liquidityMetrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Cash Flow Projections */}
      <SectionCard title="Cash Flow Projections" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cashFlowProjections.map((cf) => (
            <div key={cf.period} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-semibold text-slate-700">{cf.period}</span>
                <StatusBadge status={cf.status === "Healthy" ? "Active" : cf.status === "Watch" ? "Warning" : "Active"} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Inflow</div>
                  <div className="text-[13px] font-mono font-semibold text-emerald-600">{cf.inflow}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Outflow</div>
                  <div className="text-[13px] font-mono font-semibold text-red-500">{cf.outflow}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Net</div>
                  <div className="text-[13px] font-mono font-semibold text-indigo-600">{cf.net}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Deposit Maturity Analysis */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Deposit Maturity Analysis</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Maturity Bucket", "Amount", "Share", "Deposit Count"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {depositMaturity.map((row) => (
              <tr key={row.bucket} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.bucket}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600">{row.amount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 rounded-full h-1.5 w-20 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: row.percentage }} />
                    </div>
                    <span className="font-mono text-xs text-slate-500">{row.percentage}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stress Test Scenarios */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Stress Test Scenarios</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {["Scenario", "Withdrawal Rate", "Liquidity Ratio", "Survival Days", "Result"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stressTests.map((st) => (
              <tr key={st.scenario} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors whitespace-nowrap">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{st.scenario}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.withdrawalRate}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.liquidityRatio}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{st.survivalDays}</td>
                <td className="px-5 py-3"><span className={`text-xs font-bold ${st.color}`}>{st.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inflow vs Outflow */}
      <SectionCard title="Inflow vs Outflow (in Lakhs)">
        <BarChart
          data={inflowOutflow}
          bars={[
            { key: "inflow", label: "Inflow", gradient: "linear-gradient(to top, #059669, #10B981)" },
            { key: "outflow", label: "Outflow", gradient: "linear-gradient(to top, #DC2626, #F87171)" },
          ]}
          maxVal={80}
          labelKey="month"
        />
      </SectionCard>
    </div>
  );
}
