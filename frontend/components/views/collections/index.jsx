"use client";

import { useState } from "react";
import { useCollectionsDashboard } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";
import DashboardTab from "./DashboardTab";
import ScheduleTab from "./ScheduleTab";
import OverdueTab from "./OverdueTab";
import WorkflowTab from "./WorkflowTab";
import RecoveryTab from "./RecoveryTab";
import AnalyticsTab from "./AnalyticsTab";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule", label: "Payment Schedule" },
  { id: "overdue", label: "Overdue Loans" },
  { id: "workflow", label: "Collections Workflow" },
  { id: "recovery", label: "Recovery Cases" },
  { id: "analytics", label: "Collections Analytics" },
];

export default function CollectionsView() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: dashData } = useCollectionsDashboard();

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
        description="End-to-end collections tracking for chit fund subscriptions and loan repayments."
      >
        <div className="bg-success-50 rounded-xl px-3 py-2 text-center border border-success-200/60">
          <div className="text-lg font-bold text-success font-mono">{dashData?.collectionRate || "—"}</div>
          <div className="text-heading text-[10px]">Collection Rate</div>
        </div>
        <div className="bg-danger-50 rounded-xl px-3 py-2 text-center border border-danger-200/60">
          <div className="text-lg font-bold text-danger-500 font-mono">{dashData?.overdueCount || 0}</div>
          <div className="text-heading text-[10px]">Overdue Cases</div>
        </div>
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {renderTab()}
    </div>
  );
}
