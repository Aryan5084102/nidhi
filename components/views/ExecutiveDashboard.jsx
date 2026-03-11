import MetricCard from "../MetricCard";
import LiquidityChart from "../LiquidityChart";
import LoanPortfolioChart from "../LoanPortfolioChart";
import DepositGrowthChart from "../DepositGrowthChart";
import RiskHeatmap from "../RiskHeatmap";
import AgentCard from "../AgentCard";
import FraudAlerts from "../FraudAlerts";
import { metrics, agents } from "@/data/mockData";

export default function ExecutiveDashboard() {
  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        {metrics.map((m, i) => (
          <MetricCard key={i} metric={m} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <LiquidityChart />
        <LoanPortfolioChart />
      </div>

      {/* Deposit & Risk Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <DepositGrowthChart />
        <RiskHeatmap />
      </div>

      {/* AI Agents Control Center */}
      <div className="bg-white rounded-2xl p-3 md:p-5 mb-4 md:mb-6 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Agentic AI Control Center
          </h3>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full font-medium">
            5/6 Active
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
