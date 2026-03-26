"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useChitSchemes, useChitEnrollments } from "@/hooks/useData";

import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";

import SchemeCard from "./SchemeCard";
import EnrollmentModal from "./EnrollmentModal";
import EnrollmentsTab from "./EnrollmentsTab";
import ForemanCommissionTab from "./ForemanCommissionTab";
import DrawMinutesTab from "./DrawMinutesTab";
import WithdrawalTab from "./WithdrawalTab";

const mainTabs = [
  { id: "enrollments", label: "Enrollments" },
  { id: "schemes", label: "Schemes" },
  { id: "commission", label: "Foreman Commission" },
  { id: "drawminutes", label: "Draw Minutes" },
  { id: "withdrawals", label: "Withdrawals" },
];

const filterTabs = [
  { id: "All", label: "All Schemes" },
  { id: "Open", label: "Open" },
  { id: "Full", label: "Full" },
];

const bracketTabs = [
  { id: "All", label: "All Brackets" },
  { id: "Low", label: "Low (≤₹5L)" },
  { id: "Medium", label: "Medium (≤₹10L)" },
  { id: "Upper Medium", label: "Upper Medium (₹15-25L)" },
  { id: "High", label: "High (≤₹50L)" },
];

export default function ChitFundsView() {
  const { data: chitSchemes = [] } = useChitSchemes();
  const { data: chitEnrollments = [] } = useChitEnrollments();
  const [mainTab, setMainTab] = useState("enrollments");
  const [enrollScheme, setEnrollScheme] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBracket, setFilterBracket] = useState("All");

  const pendingEnrollments = chitEnrollments.filter(
    (e) => e.status === "Pending" || e.status === "Under Review"
  ).length;

  const withdrawnCount = chitEnrollments.filter(
    (e) => e.status === "Withdrawn"
  ).length;

  const filtered = chitSchemes.filter((s) => {
    const matchesStatus = filterStatus === "All" || s.status === filterStatus;
    const matchesBracket = filterBracket === "All" || s.bracket === filterBracket;
    return matchesStatus && matchesBracket;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Chit Fund Management"
        description="Manage chit fund enrollments, track member applications, approve or reject enrollment requests, and monitor scheme performance. Governed by the Chit Funds Act, 1982 and Telangana State Chit Fund Rules."
      >
        <HeaderStat
          value={chitEnrollments.length}
          label="Total Enrollments"
          className="bg-slate-50 text-primary"
        />
        <HeaderStat
          value={pendingEnrollments}
          label="Pending Approval"
          className="bg-warning-50 text-warning"
        />
        <HeaderStat
          value={chitSchemes.filter((s) => s.status === "Open").length}
          label="Open Schemes"
          className="bg-slate-50 text-success"
        />
        {withdrawnCount > 0 && (
          <HeaderStat
            value={withdrawnCount}
            label="Withdrawn"
            className="bg-danger-50 text-danger-500"
          />
        )}
      </PageHeader>

      <TabBar tabs={mainTabs} activeTab={mainTab} onChange={setMainTab} />

      {mainTab === "enrollments" ? (
        <EnrollmentsTab />
      ) : mainTab === "commission" ? (
        <ForemanCommissionTab />
      ) : mainTab === "drawminutes" ? (
        <DrawMinutesTab />
      ) : mainTab === "withdrawals" ? (
        <WithdrawalTab />
      ) : (
        <>
          {/* Bracket Filter Tabs (GAP 1) */}
          <div className="mb-3">
            <TabBar
              tabs={bracketTabs}
              activeTab={filterBracket}
              onChange={setFilterBracket}
            />
          </div>
          <TabBar
            tabs={filterTabs}
            activeTab={filterStatus}
            onChange={setFilterStatus}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onEnroll={setEnrollScheme}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-[13px] text-heading">
                No schemes match the selected filters
              </div>
            )}
          </div>

          {enrollScheme && createPortal(
            <EnrollmentModal
              scheme={enrollScheme}
              onClose={() => setEnrollScheme(null)}
            />,
            document.body
          )}
        </>
      )}
    </div>
  );
}
