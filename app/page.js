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
import ProfileView from "@/components/views/ProfileView";
import CollateralView from "@/components/views/CollateralView";
import GovernanceView from "@/components/views/GovernanceView";
import MemberDashboard from "@/components/views/member-portal/MemberDashboard";
import MyLoans from "@/components/views/member-portal/MyLoans";
import MyDeposits from "@/components/views/member-portal/MyDeposits";
import MyChitFunds from "@/components/views/member-portal/MyChitFunds";
import MyPayments from "@/components/views/member-portal/MyPayments";
import EnrollChitFundView from "@/components/views/member-portal/EnrollChitFundView";
import ApplyLoanView from "@/components/views/member-portal/ApplyLoanView";
import OpenDepositView from "@/components/views/member-portal/OpenDepositView";
import { useAuth } from "@/context/AuthContext";
import { navItems } from "@/data/mockData";

export default function Home() {
  const { user, isLoading, defaultNav } = useAuth();
  const [activeNav, setActiveNav] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Set default nav based on role when user logs in
  useEffect(() => {
    if (user && !activeNav) {
      setActiveNav(defaultNav);
    }
    if (!user) {
      setActiveNav(null);
    }
  }, [user, defaultNav, activeNav]);

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

  if (isLoading) return null;

  if (!user) {
    return <LoginPage />;
  }

  // Build view map with navigation callback for member dashboard
  const handleNavigate = (navId) => setActiveNav(navId);

  const viewMap = {
    // Admin/Staff views
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
    collateral: <CollateralView />,
    governance: <GovernanceView />,
    aiassistant: <AIAssistantView />,
    // Member portal views
    member_dashboard: <MemberDashboard onNavigate={handleNavigate} />,
    my_loans: <MyLoans onNavigate={handleNavigate} />,
    my_deposits: <MyDeposits onNavigate={handleNavigate} />,
    open_deposit: <OpenDepositView onNavigate={handleNavigate} />,
    my_chitfunds: <MyChitFunds onNavigate={handleNavigate} />,
    my_payments: <MyPayments />,
    enroll_chitfund: <EnrollChitFundView onNavigate={handleNavigate} />,
    apply_loan: <ApplyLoanView onNavigate={handleNavigate} />,
    // Shared views
    profile: <ProfileView />,
  };

  const pageTitleMap = { enroll_chitfund: "Enroll in Chit Fund", apply_loan: "Apply for Loan", open_deposit: "Open Deposit Account" };
  const pageTitle =
    pageTitleMap[activeNav] || navItems.find((n) => n.id === activeNav)?.label || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          pageTitle={pageTitle}
          onNavigateProfile={() => setActiveNav("profile")}
        />

        <SmoothScroll ref={smoothRef} className="flex-1" contentClassName="p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
          <div key={activeNav} className="animate-page-enter">
            {viewMap[activeNav] || <ExecutiveDashboard />}
          </div>
        </SmoothScroll>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onMorePress={() => setDrawerOpen(true)}
      />

      {/* Floating AI Assistant Button - hidden when on AI Assistant view or for members */}
      {activeNav !== "aiassistant" && activeNav !== "profile" && !activeNav?.startsWith("my_") && activeNav !== "member_dashboard" && (
        <FloatingAIButton onClick={() => setActiveNav("aiassistant")} />
      )}
    </div>
  );
}
