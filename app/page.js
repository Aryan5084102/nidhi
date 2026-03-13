"use client";

import { useState, useEffect, useRef } from "react";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileDrawer from "@/components/MobileDrawer";
import FloatingAIButton from "@/components/FloatingAIButton";
import SmoothScroll from "@/components/SmoothScroll";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  // Reset smooth scroll on nav change
  const smoothRef = useRef(null);
  useEffect(() => {
    if (smoothRef.current) {
      smoothRef.current.resetScroll();
    }
  }, [activeNav]);

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) setSidebarExpanded(false);
      else setSidebarExpanded(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      {/* Desktop/Tablet Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        userName={user.name}
        onLogout={handleLogout}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        userName={user.name}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} userName={user.name} onLogout={handleLogout} />

        <SmoothScroll ref={smoothRef} className="flex-1" contentClassName="p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
          {viewMap[activeNav]}
        </SmoothScroll>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onMorePress={() => setDrawerOpen(true)}
      />

      {/* Floating AI Assistant Button - hidden when on AI Assistant view */}
      {activeNav !== "aiassistant" && (
        <FloatingAIButton onClick={() => setActiveNav("aiassistant")} />
      )}
    </div>
  );
}
