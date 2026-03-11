"use client";

import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExecutiveDashboard from "@/components/views/ExecutiveDashboard";
import MembersView from "@/components/views/MembersView";
import AgentsView from "@/components/views/AgentsView";
import ChitFundsView from "@/components/views/ChitFundsView";
import LoansView from "@/components/views/LoansView";
import DepositsView from "@/components/views/DepositsView";
import CollectionsView from "@/components/views/CollectionsView";
import ComplianceView from "@/components/views/ComplianceView";
import AIRiskControlView from "@/components/views/AIRiskControlView";
import FraudIntelView from "@/components/views/FraudIntelView";
import ReportsView from "@/components/views/ReportsView";
import ConfigView from "@/components/views/ConfigView";
import AIAssistantView from "@/components/views/AIAssistantView";
import { navItems } from "@/data/mockData";

const viewMap = {
  executive: <ExecutiveDashboard />,
  members: <MembersView />,
  chitfunds: <ChitFundsView />,
  agents: <AgentsView />,
  loans: <LoansView />,
  deposits: <DepositsView />,
  collections: <CollectionsView />,
  compliance: <ComplianceView />,
  airisk: <AIRiskControlView />,
  fraud: <FraudIntelView />,
  reports: <ReportsView />,
  config: <ConfigView />,
  aiassistant: <AIAssistantView />,
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("executive");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // On mount, check localStorage for an existing logged-in session
  useEffect(() => {
    const storedUser = localStorage.getItem("glimmora_current_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("glimmora_current_user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("glimmora_current_user");
  };

  // Show nothing while checking localStorage to avoid login page flash
  if (isLoading) {
    return null;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageTitle =
    navItems.find((n) => n.id === activeNav)?.label || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        userName={user.name}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} userName={user.name} onLogout={handleLogout} />

        <main className="flex-1 overflow-auto p-6">
          {viewMap[activeNav]}
        </main>
      </div>
    </div>
  );
}
