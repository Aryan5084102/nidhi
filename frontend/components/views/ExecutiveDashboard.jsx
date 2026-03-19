"use client";

import MetricCard from "../MetricCard";
import LiquidityChart from "../LiquidityChart";
import LoanPortfolioChart from "../LoanPortfolioChart";
import DepositGrowthChart from "../DepositGrowthChart";
import RiskHeatmap from "../RiskHeatmap";
import AgentCard from "../AgentCard";
import FraudAlerts from "../FraudAlerts";
import ScrollReveal from "../ui/ScrollReveal";
import { useDashboardMetrics, useAgents } from "@/hooks/useData";

const METRIC_ICONS = [
  require("../../public/icon/members.png"),
  require("../../public/icon/loan.png"),
  require("../../public/icon/deposit.png"),
  require("../../public/icon/liquidity.png"),
  require("../../public/icon/alert.png"),
  require("../../public/icon/compliance.png"),
];

export default function ExecutiveDashboard() {
  const { data: apiMetrics = [] } = useDashboardMetrics();
  const { data: agents = [] } = useAgents();

  const metrics = apiMetrics.map((m, i) => ({ ...m, icon: METRIC_ICONS[i] || null, color: m.color }));

  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        {metrics.map((m, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <MetricCard metric={m} />
          </ScrollReveal>
        ))}
      </div>

      {/* Charts Row */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <LiquidityChart />
          <LoanPortfolioChart />
        </div>
      </ScrollReveal>

      {/* Deposit & Risk Row */}
      <ScrollReveal delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <DepositGrowthChart />
          <RiskHeatmap />
        </div>
      </ScrollReveal>

      {/* AI Agents Control Center */}
      <ScrollReveal delay={0.2}>
        <div className="bg-white rounded-2xl p-3 md:p-5 mb-4 md:mb-6 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Agentic AI Control Center
            </h3>
            <span className="text-[11px] text-success bg-success-50 border border-success-200/60 px-2.5 py-0.5 rounded-full font-medium">
              5/6 Active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((a, i) => (
              <AgentCard key={i} agent={a} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Fraud Alerts */}
      <ScrollReveal delay={0.25}>
        <FraudAlerts />
      </ScrollReveal>
    </div>
  );
}
