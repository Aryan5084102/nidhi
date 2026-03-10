"use client";

import { useState } from "react";
import { loanApplications, loanPortfolio, loanDefaults, members } from "@/data/mockData";

/* ─── Loan Process Steps ─── */
const processSteps = [
  {
    step: 1,
    title: "Application",
    description: "Member submits loan application with required documents and purpose of loan.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    color: "indigo",
  },
  {
    step: 2,
    title: "Risk Review",
    description: "AI Risk Agent evaluates creditworthiness, STI score, and repayment capacity.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    color: "amber",
  },
  {
    step: 3,
    title: "Approval",
    description: "Loan committee reviews the risk report and approves or rejects the application.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "emerald",
  },
  {
    step: 4,
    title: "Disbursement",
    description: "Approved amount is disbursed to the member's linked bank account.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    color: "blue",
  },
  {
    step: 5,
    title: "Monitoring",
    description: "AI monitors repayment schedule, sends reminders, and flags potential defaults.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
    color: "purple",
  },
];

const colorMap = {
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600", line: "bg-indigo-400" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", line: "bg-amber-400" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", line: "bg-emerald-400" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", line: "bg-blue-400" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", line: "bg-purple-400" },
};

/* ─── Sub-tab Sections ─── */
const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "applications", label: "Applications" },
  { id: "approval", label: "Approval" },
  { id: "risk", label: "Risk Analysis" },
  { id: "portfolio", label: "Portfolio" },
  { id: "repayments", label: "Repayments" },
  { id: "defaults", label: "Defaults" },
];

/* ─── Risk Badge ─── */
function RiskTag({ level }) {
  const styles = {
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    High: "bg-red-50 text-red-500 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[level] || styles.Medium}`}>
      {level}
    </span>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
    "Under Review": "bg-blue-50 text-blue-600 border-blue-200/60",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Rejected: "bg-red-50 text-red-500 border-red-200/60",
    Disbursed: "bg-indigo-50 text-indigo-600 border-indigo-200/60",
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    "Overdue": "bg-red-50 text-red-500 border-red-200/60",
    "Defaulted": "bg-red-50 text-red-500 border-red-200/60",
    "Recovered": "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    "In Recovery": "bg-amber-50 text-amber-600 border-amber-200/60",
    "Written Off": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab() {
  const dashMetrics = [
    { label: "Total Loan Portfolio", value: "₹2.4 Cr", change: "+8.2%", color: "#6B8ABF" },
    { label: "Active Loans", value: "5,200", change: "+1.8%", color: "#5B9E8A" },
    { label: "Pending Applications", value: "34", change: "+12", color: "#C49A4C" },
    { label: "Default Rate", value: "2.1%", change: "-0.3%", color: "#BF6F6D" },
    { label: "Avg. Interest Rate", value: "12.5%", change: "0%", color: "#9585B5" },
    { label: "Recovery Rate", value: "87%", change: "+4%", color: "#6B9E89" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {dashMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className={`text-[11px] mt-1 font-medium ${m.change.startsWith("+") ? "text-emerald-500" : m.change.startsWith("-") ? "text-red-500" : "text-slate-400"}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Loan Process Flow */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Loan Process Flow</h3>
        <div className="flex items-start gap-0">
          {processSteps.map((ps, idx) => {
            const c = colorMap[ps.color];
            return (
              <div key={ps.step} className="flex items-start flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} mb-2`}>
                    {ps.icon}
                  </div>
                  <div className="text-[12px] font-semibold text-slate-700 mb-1">{ps.title}</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed px-2 max-w-[140px]">{ps.description}</div>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="flex items-center pt-5 -mx-1">
                    <div className={`w-8 h-0.5 ${colorMap[processSteps[idx + 1].color].line} opacity-40`} />
                    <svg className="w-3 h-3 text-slate-300 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Applications + Portfolio Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recent Applications</h3>
          <div className="flex flex-col gap-3">
            {loanApplications.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-200/60 rounded-full flex items-center justify-center text-[11px] font-bold text-indigo-600">
                    {app.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{app.memberName}</div>
                    <div className="text-[11px] text-slate-400">{app.id} &middot; {app.purpose}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-slate-700 font-mono">{app.amount}</div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Breakdown */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Portfolio Breakdown</h3>
          <div className="flex flex-col gap-3">
            {loanPortfolio.map((item) => {
              const pct = (item.disbursed / item.sanctioned) * 100;
              return (
                <div key={item.category} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-semibold text-slate-700">{item.category}</span>
                    <span className="text-[12px] font-mono text-slate-500">{item.count} loans</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Sanctioned: <strong className="text-slate-600">₹{(item.sanctioned / 100000).toFixed(1)}L</strong></span>
                    <span>Disbursed: <strong className="text-slate-600">₹{(item.disbursed / 100000).toFixed(1)}L</strong></span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Applications Tab ─── */
function ApplicationsTab() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = loanApplications.filter((app) => {
    const matchesSearch = app.memberName.toLowerCase().includes(search.toLowerCase()) || app.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      {/* Search & Filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
        />
        <div className="flex gap-2">
          {["All", "Pending", "Under Review", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
                filterStatus === f
                  ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Application</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Purpose</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Applied</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <span className="text-[12px] text-slate-500 font-mono">{app.id}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-50 border border-indigo-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      {app.memberName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">{app.memberName}</div>
                      <div className="text-[10px] text-slate-400">{app.memberId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] font-bold text-slate-700 font-mono">{app.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{app.purpose}</td>
                <td className="px-5 py-3"><RiskTag level={app.risk} /></td>
                <td className="px-5 py-3"><StatusBadge status={app.status} /></td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{app.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[13px] text-slate-400">No applications found</div>
        )}
      </div>
    </div>
  );
}

/* ─── Approval Tab ─── */
function ApprovalTab() {
  const pendingApprovals = loanApplications.filter((a) => a.status === "Pending" || a.status === "Under Review");

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Pending Approvals</h3>
            <p className="text-[13px] text-slate-400">Review and approve or reject pending loan applications.</p>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2 text-center border border-amber-200/60">
            <div className="text-lg font-bold text-amber-600 font-mono">{pendingApprovals.length}</div>
            <div className="text-slate-400 text-[10px]">Pending</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingApprovals.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{app.memberName}</div>
                <span className="text-[11px] text-slate-400 font-mono">{app.id}</span>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Amount</div>
                <div className="text-[16px] font-bold text-indigo-600 font-mono">{app.amount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tenure</div>
                <div className="text-[13px] font-semibold text-slate-700">{app.tenure}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Purpose</div>
                <div className="text-[13px] font-semibold text-slate-700">{app.purpose}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Risk Level</div>
                <RiskTag level={app.risk} />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 text-[11px] text-slate-400">
              <span>STI Score: <strong className="text-slate-600">{app.stiScore}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Interest: <strong className="text-slate-600">{app.interestRate}</strong></span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-emerald-100 transition-colors">
                Approve
              </button>
              <button className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-500 rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-red-100 transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingApprovals.length === 0 && (
        <div className="bg-white rounded-2xl p-10 card-shadow border border-slate-100 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold text-slate-700">All caught up!</div>
          <div className="text-[13px] text-slate-400 mt-1">No pending approvals at the moment.</div>
        </div>
      )}
    </div>
  );
}

/* ─── Risk Analysis Tab ─── */
function RiskAnalysisTab() {
  const riskDistribution = [
    { level: "Low Risk", count: 3200, pct: 61.5, color: "#059669" },
    { level: "Medium Risk", count: 1400, pct: 26.9, color: "#D97706" },
    { level: "High Risk", count: 600, pct: 11.6, color: "#DC2626" },
  ];

  const riskFactors = [
    { factor: "STI Score Below 50", impact: "High", affectedLoans: 340, trend: "Decreasing" },
    { factor: "Multiple Active Loans", impact: "Medium", affectedLoans: 520, trend: "Stable" },
    { factor: "Late Payment History", impact: "High", affectedLoans: 280, trend: "Increasing" },
    { factor: "Low Deposit-to-Loan Ratio", impact: "Medium", affectedLoans: 410, trend: "Stable" },
    { factor: "KYC Pending/Incomplete", impact: "High", affectedLoans: 150, trend: "Decreasing" },
    { factor: "Chit Fund Default History", impact: "High", affectedLoans: 90, trend: "Stable" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {riskDistribution.map((r) => (
          <div key={r.level} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[13px] font-semibold text-slate-700">{r.level}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: r.color }}>{r.count.toLocaleString()}</div>
            </div>
            <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: r.color }} />
            </div>
            <div className="text-[11px] text-slate-400 text-right font-mono">{r.pct}%</div>
          </div>
        ))}
      </div>

      {/* Risk Factors Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Risk Factors Analysis</h3>
          <p className="text-[12px] text-slate-400 mt-1">AI-powered risk factor identification across the loan portfolio</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Risk Factor</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Impact</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Affected Loans</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {riskFactors.map((rf) => (
              <tr key={rf.factor} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{rf.factor}</td>
                <td className="px-5 py-3"><RiskTag level={rf.impact} /></td>
                <td className="px-5 py-3 text-[13px] font-mono text-slate-600">{rf.affectedLoans}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-medium ${
                    rf.trend === "Decreasing" ? "text-emerald-500" : rf.trend === "Increasing" ? "text-red-500" : "text-slate-400"
                  }`}>
                    {rf.trend === "Decreasing" ? "↓" : rf.trend === "Increasing" ? "↑" : "→"} {rf.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Portfolio Tab ─── */
function PortfolioTab() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loanPortfolio.map((item) => {
          const pct = (item.disbursed / item.sanctioned) * 100;
          const npaRate = ((item.npa / item.count) * 100).toFixed(1);
          return (
            <div key={item.category} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[15px] font-bold text-slate-900">{item.category}</div>
                  <span className="text-[11px] text-slate-400">{item.count} active loans</span>
                </div>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <svg className="w-5 h-5" style={{ color: item.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sanctioned</div>
                  <div className="text-[14px] font-bold text-indigo-600 font-mono">₹{(item.sanctioned / 100000).toFixed(1)}L</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Disbursed</div>
                  <div className="text-[14px] font-bold text-emerald-600 font-mono">₹{(item.disbursed / 100000).toFixed(1)}L</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400">Utilization</span>
                  <span className="text-[11px] text-slate-400 font-mono">{pct.toFixed(0)}%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color }} />
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Avg Rate: <strong className="text-slate-600">{item.avgRate}</strong></span>
                <span className="text-slate-300">|</span>
                <span>NPA: <strong className={parseFloat(npaRate) > 5 ? "text-red-500" : "text-slate-600"}>{npaRate}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Repayments Tab ─── */
function RepaymentsTab() {
  const repaymentData = [
    { month: "Oct", collected: 42, expected: 45 },
    { month: "Nov", collected: 48, expected: 50 },
    { month: "Dec", collected: 52, expected: 55 },
    { month: "Jan", collected: 50, expected: 52 },
    { month: "Feb", collected: 58, expected: 60 },
    { month: "Mar", collected: 55, expected: 58 },
  ];

  const repaymentMetrics = [
    { label: "Total Expected (This Month)", value: "₹58L", color: "#6B8ABF" },
    { label: "Total Collected", value: "₹55L", color: "#5B9E8A" },
    { label: "Collection Rate", value: "94.8%", color: "#059669" },
    { label: "Overdue Amount", value: "₹3L", color: "#BF6F6D" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Repayment Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {repaymentMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Monthly Repayment Trend</h3>
        <div className="flex items-end gap-3 h-40">
          {repaymentData.map((d) => {
            const maxVal = 65;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                  <div
                    className="flex-1 bg-indigo-100 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(d.expected / maxVal) * 100}%` }}
                    title={`Expected: ₹${d.expected}L`}
                  />
                  <div
                    className="flex-1 bg-emerald-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(d.collected / maxVal) * 100}%` }}
                    title={`Collected: ₹${d.collected}L`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">{d.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-100" />
            <span className="text-[11px] text-slate-400">Expected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span className="text-[11px] text-slate-400">Collected</span>
          </div>
        </div>
      </div>

      {/* Upcoming EMIs */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Upcoming EMI Schedule</h3>
        <div className="flex flex-col gap-2">
          {loanApplications.filter((a) => a.status === "Approved" || a.status === "Disbursed").map((app) => (
            <div key={app.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 border border-emerald-200/60 rounded-full flex items-center justify-center text-[11px] font-bold text-emerald-600">
                  {app.memberName.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{app.memberName}</div>
                  <div className="text-[11px] text-slate-400">{app.id} &middot; EMI: {app.emi}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-medium text-slate-500">Due: {app.nextEmi}</div>
                <StatusBadge status="Active" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Defaults Tab ─── */
function DefaultsTab() {
  const defaultMetrics = [
    { label: "Total Defaults", value: loanDefaults.length.toString(), color: "#DC2626" },
    { label: "Default Amount", value: "₹8.2L", color: "#BF6F6D" },
    { label: "Recovery Initiated", value: loanDefaults.filter((d) => d.status === "In Recovery").length.toString(), color: "#C49A4C" },
    { label: "Recovered", value: loanDefaults.filter((d) => d.status === "Recovered").length.toString(), color: "#059669" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Default Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {defaultMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Defaults Table */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Defaulted Loans</h3>
          <p className="text-[12px] text-slate-400 mt-1">Track and manage loan defaults and recovery process</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Loan ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Outstanding</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Missed EMIs</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Default Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loanDefaults.map((d) => (
              <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{d.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-red-50 border border-red-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-red-500">
                      {d.memberName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">{d.memberName}</div>
                      <div className="text-[10px] text-slate-400">{d.memberId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] font-bold text-red-500 font-mono">{d.outstanding}</td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-600">{d.missedEmis}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{d.defaultDate}</td>
                <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Loans View ─── */
export default function LoansView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "applications": return <ApplicationsTab />;
      case "approval": return <ApprovalTab />;
      case "risk": return <RiskAnalysisTab />;
      case "portfolio": return <PortfolioTab />;
      case "repayments": return <RepaymentsTab />;
      case "defaults": return <DefaultsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Loans Management</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Comprehensive loan management system with AI-powered risk analysis,
              automated approval workflows, and real-time portfolio monitoring.
              All loans comply with Nidhi Company (Amendment) Rules, 2022.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-indigo-600 font-mono">5,200</div>
              <div className="text-slate-400 text-[10px]">Active Loans</div>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">₹2.4Cr</div>
              <div className="text-slate-400 text-[10px]">Portfolio Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              activeTab === t.id
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {renderTab()}
    </div>
  );
}
