"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileDrawer from "@/components/MobileDrawer";
import FloatingAIButton from "@/components/FloatingAIButton";
import SmoothScroll from "@/components/SmoothScroll";
import { useAuth } from "@/context/AuthContext";
import useNavigation from "@/hooks/useNavigation";
import { navItems } from "@/data/mockData";

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { activeNav, navigate, pathname } = useNavigation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reset smooth scroll on route change (after paint)
  const smoothRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (smoothRef.current) smoothRef.current.resetScroll();
    });
  }, [pathname]);

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

  // Middleware handles redirect to /login if no cookie.
  // This is a fallback for edge cases (e.g., cookie expired mid-session).
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
      </div>
    );
  }

  const pageTitleMap = {
    enroll_chitfund: "Enroll in Chit Fund",
    apply_loan: "Apply for Loan",
    open_deposit: "Open Deposit Account",
    helpcenter: "Help Center",
  };
  const pageTitle =
    pageTitleMap[activeNav] ||
    navItems.find((n) => n.id === activeNav)?.label ||
    "Dashboard";

  const showAIButton =
    activeNav !== "aiassistant" &&
    activeNav !== "profile";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          pageTitle={pageTitle}
          onNavigateProfile={() => navigate("profile")}
          onNavigateHelpCenter={() => navigate("helpcenter")}
        />

        <SmoothScroll
          ref={smoothRef}
          className="flex-1"
          contentClassName="p-2 sm:p-3 md:p-4 pb-20 md:pb-4"
        >
          <div key={pathname} className="animate-page-enter">
            {children}
          </div>
        </SmoothScroll>
      </div>

      <MobileBottomNav onMorePress={() => setDrawerOpen(true)} />

      {showAIButton && (
        <FloatingAIButton onClick={() => navigate("aiassistant")} />
      )}
    </div>
  );
}
