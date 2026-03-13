"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { chitSchemes } from "@/data/mockData";

import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";

import SchemeCard from "./SchemeCard";
import EnrollmentModal from "./EnrollmentModal";

const filterTabs = [
  { id: "All", label: "All Schemes" },
  { id: "Open", label: "Open" },
  { id: "Full", label: "Full" },
];

export default function ChitFundsView() {
  const [enrollScheme, setEnrollScheme] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = chitSchemes.filter(
    (s) => filterStatus === "All" || s.status === filterStatus
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Chit Fund Schemes"
        description="Browse available chit fund schemes and enroll as a subscriber. Each scheme runs periodic auctions where members can bid for the pot. All schemes are governed by the Chit Funds Act, 1982."
      >
        <HeaderStat
          value={chitSchemes.length}
          label="Total Schemes"
          className="bg-slate-50 text-indigo-600"
        />
        <HeaderStat
          value={chitSchemes.filter((s) => s.status === "Open").length}
          label="Open for Enrollment"
          className="bg-slate-50 text-emerald-600"
        />
      </PageHeader>

      {/* Filters */}
      <TabBar
        tabs={filterTabs}
        activeTab={filterStatus}
        onChange={setFilterStatus}
      />

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onEnroll={setEnrollScheme}
          />
        ))}
      </div>

      {/* Enrollment Modal */}
      {enrollScheme && createPortal(
        <EnrollmentModal
          scheme={enrollScheme}
          onClose={() => setEnrollScheme(null)}
        />,
        document.body
      )}
    </div>
  );
}
