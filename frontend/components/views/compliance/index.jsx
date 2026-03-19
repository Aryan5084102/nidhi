"use client";

import { useState } from "react";
import { useComplianceScore } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";
import DashboardTab from "./DashboardTab";
import ChecklistTab from "./ChecklistTab";
import KycMonitoringTab from "./KycMonitoringTab";
import AmlMonitoringTab from "./AmlMonitoringTab";
import FilingsTab from "./FilingsTab";
import AlertsTab from "./AlertsTab";
import AuditLogsTab from "./AuditLogsTab";
import PanelsTab from "./PanelsTab";
import SuspiciousTransactionsTab from "./SuspiciousTransactionsTab";
import HighRiskMembersTab from "./HighRiskMembersTab";
import StatutoryRegisters from "./StatutoryRegisters";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "checklist", label: "Compliance Checklist" },
  { id: "kyc", label: "KYC Monitoring" },
  { id: "aml", label: "AML Monitoring" },
  { id: "filings", label: "Regulatory Reporting" },
  { id: "registers", label: "Statutory Registers" },
  { id: "alerts", label: "Compliance Alerts" },
  { id: "audit", label: "Audit Logs" },
  { id: "panels", label: "Compliance Panels" },
  { id: "suspicious", label: "Suspicious Transactions" },
  { id: "highrisk", label: "High Risk Members" },
];

export default function ComplianceView() {
  const { data: complianceScore = { overall: 0, categories: [] } } = useComplianceScore();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "checklist": return <ChecklistTab />;
      case "kyc": return <KycMonitoringTab />;
      case "aml": return <AmlMonitoringTab />;
      case "filings": return <FilingsTab />;
      case "registers": return <StatutoryRegisters />;
      case "alerts": return <AlertsTab />;
      case "audit": return <AuditLogsTab />;
      case "panels": return <PanelsTab />;
      case "suspicious": return <SuspiciousTransactionsTab />;
      case "highrisk": return <HighRiskMembersTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Compliance Center"
        description="Monitor regulatory compliance status across all Nidhi Company rules. AI-powered compliance tracking ensures adherence to Nidhi Rules 2014, Nidhi (Amendment) Rules 2022, and MCA filing requirements."
      >
        <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
          <div className="text-lg font-bold text-success font-mono">{complianceScore.overall}%</div>
          <div className="text-heading text-[10px]">Compliance Score</div>
        </div>
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
