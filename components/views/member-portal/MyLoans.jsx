"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { loanApplications, members } from "@/data/mockData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const loanSchemes = [
  { id: "LS-001", name: "Personal Loan", description: "Quick personal loans for any purpose. Minimal documentation, fast disbursal within 24 hours.", minAmount: 10000, maxAmount: 500000, tenures: [6, 12, 18, 24], rate: "11.0% - 13.0%", rateNum: 12, minSTI: 50, icon: "💳", color: "#6366F1", features: ["Instant approval", "No collateral", "Flexible EMI"] },
  { id: "LS-002", name: "Business Loan", description: "Expand your business with competitive rates. Suitable for working capital and equipment purchase.", minAmount: 50000, maxAmount: 1500000, tenures: [12, 24, 36], rate: "10.5% - 12.0%", rateNum: 11, minSTI: 65, icon: "🏢", color: "#0D9488", features: ["High limit", "Tax benefits", "Quick disbursal"] },
  { id: "LS-003", name: "Gold Loan", description: "Instant loan against gold ornaments. Lowest interest rates with safe vault storage.", minAmount: 5000, maxAmount: 1000000, tenures: [3, 6, 12], rate: "9.0% - 10.0%", rateNum: 9.5, minSTI: 30, icon: "🪙", color: "#C9982E", features: ["Lowest rate", "Secure vault", "Same day"] },
  { id: "LS-004", name: "Education Loan", description: "Invest in your future. Covers tuition, books, and living expenses for higher education.", minAmount: 25000, maxAmount: 800000, tenures: [12, 18, 24, 36], rate: "10.0% - 11.5%", rateNum: 10.5, minSTI: 45, icon: "🎓", color: "#7C3AED", features: ["Moratorium period", "Covers all fees", "Easy docs"] },
  { id: "LS-005", name: "Emergency Loan", description: "Instant emergency funds for medical or urgent needs. Fastest approval with minimal paperwork.", minAmount: 5000, maxAmount: 200000, tenures: [3, 6, 12], rate: "12.0% - 14.0%", rateNum: 13, minSTI: 40, icon: "🚑", color: "#DC2626", features: ["4-hour disbursal", "Minimal docs", "No guarantor"] },
  { id: "LS-006", name: "Home Renovation", description: "Renovate and upgrade your home. Covers interiors, repairs, and construction improvements.", minAmount: 100000, maxAmount: 1000000, tenures: [12, 24, 36], rate: "10.5% - 12.5%", rateNum: 11.5, minSTI: 60, icon: "🏠", color: "#059669", features: ["Large amounts", "Long tenure", "Low EMI"] },
];

function formatINR(num) {
  return "₹" + num.toLocaleString("en-IN");
}

function calculateEMI(principal, ratePercent, months) {
  const r = ratePercent / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

function getLoanCardAccentClass(status) {
  if (status === "Approved" || status === "Disbursed") return "bg-success-500";
  if (status === "Pending" || status === "Under Review") return "bg-warning-500";
  if (status === "Rejected") return "bg-danger-400";
  return "bg-slate-400";
}

function getLoanAmountColorClass(status) {
  if (status === "Approved" || status === "Disbursed") return "text-success";
  if (status === "Pending" || status === "Under Review") return "text-warning";
  return "text-body";
}

export default function MyLoans({ onNavigate }) {
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const member = members.find((m) => m.id === memberId) || members[0];
  const myLoans = loanApplications.filter((l) => l.memberId === memberId);

  const [loanSearch, setLoanSearch] = useState("");

  const activeLoans = myLoans.filter((l) => ["Approved", "Disbursed"].includes(l.status));
  const pendingLoans = myLoans.filter((l) => ["Pending", "Under Review"].includes(l.status));
  const nextEmi = myLoans.find((l) => l.nextEmi !== "—")?.nextEmi || "—";

  const filteredLoanSchemes = loanSearch
    ? loanSchemes.filter((s) =>
        s.name.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(loanSearch.toLowerCase()) ||
        s.rate.includes(loanSearch)
      )
    : loanSchemes;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Loans"
        description="View your active loans and applications. Browse available loan schemes to apply for funds based on your trust score."
      >
        <HeaderStat value={activeLoans.length} label="Active" className="bg-slate-50 text-success" />
        <HeaderStat value={pendingLoans.length} label="Pending" className="bg-slate-50 text-warning" />
        <HeaderStat value={`${member.sti}/100`} label="Your STI" className={`bg-slate-50 ${member.sti >= 80 ? "text-success" : member.sti >= 60 ? "text-warning" : "text-danger-500"}`} />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-slate-400 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Applications</div>
            <div className="text-[20px] font-bold font-mono text-body">{myLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{myLoans.length === 0 ? "No applications yet" : `${myLoans.length} application${myLoans.length > 1 ? "s" : ""}`}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-success-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Active Loans</div>
            <div className="text-[20px] font-bold font-mono text-success">{activeLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{activeLoans.length === 0 ? "No active loans" : "Currently running"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-warning-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Pending</div>
            <div className="text-[20px] font-bold font-mono text-warning">{pendingLoans.length}</div>
            <div className="text-[11px] text-heading mt-1">{pendingLoans.length === 0 ? "No pending loans" : "Under review"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-primary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Next EMI</div>
            <div className="text-[20px] font-bold font-mono text-primary">{nextEmi}</div>
            <div className="text-[11px] text-heading mt-1">{nextEmi === "—" ? "No upcoming EMI" : "Upcoming due date"}</div>
          </div>
        </div>
      </div>

      {/* My Active Loans — Card Grid */}
      <SectionCard className="mb-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-bold text-heading">My Active Loans</h3>
          {myLoans.length > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200/60">
              {activeLoans.length} active
            </span>
          )}
        </div>

        {myLoans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <p className="text-[13px] font-bold text-body mb-1">No Active Loans</p>
            <p className="text-[12px] text-heading max-w-sm mx-auto">Browse available loan schemes below and apply based on your trust score.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myLoans.map((loan) => {
              const accentClass = getLoanCardAccentClass(loan.status);
              const amountColorClass = getLoanAmountColorClass(loan.status);
              return (
                <div key={loan.id} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
                  {/* Colored top bar */}
                  <div className={`h-1.5 w-full ${accentClass}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[15px] font-bold text-heading leading-tight">{loan.purpose}</div>
                        <div className="text-[11px] font-mono text-heading mt-0.5">{loan.id}</div>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Loan Amount</div>
                        <div className={`text-[15px] font-bold font-mono ${amountColorClass}`}>{loan.amount}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly EMI</div>
                        <div className="text-[15px] font-bold font-mono text-body">{loan.emi}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure</div>
                        <div className="text-[13px] font-semibold text-body">{loan.tenure}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Next EMI</div>
                        <div className={`text-[13px] font-semibold ${loan.nextEmi === "—" ? "text-subtle" : "text-primary"}`}>
                          {loan.nextEmi}
                        </div>
                      </div>
                    </div>

                    {/* Applied date footer */}
                    {loan.appliedDate && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <span className="text-[11px] text-heading">Applied on {loan.appliedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Available Loan Schemes */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 className="text-[15px] font-bold text-heading">Available Loan Schemes</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 text-heading absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={loanSearch}
                onChange={(e) => setLoanSearch(e.target.value)}
                placeholder="Search loans..."
                className="pl-9 pr-3 py-2 w-56 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
              />
            </div>
            <span className="text-[11px] text-heading whitespace-nowrap">{filteredLoanSchemes.length} found</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoanSchemes.map((scheme) => {
            const eligible = member.sti >= scheme.minSTI;
            const sampleEmi = calculateEMI(scheme.minAmount, scheme.rateNum, scheme.tenures[1] || scheme.tenures[0]);
            return (
              <div key={scheme.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 card-shadow border border-slate-100 group">
                {/* Color Top Bar */}
                <div className="h-1.5" style={{ background: scheme.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: scheme.color + "15" }}>
                        {scheme.icon}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-heading">{scheme.name}</div>
                        <div className="text-[11px] font-mono text-heading">{scheme.rate} p.a.</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${eligible ? "bg-success-50 text-success border border-success-200/60" : "bg-danger-50 text-danger-500 border border-danger-200/60"}`}>
                      {eligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </div>

                  <p className="text-[11px] text-heading leading-relaxed mb-4">{scheme.description}</p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">Amount</div>
                      <div className="text-[12px] font-semibold text-body">{formatINR(scheme.minAmount)} - {formatINR(scheme.maxAmount)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">EMI from</div>
                      <div className="text-[12px] font-bold text-success font-mono">{formatINR(sampleEmi)}/mo</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {scheme.features.map((f) => (
                      <span key={f} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{f}</span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (eligible) {
                        localStorage.setItem("glimmora_apply_loan_scheme", JSON.stringify(scheme));
                        onNavigate("apply_loan");
                      }
                    }}
                    disabled={!eligible}
                    className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border ${eligible ? "bg-primary-50 border-primary-200 text-primary hover:bg-primary-100 hover:border-primary-300" : "bg-slate-50 border-slate-200 text-subtle cursor-not-allowed"}`}
                  >
                    {eligible ? "Apply Now" : `Min STI: ${scheme.minSTI}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
