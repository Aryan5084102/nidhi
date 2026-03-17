"use client";

import { useState } from "react";
import { loanApplications } from "@/data/mockData";
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

  const pendingCount = loanApplications.filter(
    (a) => a.status === "Pending" || a.status === "Under Review"
  ).length;

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
      <PageHeader
        title="Loans Management"
        description="Track loan applications from submission to disbursement. Review, approve or reject applications with AI-powered risk analysis. All loans comply with Nidhi Company (Amendment) Rules, 2022."
      >
        <HeaderStat value="5,200" label="Active Loans" className="bg-slate-50 text-primary" />
        <HeaderStat value={pendingCount} label="Pending Approval" className="bg-warning-50 text-warning" />
        <HeaderStat value={"\u20B92.4Cr"} label="Portfolio Value" className="bg-slate-50 text-success" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
