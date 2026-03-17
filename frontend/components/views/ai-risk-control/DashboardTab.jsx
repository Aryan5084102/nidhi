import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";
import ProgressBar from "@/components/ui/ProgressBar";

const metrics = [
  { label: "Total Risk Score", value: "72.4", color: "#D97706" },
  { label: "Active AI Alerts", value: "18", color: "#DC2626" },
  { label: "Model Accuracy", value: "96.8%", color: "#059669" },
  { label: "False Positive Rate", value: "3.2%", color: "#6B8ABF" },
  { label: "Threats Blocked", value: "142", color: "#9585B5" },
  { label: "System Health", value: "99.7%", color: "#059669" },
];

const riskCategories = [
  { name: "Fraud Risk", score: 68, weight: 25, trend: "+2.3" },
  { name: "Liquidity Risk", score: 45, weight: 20, trend: "-1.8" },
  { name: "Compliance Risk", score: 82, weight: 20, trend: "+0.5" },
  { name: "Credit Risk", score: 57, weight: 20, trend: "+3.1" },
  { name: "Operational Risk", score: 39, weight: 15, trend: "-0.7" },
];

const modelPerformance = [
  { month: "Sep", accuracy: 94, precision: 91, recall: 88 },
  { month: "Oct", accuracy: 95, precision: 93, recall: 90 },
  { month: "Nov", accuracy: 95, precision: 92, recall: 91 },
  { month: "Dec", accuracy: 96, precision: 94, recall: 92 },
  { month: "Jan", accuracy: 97, precision: 95, recall: 93 },
  { month: "Feb", accuracy: 97, precision: 96, recall: 94 },
];

export default function DashboardTab() {
  return (
    <div className="animate-fade-in">
      <MetricGrid metrics={metrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      {/* Risk Category Breakdown */}
      <SectionCard title="Risk Category Breakdown" className="mb-6">
        <div className="flex flex-col gap-3">
          {riskCategories.map((cat) => (
            <div key={cat.name} className="bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-body">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-heading">Weight: {cat.weight}%</span>
                  <span className={`text-[11px] font-semibold ${cat.trend.startsWith("+") ? "text-danger-500" : "text-success"}`}>{cat.trend}</span>
                  <span className={`text-[13px] font-bold font-mono ${cat.score >= 70 ? "text-danger-500" : cat.score >= 50 ? "text-warning" : "text-success"}`}>{cat.score}</span>
                </div>
              </div>
              <ProgressBar value={cat.score} max={100} color={cat.score >= 70 ? "#DC2626" : cat.score >= 50 ? "#D97706" : "#059669"} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* AI Model Performance Trend */}
      <SectionCard title="AI Model Performance Trend">
        <BarChart
          data={modelPerformance}
          bars={[
            { key: "accuracy", label: "Accuracy", gradient: "linear-gradient(to top, #059669, #10B981)", suffix: "%" },
            { key: "precision", label: "Precision", gradient: "linear-gradient(to top, #4F46E5, #818CF8)", suffix: "%" },
            { key: "recall", label: "Recall", gradient: "linear-gradient(to top, #C9982E, #E8C65A)", suffix: "%" },
          ]}
          maxVal={100}
          labelKey="month"
        />
      </SectionCard>
    </div>
  );
}
