"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChitSchemeMembers, useMemberEnrollments, useSchemeAuctions, useMember, useMemberPayments } from "@/hooks/useData";
import useNavigation from "@/hooks/useNavigation";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { SUCCESS } from "@/lib/colors";

function parseAmt(v) {
  if (typeof v === "number") return v;
  return parseInt(String(v || "0").replace(/[^\d]/g, "")) || 0;
}
function fmtRupee(n) { return `₹${Number(n).toLocaleString("en-IN")}`; }

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════
export default function ChitFundDetailView({ schemeId }) {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const { data: member } = useMember(memberId);
  const { data: schemeData, loading } = useChitSchemeMembers(schemeId);
  const { data: enrollments = [] } = useMemberEnrollments(memberId);
  const { data: auctions = [] } = useSchemeAuctions(schemeId);
  const { data: payments = [] } = useMemberPayments(memberId);

  const [activeTab, setActiveTab] = useState("overview");
  const [memberTab, setMemberTab] = useState("all");
  const [showPotRequest, setShowPotRequest] = useState(false);
  const [potReason, setPotReason] = useState("");
  const [potSubmitted, setPotSubmitted] = useState(false);
  const [showNomineeEdit, setShowNomineeEdit] = useState(false);
  const [nomineeForm, setNomineeForm] = useState({ name: "", relation: "", phone: "" });
  const [showExitForm, setShowExitForm] = useState(false);
  const [exitReason, setExitReason] = useState("");
  const [showDispute, setShowDispute] = useState(false);
  const [disputeText, setDisputeText] = useState("");

  const scheme = schemeData?.scheme;
  const allMembers = schemeData?.members || [];
  const myEnrollment = enrollments.find((e) => e.schemeId === schemeId);

  if (loading || !scheme) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" /></div>;
  }

  const totalMonths = parseInt(scheme.duration) || 0;
  const currentMonth = scheme.currentMonth || 0;
  const monthlyAmt = parseAmt(scheme.monthlyAmount);
  const potSize = parseAmt(scheme.potSize);
  const totalPaid = monthlyAmt * currentMonth;
  const totalToPay = monthlyAmt * totalMonths;
  const progressPct = totalMonths > 0 ? Math.round((currentMonth / totalMonths) * 100) : 0;
  const hasWon = myEnrollment?.hasWonAuction || false;
  const wonMembers = allMembers.filter((m) => m.hasWonAuction);
  const waitingMembers = allMembers.filter((m) => !m.hasWonAuction);
  const filteredMembers = memberTab === "received" ? wonMembers : memberTab === "waiting" ? waitingMembers : allMembers;
  const myPosition = waitingMembers.findIndex((m) => m.memberId === memberId);
  const estimatedTurnMonth = currentMonth + (myPosition >= 0 ? myPosition + 1 : waitingMembers.length);

  const nextPayDate = new Date();
  nextPayDate.setDate(1);
  nextPayDate.setMonth(nextPayDate.getMonth() + 1);
  const nextPayStr = nextPayDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const schemePayments = payments.filter((p) => p.referenceId === schemeId || p.type === "Chit Subscription");

  // Build schedule
  const schedule = [];
  const baseDate = new Date();
  baseDate.setDate(1);
  baseDate.setMonth(baseDate.getMonth() - currentMonth + 1);
  for (let i = 0; i < totalMonths; i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i);
    const isPaid = i < currentMonth;
    const isCurrent = i === currentMonth;
    const winner = auctions.find((a) => a.month === i + 1);
    schedule.push({
      month: i + 1,
      date: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      fullDate: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      isPaid, isCurrent,
      winnerName: winner?.winnerName || (isPaid ? wonMembers[i]?.name || "—" : ""),
      isYou: winner?.winnerId === memberId || (isPaid && wonMembers[i]?.memberId === memberId),
    });
  }

  const chartMonths = schedule.slice(Math.max(0, currentMonth - 6), currentMonth + 1);
  const onTimePct = currentMonth > 0 ? Math.round((schemePayments.filter(p => p.status === "Paid" || p.status === "Completed").length / currentMonth) * 100) : 100;
  const defaultersCount = allMembers.length > 0 ? Math.max(0, Math.round(allMembers.length * 0.05)) : 0;
  const collectionRate = allMembers.length > 0 ? Math.round(100 - (defaultersCount / allMembers.length) * 100) : 100;

  const announcements = [
    { id: 1, date: nextPayStr, text: `Next pot distribution on ${nextPayStr}. Ensure timely payment.`, type: "info" },
    ...(currentMonth > 0 ? [{ id: 2, date: "Update", text: `Month ${currentMonth} complete. ${wonMembers.length} members have received the pot.`, type: "success" }] : []),
  ];

  const TABS = [
    { id: "overview", label: "Overview", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
    { id: "payments", label: "Payments", icon: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { id: "members", label: "Members", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { id: "actions", label: "Actions", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" },
  ];

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("my_chitfunds")} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-slate-800 truncate">{scheme.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{scheme.id} · {scheme.monthlyAmount}/month</div>
          </div>
          <StatusBadge status={myEnrollment ? "Active" : scheme.status} />
        </div>
      </div>

      {/* ─── Top Stats Strip ─── */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { l: "Monthly", v: scheme.monthlyAmount, accent: true },
            { l: "Pot Size", v: scheme.potSize, accent: true },
            { l: "Duration", v: scheme.duration },
            { l: "Month", v: `${currentMonth}/${totalMonths}` },
            { l: "Members", v: `${scheme.enrolledMembers}/${scheme.totalMembers}` },
            { l: "Paid So Far", v: fmtRupee(totalPaid) },
            { l: "Remaining", v: fmtRupee(totalToPay - totalPaid) },
            { l: "Progress", v: `${progressPct}%` },
          ].map(({ l, v, accent }) => (
            <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center">
              <div className="text-[8px] text-emerald-200 uppercase tracking-wider">{l}</div>
              <div className={`text-[14px] font-bold font-mono ${accent ? "text-white" : "text-emerald-50"}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="px-4 sm:px-6 py-5">

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            {/* Row 1: Status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Your Status */}
              <div className={`rounded-2xl p-4 border ${hasWon ? "bg-emerald-50 border-emerald-200/60" : "bg-blue-50 border-blue-200/60"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasWon ? "bg-emerald-100" : "bg-blue-100"}`}>
                    <svg className={`w-5 h-5 ${hasWon ? "text-emerald-600" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={hasWon ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"} />
                    </svg>
                  </div>
                  <div>
                    <div className={`text-[13px] font-bold ${hasWon ? "text-emerald-800" : "text-blue-800"}`}>{hasWon ? "Pot Received!" : "Waiting for Turn"}</div>
                    <div className={`text-[10px] mt-0.5 ${hasWon ? "text-emerald-600" : "text-blue-600"}`}>{hasWon ? `Full ${scheme.potSize}` : `${wonMembers.length}/${allMembers.length} received`}</div>
                  </div>
                </div>
              </div>

              {/* Next Payment */}
              {currentMonth < totalMonths && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-amber-900">Next Payment</div>
                    <div className="text-[10px] text-amber-700">{nextPayStr}</div>
                  </div>
                  <div className="text-[18px] font-black text-amber-700 font-mono">{scheme.monthlyAmount}</div>
                </div>
              )}

              {/* Queue Position */}
              {!hasWon && myEnrollment && (
                <div className="bg-violet-50 rounded-2xl border border-violet-200/60 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-[16px] font-black text-violet-600">#{myPosition >= 0 ? myPosition + 1 : "?"}</div>
                  <div>
                    <div className="text-[12px] font-bold text-violet-800">Queue Position</div>
                    <div className="text-[10px] text-violet-600">Est. turn: Month {Math.min(estimatedTurnMonth, totalMonths)}</div>
                  </div>
                </div>
              )}

              {/* Auto-Pay */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-emerald-700">Auto-Pay Active</span>
                </div>
                <span className="text-[10px] text-slate-400">UPI AutoPay</span>
              </div>
            </div>

            {/* Row 2: Contribution + Chart + Scheme Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Contribution Tracker */}
              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contribution Progress</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center"><div className="text-[16px] font-black text-emerald-600 font-mono">{fmtRupee(totalPaid)}</div><div className="text-[8px] text-slate-400 mt-0.5">Paid</div></div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center"><div className="text-[16px] font-black text-slate-500 font-mono">{fmtRupee(totalToPay - totalPaid)}</div><div className="text-[8px] text-slate-400 mt-0.5">Remaining</div></div>
                  <div className="bg-indigo-50 rounded-xl p-3 text-center"><div className="text-[16px] font-black text-indigo-600 font-mono">{fmtRupee(totalToPay)}</div><div className="text-[8px] text-slate-400 mt-0.5">Total</div></div>
                </div>
                <ProgressBar value={currentMonth} max={totalMonths} color={SUCCESS} />
                <div className="flex justify-between mt-1.5"><span className="text-[9px] text-slate-400">Month {currentMonth}/{totalMonths}</span><span className="text-[9px] text-slate-400">{progressPct}%</span></div>
              </Card>

              {/* Contribution Chart */}
              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Monthly Contributions</div>
                <div className="flex items-end gap-1.5 h-[110px]">
                  {(chartMonths.length > 0 ? chartMonths : schedule.slice(0, 6)).map((m, i) => {
                    const h = m.isPaid ? 100 : m.isCurrent ? 40 : 15;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-md transition-all" style={{ height: `${h}%`, background: m.isPaid ? "linear-gradient(to top, #059669, #10b981)" : m.isCurrent ? "linear-gradient(to top, #3b82f6, #60a5fa)" : "#e2e8f0" }} />
                        <span className="text-[7px] text-slate-400">{m.date.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[8px] text-slate-400"><span className="w-1.5 h-1.5 rounded-sm bg-emerald-500" />Paid</span>
                  <span className="flex items-center gap-1 text-[8px] text-slate-400"><span className="w-1.5 h-1.5 rounded-sm bg-blue-400" />Current</span>
                  <span className="flex items-center gap-1 text-[8px] text-slate-400"><span className="w-1.5 h-1.5 rounded-sm bg-slate-200" />Upcoming</span>
                </div>
              </Card>

              {/* Scheme Health */}
              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Scheme Health</div>
                <div className="space-y-3">
                  {[
                    { label: "Collection Rate", value: collectionRate, color: "emerald" },
                    { label: "On-Time Payments", value: onTimePct, color: "blue" },
                    { label: "Rotation Progress", value: progressPct, color: "violet" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1"><span className="text-[10px] text-slate-500">{label}</span><span className={`text-[10px] font-bold text-${color}-600`}>{value}%</span></div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full bg-${color}-400`} style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                  {defaultersCount > 0 && (
                    <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 shrink-0" /><span className="text-[10px] text-red-700">{defaultersCount} overdue member{defaultersCount > 1 ? "s" : ""}</span></div>
                  )}
                </div>
              </Card>
            </div>

            {/* Row 3: How it Works + Enrollment + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">How It Works</div>
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed mb-3">
                  All <strong>{scheme.totalMembers}</strong> members pay <strong>{scheme.monthlyAmount}</strong>/month → pot of <strong>{scheme.potSize}</strong> → one member gets the full pot each month → rotates for <strong>{scheme.duration}</strong>. No deductions.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center"><div className="text-[8px] text-slate-400">You pay total</div><div className="text-[14px] font-black text-slate-700 font-mono">{fmtRupee(totalToPay)}</div></div>
                  <div className="bg-emerald-50 rounded-lg p-2.5 text-center"><div className="text-[8px] text-slate-400">You receive</div><div className="text-[14px] font-black text-emerald-600 font-mono">{fmtRupee(potSize)}</div></div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Your Enrollment</div>
                {myEnrollment ? (
                  <div className="space-y-1.5">
                    {[["ID", myEnrollment.id || "—"], ["Enrolled", myEnrollment.enrolledDate || "—"], ["Status", myEnrollment.status || "Active"],
                      ["Nominee", myEnrollment.nomineeName || "—"], ["Relationship", myEnrollment.nomineeRelation || "—"],
                      ["STI", member?.sti || "—"], ["KYC", member?.kyc || "—"]].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between py-0.5">
                        <span className="text-[10px] text-slate-400">{l}</span>
                        <span className="text-[10px] font-semibold text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-[11px] text-slate-400 mb-3">Not enrolled</div>
                    <button onClick={() => { try { localStorage.setItem("glimmora_enroll_scheme", JSON.stringify(scheme)); } catch {} navigate("enroll_chitfund"); }}
                      className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 cursor-pointer">Enroll Now</button>
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Announcements</div>
                <div className="space-y-2">
                  {announcements.map((a) => (
                    <div key={a.id} className={`rounded-xl p-3 border ${a.type === "success" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}>
                      <div className="text-[8px] text-slate-400 mb-0.5">{a.date}</div>
                      <div className={`text-[10px] leading-relaxed ${a.type === "success" ? "text-emerald-700" : "text-blue-700"}`}>{a.text}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ PAYMENTS TAB ═══ */}
        {activeTab === "payments" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Payment Schedule */}
              <Card className="overflow-hidden">
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Payment Schedule</span>
                  <span className="text-[10px] text-slate-400">{currentMonth}/{totalMonths} paid</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0 bg-white"><tr className="border-b border-slate-100">
                      <th className="text-slate-400 uppercase font-medium px-4 py-2 text-left">#</th>
                      <th className="text-slate-400 uppercase font-medium px-4 py-2 text-left">Date</th>
                      <th className="text-slate-400 uppercase font-medium px-4 py-2 text-right">Amount</th>
                      <th className="text-slate-400 uppercase font-medium px-4 py-2 text-center">Status</th>
                    </tr></thead>
                    <tbody>
                      {schedule.map((s) => (
                        <tr key={s.month} className={`border-b border-slate-50 ${s.isYou ? "bg-emerald-50/50" : s.isCurrent ? "bg-blue-50/30" : ""}`}>
                          <td className="text-slate-500 px-4 py-2 font-mono">{s.month}</td>
                          <td className="text-slate-700 font-medium px-4 py-2">{s.fullDate}</td>
                          <td className="font-bold font-mono px-4 py-2 text-right text-emerald-600">{scheme.monthlyAmount}</td>
                          <td className="px-4 py-2 text-center">
                            {s.isPaid ? <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Paid</span>
                              : s.isCurrent ? <span className="text-[9px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Due</span>
                              : <span className="text-[9px] font-semibold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Upcoming</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2.5 bg-slate-50 flex justify-between border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-700">Total</span>
                  <span className="text-[11px] font-black text-emerald-700 font-mono">{fmtRupee(totalToPay)}</span>
                </div>
              </Card>

              {/* Payment History */}
              <Card className="overflow-hidden">
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Payment History</span>
                  <span className="text-[10px] text-slate-400">{schemePayments.length} transactions</span>
                </div>
                {schemePayments.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-[11px]">
                      <thead className="sticky top-0 bg-white"><tr className="border-b border-slate-100">
                        <th className="text-slate-400 uppercase font-medium px-4 py-2 text-left">Date</th>
                        <th className="text-slate-400 uppercase font-medium px-4 py-2 text-right">Amount</th>
                        <th className="text-slate-400 uppercase font-medium px-4 py-2 text-center">Status</th>
                        <th className="text-slate-400 uppercase font-medium px-4 py-2 text-center">Receipt</th>
                      </tr></thead>
                      <tbody>
                        {schemePayments.map((p, i) => (
                          <tr key={i} className="border-b border-slate-50">
                            <td className="text-slate-700 px-4 py-2">{p.date || p.paidDate || "—"}</td>
                            <td className="font-bold font-mono px-4 py-2 text-right text-emerald-600">{p.amount || scheme.monthlyAmount}</td>
                            <td className="px-4 py-2 text-center"><span className="text-[9px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{p.status || "Paid"}</span></td>
                            <td className="px-4 py-2 text-center"><button onClick={() => window.print()} className="text-[9px] text-indigo-500 font-semibold hover:underline cursor-pointer">Download</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="text-[12px] text-slate-400 mb-1">No payment records yet</div>
                    <div className="text-[10px] text-slate-300">Payments appear after your first contribution</div>
                  </div>
                )}
              </Card>
            </div>

            {/* Documents */}
            <Card className="p-5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Scheme Documents</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[{ name: "Terms & Conditions", type: "PDF" }, { name: "Enrollment Agreement", type: "PDF" }, { name: "All Payment Receipts", type: "ZIP" }].map((doc) => (
                  <button key={doc.name} onClick={() => window.print()}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      <span className="text-[11px] font-medium text-slate-600">{doc.name}</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{doc.type}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══ MEMBERS TAB ═══ */}
        {activeTab === "members" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Members List */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Members ({allMembers.length})</span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {[{ id: "all", l: "All", c: allMembers.length }, { id: "received", l: "Received", c: wonMembers.length }, { id: "waiting", l: "Waiting", c: waitingMembers.length }].map((t) => (
                    <button key={t.id} onClick={() => setMemberTab(t.id)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${memberTab === t.id ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                      {t.l} ({t.c})
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {filteredMembers.length === 0 ? <p className="text-[12px] text-slate-400 py-6 text-center">No members</p> :
                    filteredMembers.map((m) => {
                      const isYou = m.memberId === memberId;
                      return (
                        <div key={m.memberId} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${isYou ? "bg-emerald-50 border-emerald-200/60" : "bg-slate-50/50 border-slate-100"}`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isYou ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                              {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-semibold text-slate-700 truncate">{m.name}</span>
                                {isYou && <span className="text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded">You</span>}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono">{m.memberId} · Joined {m.enrolledDate}</div>
                            </div>
                          </div>
                          {m.hasWonAuction ? <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">Received</span>
                            : <span className="text-[9px] font-semibold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full shrink-0">Waiting</span>}
                        </div>
                      );
                    })}
                </div>
              </Card>

              {/* Rotation Timeline */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Rotation Timeline</span>
                  <span className="text-[10px] text-slate-400">{wonMembers.length}/{totalMonths} done</span>
                </div>
                <div className="space-y-0 max-h-[400px] overflow-y-auto pr-1">
                  {schedule.map((s, i) => (
                    <div key={s.month} className={`flex items-center gap-2.5 py-2.5 ${i < schedule.length - 1 ? "border-b border-slate-50" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        s.isYou ? "bg-emerald-500 text-white" : s.isPaid ? "bg-emerald-50 text-emerald-600" :
                        s.isCurrent ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : "bg-slate-50 text-slate-400"
                      }`}>
                        {s.isPaid ? <svg className={`w-3.5 h-3.5 ${s.isYou ? "text-white" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : s.month}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-semibold ${s.isPaid || s.isCurrent ? "text-slate-700" : "text-slate-400"}`}>Month {s.month}</span>
                          <span className="text-[9px] text-slate-400">{s.date}</span>
                          {s.isYou && <span className="text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">YOU</span>}
                          {s.isCurrent && !s.isYou && <span className="text-[8px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">NOW</span>}
                        </div>
                        {s.isPaid && s.winnerName && <div className="text-[9px] text-slate-400 truncate">Pot: {s.winnerName}</div>}
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 ${s.isPaid ? "text-emerald-500" : "text-slate-300"}`}>{scheme.potSize}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ ACTIONS TAB ═══ */}
        {activeTab === "actions" && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pot Request */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></div>
                  <span className="text-[12px] font-bold text-slate-700">Request Pot</span>
                </div>
                {potSubmitted ? (
                  <div className="bg-emerald-50 rounded-xl p-3 text-[11px] text-emerald-700 text-center">Request submitted! Branch manager will review.</div>
                ) : (
                  <>
                    <textarea value={potReason} onChange={(e) => setPotReason(e.target.value)} placeholder="Why do you need the pot? (medical, education, business...)"
                      className="w-full border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 outline-none focus:border-indigo-400 mb-3 resize-none h-16" />
                    <button onClick={() => setPotSubmitted(true)} disabled={!potReason.trim()}
                      className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all ${potReason.trim() ? "bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>Submit Request</button>
                  </>
                )}
              </Card>

              {/* Update Nominee */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center"><svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>
                  <span className="text-[12px] font-bold text-slate-700">Update Nominee</span>
                </div>
                <div className="space-y-2 mb-3">
                  <input value={nomineeForm.name} onChange={(e) => setNomineeForm({ ...nomineeForm, name: e.target.value })} placeholder="Nominee Name"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 outline-none focus:border-teal-400" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={nomineeForm.relation} onChange={(e) => setNomineeForm({ ...nomineeForm, relation: e.target.value })}
                      className="border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 outline-none focus:border-teal-400 cursor-pointer">
                      <option value="">Relationship</option><option value="Spouse">Spouse</option><option value="Parent">Parent</option><option value="Child">Child</option><option value="Sibling">Sibling</option>
                    </select>
                    <input value={nomineeForm.phone} onChange={(e) => setNomineeForm({ ...nomineeForm, phone: e.target.value })} placeholder="Phone"
                      className="border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700 outline-none focus:border-teal-400" />
                  </div>
                </div>
                <button className="w-full py-2.5 bg-teal-500 text-white rounded-xl text-[11px] font-bold cursor-pointer hover:bg-teal-600 transition-all">Save Changes</button>
              </Card>

              {/* Raise Dispute */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
                  <span className="text-[12px] font-bold text-slate-700">Raise Dispute</span>
                </div>
                <textarea value={disputeText} onChange={(e) => setDisputeText(e.target.value)} placeholder="Describe your issue — wrong payment, rotation dispute, etc."
                  className="w-full border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 outline-none focus:border-amber-400 mb-3 resize-none h-16" />
                <button onClick={() => setDisputeText("")} disabled={!disputeText.trim()}
                  className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all ${disputeText.trim() ? "bg-amber-500 text-white cursor-pointer hover:bg-amber-600" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>Submit Dispute</button>
              </Card>
            </div>

            {/* Exit Scheme */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"><svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg></div>
                <span className="text-[12px] font-bold text-slate-700">Request Early Exit</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="bg-red-50 rounded-xl p-3 mb-3 text-[10px] text-red-700 leading-relaxed">
                    <strong>Warning:</strong> Early exit incurs 5% surrender charge on contributions paid. You'll receive <strong>{fmtRupee(Math.round(totalPaid * 0.95))}</strong> (charge: {fmtRupee(Math.round(totalPaid * 0.05))}) within 15 working days.
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2.5 text-center"><div className="text-[8px] text-slate-400">Paid</div><div className="text-[13px] font-black text-slate-700 font-mono">{fmtRupee(totalPaid)}</div></div>
                    <div className="bg-red-50 rounded-lg p-2.5 text-center"><div className="text-[8px] text-slate-400">Charge (5%)</div><div className="text-[13px] font-black text-red-600 font-mono">{fmtRupee(Math.round(totalPaid * 0.05))}</div></div>
                    <div className="bg-emerald-50 rounded-lg p-2.5 text-center"><div className="text-[8px] text-slate-400">You Get</div><div className="text-[13px] font-black text-emerald-600 font-mono">{fmtRupee(Math.round(totalPaid * 0.95))}</div></div>
                  </div>
                </div>
                <div>
                  <textarea value={exitReason} onChange={(e) => setExitReason(e.target.value)} placeholder="Reason for early exit..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-[11px] text-slate-700 outline-none focus:border-red-400 mb-3 resize-none h-20" />
                  <button disabled={!exitReason.trim()}
                    className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all ${exitReason.trim() ? "bg-red-500 text-white cursor-pointer hover:bg-red-600" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>Submit Exit Request</button>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <div className="flex gap-3">
              <button onClick={() => navigate("my_payments")} className="flex-1 py-3 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-xl text-[12px] font-semibold hover:bg-emerald-100 transition-all cursor-pointer">Make Payment</button>
              <button onClick={() => window.print()} className="flex-1 py-3 bg-violet-50 border border-violet-200/60 text-violet-700 rounded-xl text-[12px] font-semibold hover:bg-violet-100 transition-all cursor-pointer">Download Statement</button>
              <button onClick={() => navigate("helpcenter")} className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[12px] font-semibold hover:bg-slate-100 transition-all cursor-pointer">Contact Support</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
