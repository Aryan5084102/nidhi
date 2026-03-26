"use client";

import MetricCard from "../MetricCard";
import LiquidityChart from "../LiquidityChart";
import LoanPortfolioChart from "../LoanPortfolioChart";
import DepositGrowthChart from "../DepositGrowthChart";
import RiskHeatmap from "../RiskHeatmap";
import AgentCard from "../AgentCard";
import FraudAlerts from "../FraudAlerts";
import ScrollReveal from "../ui/ScrollReveal";
import SectionCard from "../ui/SectionCard";
import { useDashboardMetrics, useAgents, fmtCurrency } from "@/hooks/useData";

const METRIC_ICONS = [
  require("../../public/icon/members.png"),
  require("../../public/icon/loan.png"),
  require("../../public/icon/deposit.png"),
  require("../../public/icon/liquidity.png"),
  require("../../public/icon/alert.png"),
  require("../../public/icon/compliance.png"),
];

const BRACKET_COLORS = {
  Low: "#10B981",
  Medium: "#3B82F6",
  "Upper Medium": "#F59E0B",
  High: "#8B5CF6",
};

export default function ExecutiveDashboard() {
  const { data: dashData = { metrics: [], chitKpis: null } } = useDashboardMetrics();
  const { data: agents = [] } = useAgents();

  const apiMetrics = dashData.metrics || [];
  const chitKpis = dashData.chitKpis;

  const metrics = apiMetrics.map((m, i) => ({ ...m, icon: METRIC_ICONS[i] || null, color: m.color }));

  // Bracket distribution for donut-style display
  const bracketDist = chitKpis?.bracketDistribution || {};
  const totalPotAll = Object.values(bracketDist).reduce((s, v) => s + v, 0) || 1;

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

      {/* Chit-Specific KPI Cards (GAP 9) */}
      {chitKpis && (
        <ScrollReveal delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
            {[
              { label: "Active Chit Schemes", value: chitKpis.activeSchemes, color: "text-primary", accent: "bg-primary-50" },
              { label: "Total Pot Value", value: fmtCurrency(chitKpis.totalPotValue), color: "text-success", accent: "bg-success-50" },
              { label: "Monthly Collections", value: fmtCurrency(chitKpis.monthlyCollections), color: "text-secondary", accent: "bg-secondary-50" },
              { label: "Pending Payouts", value: chitKpis.activeSchemes, color: "text-warning", accent: "bg-warning-50" },
              { label: "Withdrawals", value: chitKpis.withdrawalsThisMonth, color: "text-danger-500", accent: "bg-danger-50" },
              { label: "Pending Deregistrations", value: chitKpis.pendingDeregistrations, color: chitKpis.pendingDeregistrations > 0 ? "text-danger-500" : "text-success", accent: chitKpis.pendingDeregistrations > 0 ? "bg-danger-50" : "bg-success-50" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1.5">{kpi.label}</div>
                <div className={`text-[18px] font-mono font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className={`mt-2 h-1 rounded-full ${kpi.accent}`} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Chit Portfolio Distribution (GAP 9) */}
      {chitKpis && Object.keys(bracketDist).length > 0 && (
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <SectionCard title="Chit Portfolio Distribution — by Bracket">
              <div className="space-y-3">
                {Object.entries(bracketDist).map(([bracket, value]) => {
                  const pct = ((value / totalPotAll) * 100).toFixed(1);
                  return (
                    <div key={bracket} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: BRACKET_COLORS[bracket] || "#94A3B8" }} />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-[12px] font-semibold text-body">{bracket}</span>
                          <span className="text-[12px] font-mono text-heading">{fmtCurrency(value)} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: BRACKET_COLORS[bracket] || "#94A3B8" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Quick Chit Summary */}
            <SectionCard title="Chit Fund Summary">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Total Pot Under Management</div>
                  <div className="text-[18px] font-bold font-mono text-success">{fmtCurrency(chitKpis.totalPotValue)}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Expected Monthly Collections</div>
                  <div className="text-[18px] font-bold font-mono text-primary">{fmtCurrency(chitKpis.monthlyCollections)}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Active Schemes</div>
                  <div className="text-[18px] font-bold font-mono text-secondary">{chitKpis.activeSchemes}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Regulatory Framework</div>
                  <div className="text-[13px] font-semibold text-body">Chit Funds Act 1982</div>
                </div>
              </div>
            </SectionCard>
          </div>
        </ScrollReveal>
      )}

      {/* Charts Row */}
      <ScrollReveal delay={0.12}>
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
