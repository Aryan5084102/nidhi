"use client";

import { useState } from "react";
import { useSystemConfig } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";
import ConfigSection from "./ConfigSection";
import UserManagementTab from "./UserManagementTab";
import RolesPermissionsTab from "./RolesPermissionsTab";
import AIAgentConfigTab from "./AIAgentConfigTab";
import RiskThresholdTab from "./RiskThresholdTab";
import SystemConfigTab from "./SystemConfigTab";
import AuditLogTab from "./AuditLogTab";

const tabs = [
  { id: "users", label: "User Management" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "general", label: "General" },
  { id: "deposits", label: "Deposits" },
  { id: "loans", label: "Loans" },
  { id: "chitfunds", label: "Chit Funds" },
  { id: "ai", label: "AI Agent Configuration" },
  { id: "risk", label: "Risk Threshold Settings" },
  { id: "notifications", label: "Notifications" },
  { id: "system", label: "System Configuration" },
  { id: "audit", label: "Audit Log" },
];

export default function ConfigView() {
  const { data: systemConfig = { general: [], deposits: [], loans: [], chitFunds: [], ai: [], notifications: [] } } = useSystemConfig();
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "users":
        return <UserManagementTab />;
      case "roles":
        return <RolesPermissionsTab />;
      case "general":
        return <ConfigSection title="General Settings" description="Core company information and system-wide configuration for Glimmora Nidhi Limited." configs={systemConfig.general} />;
      case "deposits":
        return <ConfigSection title="Deposit Configuration" description="Configure interest rates, limits, and rules for Fixed, Recurring, and Savings deposit schemes." configs={systemConfig.deposits} />;
      case "loans":
        return <ConfigSection title="Loan Configuration" description="Set lending parameters, interest rate caps, and risk thresholds as per Nidhi Rules." configs={systemConfig.loans} />;
      case "chitfunds":
        return <ConfigSection title="Chit Fund Configuration" description="Configure auction rules, foreman commission, and subscriber limits governed by Chit Funds Act 1982." configs={systemConfig.chitFunds} />;
      case "ai":
        return <AIAgentConfigTab />;
      case "risk":
        return <RiskThresholdTab />;
      case "notifications":
        return <ConfigSection title="Notification Settings" description="Configure member communication channels and alert thresholds for EMIs, maturities, and events." configs={systemConfig.notifications} />;
      case "system":
        return <SystemConfigTab />;
      case "audit":
        return <AuditLogTab />;
      default:
        return <ConfigSection title="General Settings" description="Core company settings." configs={systemConfig.general} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Admin & Configuration"
        description="System-wide settings for Glimmora Nidhi operations. Configure deposit schemes, loan parameters, chit fund rules, AI agent behaviour, and notification preferences. All settings are audited and comply with Nidhi Company regulatory requirements."
      >
        <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
          <div className="text-lg font-bold text-body font-mono">v2.4</div>
          <div className="text-heading text-[10px]">System Version</div>
        </div>
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
