"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { chitSchemes, chitFundEnrollments } from "@/data/mockData";

import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";

import SchemeCard from "./SchemeCard";
import EnrollmentModal from "./EnrollmentModal";
import EnrollmentsTab from "./EnrollmentsTab";
import ForemanCommissionTab from "./ForemanCommissionTab";

const mainTabs = [
  { id: "enrollments", label: "Enrollments" },
  { id: "schemes", label: "Schemes" },
  { id: "commission", label: "Foreman Commission" },
];

const filterTabs = [
  { id: "All", label: "All Schemes" },
  { id: "Open", label: "Open" },
  { id: "Full", label: "Full" },
];

export default function ChitFundsView() {
  const [mainTab, setMainTab] = useState("enrollments");
  const [enrollScheme, setEnrollScheme] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const pendingEnrollments = chitFundEnrollments.filter(
    (e) => e.status === "Pending" || e.status === "Under Review"
  ).length;

  const filtered = chitSchemes.filter(
    (s) => filterStatus === "All" || s.status === filterStatus
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Chit Fund Management"
        description="Manage chit fund enrollments, track member applications, approve or reject enrollment requests, and monitor scheme performance. Governed by the Chit Funds Act, 1982."
      >
        <HeaderStat
          value={chitFundEnrollments.length}
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
      </PageHeader>

      <TabBar tabs={mainTabs} activeTab={mainTab} onChange={setMainTab} />

      {mainTab === "enrollments" ? (
        <EnrollmentsTab />
      ) : mainTab === "commission" ? (
        <ForemanCommissionTab />
      ) : (
        <>
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
