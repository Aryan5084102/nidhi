"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const KPI_DATA = [
  { label: "Assets Under Mgmt", value: "₹84.6 Cr", change: "+12.4%", trend: "up" },
  { label: "Revenue (YTD)", value: "₹6.82 Cr", change: "+8.7%", trend: "up" },
  { label: "Total Members", value: "12,847", change: "+342", trend: "up" },
  { label: "NPA Rate", value: "1.82%", change: "-0.14%", trend: "down" },
  { label: "Collection Efficiency", value: "97.3%", change: "+0.6%", trend: "up" },
  { label: "Compliance Score", value: "94/100", change: "+2", trend: "up" },
  { label: "Liquidity Ratio", value: "1.48x", change: "+0.05", trend: "up" },
  { label: "Fraud Cases", value: "3", change: "-2", trend: "down" },
];

const BOARD_RESOLUTIONS = [
  { id: "BR-2026-001", date: "2026-01-15", subject: "Approval of FY2025-26 Annual Budget & Capital Allocation Plan", proposedBy: "Mr. Arvind Mehta", status: "Approved", votesFor: 7, votesAgainst: 0 },
  { id: "BR-2026-002", date: "2026-01-15", subject: "Adoption of Revised NPA Recovery Policy under RBI Guidelines", proposedBy: "Ms. Priya Sharma", status: "Approved", votesFor: 6, votesAgainst: 1 },
  { id: "BR-2026-003", date: "2026-02-12", subject: "Expansion of Branch Network to Tier-3 Cities (Phase II)", proposedBy: "Mr. Rajesh Iyer", status: "Pending", votesFor: 4, votesAgainst: 3 },
  { id: "BR-2026-004", date: "2026-02-12", subject: "Integration of AI-Powered Fraud Detection System", proposedBy: "Dr. Anita Desai", status: "Approved", votesFor: 7, votesAgainst: 0 },
  { id: "BR-2026-005", date: "2026-03-05", subject: "Appointment of External Auditor for FY2026-27", proposedBy: "Mr. Suresh Patel", status: "Approved", votesFor: 5, votesAgainst: 2 },
  { id: "BR-2026-006", date: "2026-03-05", subject: "Deferment of Dividend Declaration Pending Liquidity Review", proposedBy: "Ms. Kavitha Nair", status: "Deferred", votesFor: 3, votesAgainst: 4 },
  { id: "BR-2026-007", date: "2026-03-12", subject: "Member Loan Limit Enhancement from ₹5L to ₹10L for Gold Members", proposedBy: "Mr. Arvind Mehta", status: "Pending", votesFor: 0, votesAgainst: 0 },
  { id: "BR-2026-008", date: "2026-03-12", subject: "Approval of Digital KYC & e-Signature Implementation Roadmap", proposedBy: "Dr. Anita Desai", status: "Approved", votesFor: 6, votesAgainst: 1 },
];

const RISK_HEATMAP = [
  { branch: "Mumbai HQ", creditRisk: "Low", operationalRisk: "Low", complianceRisk: "Low", overallScore: 92 },
  { branch: "Pune Central", creditRisk: "Low", operationalRisk: "Medium", complianceRisk: "Low", overallScore: 85 },
  { branch: "Nashik", creditRisk: "Medium", operationalRisk: "Low", complianceRisk: "Low", overallScore: 78 },
  { branch: "Nagpur East", creditRisk: "High", operationalRisk: "Medium", complianceRisk: "Medium", overallScore: 58 },
  { branch: "Aurangabad", creditRisk: "Medium", operationalRisk: "Medium", complianceRisk: "Low", overallScore: 72 },
  { branch: "Kolhapur", creditRisk: "Low", operationalRisk: "Low", complianceRisk: "Medium", overallScore: 80 },
];

const COMPLIANCE_RULES = [
  { rule: "Nidhi Rules 2014 — Net Owned Fund Requirement (₹10L minimum)", status: "Compliant", lastChecked: "2026-03-15" },
  { rule: "NDH-1 Return Filing — Annual Return to ROC", status: "Compliant", lastChecked: "2026-03-10" },
  { rule: "NDH-2 Return Filing — Half-Yearly Return", status: "Compliant", lastChecked: "2026-03-10" },
  { rule: "NDH-3 Application — Extension/Compliance Application", status: "Compliant", lastChecked: "2026-02-28" },
  { rule: "Minimum 200 Members Requirement", status: "Compliant", lastChecked: "2026-03-15" },
  { rule: "Net Owned Fund to Deposit Ratio (1:20)", status: "Compliant", lastChecked: "2026-03-15" },
  { rule: "Unencumbered Term Deposits (10% of Deposits)", status: "Compliant", lastChecked: "2026-03-14" },
  { rule: "KYC/AML Compliance — PMLA Act 2002", status: "Pending", lastChecked: "2026-03-12" },
  { rule: "Interest Rate Cap on Deposits (Max RBI prescribed rate)", status: "Compliant", lastChecked: "2026-03-08" },
  { rule: "Loan-to-Deposit Ratio Ceiling (Max 50% as per Nidhi Rules)", status: "Compliant", lastChecked: "2026-03-15" },
];

const REGULATORY_ACTIONS = [
  { id: "RA-001", action: "Submit updated KYC documents for 48 high-value members to comply with PMLA amendment", authority: "FIU-IND", deadline: "2026-03-31", priority: "High" },
  { id: "RA-002", action: "File NDH-4 form for change in directorship (Mr. Vikram Singh retirement)", authority: "ROC Mumbai", deadline: "2026-04-15", priority: "Medium" },
  { id: "RA-003", action: "Complete annual statutory audit reconciliation for FY2025-26", authority: "Internal Audit", deadline: "2026-04-30", priority: "Medium" },
  { id: "RA-004", action: "Respond to RBI circular on digital lending norms applicability to Nidhi companies", authority: "RBI", deadline: "2026-05-15", priority: "Low" },
];

const POLICY_CHANGES = [
  { date: "2026-03-10", policy: "Loan Recovery Policy v3.2", changedBy: "Mr. Arvind Mehta", change: "Added 60-day grace period for medical emergency defaults", approvedBy: "Board Resolution BR-2026-002" },
  { date: "2026-02-28", policy: "Member Onboarding SOP v2.1", changedBy: "Ms. Priya Sharma", change: "Mandatory video KYC for deposits above ₹2L", approvedBy: "Compliance Committee" },
  { date: "2026-02-15", policy: "Interest Rate Schedule Q1-2026", changedBy: "Mr. Suresh Patel", change: "FD rates revised: 1Y 7.5%, 2Y 8.0%, 3Y 8.5%", approvedBy: "Board Resolution BR-2026-001" },
  { date: "2026-01-30", policy: "IT Security Policy v4.0", changedBy: "Dr. Anita Desai", change: "Implemented MFA for all admin portal access, session timeout reduced to 15 min", approvedBy: "IT Governance Committee" },
  { date: "2026-01-20", policy: "Agent Commission Structure v2.3", changedBy: "Mr. Rajesh Iyer", change: "Tiered commission: 2% base + 0.5% bonus for >95% collection rate", approvedBy: "Board Resolution BR-2026-001" },
  { date: "2026-01-10", policy: "Chit Fund Auction Rules v1.8", changedBy: "Ms. Kavitha Nair", change: "Maximum bid discount capped at 30% (previously 35%)", approvedBy: "Compliance Committee" },
];

const ACCESS_REVIEWS = [
  { date: "2026-03-08", user: "admin@glimmora.com", role: "Super Admin", action: "Quarterly access review — Retained", reviewer: "Mr. Arvind Mehta" },
  { date: "2026-03-08", user: "priya.s@glimmora.com", role: "Compliance Officer", action: "Quarterly access review — Retained", reviewer: "Mr. Arvind Mehta" },
  { date: "2026-03-08", user: "vikram.s@glimmora.com", role: "Director", action: "Access revoked — Retirement effective 2026-04-01", reviewer: "Ms. Kavitha Nair" },
  { date: "2026-02-20", user: "temp_auditor@ext.com", role: "External Auditor", action: "Temporary access granted — Expires 2026-04-30", reviewer: "Mr. Suresh Patel" },
  { date: "2026-02-10", user: "rajesh.i@glimmora.com", role: "Branch Manager", action: "Elevated to Regional Manager — Permissions updated", reviewer: "Ms. Priya Sharma" },
];

const DIRECTOR_ATTENDANCE = [
  { name: "Mr. Arvind Mehta (Chairman)", meetings: [true, true, true, true, true, true] },
  { name: "Ms. Priya Sharma", meetings: [true, true, true, false, true, true] },
  { name: "Mr. Rajesh Iyer", meetings: [true, false, true, true, true, true] },
  { name: "Dr. Anita Desai", meetings: [true, true, true, true, true, true] },
  { name: "Mr. Suresh Patel", meetings: [true, true, false, true, true, true] },
  { name: "Ms. Kavitha Nair", meetings: [true, true, true, true, false, true] },
  { name: "Mr. Vikram Singh", meetings: [true, true, true, true, true, false] },
];

const MEETING_DATES = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];

const TABS = [
  { id: "board-pack", label: "Board Pack" },
  { id: "governance-review", label: "Governance Review" },
  { id: "audit-trail", label: "Audit Trail" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRiskColor(level) {
  if (level === "Low") return "text-success bg-success-50";
  if (level === "Medium") return "text-warning bg-warning-50";
  return "text-danger-500 bg-danger-50";
}

function getResolutionStatusForBadge(status) {
  if (status === "Deferred") return "Pending";
  return status;
}

// ─── Tab Components ───────────────────────────────────────────────────────────

function BoardPackTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI Snapshot */}
      <SectionCard title="KPI Snapshot — Board Executive Summary">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {KPI_DATA.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-2">{kpi.label}</div>
              <div className="font-mono font-bold text-lg text-heading">{kpi.value}</div>
              <div className={`text-[11px] font-semibold mt-1 ${kpi.trend === "up" && kpi.label !== "Fraud Cases" ? "text-success" : kpi.trend === "down" && kpi.label === "NPA Rate" ? "text-success" : kpi.trend === "down" && kpi.label === "Fraud Cases" ? "text-success" : "text-warning"}`}>
                {kpi.change} vs last quarter
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Board Resolutions */}
      <SectionCard title="Board Resolutions — FY 2025-26">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Resolution ID</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Date</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Subject</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Proposed By</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Status</th>
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">For</th>
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3">Against</th>
              </tr>
            </thead>
            <tbody>
              {BOARD_RESOLUTIONS.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono font-bold text-primary">{r.id}</td>
                  <td className="py-3 pr-4 text-slate-500">{r.date}</td>
                  <td className="py-3 pr-4 text-body max-w-xs">{r.subject}</td>
                  <td className="py-3 pr-4 text-slate-500">{r.proposedBy}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status === "Deferred" ? "Pending" : r.status} />
                    {r.status === "Deferred" && (
                      <span className="ml-1 text-[10px] text-heading">(Deferred)</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-center font-mono font-bold text-success">{r.votesFor || "—"}</td>
                  <td className="py-3 text-center font-mono font-bold text-danger-500">{r.votesAgainst || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-heading">Summary:</span>
          <span className="text-[11px] font-semibold text-success">5 Approved</span>
          <span className="text-[11px] text-subtle">|</span>
          <span className="text-[11px] font-semibold text-warning">2 Pending</span>
          <span className="text-[11px] text-subtle">|</span>
          <span className="text-[11px] font-semibold text-slate-500">1 Deferred</span>
        </div>
      </SectionCard>
    </div>
  );
}

function GovernanceReviewTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Risk Heatmap */}
      <SectionCard title="Risk Heatmap — Branch / Region Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Branch</th>
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Credit Risk</th>
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Operational Risk</th>
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Compliance Risk</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3">Overall Score</th>
              </tr>
            </thead>
            <tbody>
              {RISK_HEATMAP.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-body">{row.branch}</td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getRiskColor(row.creditRisk)}`}>
                      {row.creditRisk}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getRiskColor(row.operationalRisk)}`}>
                      {row.operationalRisk}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getRiskColor(row.complianceRisk)}`}>
                      {row.complianceRisk}
                    </span>
                  </td>
                  <td className="py-3 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar value={row.overallScore} max={100} color={row.overallScore >= 80 ? "#059669" : row.overallScore >= 65 ? "#D97706" : "#DC2626"} />
                      </div>
                      <span className="font-mono font-bold text-[12px] text-body w-8 text-right">{row.overallScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Compliance Status */}
      <SectionCard title="Compliance Status — Nidhi Company Regulatory Rules">
        <div className="space-y-2.5">
          {COMPLIANCE_RULES.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-body font-medium truncate">{item.rule}</div>
                <div className="text-[10px] text-heading uppercase tracking-wider mt-0.5">Last checked: {item.lastChecked}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="w-2 h-2 rounded-full bg-success-500"></div>
          <span className="text-[11px] text-slate-500">9 of 10 rules compliant</span>
          <span className="text-[11px] text-subtle">|</span>
          <span className="text-[11px] font-semibold text-warning">1 pending review</span>
        </div>
      </SectionCard>

      {/* Pending Regulatory Actions */}
      <SectionCard title="Pending Regulatory Actions">
        <div className="space-y-3">
          {REGULATORY_ACTIONS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono font-bold text-[12px] text-primary">{item.id}</span>
                    <StatusBadge status={item.priority} />
                  </div>
                  <div className="text-[13px] text-body font-medium">{item.action}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <span className="text-[10px] text-heading uppercase tracking-wider">Authority: </span>
                      <span className="text-[12px] text-body font-medium">{item.authority}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-heading uppercase tracking-wider">Deadline: </span>
                      <span className="font-mono font-bold text-[12px] text-body">{item.deadline}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold px-3 py-1.5 hover:bg-primary-100 transition-colors whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function AuditTrailTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Policy Changes Log */}
      <SectionCard title="Policy Changes Log">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Date</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Policy</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Changed By</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Change Description</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {POLICY_CHANGES.map((p, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="py-3 pr-4 font-semibold text-primary whitespace-nowrap">{p.policy}</td>
                  <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{p.changedBy}</td>
                  <td className="py-3 pr-4 text-body max-w-sm">{p.change}</td>
                  <td className="py-3 text-slate-500 text-[12px]">{p.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Access Reviews */}
      <SectionCard title="Access Reviews">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Date</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">User</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Role</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Action</th>
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3">Reviewer</th>
              </tr>
            </thead>
            <tbody>
              {ACCESS_REVIEWS.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="py-3 pr-4 font-mono font-bold text-body">{r.user}</td>
                  <td className="py-3 pr-4">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary border border-primary-200/60">
                      {r.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-body">{r.action}</td>
                  <td className="py-3 text-slate-500">{r.reviewer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Director Attendance */}
      <SectionCard title="Director Attendance — Last 6 Board Meetings">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[10px] text-heading uppercase tracking-wider pb-3 pr-4">Director</th>
                {MEETING_DATES.map((d) => (
                  <th key={d} className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 px-2">{d}</th>
                ))}
                <th className="text-center text-[10px] text-heading uppercase tracking-wider pb-3 pl-4">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {DIRECTOR_ATTENDANCE.map((dir, i) => {
                const attended = dir.meetings.filter(Boolean).length;
                const total = dir.meetings.length;
                const pct = Math.round((attended / total) * 100);
                return (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-body whitespace-nowrap">{dir.name}</td>
                    {dir.meetings.map((present, j) => (
                      <td key={j} className="py-3 px-2 text-center">
                        {present ? (
                          <span className="inline-block w-5 h-5 leading-5 rounded-full bg-success-50 text-success text-[11px] font-bold">P</span>
                        ) : (
                          <span className="inline-block w-5 h-5 leading-5 rounded-full bg-danger-50 text-danger-500 text-[11px] font-bold">A</span>
                        )}
                      </td>
                    ))}
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16">
                          <ProgressBar value={pct} max={100} color={pct >= 80 ? "#059669" : "#D97706"} />
                        </div>
                        <span className="font-mono font-bold text-[12px] text-body">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 leading-4 text-center rounded-full bg-success-50 text-success text-[9px] font-bold">P</span>
            <span className="text-[11px] text-heading">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 leading-4 text-center rounded-full bg-danger-50 text-danger-500 text-[9px] font-bold">A</span>
            <span className="text-[11px] text-heading">Absent</span>
          </div>
          <span className="text-[11px] text-subtle">|</span>
          <span className="text-[11px] text-slate-500">Average attendance: <span className="font-mono font-bold">90.5%</span></span>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GovernanceView() {
  const [activeTab, setActiveTab] = useState("board-pack");

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Board & Governance Portal"
        description="Executive oversight dashboard for board members, governance reviews, and audit trails. All data as of Q4 FY2025-26."
      >
        <HeaderStat value="94" label="Compliance Score" className="bg-success-50" />
        <HeaderStat value="8" label="Resolutions" className="bg-primary-50" />
        <HeaderStat value="4" label="Pending Actions" className="bg-warning-50" />
      </PageHeader>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "board-pack" && <BoardPackTab />}
      {activeTab === "governance-review" && <GovernanceReviewTab />}
      {activeTab === "audit-trail" && <AuditTrailTab />}
    </div>
  );
}
