"use client";

import { useAuth } from "@/context/AuthContext";
import { useMember, useChitSchemes, useMemberLoans, useMemberDeposits, useMemberEnrollments, useMemberPayments } from "@/hooks/useData";
import { useRouter } from "next/navigation";
import useNavigation from "@/hooks/useNavigation";
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

// Build savings trend data from payments
function buildSavingsTrendData(payments) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const labels = [];
  const depositData = [];
  const emiData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(monthNames[d.getMonth()]);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthPayments = payments.filter((p) => (p.date || "").startsWith(monthStr));
    const depTotal = monthPayments.filter((p) => p.type === "Deposit" || p.type === "RD Installment").reduce((s, p) => s + (parseFloat(String(p.amount).replace(/[₹,]/g, "")) || 0), 0);
    const emiTotal = monthPayments.filter((p) => p.type === "EMI" || p.type === "EMI Payment").reduce((s, p) => s + (parseFloat(String(p.amount).replace(/[₹,]/g, "")) || 0), 0);
    depositData.push(depTotal);
    emiData.push(emiTotal);
  }

  return {
    labels,
    datasets: [
      { label: "Deposits", data: depositData, borderColor: SUCCESS, backgroundColor: "rgba(5, 150, 105, 0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: SUCCESS, pointBorderColor: "#fff", pointBorderWidth: 2, borderWidth: 2 },
      { label: "EMI Paid", data: emiData, borderColor: PRIMARY, backgroundColor: "rgba(99, 102, 241, 0.06)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: PRIMARY, pointBorderColor: "#fff", pointBorderWidth: 2, borderWidth: 2 },
    ],
  };
}

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

export default function MemberDashboard() {
  const { navigate: onNavigate } = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const memberId = user?.memberId;

  const { data: member } = useMember(memberId);
  const { data: chitSchemes = [] } = useChitSchemes();
  const { data: myLoans = [] } = useMemberLoans(memberId);
  const { data: myDeposits = [] } = useMemberDeposits(memberId);
  const { data: memberEnrollments = [] } = useMemberEnrollments(memberId);
  const { data: myPayments = [] } = useMemberPayments(memberId);

  const savingsTrendData = buildSavingsTrendData(myPayments);

  const enrolledIds = memberEnrollments.map(e => e.schemeId);
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

  // Helper: get enrollment status for a member in a scheme
  function getPayoutStatus(schemeId) {
    const enrollment = memberEnrollments.find(e => e.schemeId === schemeId);
    if (!enrollment) return { label: "Waiting", color: "slate" };
    if (enrollment.hasWonAuction) return { label: "Received", color: "emerald" };
    return { label: "Active", color: "slate" };
  }

  // Doughnut data for portfolio breakdown
  const depositTotal = myDeposits.length > 0 ? parseInt((member?.deposits || "₹0").replace(/[₹,]/g, "")) || 0 : 0;
  const loanTotal = myLoans.length > 0 ? parseInt((member?.loans || "₹0").replace(/[₹,]/g, "")) || 0 : 0;
  const chitTotal = enrolledSchemes.reduce((sum, s) => {
    const amt = parseInt((s.monthlyAmount || "₹0").replace(/[₹,]/g, "")) || 0;
    return sum + amt * (s.currentMonth || 1);
  }, 0);

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
      {/* Welcome Header — Scheme Card Style Gradient */}
      <div className="rounded-2xl p-6 mb-5 card-shadow relative overflow-hidden" style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 40%, #10b981 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute top-[-40%] right-[-15%] w-[300px] h-[300px] rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40%] left-[-10%] w-[200px] h-[200px] rounded-full bg-teal-300/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-[150px] h-full bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-success-100/60 uppercase tracking-widest font-semibold mb-1">Member Dashboard</p>
            <h2 className="text-[20px] font-bold text-white mb-1.5">
              {getGreeting()}, {member?.name || user?.name || "Member"}
            </h2>
            <p className="text-[13px] text-white/70 leading-relaxed">
              {member
                ? `Member ID: ${member.id} · KYC: ${member.kyc} · Since ${member.joinDate}`
                : "Welcome to Glimmora Nidhi! Explore chit funds, deposits & loans."}
            </p>
            {member && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full ${
                    member.risk === "Low"
                      ? "bg-white/15 text-white border border-white/20"
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

          {/* Trust Score Circle */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#fff ${stiDeg}deg, rgba(255,255,255,0.15) ${stiDeg}deg)`,
              }}
            />
            <div className="absolute inset-1.5 rounded-full flex flex-col items-center justify-center" style={{ background: "rgba(5, 150, 105, 0.85)" }}>
              <span className="text-[20px] font-bold font-mono text-white leading-none">{stiScore}</span>
              <span className="text-[7px] text-white/70 uppercase tracking-widest mt-0.5">STI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
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
                <div key={scheme.id} onClick={() => router.push(`/member/chit-funds/${scheme.id}`)} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100 hover:shadow-md transition-all duration-300 flex cursor-pointer">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
