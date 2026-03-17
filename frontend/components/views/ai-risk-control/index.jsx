"use client";

import { useState } from "react";
import TabBar from "@/components/ui/TabBar";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import DashboardTab from "./DashboardTab";
import FraudDetectionTab from "./FraudDetectionTab";
import LiquidityRiskTab from "./LiquidityRiskTab";
import ComplianceRiskTab from "./ComplianceRiskTab";
import MemberRiskTab from "./MemberRiskTab";
import AnomalyDetectionTab from "./AnomalyDetectionTab";
import AgentLiquidityGuardTab from "./AgentLiquidityGuardTab";
import AgentFraudSentinelTab from "./AgentFraudSentinelTab";
import AgentComplianceAuditorTab from "./AgentComplianceAuditorTab";
import AgentMemberRiskTab from "./AgentMemberRiskTab";

const tabs = [
  { id: "dashboard", label: "AI Risk Dashboard" },
  { id: "fraud", label: "AI Fraud Detection" },
  { id: "liquidity", label: "Liquidity Risk Monitor" },
  { id: "compliance", label: "Compliance Risk Engine" },
  { id: "member-risk", label: "Member Risk Engine" },
  { id: "anomaly", label: "Transaction Anomaly" },
  { id: "agent-liquidity", label: "Agent Liquidity Guard" },
  { id: "agent-fraud", label: "Agent Fraud Sentinel" },
  { id: "agent-compliance", label: "Agent Compliance Auditor" },
  { id: "agent-member", label: "Agent Member Analyzer" },
];

export default function AIRiskControlView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "fraud": return <FraudDetectionTab />;
      case "liquidity": return <LiquidityRiskTab />;
      case "compliance": return <ComplianceRiskTab />;
      case "member-risk": return <MemberRiskTab />;
      case "anomaly": return <AnomalyDetectionTab />;
      case "agent-liquidity": return <AgentLiquidityGuardTab />;
      case "agent-fraud": return <AgentFraudSentinelTab />;
      case "agent-compliance": return <AgentComplianceAuditorTab />;
      case "agent-member": return <AgentMemberRiskTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Risk Control Center"
        description="Agentic AI-powered risk monitoring and control system for Nidhi company operations. Autonomous agents continuously monitor fraud, liquidity, compliance, and member risk across all operational dimensions."
      >
        <HeaderStat value="4" label="Agents Online" className="bg-success-50 border border-success-200/60 text-success" />
        <HeaderStat value="18" label="Active Alerts" className="bg-danger-50 border border-danger-200/60 text-danger-500" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
