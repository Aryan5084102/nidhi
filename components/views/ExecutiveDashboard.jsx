import MetricCard from "../MetricCard";
import LiquidityChart from "../LiquidityChart";
import Roadmap from "../Roadmap";
import AgentCard from "../AgentCard";
import FraudAlerts from "../FraudAlerts";
import { metrics, agents } from "@/data/mockData";

export default function ExecutiveDashboard() {
  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((m, i) => (
          <MetricCard key={i} metric={m} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LiquidityChart />
        <Roadmap />
      </div>

      {/* AI Agents Control Center */}
      <div className="bg-white rounded-2xl p-5 mb-6 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Agentic AI Control Center
          </h3>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full font-medium">
            5/6 Active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((a, i) => (
            <AgentCard key={i} agent={a} />
          ))}
        </div>
      </div>

      {/* Fraud Alerts */}
      <FraudAlerts />
    </div>
  );
}
