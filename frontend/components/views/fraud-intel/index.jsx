"use client";

import { useState } from "react";
import { useFraudDashboard } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import DashboardTab from "./DashboardTab";
import CasesTab from "./CasesTab";
import PatternsTab from "./PatternsTab";
import PreventionTab from "./PreventionTab";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cases", label: "Active Cases" },
  { id: "patterns", label: "Pattern Analysis" },
  { id: "prevention", label: "Prevention" },
];

export default function FraudIntelView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: fraudMetrics } = useFraudDashboard();

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "cases": return <CasesTab />;
      case "patterns": return <PatternsTab />;
      case "prevention": return <PreventionTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fraud Intelligence Center"
        description="AI-powered fraud detection and prevention system designed for Nidhi companies. Monitors auction manipulation, identity fraud, deposit layering, and collusion patterns across all member activities."
      >
        <HeaderStat value={<span className="text-danger-500">{fraudMetrics?.criticalAlerts}</span>} label="Critical" className="bg-danger-50 border border-danger-200/60" />
        <HeaderStat value={<span className="text-success">{fraudMetrics?.totalPreventedLoss}</span>} label="Loss Prevented" className="bg-success-50 border border-success-200/60" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
