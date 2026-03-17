"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";
import DashboardTab from "./DashboardTab";
import ScheduleTab from "./ScheduleTab";
import OverdueTab from "./OverdueTab";
import WorkflowTab from "./WorkflowTab";
import RecoveryTab from "./RecoveryTab";
import AnalyticsTab from "./AnalyticsTab";
import { tabs, collectionsDashboard } from "./data";

export default function CollectionsView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "schedule": return <ScheduleTab />;
      case "overdue": return <OverdueTab />;
      case "workflow": return <WorkflowTab />;
      case "recovery": return <RecoveryTab />;
      case "analytics": return <AnalyticsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Collections Management"
        description="End-to-end collections tracking for chit fund subscriptions and loan repayments. Monitor payment schedules, manage overdue accounts, and track recovery workflows across all member obligations."
      >
        <div className="bg-success-50 rounded-xl px-3 py-2 text-center border border-success-200/60">
          <div className="text-lg font-bold text-success font-mono">{collectionsDashboard.collectionRate}</div>
          <div className="text-heading text-[10px]">Collection Rate</div>
        </div>
        <div className="bg-danger-50 rounded-xl px-3 py-2 text-center border border-danger-200/60">
          <div className="text-lg font-bold text-danger-500 font-mono">{collectionsDashboard.activeCases}</div>
          <div className="text-heading text-[10px]">Active Cases</div>
        </div>
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
