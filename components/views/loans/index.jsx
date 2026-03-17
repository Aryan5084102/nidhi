"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import DashboardTab from "./DashboardTab";
import ApplicationsTab from "./ApplicationsTab";
import ApprovalTab from "./ApprovalTab";
import RiskAnalysisTab from "./RiskAnalysisTab";
import PortfolioTab from "./PortfolioTab";
import RepaymentsTab from "./RepaymentsTab";
import DefaultsTab from "./DefaultsTab";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "applications", label: "Applications" },
  { id: "approval", label: "Approval" },
  { id: "risk", label: "Risk Analysis" },
  { id: "portfolio", label: "Portfolio" },
  { id: "repayments", label: "Repayments" },
  { id: "defaults", label: "Defaults" },
];

export default function LoansView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "applications": return <ApplicationsTab />;
      case "approval": return <ApprovalTab />;
      case "risk": return <RiskAnalysisTab />;
      case "portfolio": return <PortfolioTab />;
      case "repayments": return <RepaymentsTab />;
      case "defaults": return <DefaultsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Loans Management"
        description="Comprehensive loan management system with AI-powered risk analysis, automated approval workflows, and real-time portfolio monitoring. All loans comply with Nidhi Company (Amendment) Rules, 2022."
      >
        <HeaderStat value="5,200" label="Active Loans" className="bg-slate-50 text-primary" />
        <HeaderStat value={"\u20B92.4Cr"} label="Portfolio Value" className="bg-slate-50 text-success" />
      </PageHeader>

      {/* Sub-tabs */}
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Active Tab Content */}
      {renderTab()}
    </div>
  );
}
