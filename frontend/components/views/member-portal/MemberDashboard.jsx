"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { members, chitSchemes, loanApplications, depositAccounts, chitPayoutHistory } from "@/data/mockData";
import { PRIMARY, SUCCESS, SECONDARY, WARNING, SKY, ROSE } from "@/lib/colors";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const ENROLLMENT_KEY = "glimmora_member_enrollments";

function getEnrollments(memberId) {
  if (typeof window === "undefined") return [];
  try {
    const data = JSON.parse(localStorage.getItem(ENROLLMENT_KEY) || "{}");
    return data[memberId] || [];
  } catch {
    return [];
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Static color map — no dynamic Tailwind class interpolation
const quickActionColorMap = {
  emerald: {
    container: "w-10 h-10 rounded-xl bg-success-50 border border-success-200/60 flex items-center justify-center",
  },
  indigo: {
    container: "w-10 h-10 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center",
  },
  purple: {
    container: "w-10 h-10 rounded-xl bg-secondary-50 border border-secondary-200/60 flex items-center justify-center",
  },
  blue: {
    container: "w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center",
  },
  amber: {
    container: "w-10 h-10 rounded-xl bg-warning-50 border border-warning-200/60 flex items-center justify-center",
  },
  slate: {
    container: "w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center",
  },
};

const QuickAction = ({ icon, label, onClick, color }) => {
  const colorClasses = quickActionColorMap[color] || quickActionColorMap.slate;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer card-shadow"
    >
      <div className={colorClasses.container}>
        <span className="text-lg">{icon}</span>
      </div>
      <span className="text-[11px] font-medium text-body">{label}</span>
    </button>
  );
};

// Chit fund scheme accent colors mapped by index
const schemeAccentColors = [PRIMARY, SUCCESS, SECONDARY, WARNING, ROSE, SKY];

// Monthly savings trend data (mock for member)
const savingsTrendData = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  datasets: [
    {
      label: "Deposits",
      data: [12000, 18000, 15000, 22000, 20000, 25000],
      borderColor: SUCCESS,
      backgroundColor: "rgba(5, 150, 105, 0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: SUCCESS,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      borderWidth: 2,
    },
    {
      label: "EMI Paid",
      data: [9420, 9420, 9420, 9420, 9420, 9420],
      borderColor: PRIMARY,
      backgroundColor: "rgba(99, 102, 241, 0.06)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: PRIMARY,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      borderWidth: 2,
    },
  ],
};

const savingsTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true, pointStyle: "circle", padding: 16, font: { size: 11 }, color: "#94A3B8" },
    },
    tooltip: {
      backgroundColor: "#0F172A",
      titleFont: { size: 11 },
      bodyFont: { size: 11, family: "monospace" },
      padding: 10,
      cornerRadius: 10,
      callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString("en-IN")}` },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#94A3B8" } },
    y: {
      grid: { color: "#F1F5F9" },
      ticks: { font: { size: 10, family: "monospace" }, color: "#94A3B8", callback: (v) => `₹${(v / 1000).toFixed(0)}K` },
    },
  },
};

export default function MemberDashboard({ onNavigate }) {
  const { user } = useAuth();
  const memberId = user?.memberId;

  const member = memberId ? members.find((m) => m.id === memberId) : null;
  const myLoans = memberId ? loanApplications.filter((l) => l.memberId === memberId) : [];
  const myDeposits = memberId ? depositAccounts.filter((d) => d.memberId === memberId) : [];

  const [enrolledIds, setEnrolledIds] = useState([]);

  useEffect(() => {
    if (memberId) {
      setEnrolledIds(getEnrollments(memberId));
    }
  }, [memberId]);

  const enrolledSchemes = chitSchemes.filter((s) => enrolledIds.includes(s.id));
  const availableChits = chitSchemes.filter((s) => s.status === "Open" && !enrolledIds.includes(s.id)).slice(0, 3);

  const activeLoans = myLoans.filter((l) => ["Approved", "Disbursed"].includes(l.status));
  const pendingLoans = myLoans.filter((l) => ["Pending", "Under Review"].includes(l.status));

  const isFresh = !member || (myLoans.length === 0 && myDeposits.length === 0 && enrolledIds.length === 0);

  const stiScore = member?.sti || 0;
  const stiDeg = (stiScore / 100) * 360;

  // Onboarding steps
  const kycDone = member?.kyc === "Verified";
  const hasChitFund = enrolledIds.length > 0;
  const hasSavings = myDeposits.length > 0;

  // Helper: get payout status for a member in a scheme
  function getPayoutStatus(schemeId) {
    const payouts = chitPayoutHistory.filter((p) => p.schemeId === schemeId);
    const myPayout = payouts.find((p) => p.memberId === memberId);
    if (!myPayout) return { label: "Waiting", color: "slate" };
    if (myPayout.status === "Paid") return { label: "Received", color: "emerald" };
    if (myPayout.status === "Upcoming") return { label: "Next", color: "amber" };
    return { label: "Waiting", color: "slate" };
  }

  // Doughnut data for portfolio breakdown
  const depositTotal = myDeposits.length > 0 ? parseInt((member?.deposits || "₹0").replace(/[₹,]/g, "")) || 50000 : 0;
  const loanTotal = myLoans.length > 0 ? parseInt((member?.loans || "₹0").replace(/[₹,]/g, "")) || 10000 : 0;
  const chitTotal = enrolledSchemes.length * 5000; // estimate

  const portfolioData = {
    labels: ["Deposits", "Loans", "Chit Funds"],
    datasets: [
      {
        data: [depositTotal || 1, loanTotal || 1, chitTotal || 1],
        backgroundColor: [SUCCESS, PRIMARY, SECONDARY],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const portfolioOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, pointStyle: "circle", padding: 14, font: { size: 11 }, color: "#94A3B8" },
      },
      tooltip: {
        backgroundColor: "#0F172A",
        bodyFont: { size: 11, family: "monospace" },
        padding: 10,
        cornerRadius: 10,
        callbacks: { label: (ctx) => ` ${ctx.label}: ₹${ctx.parsed.toLocaleString("en-IN")}` },
      },
    },
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Header — Emerald Gradient */}
      <div className="bg-linear-to-br from-success-500 via-success to-teal-700 rounded-2xl p-5 mb-5 card-shadow relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-[-30%] right-[-10%] w-62.5 h-62.5 rounded-full bg-white/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-50 h-50 rounded-full bg-teal-300/[0.1] blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-white mb-1">
              {getGreeting()}, {member?.name || user?.name || "Member"}
            </h2>
            <p className="text-[13px] text-success-100/80 leading-relaxed">
              {member
                ? `Member ID: ${member.id} · KYC: ${member.kyc} · Since ${member.joinDate}`
                : `${user?.email || ""} · Complete your profile to get started`}
            </p>
            {member && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full ${
                    member.risk === "Low"
                      ? "bg-white/15 text-success-100 border border-white/20"
                      : member.risk === "Medium"
                      ? "bg-warning-500/20 text-warning-200 border border-warning-400/30"
                      : "bg-danger-500/20 text-danger-200 border border-danger-400/30"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    member.risk === "Low" ? "bg-success-200" : member.risk === "Medium" ? "bg-warning-300" : "bg-danger-300"
                  }`} />
                  {member.risk} Risk
                </span>
              </div>
            )}
          </div>
          {member && (
            <div className="flex items-center gap-3">
              {/* Trust Score Circular Indicator */}
              <div className="relative w-18 h-18 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#fff ${stiDeg}deg, rgba(255,255,255,0.15) ${stiDeg}deg)`,
                  }}
                />
                <div className="absolute inset-1.25 rounded-full bg-success-700/80 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold font-mono text-white leading-none">{stiScore}</span>
                  <span className="text-[8px] text-success-100 uppercase tracking-wider mt-0.5">Trust</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Banner for fresh members */}
      {isFresh && (
        <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-success-200/60">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-success-50 border border-success-200/60 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-heading mb-3">Get Started with Glimmora Nidhi</div>
              {/* Step-based progress */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {[
                  { step: 1, label: "Complete KYC", done: kycDone },
                  { step: 2, label: "Join a Chit Fund", done: hasChitFund },
                  { step: 3, label: "Start Saving", done: hasSavings },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      s.done
                        ? "bg-success-100 text-success border border-success-200"
                        : "bg-slate-100 text-heading border border-slate-200"
                    }`}>
                      {s.done ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        s.step
                      )}
                    </div>
                    <span className={`text-[12px] font-medium ${s.done ? "text-success" : "text-slate-500"}`}>
                      {s.label}
                    </span>
                    {i < 2 && (
                      <span className="hidden sm:inline text-subtle text-[12px] mx-1">&rarr;</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onNavigate?.("my_chitfunds")} className="px-4 py-2 bg-primary-50 border border-primary-200 text-primary text-[12px] font-semibold rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all duration-150 cursor-pointer">
                  Browse Chit Funds
                </button>
                <button onClick={() => onNavigate?.("my_deposits")} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[12px] font-semibold rounded-xl hover:border-slate-300 hover:text-body transition-all duration-150 cursor-pointer">
                  Open a Deposit
                </button>
                <button onClick={() => onNavigate?.("my_loans")} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[12px] font-semibold rounded-xl hover:border-slate-300 hover:text-body transition-all duration-150 cursor-pointer">
                  Apply for a Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
        {/* Total Deposits */}
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-success-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Deposits</div>
            <div className="text-[20px] font-bold font-mono text-success">{member?.deposits || "₹0"}</div>
            <div className="text-[11px] text-heading mt-1">{myDeposits.length > 0 ? `${myDeposits.length} account(s)` : "No deposits yet"}</div>
          </div>
        </div>
        {/* Active Loans */}
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-primary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Active Loans</div>
            <div className="text-[20px] font-bold font-mono text-primary">{member?.loans || "₹0"}</div>
            <div className="text-[11px] text-heading mt-1">{myLoans.length > 0 ? `${activeLoans.length} active, ${pendingLoans.length} pending` : "No loans yet"}</div>
          </div>
        </div>
        {/* Active Funds */}
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-secondary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Active Funds</div>
            <div className="text-[20px] font-bold font-mono text-secondary">{enrolledSchemes.length}</div>
            <div className="text-[11px] text-heading mt-1">{enrolledSchemes.length > 0 ? `${enrolledSchemes.length} enrolled` : "No enrollments yet"}</div>
          </div>
        </div>
        {/* Trust Score */}
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-warning-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Trust Score</div>
            <div className={`text-[20px] font-bold font-mono ${!member ? "text-heading" : member.sti >= 80 ? "text-success" : member.sti >= 60 ? "text-warning" : "text-danger-500"}`}>
              {member ? `${member.sti}/100` : "—"}
            </div>
            <div className="text-[11px] text-heading mt-1">{!member ? "Complete KYC" : member.sti >= 80 ? "Excellent" : member.sti >= 60 ? "Good" : "Needs Improvement"}</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Monthly Savings Trend — Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-heading">Monthly Savings Trend</h3>
              <p className="text-[11px] text-heading mt-0.5">Deposits vs EMI paid over last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-[10px] text-heading">Deposits</span>
              <div className="w-2 h-2 rounded-full bg-primary-500 ml-2" />
              <span className="text-[10px] text-heading">EMI</span>
            </div>
          </div>
          <div className="h-52">
            <Line data={savingsTrendData} options={savingsTrendOptions} />
          </div>
        </div>

        {/* Portfolio Breakdown — Doughnut */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-heading mb-1">Portfolio Breakdown</h3>
          <p className="text-[11px] text-heading mb-4">Your financial distribution</p>
          <div className="h-48 flex items-center justify-center">
            <Doughnut data={portfolioData} options={portfolioOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Deposits", value: member?.deposits || "₹0", color: "bg-success-500" },
              { label: "Loans", value: member?.loans || "₹0", color: "bg-primary-500" },
              { label: "Chit Funds", value: `${enrolledSchemes.length}`, color: "bg-secondary-500" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-[10px] text-heading uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="text-[13px] font-bold font-mono text-body">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <SectionCard title="Quick Actions" className="mb-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <QuickAction icon="💰" label="My Deposits" onClick={() => onNavigate?.("my_deposits")} color="emerald" />
          <QuickAction icon="🏦" label="My Loans" onClick={() => onNavigate?.("my_loans")} color="indigo" />
          <QuickAction icon="🔄" label="Chit Funds" onClick={() => onNavigate?.("my_chitfunds")} color="purple" />
          <QuickAction icon="📋" label="Payments" onClick={() => onNavigate?.("my_payments")} color="blue" />
          <QuickAction icon="📝" label="Apply Loan" onClick={() => onNavigate?.("my_loans")} color="amber" />
          <QuickAction icon="👤" label="Profile" onClick={() => onNavigate?.("profile")} color="slate" />
        </div>
      </SectionCard>

      {/* My Chit Funds Section */}
      <SectionCard className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-heading">My Chit Funds</h3>
          <button onClick={() => onNavigate?.("my_chitfunds")} className="text-[12px] text-primary font-semibold hover:text-primary-700 cursor-pointer">
            {enrolledSchemes.length > 0 ? "View All →" : "Browse Schemes →"}
          </button>
        </div>

        {enrolledSchemes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-body">No Active Chit Funds</p>
            <p className="text-[12px] text-heading mt-1 max-w-sm mx-auto">Enroll in a chit fund scheme to start saving with monthly contributions</p>
            <button onClick={() => onNavigate?.("my_chitfunds")} className="mt-3 px-4 py-2 bg-primary-50 border border-primary-200 text-primary text-[12px] font-semibold rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all duration-150 cursor-pointer">
              Browse Chit Fund Schemes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {enrolledSchemes.map((scheme, idx) => {
              const currentMonth = scheme.currentMonth || 0;
              const totalMonths = parseInt(scheme.duration) || 0;
              const rotationPct = totalMonths > 0 ? (currentMonth / totalMonths) * 100 : 0;
              const payoutStatus = getPayoutStatus(scheme.id);
              const accent = schemeAccentColors[idx % schemeAccentColors.length];

              return (
                <div key={scheme.id} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100 hover:shadow-md transition-all duration-300 flex">
                  {/* Accent bar */}
                  <div className="w-1 shrink-0 rounded-l-2xl" style={{ background: accent }} />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-[14px] font-bold text-heading leading-tight">{scheme.name}</div>
                        <div className="text-[11px] text-heading font-mono mt-0.5">{scheme.id} · Month {currentMonth}/{totalMonths}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        payoutStatus.color === "emerald"
                          ? "bg-success-50 text-success border-success-200/60"
                          : payoutStatus.color === "amber"
                          ? "bg-warning-50 text-warning border-warning-200/60"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        Payout: {payoutStatus.label}
                      </span>
                    </div>
                    {/* Progress */}
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-heading uppercase tracking-wider">Rotation Progress</span>
                      <span className="text-[10px] text-slate-500 font-mono">{rotationPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rotationPct}%`, background: accent }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-[10px] text-heading uppercase tracking-wider">Monthly</div>
                          <div className="text-[13px] font-bold font-mono" style={{ color: accent }}>{scheme.monthlyAmount}</div>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div>
                          <div className="text-[10px] text-heading uppercase tracking-wider">Pot Size</div>
                          <div className="text-[13px] font-bold font-mono text-success">{scheme.potSize}</div>
                        </div>
                      </div>
                      <StatusBadge status="Active" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Upcoming Payments */}
        <SectionCard title="Upcoming Payments">
          {activeLoans.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeLoans.map((loan) => (
                <div key={loan.id} onClick={() => onNavigate?.("my_loans")} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-primary-50/50 hover:border-primary-200 transition-all duration-150">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-400 border-2 border-primary-100" />
                    <div className="w-px h-full bg-primary-100 mt-1" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-body">{loan.purpose}</p>
                      <p className="text-[11px] text-heading mt-0.5">EMI: <span className="font-mono">{loan.emi}</span> · Next: {loan.nextEmi}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={loan.status} />
                      <svg className="w-4 h-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-body">No upcoming payments</p>
              <p className="text-[11px] text-heading mt-1">Your payment schedule will appear here</p>
            </div>
          )}
        </SectionCard>

        {/* My Deposits */}
        <SectionCard title="My Deposits">
          {myDeposits.length > 0 ? (
            <div className="flex flex-col gap-3">
              {myDeposits.map((dep) => (
                <div key={dep.id} onClick={() => onNavigate?.("my_deposits")} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-success-50/50 hover:border-success-200 transition-all duration-150">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-success-400 border-2 border-success-100" />
                    <div className="w-px h-full bg-success-100 mt-1" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-body">{dep.type}</p>
                      <p className="text-[11px] text-heading mt-0.5"><span className="font-mono">{dep.amount}</span> @ {dep.rate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={dep.status} />
                      <svg className="w-4 h-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-xl bg-success-50 border border-success-200/60 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-body">No deposits yet</p>
              <p className="text-[11px] text-heading mt-1">Start with a Fixed or Recurring Deposit</p>
              <button onClick={() => onNavigate?.("my_deposits")} className="mt-3 px-4 py-2 bg-primary-50 border border-primary-200 text-primary text-[12px] font-semibold rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all duration-150 cursor-pointer">
                Explore Deposits
              </button>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Available Chit Schemes */}
      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-heading">Available Chit Schemes</h3>
          <button onClick={() => onNavigate?.("my_chitfunds")} className="text-[12px] text-primary font-semibold hover:text-primary-700 cursor-pointer">View All →</button>
        </div>
        {availableChits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableChits.map((scheme) => {
              const fillPct = (scheme.enrolledMembers / scheme.totalMembers) * 100;
              return (
                <div key={scheme.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[13px] font-bold text-heading">{scheme.name}</div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200/60">
                      {scheme.totalMembers - scheme.enrolledMembers} spots
                    </span>
                  </div>
                  <p className="text-[11px] text-heading mb-3 line-clamp-2">{scheme.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] text-heading uppercase tracking-wider">Monthly</div>
                      <div className="text-[13px] font-bold text-primary font-mono">{scheme.monthlyAmount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-heading uppercase tracking-wider">Pot Size</div>
                      <div className="text-[13px] font-bold text-success font-mono">{scheme.potSize}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-heading">{scheme.enrolledMembers}/{scheme.totalMembers} members</span>
                      <span className="text-[11px] text-heading font-mono">{fillPct.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={scheme.enrolledMembers} max={scheme.totalMembers} color={PRIMARY} />
                  </div>
                  <button
                    onClick={() => onNavigate?.("my_chitfunds")}
                    className="w-full py-2 bg-primary-50 border border-primary-200 text-primary text-[12px] font-semibold rounded-xl hover:bg-primary-100 hover:border-primary-300 transition-all duration-150 cursor-pointer"
                  >
                    Enroll Now
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-heading text-center py-6">You've enrolled in all available schemes!</p>
        )}
      </SectionCard>
    </div>
  );
}
