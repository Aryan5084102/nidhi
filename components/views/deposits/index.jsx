"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import OverviewTab from "./OverviewTab";
import AccountsTab from "./AccountsTab";
import SchemesTab from "./SchemesTab";
import MaturityTab from "./MaturityTab";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "accounts", label: "Accounts" },
  { id: "schemes", label: "Schemes" },
  { id: "maturity", label: "Maturity Tracker" },
];

export default function DepositsView() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "accounts": return <AccountsTab />;
      case "schemes": return <SchemesTab />;
      case "maturity": return <MaturityTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Deposits Management"
        description="Manage Fixed Deposits, Recurring Deposits, and Savings accounts. All deposit schemes comply with Nidhi Rules 2014 and interest rate ceilings prescribed by RBI."
      >
        <HeaderStat value={<span className="text-secondary">{"\u20B939.5Cr"}</span>} label="Total Deposits" />
        <HeaderStat value={<span className="text-success">{"12,450"}</span>} label="Active Accounts" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
