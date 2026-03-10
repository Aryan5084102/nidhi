"use client";

import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExecutiveDashboard from "@/components/views/ExecutiveDashboard";
import MembersView from "@/components/views/MembersView";
import AgentsView from "@/components/views/AgentsView";
import ChitFundsView from "@/components/views/ChitFundsView";
import LoansView from "@/components/views/LoansView";
import DepositsView from "@/components/views/DepositsView";
import ComplianceView from "@/components/views/ComplianceView";
import FraudIntelView from "@/components/views/FraudIntelView";
import ReportsView from "@/components/views/ReportsView";
import ConfigView from "@/components/views/ConfigView";
import { navItems } from "@/data/mockData";

const viewMap = {
  executive: <ExecutiveDashboard />,
  members: <MembersView />,
  chitfunds: <ChitFundsView />,
  agents: <AgentsView />,
  loans: <LoansView />,
  deposits: <DepositsView />,
  compliance: <ComplianceView />,
  fraud: <FraudIntelView />,
  reports: <ReportsView />,
  config: <ConfigView />,
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("executive");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
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
        onLogout={() => setUser(null)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} userName={user.name} onLogout={() => setUser(null)} />

        <main className="flex-1 overflow-auto p-6">
          {viewMap[activeNav]}
        </main>
      </div>
    </div>
  );
}
