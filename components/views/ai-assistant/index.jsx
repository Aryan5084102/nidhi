"use client";

import { useState } from "react";
import TabBar from "@/components/ui/TabBar";
import HeaderStat from "@/components/ui/HeaderStat";
import ChatAssistantTab from "./ChatAssistantTab";
import QueryPanelTab from "./QueryPanelTab";
import ReportGeneratorTab from "./ReportGeneratorTab";
import InsightsDashboardTab from "./InsightsDashboardTab";
import RiskExplanationTab from "./RiskExplanationTab";
import AIQueriesTab from "./AIQueriesTab";

const tabs = [
  { id: "chat", label: "AI Chat Assistant" },
  { id: "query", label: "AI Query Panel" },
  { id: "reports", label: "AI Report Generator" },
  { id: "insights", label: "AI Insights Dashboard" },
  { id: "risk", label: "AI Risk Explanation" },
  { id: "queries", label: "AI Queries" },
];

export default function AIAssistantView() {
  const [activeTab, setActiveTab] = useState("chat");

  const renderTab = () => {
    switch (activeTab) {
      case "chat":
        return <ChatAssistantTab />;
      case "query":
        return <QueryPanelTab />;
      case "reports":
        return <ReportGeneratorTab />;
      case "insights":
        return <InsightsDashboardTab />;
      case "risk":
        return <RiskExplanationTab />;
      case "queries":
        return <AIQueriesTab />;
      default:
        return <ChatAssistantTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-800">AI Assistant</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Intelligent insights, natural language queries, and automated reports for your Nidhi company
        </p>
        <div className="hidden sm:flex gap-4 mt-3">
          {[
            { label: "Queries Today", value: "47" },
            { label: "Reports Generated", value: "12" },
            { label: "Active Insights", value: "8" },
            { label: "AI Confidence", value: "92%" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{s.value}</span>
              <span className="text-[11px] text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="animate-fade-in">{renderTab()}</div>
    </div>
  );
}
