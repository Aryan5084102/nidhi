"use client";

import { useState } from "react";
import { loanApplications, loanPortfolio } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricGrid from "@/components/ui/MetricGrid";
import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";

/* ─── Loan Process Steps ─── */
const processSteps = [
  {
    step: 1, title: "Application", description: "Member submits loan request with documents, amount, purpose, and tenure.",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>),
    color: "indigo",
  },
  {
    step: 2, title: "Risk Review", description: "AI Risk Agent evaluates creditworthiness, STI score, and repayment capacity.",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>),
    color: "amber",
  },
  {
    step: 3, title: "Manager Approval", description: "Branch manager reviews risk report and approves or rejects the application.",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>),
    color: "emerald",
  },
  {
    step: 4, title: "Disbursement", description: "Approved amount is disbursed to the member's linked bank account.",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>),
    color: "blue",
  },
  {
    step: 5, title: "EMI Monitoring", description: "AI monitors repayment schedule, sends reminders, and flags potential defaults.",
    icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>),
    color: "purple",
  },
];

const colorMap = {
  indigo: { bg: "bg-primary-50", border: "border-primary-200", text: "text-primary", line: "bg-primary-400" },
  amber: { bg: "bg-warning-50", border: "border-warning-200", text: "text-warning", line: "bg-warning-400" },
  emerald: { bg: "bg-success-50", border: "border-success-200", text: "text-success", line: "bg-success-400" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", line: "bg-blue-400" },
  purple: { bg: "bg-secondary-50", border: "border-secondary-200", text: "text-secondary", line: "bg-purple-400" },
};

export default function DashboardTab() {
  const pending = loanApplications.filter((a) => a.status === "Pending").length;
  const underReview = loanApplications.filter((a) => a.status === "Under Review").length;
  const approved = loanApplications.filter((a) => a.status === "Approved").length;
  const disbursed = loanApplications.filter((a) => a.status === "Disbursed").length;
  const rejected = loanApplications.filter((a) => a.status === "Rejected").length;

  const dashMetrics = [
    { label: "Total Loan Portfolio", value: "\u20B92.4 Cr", change: "+8.2%", color: "#6B8ABF" },
    { label: "Active Loans", value: "5,200", change: "+1.8%", color: "#5B9E8A" },
    { label: "Pending Applications", value: (pending + underReview).toString(), change: "Needs Action", color: "#C49A4C" },
    { label: "Default Rate", value: "2.1%", change: "-0.3%", color: "#BF6F6D" },
    { label: "Avg. Interest Rate", value: "12.5%", change: "0%", color: "#9585B5" },
    { label: "Recovery Rate", value: "87%", change: "+4%", color: "#6B9E89" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <MetricGrid metrics={dashMetrics} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />

      {/* Application Pipeline */}
      <SectionCard title="Application Pipeline" className="mb-6">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Pending", count: pending, color: "bg-warning-50 text-warning border-warning-200" },
            { label: "Under Review", count: underReview, color: "bg-blue-50 text-blue-600 border-blue-200" },
            { label: "Approved", count: approved, color: "bg-success-50 text-success border-success-200" },
            { label: "Disbursed", count: disbursed, color: "bg-primary-50 text-primary border-primary-200" },
            { label: "Rejected", count: rejected, color: "bg-danger-50 text-danger-500 border-danger-200" },
          ].map((stage) => (
            <div key={stage.label} className={`${stage.color} border rounded-xl p-3 text-center`}>
              <div className="text-[20px] font-bold font-mono">{stage.count}</div>
              <div className="text-[11px] font-semibold mt-1">{stage.label}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Loan Process Flow */}
      <SectionCard title="Loan Approval Process Flow" className="mb-6">
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {processSteps.map((ps, idx) => {
            const c = colorMap[ps.color];
            return (
              <div key={ps.step} className="flex items-start flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} mb-2`}>
                    {ps.icon}
                  </div>
                  <div className="text-[12px] font-semibold text-body mb-1">{ps.title}</div>
                  <div className="text-[10px] text-heading leading-relaxed px-2 max-w-[140px]">{ps.description}</div>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="flex items-center pt-5 -mx-1">
                    <div className={`w-8 h-0.5 ${colorMap[processSteps[idx + 1].color].line} opacity-40`} />
                    <svg className="w-3 h-3 text-subtle -ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Recent Applications + Portfolio Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Applications */}
        <SectionCard title="Recent Applications">
          <div className="flex flex-col gap-3">
            {loanApplications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 border border-primary-200/60 rounded-full flex items-center justify-center text-[11px] font-bold text-primary">
                    {app.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-body">{app.memberName}</div>
                    <div className="text-[11px] text-heading">{app.id} &middot; {app.purpose}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-body font-mono">{app.amount}</div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Portfolio Breakdown */}
        <SectionCard title="Portfolio Breakdown">
          <div className="flex flex-col gap-3">
            {loanPortfolio.map((item) => {
              const pct = (item.disbursed / item.sanctioned) * 100;
              return (
                <div key={item.category} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-semibold text-body">{item.category}</span>
                    <span className="text-[12px] font-mono text-slate-500">{item.count} loans</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-heading mb-1.5">
                    <span>Sanctioned: <strong className="text-body">{"\u20B9"}{(item.sanctioned / 100000).toFixed(1)}L</strong></span>
                    <span>Disbursed: <strong className="text-body">{"\u20B9"}{(item.disbursed / 100000).toFixed(1)}L</strong></span>
                  </div>
                  <ProgressBar value={pct} max={100} color={item.color} />
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
