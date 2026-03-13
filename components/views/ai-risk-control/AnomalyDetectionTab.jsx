import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import FeedItem from "@/components/ui/FeedItem";

const anomalyFeed = [
  { id: "ANM-4021", time: "11 Mar, 09:14 AM", type: "Structuring", member: "M-1042", description: "4th deposit of Rs 9,800 within 48 hours across branches", severity: "Critical" },
  { id: "ANM-4020", time: "11 Mar, 08:52 AM", type: "Unusual Volume", member: "M-1055", description: "Withdrawal volume 340% above 30-day average", severity: "High" },
  { id: "ANM-4019", time: "10 Mar, 04:31 PM", type: "Cross-Account", member: "M-1087", description: "Funds routed through 3 member accounts within 2 hours", severity: "High" },
  { id: "ANM-4018", time: "10 Mar, 02:15 PM", type: "Time Anomaly", member: "M-1023", description: "Transaction initiated at 2:15 AM IST from new device", severity: "Medium" },
  { id: "ANM-4017", time: "10 Mar, 11:30 AM", type: "Structuring", member: "M-1091", description: "Split deposit pattern: 3 deposits totaling Rs 28K in 30 mins", severity: "Medium" },
  { id: "ANM-4016", time: "09 Mar, 06:45 PM", type: "Unusual Volume", member: "M-1033", description: "Loan prepayment of Rs 4.2L, no prior history of early repayment", severity: "Low" },
];

// Heatmap data: hours (rows) x days (columns)
const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const heatmapData = [
  [0, 1, 0, 0, 1, 0],
  [1, 2, 1, 0, 0, 1],
  [2, 3, 4, 2, 1, 3],
  [3, 2, 3, 5, 2, 1],
  [4, 5, 3, 4, 6, 2],
  [2, 3, 2, 3, 4, 1],
  [1, 1, 2, 1, 2, 3],
  [0, 0, 1, 0, 1, 0],
];

const heatColor = (val) => {
  if (val === 0) return "bg-slate-100";
  if (val <= 1) return "bg-amber-100";
  if (val <= 2) return "bg-amber-200";
  if (val <= 3) return "bg-orange-300";
  if (val <= 4) return "bg-red-300";
  return "bg-red-500";
};

const anomalyClassification = [
  { type: "Structuring", detected: 28, confirmed: 22, falsePositive: 6, accuracy: "78.6%" },
  { type: "Unusual Volume", detected: 45, confirmed: 39, falsePositive: 6, accuracy: "86.7%" },
  { type: "Cross-Account", detected: 14, confirmed: 12, falsePositive: 2, accuracy: "85.7%" },
  { type: "Time Anomaly", detected: 31, confirmed: 24, falsePositive: 7, accuracy: "77.4%" },
];

const modelMetrics = [
  { label: "Anomalies Detected (MTD)", value: "118", color: "#DC2626" },
  { label: "True Positive Rate", value: "82.4%", color: "#059669" },
  { label: "Avg Detection Latency", value: "1.2s", color: "#4F46E5" },
  { label: "Model Version", value: "v3.7.2", color: "#6B7280" },
];

export default function AnomalyDetectionTab() {
  return (
    <div className="animate-fade-in">
      {/* Detection Model Metrics */}
      <MetricGrid metrics={modelMetrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Real-Time Anomaly Feed */}
      <SectionCard title="Real-Time Anomaly Feed" className="mb-6">
        <div className="flex flex-col gap-3">
          {anomalyFeed.map((af) => (
            <FeedItem
              key={af.id}
              dotColor={af.severity === "Critical" ? "bg-red-500" : af.severity === "High" ? "bg-orange-500" : af.severity === "Medium" ? "bg-amber-500" : "bg-slate-400"}
              title={af.type}
              subtitle={`${af.id} \u00b7 ${af.member}`}
              time={af.time}
              badge={af.severity}
              description={af.description}
            />
          ))}
        </div>
      </SectionCard>

      {/* Transaction Pattern Heatmap */}
      <SectionCard title="Transaction Anomaly Heatmap (Hour x Day)" className="mb-6">
        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="flex gap-1 mb-1 ml-12">
              {days.map((d) => (
                <div key={d} className="w-10 text-center text-[10px] text-slate-400 font-medium">{d}</div>
              ))}
            </div>
            {hours.map((h, hi) => (
              <div key={h} className="flex gap-1 items-center mb-1">
                <div className="w-10 text-right text-[10px] text-slate-400 pr-2">{h}</div>
                {heatmapData[hi].map((val, di) => (
                  <div key={di} className={`w-10 h-8 rounded ${heatColor(val)} flex items-center justify-center`}>
                    <span className="text-[10px] font-mono text-slate-600">{val}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 ml-12">
              <span className="text-[10px] text-slate-400">Low</span>
              <div className="w-6 h-3 rounded bg-slate-100" />
              <div className="w-6 h-3 rounded bg-amber-100" />
              <div className="w-6 h-3 rounded bg-amber-200" />
              <div className="w-6 h-3 rounded bg-orange-300" />
              <div className="w-6 h-3 rounded bg-red-300" />
              <div className="w-6 h-3 rounded bg-red-500" />
              <span className="text-[10px] text-slate-400">High</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Anomaly Classification */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Anomaly Classification Breakdown</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Type", "Detected", "Confirmed", "False Positive", "Accuracy"].map((h) => (
                <th key={h} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {anomalyClassification.map((row) => (
              <tr key={row.type} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{row.type}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{row.detected}</td>
                <td className="px-5 py-3 font-mono text-xs text-emerald-600">{row.confirmed}</td>
                <td className="px-5 py-3 font-mono text-xs text-red-500">{row.falsePositive}</td>
                <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-semibold">{row.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
