"use client";

import { useState } from "react";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule", label: "Payment Schedule" },
  { id: "overdue", label: "Overdue Loans" },
  { id: "workflow", label: "Collections Workflow" },
  { id: "recovery", label: "Recovery Cases" },
  { id: "analytics", label: "Collections Analytics" },
];

// --- Inline Data ---

const collectionsDashboard = {
  totalDue: "₹18,45,000",
  collectedThisMonth: "₹12,30,500",
  collectionRate: "91.4%",
  overdueAmount: "₹5,62,800",
  recoveryRate: "78.2%",
  activeCases: 34,
  monthlyTrend: [
    { month: "Oct", due: 1520000, collected: 1380000, overdue: 140000 },
    { month: "Nov", due: 1610000, collected: 1490000, overdue: 120000 },
    { month: "Dec", due: 1750000, collected: 1540000, overdue: 210000 },
    { month: "Jan", due: 1680000, collected: 1560000, overdue: 120000 },
    { month: "Feb", due: 1820000, collected: 1710000, overdue: 110000 },
    { month: "Mar", due: 1845000, collected: 1230500, overdue: 562800 },
  ],
  topDefaulters: [
    { name: "Ramesh Gupta", id: "M-1042", outstanding: "₹1,25,000", daysOverdue: 112, scheme: "Gold Chit 50L" },
    { name: "Priya Nair", id: "M-1078", outstanding: "₹98,500", daysOverdue: 87, scheme: "Personal Loan" },
    { name: "Suresh Yadav", id: "M-1015", outstanding: "₹76,200", daysOverdue: 65, scheme: "Silver Chit 25L" },
    { name: "Kavita Sharma", id: "M-1091", outstanding: "₹54,800", daysOverdue: 45, scheme: "Vehicle Loan" },
  ],
};

const paymentSchedule = [
  { id: "PAY-3001", member: "Anitha Reddy", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "15 Mar 2026", status: "Paid" },
  { id: "PAY-3002", member: "Vikram Singh", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "15 Mar 2026", status: "Pending" },
  { id: "PAY-3003", member: "Deepa Menon", scheme: "Personal Loan", amountDue: "₹8,750", dueDate: "10 Mar 2026", status: "Paid" },
  { id: "PAY-3004", member: "Ramesh Gupta", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "05 Mar 2026", status: "Overdue" },
  { id: "PAY-3005", member: "Sunita Devi", scheme: "Diamond Chit 1Cr", amountDue: "₹50,000", dueDate: "15 Mar 2026", status: "Partial" },
  { id: "PAY-3006", member: "Arun Kumar", scheme: "Vehicle Loan", amountDue: "₹15,200", dueDate: "12 Mar 2026", status: "Paid" },
  { id: "PAY-3007", member: "Priya Nair", scheme: "Personal Loan", amountDue: "₹9,800", dueDate: "01 Mar 2026", status: "Overdue" },
  { id: "PAY-3008", member: "Manoj Tiwari", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "15 Mar 2026", status: "Pending" },
  { id: "PAY-3009", member: "Lakshmi Iyer", scheme: "Gold Chit 50L", amountDue: "₹25,000", dueDate: "15 Mar 2026", status: "Paid" },
  { id: "PAY-3010", member: "Suresh Yadav", scheme: "Silver Chit 25L", amountDue: "₹12,500", dueDate: "28 Feb 2026", status: "Overdue" },
  { id: "PAY-3011", member: "Kavita Sharma", scheme: "Vehicle Loan", amountDue: "₹15,200", dueDate: "10 Mar 2026", status: "Partial" },
  { id: "PAY-3012", member: "Rajesh Pillai", scheme: "Diamond Chit 1Cr", amountDue: "₹50,000", dueDate: "15 Mar 2026", status: "Pending" },
];

const overdueLoans = [
  { id: "OD-501", member: "Ramesh Gupta", memberId: "M-1042", loanType: "Chit Fund Loan", outstanding: "₹1,25,000", totalLoan: "₹3,00,000", daysOverdue: 112, lastPayment: "18 Nov 2025", emiAmount: "₹25,000", collateral: "Fixed Deposit", contactPhone: "+91 98765 43210" },
  { id: "OD-502", member: "Priya Nair", memberId: "M-1078", loanType: "Personal Loan", outstanding: "₹98,500", totalLoan: "₹2,00,000", daysOverdue: 87, lastPayment: "14 Dec 2025", emiAmount: "₹9,800", collateral: "None", contactPhone: "+91 87654 32109" },
  { id: "OD-503", member: "Suresh Yadav", memberId: "M-1015", loanType: "Chit Fund Loan", outstanding: "₹76,200", totalLoan: "₹1,50,000", daysOverdue: 65, lastPayment: "05 Jan 2026", emiAmount: "₹12,500", collateral: "Gold Jewellery", contactPhone: "+91 76543 21098" },
  { id: "OD-504", member: "Kavita Sharma", memberId: "M-1091", loanType: "Vehicle Loan", outstanding: "₹54,800", totalLoan: "₹4,50,000", daysOverdue: 45, lastPayment: "25 Jan 2026", emiAmount: "₹15,200", collateral: "Vehicle RC", contactPhone: "+91 65432 10987" },
  { id: "OD-505", member: "Dinesh Patel", memberId: "M-1034", loanType: "Personal Loan", outstanding: "₹42,300", totalLoan: "₹1,00,000", daysOverdue: 32, lastPayment: "07 Feb 2026", emiAmount: "₹8,750", collateral: "None", contactPhone: "+91 54321 09876" },
  { id: "OD-506", member: "Meena Kumari", memberId: "M-1056", loanType: "Chit Fund Loan", outstanding: "₹1,10,000", totalLoan: "₹2,50,000", daysOverdue: 95, lastPayment: "06 Dec 2025", emiAmount: "₹20,000", collateral: "Property Docs", contactPhone: "+91 43210 98765" },
];

const collectionsWorkflow = {
  stages: [
    {
      name: "Notice Sent",
      count: 12,
      color: "#6366F1",
      cases: [
        { id: "WF-101", member: "Manoj Tiwari", amount: "₹12,500", daysOverdue: 8, action: "SMS + Email reminder sent on 08 Mar 2026" },
        { id: "WF-102", member: "Rajesh Pillai", amount: "₹50,000", daysOverdue: 5, action: "First notice dispatched on 10 Mar 2026" },
        { id: "WF-103", member: "Sunita Devi", amount: "₹25,000", daysOverdue: 12, action: "Second reminder sent on 06 Mar 2026" },
      ],
    },
    {
      name: "Follow-up Call",
      count: 8,
      color: "#F59E0B",
      cases: [
        { id: "WF-201", member: "Dinesh Patel", amount: "₹8,750", daysOverdue: 32, action: "Called on 09 Mar — promised payment by 15 Mar" },
        { id: "WF-202", member: "Kavita Sharma", amount: "₹15,200", daysOverdue: 45, action: "Called on 07 Mar — no response, rescheduled" },
      ],
    },
    {
      name: "Field Visit",
      count: 5,
      color: "#EF4444",
      cases: [
        { id: "WF-301", member: "Suresh Yadav", amount: "₹12,500", daysOverdue: 65, action: "Field agent Ravi Kumar visited on 05 Mar — partial commitment" },
        { id: "WF-302", member: "Priya Nair", amount: "₹9,800", daysOverdue: 87, action: "Scheduled visit for 12 Mar — agent Meena assigned" },
      ],
    },
    {
      name: "Legal Notice",
      count: 3,
      color: "#DC2626",
      cases: [
        { id: "WF-401", member: "Ramesh Gupta", amount: "₹25,000", daysOverdue: 112, action: "Legal notice issued via registered post on 01 Mar 2026" },
        { id: "WF-402", member: "Meena Kumari", amount: "₹20,000", daysOverdue: 95, action: "Legal notice drafted, pending dispatch" },
      ],
    },
    {
      name: "Recovery",
      count: 2,
      color: "#7C3AED",
      cases: [
        { id: "WF-501", member: "Ramesh Gupta", amount: "₹1,25,000", daysOverdue: 112, action: "Recovery proceedings initiated — collateral FD marked for lien" },
      ],
    },
  ],
};

const recoveryCases = [
  { id: "RC-001", member: "Ramesh Gupta", type: "Chit Fund Loan", outstanding: "₹1,25,000", stage: "Legal", assignedAgent: "Adv. Sunil Mehta", lastAction: "Legal notice served — 01 Mar 2026", status: "Active" },
  { id: "RC-002", member: "Priya Nair", type: "Personal Loan", outstanding: "₹98,500", stage: "Field Visit", assignedAgent: "Meena Krishnan", lastAction: "Visit scheduled — 12 Mar 2026", status: "Active" },
  { id: "RC-003", member: "Suresh Yadav", type: "Chit Fund Loan", outstanding: "₹76,200", stage: "Follow-up", assignedAgent: "Ravi Kumar", lastAction: "Partial payment received — 05 Mar 2026", status: "Active" },
  { id: "RC-004", member: "Meena Kumari", type: "Chit Fund Loan", outstanding: "₹1,10,000", stage: "Legal", assignedAgent: "Adv. Sunil Mehta", lastAction: "Legal notice pending dispatch", status: "Active" },
  { id: "RC-005", member: "Kavita Sharma", type: "Vehicle Loan", outstanding: "₹54,800", stage: "Follow-up", assignedAgent: "Ravi Kumar", lastAction: "Call follow-up — 07 Mar 2026", status: "Active" },
  { id: "RC-006", member: "Dinesh Patel", type: "Personal Loan", outstanding: "₹42,300", stage: "Notice Sent", assignedAgent: "Meena Krishnan", lastAction: "First notice sent — 08 Mar 2026", status: "Active" },
  { id: "RC-007", member: "Gopal Verma", type: "Chit Fund Loan", outstanding: "₹0", stage: "Settled", assignedAgent: "Ravi Kumar", lastAction: "Full settlement received — 20 Feb 2026", status: "Settled" },
  { id: "RC-008", member: "Bhavana Joshi", type: "Personal Loan", outstanding: "₹35,000", stage: "Written Off", assignedAgent: "Adv. Sunil Mehta", lastAction: "Board approved write-off — 28 Feb 2026", status: "Written Off" },
];

const collectionsAnalytics = {
  efficiencyTrend: [
    { month: "Oct", efficiency: 90.8, target: 92 },
    { month: "Nov", efficiency: 92.5, target: 92 },
    { month: "Dec", efficiency: 88.0, target: 92 },
    { month: "Jan", efficiency: 92.9, target: 92 },
    { month: "Feb", efficiency: 93.9, target: 92 },
    { month: "Mar", efficiency: 91.4, target: 92 },
  ],
  recoveryByCategory: [
    { category: "Chit Fund Loans", total: "₹8,50,000", recovered: "₹6,20,000", rate: "72.9%" },
    { category: "Personal Loans", total: "₹4,25,000", recovered: "₹3,50,000", rate: "82.4%" },
    { category: "Vehicle Loans", total: "₹3,20,000", recovered: "₹2,85,000", rate: "89.1%" },
    { category: "Gold Loans", total: "₹2,50,000", recovered: "₹2,40,000", rate: "96.0%" },
  ],
  agentPerformance: [
    { name: "Ravi Kumar", role: "Field Agent", casesHandled: 18, resolved: 14, efficiency: "77.8%", avgResolution: "22 days" },
    { name: "Meena Krishnan", role: "Field Agent", casesHandled: 15, resolved: 12, efficiency: "80.0%", avgResolution: "19 days" },
    { name: "Adv. Sunil Mehta", role: "Legal Counsel", casesHandled: 8, resolved: 5, efficiency: "62.5%", avgResolution: "45 days" },
    { name: "Pooja Desai", role: "Tele-caller", casesHandled: 32, resolved: 28, efficiency: "87.5%", avgResolution: "8 days" },
  ],
};

// --- Badge Components ---

function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Pending: "bg-blue-50 text-blue-600 border-blue-200/60",
    Overdue: "bg-red-50 text-red-500 border-red-200/60",
    Partial: "bg-amber-50 text-amber-600 border-amber-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function RecoveryStatusBadge({ status }) {
  const styles = {
    Active: "bg-blue-50 text-blue-600 border-blue-200/60",
    Settled: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Legal: "bg-red-50 text-red-500 border-red-200/60",
    "Written Off": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

// --- Tab Components ---

function DashboardTab() {
  const metrics = [
    { label: "Total Due", value: collectionsDashboard.totalDue, color: "#6B8ABF" },
    { label: "Collected This Month", value: collectionsDashboard.collectedThisMonth, color: "#059669" },
    { label: "Collection Rate", value: collectionsDashboard.collectionRate, color: "#10B981" },
    { label: "Overdue Amount", value: collectionsDashboard.overdueAmount, color: "#DC2626" },
    { label: "Recovery Rate", value: collectionsDashboard.recoveryRate, color: "#C49A4C" },
    { label: "Active Cases", value: collectionsDashboard.activeCases, color: "#9585B5" },
  ];

  const maxVal = 2000000;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly Collection Trend */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Monthly Collection Trend</h3>
        <div className="flex items-end gap-3 h-44">
          {collectionsDashboard.monthlyTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.due / maxVal) * 100}%`, background: "linear-gradient(to top, #6366F1, #818CF8)" }} title={`Due: ₹${(d.due / 100000).toFixed(1)}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.collected / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} title={`Collected: ₹${(d.collected / 100000).toFixed(1)}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.overdue / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`Overdue: ₹${(d.overdue / 100000).toFixed(1)}L`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #6366F1, #818CF8)" }} /><span className="text-[11px] text-slate-500">Total Due</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Collected</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Overdue</span></div>
        </div>
      </div>

      {/* Top Defaulters */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Top Defaulters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collectionsDashboard.topDefaulters.map((d) => (
            <div key={d.id} className="flex items-start gap-3 bg-red-50/50 rounded-xl p-4 border border-red-100/60">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.id} &middot; {d.scheme}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${d.daysOverdue >= 90 ? "bg-red-50 text-red-500 border-red-200/60" : d.daysOverdue >= 60 ? "bg-orange-50 text-orange-600 border-orange-200/60" : "bg-amber-50 text-amber-600 border-amber-200/60"}`}>
                    {d.daysOverdue}d overdue
                  </span>
                </div>
                <div className="text-[14px] font-bold text-red-500 font-mono mt-1">{d.outstanding}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = paymentSchedule.filter((p) => filterStatus === "All" || p.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 tab-scroll">
        {["All", "Paid", "Pending", "Overdue", "Partial"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterStatus === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Scheme</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount Due</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Due Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{p.id}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{p.member}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{p.scheme}</span>
                </td>
                <td className="px-5 py-3 text-[13px] font-mono font-semibold text-slate-700">{p.amountDue}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{p.dueDate}</td>
                <td className="px-5 py-3"><PaymentStatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {paymentSchedule.length} payments
        </div>
      </div>
    </div>
  );
}

function OverdueTab() {
  const getSeverityColor = (days) => {
    if (days >= 90) return { bg: "bg-red-50/50", border: "border-red-100/60", text: "text-red-500", label: "Critical" };
    if (days >= 60) return { bg: "bg-orange-50/50", border: "border-orange-100/60", text: "text-orange-600", label: "High" };
    if (days >= 30) return { bg: "bg-amber-50/50", border: "border-amber-100/60", text: "text-amber-600", label: "Medium" };
    return { bg: "bg-blue-50/50", border: "border-blue-100/60", text: "text-blue-600", label: "Low" };
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Overdue Loan Tracker</h3>
            <p className="text-[13px] text-slate-400">Monitor all overdue loans with severity-based prioritisation for collection action.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="bg-red-50 rounded-xl px-3 py-2 text-center border border-red-200/60">
              <div className="text-lg font-bold text-red-500 font-mono">{overdueLoans.filter((l) => l.daysOverdue >= 90).length}</div>
              <div className="text-slate-400 text-[10px]">90+ Days</div>
            </div>
            <div className="bg-orange-50 rounded-xl px-3 py-2 text-center border border-orange-200/60">
              <div className="text-lg font-bold text-orange-600 font-mono">{overdueLoans.filter((l) => l.daysOverdue >= 60 && l.daysOverdue < 90).length}</div>
              <div className="text-slate-400 text-[10px]">60–90 Days</div>
            </div>
            <div className="bg-amber-50 rounded-xl px-3 py-2 text-center border border-amber-200/60">
              <div className="text-lg font-bold text-amber-600 font-mono">{overdueLoans.filter((l) => l.daysOverdue < 60).length}</div>
              <div className="text-slate-400 text-[10px]">&lt;60 Days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {overdueLoans.sort((a, b) => b.daysOverdue - a.daysOverdue).map((loan) => {
          const severity = getSeverityColor(loan.daysOverdue);
          return (
            <div key={loan.id} className={`bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${severity.bg} ${severity.border} border flex items-center justify-center ${severity.text} font-bold text-sm flex-shrink-0`}>
                    {loan.member.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-slate-900">{loan.member}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${severity.bg} ${severity.text} ${severity.border}`}>
                        {severity.label} — {loan.daysOverdue}d overdue
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{loan.memberId} &middot; {loan.id} &middot; {loan.loanType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Outstanding</div>
                  <div className="text-[18px] font-bold text-red-500 font-mono">{loan.outstanding}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Loan</div>
                  <div className="text-[13px] font-semibold text-slate-700 font-mono">{loan.totalLoan}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">EMI Amount</div>
                  <div className="text-[13px] font-semibold text-slate-700 font-mono">{loan.emiAmount}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Payment</div>
                  <div className="text-[13px] font-semibold text-slate-700">{loan.lastPayment}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Collateral</div>
                  <div className="text-[13px] font-semibold text-slate-700">{loan.collateral}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Collections Workflow Pipeline</h3>
        <p className="text-[13px] text-slate-400">Track cases through each stage of the collections process — from initial notice to recovery action.</p>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {collectionsWorkflow.stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className="bg-white rounded-2xl px-4 py-3 card-shadow border border-slate-100 text-center min-w-[140px]">
              <div className="text-[20px] font-bold font-mono" style={{ color: stage.color }}>{stage.count}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{stage.name}</div>
            </div>
            {i < collectionsWorkflow.stages.length - 1 && (
              <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Stage Details */}
      <div className="flex flex-col gap-4">
        {collectionsWorkflow.stages.map((stage) => (
          <div key={stage.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: stage.color }} />
              <h3 className="text-[15px] font-bold text-slate-900">{stage.name}</h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">{stage.count} cases</span>
            </div>
            <div className="flex flex-col gap-3">
              {stage.cases.map((c) => (
                <div key={c.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold" style={{ background: stage.color }}>
                    {c.member.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-700">{c.member}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.id} &middot; {c.daysOverdue}d overdue</div>
                      </div>
                      <div className="text-[14px] font-bold font-mono text-slate-700">{c.amount}</div>
                    </div>
                    <div className="text-[12px] text-slate-500 mt-2 bg-white rounded-lg px-3 py-2 border border-slate-100">
                      {c.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecoveryTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = recoveryCases.filter((r) => filterStatus === "All" || r.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 tab-scroll">
        {["All", "Active", "Settled", "Legal", "Written Off"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterStatus === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Outstanding</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Recovery Stage</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Assigned Agent</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Action</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{r.id}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{r.member}</td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r.type}</span>
                </td>
                <td className="px-5 py-3 text-[13px] font-mono font-semibold text-red-500">{r.outstanding}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    r.stage === "Legal" ? "bg-red-50 text-red-500 border-red-200/60"
                    : r.stage === "Field Visit" ? "bg-orange-50 text-orange-600 border-orange-200/60"
                    : r.stage === "Follow-up" ? "bg-amber-50 text-amber-600 border-amber-200/60"
                    : r.stage === "Notice Sent" ? "bg-blue-50 text-blue-600 border-blue-200/60"
                    : r.stage === "Settled" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                    : r.stage === "Written Off" ? "bg-slate-100 text-slate-500 border-slate-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    {r.stage}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-600">{r.assignedAgent}</td>
                <td className="px-5 py-3 text-[11px] text-slate-400 max-w-[200px]">{r.lastAction}</td>
                <td className="px-5 py-3"><RecoveryStatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {recoveryCases.length} recovery cases
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const maxEfficiency = 100;

  return (
    <div className="animate-fade-in">
      {/* Collection Efficiency Over Time */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Collection Efficiency Over Time</h3>
        <div className="flex items-end gap-3 h-44">
          {collectionsAnalytics.efficiencyTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.efficiency / maxEfficiency) * 100}%`, background: d.efficiency >= d.target ? "linear-gradient(to top, #059669, #10B981)" : "linear-gradient(to top, #DC2626, #F87171)" }} title={`Efficiency: ${d.efficiency}%`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.target / maxEfficiency) * 100}%`, background: "linear-gradient(to top, #94A3B8, #CBD5E1)" }} title={`Target: ${d.target}%`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Actual (Met Target)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Actual (Below Target)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #94A3B8, #CBD5E1)" }} /><span className="text-[11px] text-slate-500">Target</span></div>
        </div>
      </div>

      {/* Recovery by Category */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recovery by Category</h3>
        <div className="flex flex-col gap-3">
          {collectionsAnalytics.recoveryByCategory.map((cat) => {
            const rateNum = parseFloat(cat.rate);
            return (
              <div key={cat.category} className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Total: <strong className="text-slate-600 font-mono">{cat.total}</strong></span>
                    <span className="text-[11px] text-slate-400">Recovered: <strong className="text-emerald-600 font-mono">{cat.recovered}</strong></span>
                    <span className={`text-[13px] font-bold font-mono ${rateNum >= 90 ? "text-emerald-600" : rateNum >= 75 ? "text-amber-600" : "text-red-500"}`}>{cat.rate}</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: cat.rate, background: rateNum >= 90 ? "#059669" : rateNum >= 75 ? "#D97706" : "#DC2626" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Agent Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectionsAnalytics.agentPerformance.map((agent) => {
            const effNum = parseFloat(agent.efficiency);
            return (
              <div key={agent.name} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{agent.name}</div>
                    <div className="text-[11px] text-slate-400">{agent.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cases</div>
                    <div className="text-[14px] font-bold font-mono text-slate-700">{agent.casesHandled}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Resolved</div>
                    <div className="text-[14px] font-bold font-mono text-emerald-600">{agent.resolved}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Efficiency</div>
                    <div className={`text-[14px] font-bold font-mono ${effNum >= 80 ? "text-emerald-600" : effNum >= 65 ? "text-amber-600" : "text-red-500"}`}>{agent.efficiency}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Resolution</div>
                    <div className="text-[14px] font-bold font-mono text-slate-700">{agent.avgResolution}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Main Export ---

export default function CollectionsView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "schedule": return <ScheduleTab />;
      case "overdue": return <OverdueTab />;
      case "workflow": return <WorkflowTab />;
      case "recovery": return <RecoveryTab />;
      case "analytics": return <AnalyticsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Collections Management</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              End-to-end collections tracking for chit fund subscriptions and loan repayments.
              Monitor payment schedules, manage overdue accounts, and track recovery workflows
              across all member obligations.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px]">
            <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center border border-emerald-200/60">
              <div className="text-lg font-bold text-emerald-600 font-mono">{collectionsDashboard.collectionRate}</div>
              <div className="text-slate-400 text-[10px]">Collection Rate</div>
            </div>
            <div className="bg-red-50 rounded-xl px-3 py-2 text-center border border-red-200/60">
              <div className="text-lg font-bold text-red-500 font-mono">{collectionsDashboard.activeCases}</div>
              <div className="text-slate-400 text-[10px]">Active Cases</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${activeTab === t.id ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
