"use client";

import { useState } from "react";
import { reportsList } from "@/data/mockData";
import PageHeader from "@/components/ui/PageHeader";
import TabBar from "@/components/ui/TabBar";

import FinancialReportsTab from "./FinancialReportsTab";
import LoanPerformanceTab from "./LoanPerformanceTab";
import DepositAnalyticsTab from "./DepositAnalyticsTab";
import MemberGrowthTab from "./MemberGrowthTab";
import RiskAnalyticsTab from "./RiskAnalyticsTab";
import ComplianceReportsTab from "./ComplianceReportsTab";
import PDFReportsTab from "./PDFReportsTab";
import CSVExportsTab from "./CSVExportsTab";
import BoardReportsTab from "./BoardReportsTab";
import KPIsTab from "./KPIsTab";
import ChitFundReportsTab from "./ChitFundReportsTab";

const tabs = [
  { id: "financial", label: "Financial Reports" },
  { id: "chitfund", label: "Chit Fund Reports" },
  { id: "loans", label: "Loan Performance" },
  { id: "deposits", label: "Deposit Analytics" },
  { id: "members", label: "Member Growth" },
  { id: "risk", label: "Risk Analytics" },
  { id: "compliance", label: "Compliance Reports" },
  { id: "pdf", label: "PDF Reports" },
  { id: "csv", label: "CSV Exports" },
  { id: "board", label: "Board Reports" },
  { id: "kpis", label: "KPIs" },
];

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState("financial");

  const renderTab = () => {
    switch (activeTab) {
      case "financial": return <FinancialReportsTab />;
      case "chitfund": return <ChitFundReportsTab />;
      case "loans": return <LoanPerformanceTab />;
      case "deposits": return <DepositAnalyticsTab />;
      case "members": return <MemberGrowthTab />;
      case "risk": return <RiskAnalyticsTab />;
      case "compliance": return <ComplianceReportsTab />;
      case "pdf": return <PDFReportsTab />;
      case "csv": return <CSVExportsTab />;
      case "board": return <BoardReportsTab />;
      case "kpis": return <KPIsTab />;
      default: return <FinancialReportsTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive reporting suite for Glimmora Nidhi operations. Generate financial statements, chit fund MIS reports, member reports, compliance summaries, and AI-powered business intelligence analytics."
      >
        <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
          <div className="text-lg font-bold text-primary font-mono">{reportsList.length}</div>
          <div className="text-heading text-[10px]">Available Reports</div>
        </div>
        <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
          <div className="text-lg font-bold text-success font-mono">10</div>
          <div className="text-heading text-[10px]">Analytics Modules</div>
        </div>
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
