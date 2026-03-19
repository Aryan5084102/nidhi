"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChitSchemes, useMember, useMemberEnrollments, useChitSchemeMembers } from "@/hooks/useData";
import useNavigation from "@/hooks/useNavigation";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { SUCCESS, DANGER_500, SCHEME_ACCENTS } from "@/lib/colors";

// Derive an icon for a chit scheme based on its name or id
function getSchemeIcon(scheme) {
  const name = (scheme.name || "").toLowerCase();
  const id = (scheme.id || "").toLowerCase();
  if (name.includes("gold") || name.includes("suvarna")) return "🥇";
  if (name.includes("silver") || name.includes("rajat")) return "🥈";
  if (name.includes("diamond") || name.includes("heera")) return "💎";
  if (name.includes("platinum")) return "⚡";
  if (name.includes("premium") || name.includes("elite")) return "👑";
  if (name.includes("women") || name.includes("mahila")) return "🌸";
  if (name.includes("business") || name.includes("vyapar")) return "🏢";
  if (name.includes("education") || name.includes("vidya")) return "🎓";
  if (name.includes("family") || name.includes("parivar")) return "🏠";
  if (name.includes("agri") || name.includes("kisan") || name.includes("farm")) return "🌾";
  if (name.includes("mini") || name.includes("small") || name.includes("nano")) return "🌱";
  if (name.includes("mega") || name.includes("grand") || name.includes("large")) return "🚀";
  if (name.includes("super") || name.includes("top")) return "⭐";
  if (name.includes("smart") || name.includes("digital")) return "📱";
  if (name.includes("savings") || name.includes("saving")) return "💰";
  // Fallback based on id number
  const idNum = parseInt(id.replace(/[^0-9]/g, "")) || 0;
  const fallbacks = ["🔄", "💳", "📈", "🏦", "💵", "🎯", "🌟", "🔐"];
  return fallbacks[idNum % fallbacks.length];
}

// Scheme card accent colors (index-based, hardcoded)
const schemeAccentColors = SCHEME_ACCENTS;

/* ─── Members List Modal ─── */
function MembersModal({ scheme, onClose, currentMemberId }) {
  const { data: schemeDetail } = useChitSchemeMembers(scheme.id);
  const enrolledMembers = schemeDetail?.members || [];
  const wonMembers = enrolledMembers.filter((m) => m.hasWonAuction);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl sm:max-w-2xl w-full shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-heading">{scheme.name} — Members</h3>
              <p className="text-[12px] text-heading mt-1">{enrolledMembers.length} members enrolled · Month {scheme.currentMonth || 0}/{parseInt(scheme.duration) || 0}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-heading hover:text-body cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Rotation Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly Pot</div>
              <div className="text-[15px] font-mono font-bold text-success">{scheme.potSize}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Received</div>
              <div className="text-[15px] font-mono font-bold text-primary">{wonMembers.length}/{enrolledMembers.length}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Enrolled</div>
              <div className="text-[13px] font-semibold text-body">{scheme.enrolledMembers}/{scheme.totalMembers}</div>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="p-5">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-3">Enrolled Members</div>
          {enrolledMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-heading">Loading members...</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {enrolledMembers.map((m) => {
                const isYou = m.memberId === currentMemberId;
                return (
                  <div key={m.memberId} className={`flex items-center justify-between p-3 rounded-xl border ${isYou ? "bg-primary-50 border-primary-200/60" : "bg-slate-50 border-slate-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${isYou ? "bg-primary-100 text-primary" : "bg-slate-200 text-slate-500"}`}>
                        {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-body">{m.name}</span>
                          {isYou && <span className="text-[10px] font-semibold text-primary bg-primary-100 px-1.5 py-0.5 rounded">You</span>}
                        </div>
                        <span className="text-[11px] text-heading font-mono">{m.memberId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.hasWonAuction ? (
                        <StatusBadge status="Paid" />
                      ) : (
                        <span className="text-[11px] text-heading">Waiting</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyChitFunds() {
  const { navigate: onNavigate } = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);
  const { data: chitSchemes = [] } = useChitSchemes();
  const { data: memberEnrollments = [] } = useMemberEnrollments(memberId);
  const [viewMembersScheme, setViewMembersScheme] = useState(null);
  const [schemeSearch, setSchemeSearch] = useState("");

  const enrolledIds = memberEnrollments.map(e => e.schemeId);
  const enrolledSchemes = chitSchemes.filter((s) => enrolledIds.includes(s.id));
  const allAvailable = chitSchemes.filter(
    (s) => !enrolledIds.includes(s.id) && s.status === "Open"
  );
  const availableSchemes = schemeSearch
    ? allAvailable.filter((s) =>
        s.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        s.monthlyAmount.includes(schemeSearch) ||
        s.potSize.includes(schemeSearch) ||
        s.description.toLowerCase().includes(schemeSearch.toLowerCase())
      )
    : allAvailable;

  // ─── Dashboard Calculations (from API data) ───

  // Total contributed: sum monthlyAmount numeric × currentMonth for each enrolled scheme
  const totalContributed = enrolledSchemes.reduce((sum, s) => {
    const amt = parseInt(s.monthlyAmount.replace(/[₹,]/g, "")) || 0;
    return sum + amt * (s.currentMonth || 0);
  }, 0);

  // Total pot value across enrolled schemes
  const totalPotValue = enrolledSchemes.reduce((sum, s) => {
    const pot = parseInt(s.potSize.replace(/[₹,]/g, "")) || 0;
    return sum + pot;
  }, 0);

  // Payout info from enrollment data (hasWonAuction)
  const wonEnrollments = memberEnrollments.filter(e => e.hasWonAuction);
  const totalPayoutReceived = wonEnrollments.reduce((sum, e) => {
    const pot = parseInt(String(e.potSize || "₹0").replace(/[₹,]/g, "")) || 0;
    return sum + pot;
  }, 0);

  // Contribution timeline — last 6 months
  const timelineMonths = (() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = monthNames[d.getMonth()];
      const monthlyTotal = enrolledSchemes.reduce((sum, s) => {
        const amt = parseInt(s.monthlyAmount.replace(/[₹,]/g, "")) || 0;
        return sum + amt;
      }, 0);
      const isCurrent = i === 0;
      const isPaid = i > 0;
      months.push({ label, year: d.getFullYear(), monthNum: d.getMonth(), amount: monthlyTotal, isCurrent, isPaid });
    }
    return months;
  })();

  // My payout summary from enrollment data
  const myPayoutSummary = (() => {
    if (wonEnrollments.length > 0) {
      return { type: "received", count: wonEnrollments.length };
    }
    if (enrolledSchemes.length > 0) {
      return { type: "waiting", membersBefore: 0 };
    }
    return { type: "waiting", membersBefore: 0 };
  })();

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="My Chit Funds"
        description="View your enrolled chit fund schemes. Each month, all members contribute and the pot is given to one member on rotation until everyone receives."
      >
        <HeaderStat value={enrolledSchemes.length} label="Enrolled" className="bg-slate-50 text-success" />
        <HeaderStat value={availableSchemes.length} label="Available" className="bg-slate-50 text-primary" />
        <HeaderStat value={member?.sti || 0} label="Your STI" className={`bg-slate-50 ${(member?.sti || 0) >= 80 ? "text-success" : (member?.sti || 0) >= 60 ? "text-warning" : "text-danger-500"}`} />
      </PageHeader>

      {/* ─── Chit Fund Dashboard ─── */}
      {enrolledSchemes.length > 0 && (
        <SectionCard className="mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-heading">Chit Fund Dashboard</h3>
            <span className="text-[11px] text-heading">Overview of your chit fund activity</span>
          </div>

          {/* 1. Overview Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6">
            {/* Total Contributed */}
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
              <div className="w-1 rounded-full bg-success-500 shrink-0" />
              <div className="p-4 flex-1">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Contributed</div>
                <div className="font-mono font-bold text-[20px] text-success">
                  {formatCurrency(totalContributed)}
                </div>
                <div className="text-[11px] text-heading mt-1">across {enrolledSchemes.length} scheme{enrolledSchemes.length > 1 ? "s" : ""}</div>
              </div>
            </div>

            {/* Total Pot Value */}
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
              <div className="w-1 rounded-full bg-primary-500 shrink-0" />
              <div className="p-4 flex-1">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Pot Value</div>
                <div className="font-mono font-bold text-[20px] text-primary">
                  {formatCurrency(totalPotValue)}
                </div>
                <div className="text-[11px] text-heading mt-1">combined pot size</div>
              </div>
            </div>

            {/* Payouts Received */}
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
              <div className="w-1 rounded-full bg-secondary-500 shrink-0" />
              <div className="p-4 flex-1">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Payouts Received</div>
                <div className="font-mono font-bold text-[20px] text-secondary">
                  {wonEnrollments.length}
                </div>
                <div className="text-[11px] text-heading mt-1">
                  {totalPayoutReceived > 0 ? `Total: ${formatCurrency(totalPayoutReceived)}` : "No payouts yet"}
                </div>
              </div>
            </div>

            {/* Schemes Enrolled */}
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
              <div className="w-1 rounded-full bg-warning-500 shrink-0" />
              <div className="p-4 flex-1">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Schemes Enrolled</div>
                <div className="font-mono font-bold text-[20px] text-warning">{enrolledSchemes.length}</div>
                <div className="text-[11px] text-heading mt-1">{availableSchemes.length} more available</div>
              </div>
            </div>
          </div>

          {/* 2. Contribution Timeline */}
          <div className="mb-6">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-4">Contribution Timeline</div>
            <div className="bg-white rounded-2xl p-3 sm:p-5 card-shadow border border-slate-100 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[400px]">
                {timelineMonths.map((m, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    {/* Circle + connector */}
                    <div className="flex items-center w-full justify-center mb-3">
                      {idx > 0 && (
                        <div className={`h-[2px] flex-1 ${m.isPaid ? "bg-success-300" : "bg-slate-200"}`} />
                      )}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                          m.isCurrent
                            ? "bg-primary-100 border-primary-400 animate-pulse"
                            : m.isPaid
                            ? "bg-success-100 border-success-400"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        {m.isPaid ? (
                          <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : m.isCurrent ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                      {idx < timelineMonths.length - 1 && (
                        <div className={`h-[2px] flex-1 ${m.isPaid && !timelineMonths[idx + 1]?.isCurrent ? "bg-success-300" : "bg-slate-200"}`} />
                      )}
                    </div>
                    {/* Month label */}
                    <div className={`text-[12px] font-semibold ${m.isCurrent ? "text-primary" : m.isPaid ? "text-success" : "text-heading"}`}>
                      {m.label}
                    </div>
                    {/* Amount */}
                    <div className={`text-[11px] font-mono mt-0.5 ${m.isCurrent ? "text-primary-500" : m.isPaid ? "text-slate-500" : "text-subtle"}`}>
                      {m.amount > 0 ? `₹${m.amount.toLocaleString("en-IN")}` : "--"}
                    </div>
                    {/* Status */}
                    <div className={`text-[9px] uppercase tracking-wider mt-1 font-semibold ${m.isCurrent ? "text-primary-400" : m.isPaid ? "text-success-400" : "text-subtle"}`}>
                      {m.isCurrent ? "Current" : m.isPaid ? "Paid" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. My Payout Summary Card */}
          <div>
            <div className="text-[10px] text-heading uppercase tracking-wider mb-3">My Payout Summary</div>
            {myPayoutSummary.type === "received" && (
              <div className="bg-white rounded-2xl p-5 card-shadow border border-success-200/60">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-success-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-success-700">
                      You have received {myPayoutSummary.count} payout{myPayoutSummary.count > 1 ? "s" : ""}
                    </div>
                    <div className="text-[12px] text-heading mt-0.5">
                      Total received: {formatCurrency(totalPayoutReceived)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {myPayoutSummary.type === "waiting" && (
              <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-body">
                      Your turn is coming. {myPayoutSummary.membersBefore} member{myPayoutSummary.membersBefore !== 1 ? "s" : ""} before you
                    </div>
                    <div className="text-[12px] text-heading mt-0.5">
                      Keep contributing monthly to maintain your position in the rotation
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* My Active Chit Funds */}
      <SectionCard className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-heading">My Active Chit Funds</h3>
          {enrolledSchemes.length > 0 && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200/60">
              {enrolledSchemes.length} enrolled
            </span>
          )}
        </div>

        {enrolledSchemes.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-body">No Active Chit Funds</p>
            <p className="text-[12px] text-heading mt-1 max-w-sm mx-auto">
              You haven't enrolled in any chit fund scheme yet. Browse available schemes below and enroll to start saving.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledSchemes.map((scheme) => {
              const totalMonths = parseInt(scheme.duration) || 0;
              const rotationPct = totalMonths > 0 ? ((scheme.currentMonth || 0) / totalMonths) * 100 : 0;
              const myEnrollment = memberEnrollments.find(e => e.schemeId === scheme.id);

              return (
                <div key={scheme.id} onClick={() => router.push(`/member/chit-funds/${scheme.id}`)}
                  className="bg-white rounded-2xl p-5 card-shadow border border-success-200/60 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[15px] font-bold text-heading">{scheme.name}</div>
                      <span className="text-[11px] text-heading font-mono">{scheme.id}</span>
                    </div>
                    <StatusBadge status="Active" />
                  </div>

                  <p className="text-[12px] text-heading leading-relaxed mb-4">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly</div>
                      <div className="text-[16px] font-bold text-primary font-mono">{scheme.monthlyAmount}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Pot Size</div>
                      <div className="text-[16px] font-bold text-success font-mono">{scheme.potSize}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Duration</div>
                      <div className="text-[13px] font-semibold text-body">{scheme.duration}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Rotation</div>
                      <div className="text-[13px] font-semibold text-body">Month {scheme.currentMonth || 0}/{totalMonths}</div>
                    </div>
                  </div>

                  {/* Rotation Progress */}
                  {scheme.currentMonth > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-heading">{scheme.enrolledMembers} members enrolled</span>
                        <span className="text-[11px] text-heading font-mono">{rotationPct.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={scheme.currentMonth} max={totalMonths} color={SUCCESS} />
                    </div>
                  )}

                  {/* Your Payout Status */}
                  <div className={`rounded-xl p-3 mb-3 border ${myEnrollment?.hasWonAuction ? "bg-success-50 border-success-200/60" : "bg-slate-50 border-slate-100"}`}>
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Your Payout Status</div>
                    {myEnrollment?.hasWonAuction ? (
                      <div className="text-[13px] font-semibold text-success">Payout received</div>
                    ) : (
                      <div className="text-[13px] font-semibold text-slate-500">Waiting for your turn in rotation</div>
                    )}
                  </div>

                  {/* View Members Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setViewMembersScheme(scheme); }}
                    className="w-full py-2.5 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[13px] font-semibold hover:bg-primary-100 hover:border-primary-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    View Members & Rotation
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* All Available Schemes */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 className="text-[15px] font-bold text-heading">All Available Schemes</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 text-heading absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                placeholder="Search schemes..."
                className="pl-9 pr-3 py-2 w-full sm:w-56 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
              />
            </div>
            <span className="text-[11px] text-heading whitespace-nowrap">{availableSchemes.length} found</span>
          </div>
        </div>

        {availableSchemes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-heading">No schemes available right now. Check back later for new schemes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSchemes.map((scheme, idx) => {
              const eligible = (member?.sti || 0) >= scheme.minSTI;
              const fillPct = (scheme.enrolledMembers / scheme.totalMembers) * 100;
              const spotsFull = scheme.enrolledMembers >= scheme.totalMembers;
              const spotsLeft = scheme.totalMembers - scheme.enrolledMembers;
              const accentColor = schemeAccentColors[idx % schemeAccentColors.length];
              const schemeIcon = getSchemeIcon(scheme);

              return (
                <div key={scheme.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
                  {/* Color top bar */}
                  <div className="h-1.5" style={{ background: accentColor }} />

                  <div className="p-5">
                    {/* Header with icon */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: accentColor + "15" }}
                        >
                          {schemeIcon}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-heading leading-tight">{scheme.name}</div>
                          <span className="text-[11px] text-heading font-mono">{scheme.id}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${spotsFull ? "bg-danger-50 text-danger-500 border border-danger-200/60" : "bg-success-50 text-success border border-success-200/60"}`}>
                        {spotsFull ? "Full" : `${spotsLeft} left`}
                      </span>
                    </div>

                    <p className="text-[12px] text-heading leading-relaxed mb-4">{scheme.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Monthly</div>
                        <div className="text-[16px] font-bold font-mono" style={{ color: accentColor }}>{scheme.monthlyAmount}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Pot Size</div>
                        <div className="text-[16px] font-bold text-success font-mono">{scheme.potSize}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Duration</div>
                        <div className="text-[13px] font-semibold text-body">{scheme.duration}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Members</div>
                        <div className="text-[13px] font-semibold text-body">{scheme.enrolledMembers}/{scheme.totalMembers}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-heading">{scheme.enrolledMembers}/{scheme.totalMembers} members enrolled</span>
                        <span className="text-[11px] text-heading font-mono">{fillPct.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={scheme.enrolledMembers} max={scheme.totalMembers} color={spotsFull ? DANGER_500 : accentColor} />
                    </div>

                    <div className="flex items-center gap-3 mb-4 text-[11px] text-heading">
                      <span>Min STI: <strong className="text-body">{scheme.minSTI}</strong></span>
                      <span className="text-subtle">|</span>
                      <span>KYC: <strong className="text-body">{scheme.kycRequired}</strong></span>
                    </div>

                    <button
                      onClick={() => {
                        if (eligible && !spotsFull) {
                          try { localStorage.setItem("glimmora_enroll_scheme", JSON.stringify(scheme)); } catch {}
                          onNavigate("enroll_chitfund");
                        }
                      }}
                      disabled={!eligible || spotsFull}
                      className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border ${
                        !eligible || spotsFull
                          ? "bg-slate-50 border-slate-200 text-subtle cursor-not-allowed"
                          : "bg-primary-50 border-primary-200 text-primary hover:bg-primary-100 hover:border-primary-300"
                      }`}
                    >
                      {spotsFull ? "Scheme Full" : eligible ? "Enroll Now" : `Min STI Required: ${scheme.minSTI}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Members & Rotation Modal — rendered via portal to overlay full screen */}
      {viewMembersScheme && createPortal(
        <MembersModal
          scheme={viewMembersScheme}
          onClose={() => setViewMembersScheme(null)}
          currentMemberId={memberId}
        />,
        document.body
      )}
    </div>
  );
}
