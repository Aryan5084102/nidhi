"use client";

import { loanApplications } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";

const repaymentData = [
  { month: "Oct", collected: 42, expected: 45 },
  { month: "Nov", collected: 48, expected: 50 },
  { month: "Dec", collected: 52, expected: 55 },
  { month: "Jan", collected: 50, expected: 52 },
  { month: "Feb", collected: 58, expected: 60 },
  { month: "Mar", collected: 55, expected: 58 },
];

const repaymentMetrics = [
  { label: "Total Expected (This Month)", value: "\u20B958L", color: "#6B8ABF" },
  { label: "Total Collected", value: "\u20B955L", color: "#5B9E8A" },
  { label: "Collection Rate", value: "94.8%", color: "#059669" },
  { label: "Overdue Amount", value: "\u20B93L", color: "#BF6F6D" },
];

const barChartBars = [
  { key: "expected", label: "Expected", gradient: "#c7d2fe", suffix: "L" },
  { key: "collected", label: "Collected", gradient: "#34d399", suffix: "L" },
];

export default function RepaymentsTab() {
  return (
    <div className="animate-fade-in">
      {/* Repayment Metrics */}
      <MetricGrid metrics={repaymentMetrics} columns="grid-cols-2 md:grid-cols-4" />

      {/* Monthly Trend */}
      <SectionCard title="Monthly Repayment Trend" className="mb-6">
        <BarChart
          data={repaymentData}
          bars={barChartBars}
          maxVal={65}
          labelKey="month"
          height="120px"
        />
      </SectionCard>

      {/* Upcoming EMIs */}
      <SectionCard title="Upcoming EMI Schedule">
        <div className="flex flex-col gap-2">
          {loanApplications.filter((a) => a.status === "Approved" || a.status === "Disbursed").map((app) => (
            <div key={app.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-50 border border-success-200/60 rounded-full flex items-center justify-center text-[11px] font-bold text-success">
                  {app.memberName.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-body">{app.memberName}</div>
                  <div className="text-[11px] text-heading">{app.id} &middot; EMI: {app.emi}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-medium text-slate-500">Due: {app.nextEmi}</div>
                <StatusBadge status="Active" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
