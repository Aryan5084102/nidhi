"use client";

import { useState } from "react";
import { loanApplications } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";

function RiskTag({ level }) {
  const styles = {
    Low: "bg-success-50 text-success border-success-200/60",
    Medium: "bg-warning-50 text-warning border-warning-200/60",
    High: "bg-danger-50 text-danger-500 border-danger-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

const processSteps = [
  { step: 1, title: "Application Received", desc: "Member submits loan request with purpose and documents.", color: "bg-primary-50 text-primary border-primary-200" },
  { step: 2, title: "AI Risk Assessment", desc: "System evaluates STI, repayment capacity, and credit history.", color: "bg-warning-50 text-warning border-warning-200" },
  { step: 3, title: "Manager Decision", desc: "Branch manager reviews and approves or rejects.", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { step: 4, title: "Disbursement", desc: "Approved funds transferred to member's bank account.", color: "bg-success-50 text-success border-success-200" },
];

export default function ApprovalTab() {
  const [applications, setApplications] = useState(loanApplications);
  const pendingApprovals = applications.filter((a) => a.status === "Pending" || a.status === "Under Review");
  const recentActions = applications.filter((a) => a.status === "Approved" || a.status === "Rejected" || a.status === "Disbursed");

  const handleApprove = (id) => {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "Approved" } : a)
    );
  };

  const handleReject = (id) => {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "Rejected" } : a)
    );
  };

  const handleDisburse = (id) => {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "Disbursed" } : a)
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Approval Process */}
      <SectionCard title="Loan Approval Workflow" className="mb-6">
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {processSteps.map((ps, idx) => (
            <div key={ps.step} className="flex items-start flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-10 h-10 rounded-2xl ${ps.color} border flex items-center justify-center text-[14px] font-bold mb-2`}>
                  {ps.step}
                </div>
                <div className="text-[12px] font-semibold text-body mb-1">{ps.title}</div>
                <div className="text-[10px] text-heading leading-relaxed px-2 max-w-[140px]">{ps.desc}</div>
              </div>
              {idx < processSteps.length - 1 && (
                <div className="flex items-center pt-5 -mx-1">
                  <div className="w-8 h-0.5 bg-slate-300" />
                  <svg className="w-3 h-3 text-subtle -ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Pending Approvals Header */}
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-heading mb-1">Pending Approvals</h3>
            <p className="text-[13px] text-heading">Review loan applications and take action — approve, reject, or disburse approved loans.</p>
          </div>
          <div className="bg-warning-50 rounded-xl px-3 py-2 text-center border border-warning-200/60">
            <div className="text-lg font-bold text-warning font-mono">{pendingApprovals.length}</div>
            <div className="text-heading text-[10px]">Pending</div>
          </div>
        </div>
      </div>

      {/* Pending Cards */}
      {pendingApprovals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {pendingApprovals.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 border border-primary-200/60 rounded-full flex items-center justify-center text-[13px] font-bold text-primary">
                    {app.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-heading">{app.memberName}</div>
                    <span className="text-[11px] text-heading font-mono">{app.id} &middot; {app.memberId}</span>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Amount</div>
                  <div className="text-[16px] font-bold text-primary font-mono">{app.amount}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure</div>
                  <div className="text-[13px] font-semibold text-body">{app.tenure}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Purpose</div>
                  <div className="text-[13px] font-semibold text-body">{app.purpose}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Risk Level</div>
                  <RiskTag level={app.risk} />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 text-[11px] text-heading">
                <span>STI Score: <strong className="text-body">{app.stiScore}</strong></span>
                <span className="text-subtle">|</span>
                <span>Interest: <strong className="text-body">{app.interestRate}</strong></span>
                <span className="text-subtle">|</span>
                <span>Applied: <strong className="text-body">{app.appliedDate}</strong></span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="flex-1 py-2.5 bg-success-50 border border-success-200 text-success rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-success-100 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="flex-1 py-2.5 bg-danger-50 border border-danger-200 text-danger-500 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-danger-100 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 card-shadow border border-slate-100 text-center mb-6">
          <div className="w-14 h-14 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold text-body">All caught up!</div>
          <div className="text-[13px] text-heading mt-1">No pending approvals at the moment.</div>
        </div>
      )}

      {/* Approved - Ready for Disbursement */}
      {applications.filter((a) => a.status === "Approved").length > 0 && (
        <SectionCard title="Ready for Disbursement" className="mb-6">
          <div className="flex flex-col gap-3">
            {applications.filter((a) => a.status === "Approved").map((app) => (
              <div key={app.id} className="flex items-center justify-between bg-success-50/50 rounded-xl p-4 border border-success-200/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success-50 border border-success-200/60 rounded-full flex items-center justify-center text-[12px] font-bold text-success">
                    {app.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-body">{app.memberName}</div>
                    <div className="text-[11px] text-heading">{app.id} &middot; {app.amount} &middot; {app.purpose}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDisburse(app.id)}
                  className="px-4 py-2 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-primary-100 transition-colors"
                >
                  Disburse Funds
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Recent Actions Log */}
      <SectionCard title="Recent Actions">
        <div className="flex flex-col gap-2">
          {recentActions.map((app) => (
            <div key={app.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  app.status === "Approved" ? "bg-success-50 border border-success-200/60 text-success" :
                  app.status === "Disbursed" ? "bg-primary-50 border border-primary-200/60 text-primary" :
                  "bg-danger-50 border border-danger-200/60 text-danger-500"
                }`}>
                  {app.memberName.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-body">{app.memberName}</div>
                  <div className="text-[11px] text-heading">{app.id} &middot; {app.amount} &middot; {app.purpose}</div>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
