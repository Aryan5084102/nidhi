"use client";

import { useState } from "react";
import { reportsList, reportAnalytics } from "@/data/mockData";

const tabs = [
  { id: "financial", label: "Financial Reports" },
  { id: "loans", label: "Loan Performance" },
  { id: "deposits", label: "Deposit Analytics" },
  { id: "members", label: "Member Growth" },
  { id: "risk", label: "Risk Analytics" },
  { id: "compliance", label: "Compliance Reports" },
  { id: "pdf", label: "PDF Reports" },
  { id: "csv", label: "CSV Exports" },
  { id: "board", label: "Board Reports" },
  { id: "kpis", label: "KPIs" },
];

function FinancialReportsTab() {
  return (
    <div className="animate-fade-in">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {reportAnalytics.keyMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono text-slate-900">{m.value}</div>
            <div className={`text-[11px] mt-1 font-medium ${m.change.startsWith("+") ? "text-emerald-500" : m.change.startsWith("-") ? "text-red-500" : "text-slate-400"}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Revenue Breakdown</h3>
          <div className="flex flex-col gap-3">
            {reportAnalytics.revenueBreakdown.map((r) => (
              <div key={r.source} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{r.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">₹{(r.amount / 100000).toFixed(1)}L</span>
                    <span className="text-[11px] text-slate-400 font-mono">{r.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: "linear-gradient(to right, #4F46E5, #6366F1, #818CF8)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* P&L Summary */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">P&L Summary — March 2026</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Total Income", value: "₹1.18 Cr", monthly: "₹98.3L avg/mo", color: "#059669", bg: "bg-emerald-50" },
              { label: "Interest Income", value: "₹72.4L", monthly: "₹60.3L avg/mo", color: "#0D9488", bg: "bg-teal-50" },
              { label: "Operating Expenses", value: "₹38.2L", monthly: "₹31.8L avg/mo", color: "#D97706", bg: "bg-amber-50" },
              { label: "Provisions & Write-offs", value: "₹4.8L", monthly: "₹4.0L avg/mo", color: "#DC2626", bg: "bg-red-50" },
              { label: "Net Profit", value: "₹38.4L", monthly: "₹32.0L avg/mo", color: "#4F46E5", bg: "bg-indigo-50" },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-xl p-3.5`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[12px] text-slate-500">{item.label}</div>
                    <div className="text-[18px] font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.monthly}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Sheet Highlights */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Balance Sheet Highlights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Assets", value: "₹52.8 Cr", sub: "Up 14.2% YoY", color: "#6B8ABF" },
            { label: "Total Liabilities", value: "₹41.6 Cr", sub: "Deposits + Borrowings", color: "#9585B5" },
            { label: "Net Worth", value: "₹11.2 Cr", sub: "Shareholders' Equity", color: "#5B9E8A" },
            { label: "Capital Adequacy", value: "18.4%", sub: "Above 15% threshold", color: "#C49A4C" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoanPerformanceTab() {
  const loanMetrics = [
    { label: "Total Disbursed", value: "₹28.6 Cr", change: "+18.3%" },
    { label: "NPA Rate", value: "2.1%", change: "-0.4%" },
    { label: "Recovery Rate", value: "96.8%", change: "+1.2%" },
    { label: "Avg Interest", value: "11.8%", change: "-0.2%" },
  ];

  const loanCategories = [
    { category: "Personal Loans", disbursed: "₹9.0 Cr", active: 1800, npa: "1.8%", recovery: "97.2%", avgTicket: "₹50,000", color: "#6366F1" },
    { category: "Business Loans", disbursed: "₹10.5 Cr", active: 1400, npa: "2.8%", recovery: "95.4%", avgTicket: "₹75,000", color: "#0D9488" },
    { category: "Gold Loans", disbursed: "₹5.2 Cr", active: 900, npa: "0.5%", recovery: "99.1%", avgTicket: "₹58,000", color: "#C9982E" },
    { category: "Education Loans", disbursed: "₹2.8 Cr", active: 650, npa: "3.2%", recovery: "94.8%", avgTicket: "₹43,000", color: "#7C3AED" },
    { category: "Emergency Loans", disbursed: "₹1.6 Cr", active: 350, npa: "4.1%", recovery: "93.5%", avgTicket: "₹46,000", color: "#DC2626" },
    { category: "Vehicle Loans", disbursed: "₹0.65 Cr", active: 100, npa: "2.4%", recovery: "96.0%", avgTicket: "₹65,000", color: "#059669" },
  ];

  const npaTrend = [
    { month: "Oct", npa: 2.8 },
    { month: "Nov", npa: 2.6 },
    { month: "Dec", npa: 2.5 },
    { month: "Jan", npa: 2.4 },
    { month: "Feb", npa: 2.3 },
    { month: "Mar", npa: 2.1 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {loanMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono text-slate-900">{m.value}</div>
            <div className={`text-[11px] mt-1 font-medium ${m.change.startsWith("+") ? "text-emerald-500" : m.change.startsWith("-") ? "text-red-500" : "text-slate-400"}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Loan Category Table */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Loan Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Category</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Disbursed</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Active</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">NPA</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Recovery</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Avg Ticket</th>
              </tr>
            </thead>
            <tbody>
              {loanCategories.map((l) => (
                <tr key={l.category} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                      <span className="text-[13px] font-semibold text-slate-700">{l.category}</span>
                    </div>
                  </td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.disbursed}</td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.active.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${parseFloat(l.npa) > 3 ? "bg-red-50 border-red-200 text-red-600" : parseFloat(l.npa) > 2 ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                      {l.npa}
                    </span>
                  </td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.recovery}</td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{l.avgTicket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* NPA Trend */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">NPA Trend (6 Months)</h3>
          <div className="flex items-end gap-3 h-40">
            {npaTrend.map((d) => {
              const maxVal = 4;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{d.npa}%</div>
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.npa / maxVal) * 100}%`, background: d.npa > 2.5 ? "linear-gradient(to top, #DC2626, #F87171)" : "linear-gradient(to top, #059669, #34D399)" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disbursement vs Recovery */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Disbursement vs Recovery</h3>
          <div className="flex items-end gap-3 h-40">
            {[
              { month: "Oct", disbursed: 420, recovered: 380 },
              { month: "Nov", disbursed: 480, recovered: 440 },
              { month: "Dec", disbursed: 510, recovered: 470 },
              { month: "Jan", disbursed: 460, recovered: 450 },
              { month: "Feb", disbursed: 530, recovered: 500 },
              { month: "Mar", disbursed: 560, recovered: 520 },
            ].map((d) => {
              const maxVal = 600;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.disbursed / maxVal) * 100}%`, background: "linear-gradient(to top, #4F46E5, #818CF8)" }} title={`Disbursed: ₹${d.disbursed}L`} />
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.recovered / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #34D399)" }} title={`Recovered: ₹${d.recovered}L`} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #4F46E5, #818CF8)" }} /><span className="text-[11px] text-slate-500">Disbursed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #34D399)" }} /><span className="text-[11px] text-slate-500">Recovered</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepositAnalyticsTab() {
  const depositMetrics = [
    { label: "Total Deposits", value: "₹39.5 Cr", change: "+6.1%" },
    { label: "FD Portfolio", value: "₹18.5 Cr", change: "+8.2%" },
    { label: "RD Portfolio", value: "₹8.2 Cr", change: "+5.4%" },
    { label: "Savings Deposits", value: "₹12.8 Cr", change: "+4.8%" },
  ];

  const depositGrowth = [
    { month: "Oct", fd: 320, rd: 180, savings: 420 },
    { month: "Nov", fd: 380, rd: 200, savings: 450 },
    { month: "Dec", fd: 420, rd: 220, savings: 480 },
    { month: "Jan", fd: 390, rd: 240, savings: 510 },
    { month: "Feb", fd: 460, rd: 260, savings: 540 },
    { month: "Mar", fd: 510, rd: 280, savings: 560 },
  ];

  const maturities = [
    { period: "Apr 2026", count: 42, amount: "₹1.8 Cr", type: "FD", urgency: "Immediate" },
    { period: "May 2026", count: 38, amount: "₹1.5 Cr", type: "FD + RD", urgency: "Upcoming" },
    { period: "Jun 2026", count: 55, amount: "₹2.2 Cr", type: "FD + RD", urgency: "Planned" },
    { period: "Jul-Sep 2026", count: 120, amount: "₹5.8 Cr", type: "Mixed", urgency: "Future" },
  ];

  const tierConcentration = [
    { tier: "Platinum (>₹5L)", members: 280, deposits: "₹14.2 Cr", pct: 36 },
    { tier: "Gold (₹2L-₹5L)", members: 620, deposits: "₹11.8 Cr", pct: 30 },
    { tier: "Silver (₹50K-₹2L)", members: 1850, deposits: "₹8.6 Cr", pct: 22 },
    { tier: "Bronze (<₹50K)", members: 4700, deposits: "₹4.9 Cr", pct: 12 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {depositMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[22px] font-bold font-mono text-slate-900">{m.value}</div>
            <div className="text-[11px] mt-1 font-medium text-emerald-500">{m.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Deposit Growth Trend */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Deposit Growth Trend (₹ Lakhs)</h3>
          <div className="flex items-end gap-3 h-40">
            {depositGrowth.map((d) => {
              const maxVal = 600;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "120px" }}>
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.fd / maxVal) * 100}%`, background: "linear-gradient(to top, #4F46E5, #818CF8)" }} title={`FD: ₹${d.fd}L`} />
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.rd / maxVal) * 100}%`, background: "linear-gradient(to top, #0D9488, #14B8A6)" }} title={`RD: ₹${d.rd}L`} />
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.savings / maxVal) * 100}%`, background: "linear-gradient(to top, #C9982E, #F59E0B)" }} title={`Savings: ₹${d.savings}L`} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #4F46E5, #818CF8)" }} /><span className="text-[11px] text-slate-500">FD</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #0D9488, #14B8A6)" }} /><span className="text-[11px] text-slate-500">RD</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #C9982E, #F59E0B)" }} /><span className="text-[11px] text-slate-500">Savings</span></div>
          </div>
        </div>

        {/* Maturity Calendar */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Upcoming Maturities</h3>
          <div className="flex flex-col gap-3">
            {maturities.map((m) => (
              <div key={m.period} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{m.period}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${m.urgency === "Immediate" ? "bg-red-50 border-red-200 text-red-600" : m.urgency === "Upcoming" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                    {m.urgency}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[12px] text-slate-500 whitespace-nowrap">{m.count} accounts</span>
                  <span className="text-[14px] font-bold font-mono text-slate-800 whitespace-nowrap">{m.amount}</span>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposit Concentration */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Deposit Concentration by Member Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tierConcentration.map((t) => (
            <div key={t.tier} className="bg-slate-50 rounded-xl p-4">
              <div className="text-[12px] font-semibold text-slate-700 mb-2">{t.tier}</div>
              <div className="text-[20px] font-bold font-mono text-indigo-600">{t.deposits}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-400">{t.members.toLocaleString()} members</span>
                <span className="text-[11px] font-semibold text-slate-500">{t.pct}%</span>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.pct}%`, background: "linear-gradient(to right, #4F46E5, #818CF8)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberGrowthTab() {
  const demographics = [
    { group: "18-25 yrs", count: 1620, pct: 13 },
    { group: "26-35 yrs", count: 3735, pct: 30 },
    { group: "36-45 yrs", count: 3486, pct: 28 },
    { group: "46-55 yrs", count: 2241, pct: 18 },
    { group: "55+ yrs", count: 1368, pct: 11 },
  ];

  const locations = [
    { city: "Bengaluru", members: 5480, pct: 44 },
    { city: "Mysuru", members: 1868, pct: 15 },
    { city: "Hubli-Dharwad", members: 1494, pct: 12 },
    { city: "Mangaluru", members: 1120, pct: 9 },
    { city: "Others", members: 2488, pct: 20 },
  ];

  const churnData = [
    { month: "Oct", churned: 18, reason: "Relocation", recovered: 5 },
    { month: "Nov", churned: 22, reason: "Dissatisfaction", recovered: 8 },
    { month: "Dec", churned: 15, reason: "Financial Hardship", recovered: 3 },
    { month: "Jan", churned: 28, reason: "Competition", recovered: 10 },
    { month: "Feb", churned: 20, reason: "Dormancy", recovered: 6 },
    { month: "Mar", churned: 25, reason: "Mixed", recovered: 9 },
  ];

  const channels = [
    { channel: "Referral Program", acquired: 4200, pct: 34, cost: "₹120/member" },
    { channel: "Branch Walk-in", acquired: 2988, pct: 24, cost: "₹85/member" },
    { channel: "Digital Marketing", acquired: 2490, pct: 20, cost: "₹210/member" },
    { channel: "Corporate Tie-ups", acquired: 1620, pct: 13, cost: "₹65/member" },
    { channel: "Agent Network", acquired: 1152, pct: 9, cost: "₹180/member" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Member Growth Chart */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Member Growth Trend</h3>
        <div className="flex items-end gap-3 h-40">
          {reportAnalytics.memberGrowth.map((d) => {
            const maxVal = 600;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.newMembers / maxVal) * 100}%`, background: "linear-gradient(to top, #0D9488, #14B8A6)" }} title={`New: ${d.newMembers}`} />
                  <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.churned / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`Churned: ${d.churned}`} />
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #0D9488, #14B8A6)" }} /><span className="text-[11px] text-slate-500">New Members</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Churned</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Demographics */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Age Group Distribution</h3>
          <div className="flex flex-col gap-3">
            {demographics.map((d) => (
              <div key={d.group} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{d.group}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{d.count.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{d.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, background: "linear-gradient(to right, #0D9488, #14B8A6)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Geographic Distribution</h3>
          <div className="flex flex-col gap-3">
            {locations.map((l) => (
              <div key={l.city} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{l.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{l.members.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{l.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${l.pct}%`, background: "linear-gradient(to right, #4F46E5, #818CF8)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Analysis */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Churn Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Month</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Churned</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Primary Reason</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Recovered</th>
                </tr>
              </thead>
              <tbody>
                {churnData.map((c) => (
                  <tr key={c.month} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{c.month}</td>
                    <td className="text-[13px] font-mono text-red-500 px-5 py-3 text-right">{c.churned}</td>
                    <td className="text-[12px] text-slate-500 px-5 py-3">{c.reason}</td>
                    <td className="text-[13px] font-mono text-emerald-500 px-5 py-3 text-right">{c.recovered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acquisition Channels */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Acquisition Channel Performance</h3>
          <div className="flex flex-col gap-3">
            {channels.map((ch) => (
              <div key={ch.channel} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{ch.channel}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 border-indigo-200 text-indigo-600">{ch.pct}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-400">{ch.acquired.toLocaleString()} members</span>
                  <span className="text-[11px] text-slate-400">CAC: {ch.cost}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ch.pct}%`, background: "linear-gradient(to right, #7C3AED, #A78BFA)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskAnalyticsTab() {
  const riskDistribution = [
    { score: "0-20 (Critical)", count: 120, pct: 1, color: "#DC2626" },
    { score: "21-40 (High)", count: 485, pct: 4, color: "#F97316" },
    { score: "41-60 (Medium)", count: 1870, pct: 15, color: "#D97706" },
    { score: "61-80 (Low)", count: 4975, pct: 40, color: "#0D9488" },
    { score: "81-100 (Minimal)", count: 5000, pct: 40, color: "#059669" },
  ];

  const riskTrend = [
    { month: "Oct", high: 85, medium: 240, low: 680 },
    { month: "Nov", high: 78, medium: 225, low: 710 },
    { month: "Dec", high: 92, medium: 260, low: 690 },
    { month: "Jan", high: 70, medium: 210, low: 740 },
    { month: "Feb", high: 65, medium: 195, low: 760 },
    { month: "Mar", high: 60, medium: 185, low: 780 },
  ];

  const riskFactors = [
    { factor: "Loan-to-Deposit Ratio > 70%", affected: 342, impact: "High", trend: "Declining", mitigation: "EMI restructuring" },
    { factor: "Missed EMI Payments (2+)", affected: 218, impact: "Critical", trend: "Stable", mitigation: "Recovery team assigned" },
    { factor: "Low STI Score (<50)", affected: 605, impact: "Medium", trend: "Improving", mitigation: "Member counselling" },
    { factor: "KYC Expired / Pending", affected: 342, impact: "High", trend: "Action Needed", mitigation: "Re-verification drive" },
    { factor: "Dormant Account (>90 days)", affected: 890, impact: "Low", trend: "Increasing", mitigation: "Engagement campaigns" },
  ];

  const heatmap = [
    { category: "Credit Risk", low: 72, medium: 20, high: 6, critical: 2 },
    { category: "Liquidity Risk", low: 65, medium: 25, high: 8, critical: 2 },
    { category: "Operational Risk", low: 80, medium: 14, high: 5, critical: 1 },
    { category: "Compliance Risk", low: 85, medium: 10, high: 4, critical: 1 },
    { category: "Fraud Risk", low: 78, medium: 15, high: 5, critical: 2 },
  ];

  return (
    <div className="animate-fade-in">
      {/* Risk Score Distribution */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Risk Score Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {riskDistribution.map((r) => (
            <div key={r.score} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{r.score}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: r.color }}>{r.count.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-1">{r.pct}% of members</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Risk Trends */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Risk Trends (New Alerts)</h3>
          <div className="flex items-end gap-3 h-40">
            {riskTrend.map((d) => {
              const maxVal = 800;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "120px" }}>
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.high / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`High: ${d.high}`} />
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.medium / maxVal) * 100}%`, background: "linear-gradient(to top, #D97706, #FBBF24)" }} title={`Medium: ${d.medium}`} />
                    <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.low / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #34D399)" }} title={`Low: ${d.low}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">High</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #D97706, #FBBF24)" }} /><span className="text-[11px] text-slate-500">Medium</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #34D399)" }} /><span className="text-[11px] text-slate-500">Low</span></div>
          </div>
        </div>

        {/* Predictive Risk */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Predictive Risk Indicators</h3>
          <div className="flex flex-col gap-3">
            {[
              { indicator: "Projected NPA (Next Quarter)", value: "1.9%", direction: "Improving", color: "#059669" },
              { indicator: "Liquidity Stress Probability", value: "12%", direction: "Stable", color: "#D97706" },
              { indicator: "Member Default Likelihood", value: "3.2%", direction: "Improving", color: "#059669" },
              { indicator: "Deposit Flight Risk", value: "8%", direction: "Needs Watch", color: "#F97316" },
              { indicator: "Regulatory Breach Risk", value: "Low", direction: "Stable", color: "#059669" },
            ].map((p) => (
              <div key={p.indicator} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[12px] text-slate-500">{p.indicator}</div>
                    <div className="text-[18px] font-bold font-mono mt-0.5" style={{ color: p.color }}>{p.value}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${p.direction === "Improving" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : p.direction === "Stable" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                    {p.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Factors Table */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Top Risk Factors</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Risk Factor</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Affected</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Impact</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Trend</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {riskFactors.map((rf) => (
                <tr key={rf.factor} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{rf.factor}</td>
                  <td className="text-[13px] font-mono text-slate-600 px-5 py-3 text-right">{rf.affected}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${rf.impact === "Critical" ? "bg-red-50 border-red-200 text-red-600" : rf.impact === "High" ? "bg-amber-50 border-amber-200 text-amber-600" : rf.impact === "Medium" ? "bg-yellow-50 border-yellow-200 text-yellow-600" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                      {rf.impact}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold ${rf.trend === "Improving" || rf.trend === "Declining" ? "text-emerald-500" : rf.trend === "Stable" ? "text-slate-500" : "text-red-500"}`}>
                      {rf.trend}
                    </span>
                  </td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{rf.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Heatmap */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Risk Heatmap by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">Category</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Low %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Medium %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">High %</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center whitespace-nowrap">Critical %</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((h) => (
                <tr key={h.category} className="border-b border-slate-50">
                  <td className="text-[13px] font-semibold text-slate-700 px-5 py-3">{h.category}</td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-emerald-100 text-emerald-700">{h.low}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-amber-100 text-amber-700">{h.medium}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-orange-100 text-orange-700">{h.high}</span></td>
                  <td className="px-5 py-3 text-center"><span className="inline-block w-12 py-1 rounded-lg text-[12px] font-mono font-semibold bg-red-100 text-red-700">{h.critical}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComplianceReportsTab() {
  const complianceHistory = [
    { month: "Oct 2025", score: 89 },
    { month: "Nov 2025", score: 90 },
    { month: "Dec 2025", score: 91 },
    { month: "Jan 2026", score: 92 },
    { month: "Feb 2026", score: 93 },
    { month: "Mar 2026", score: 94 },
  ];

  const filingStatus = [
    { form: "NDH-1", description: "Return of Statutory Compliances", dueDate: "30 Apr 2026", status: "Upcoming" },
    { form: "NDH-3", description: "Half-Yearly Return", dueDate: "30 Sep 2026", status: "Upcoming" },
    { form: "NDH-4", description: "Declaration as Nidhi", dueDate: "—", status: "Filed" },
    { form: "AOC-4", description: "Annual Financial Statements", dueDate: "30 Oct 2026", status: "Upcoming" },
    { form: "MGT-7A", description: "Annual Return", dueDate: "28 Nov 2026", status: "Upcoming" },
    { form: "DIR-3 KYC", description: "Director KYC", dueDate: "30 Sep 2026", status: "Upcoming" },
  ];

  const auditFindings = [
    { id: "AF-001", finding: "KYC re-verification backlog for 342 members", severity: "High", status: "Open", raisedDate: "15 Feb 2026", owner: "Compliance Team" },
    { id: "AF-002", finding: "Unencumbered deposit ratio at 11.2%, approaching threshold", severity: "Medium", status: "Monitoring", raisedDate: "28 Feb 2026", owner: "Treasury" },
    { id: "AF-003", finding: "Two loan accounts exceed individual exposure limit", severity: "Low", status: "Resolved", raisedDate: "10 Jan 2026", owner: "Credit Team" },
    { id: "AF-004", finding: "Board meeting minutes not digitised for Q3", severity: "Low", status: "In Progress", raisedDate: "05 Mar 2026", owner: "Company Secretary" },
  ];

  const gapAnalysis = [
    { area: "Capital Adequacy", required: "NOF ≥ ₹20L", current: "₹1.2 Cr", gap: "None", status: "Compliant" },
    { area: "Deposit Ratio", required: "NOF:Deposits ≤ 1:20", current: "1:14.5", gap: "None", status: "Compliant" },
    { area: "Unencumbered Deposits", required: "≥ 10%", current: "11.2%", gap: "1.2% buffer", status: "Warning" },
    { area: "KYC Compliance", required: "100% verified", current: "97.3%", gap: "342 pending", status: "Action Required" },
    { area: "Loan-to-Deposit", required: "≤ 80%", current: "62%", gap: "None", status: "Compliant" },
    { area: "Interest Rate Cap", required: "≤ Bank Rate + 12.5%", current: "9.5% max", gap: "None", status: "Compliant" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Compliance Score History */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Compliance Score Trend</h3>
          <div className="flex items-end gap-3 h-40">
            {complianceHistory.map((d) => {
              const minVal = 85;
              const maxVal = 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{d.score}%</div>
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${((d.score - minVal) / (maxVal - minVal)) * 100}%`, background: d.score >= 93 ? "linear-gradient(to top, #059669, #34D399)" : "linear-gradient(to top, #D97706, #FBBF24)" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filing Status */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Regulatory Filing Status</h3>
          <div className="flex flex-col gap-2.5">
            {filingStatus.map((f) => (
              <div key={f.form} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">{f.form}</div>
                  <div className="text-[11px] text-slate-400">{f.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  {f.dueDate !== "—" && <span className="text-[11px] text-slate-400 font-mono">{f.dueDate}</span>}
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${f.status === "Filed" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Findings */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Audit Findings Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">ID</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Finding</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Severity</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Status</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {auditFindings.map((af) => (
                <tr key={af.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[12px] font-mono text-slate-400 px-5 py-3">{af.id}</td>
                  <td className="text-[13px] text-slate-700 px-5 py-3 max-w-xs">{af.finding}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${af.severity === "High" ? "bg-red-50 border-red-200 text-red-600" : af.severity === "Medium" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                      {af.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${af.status === "Resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : af.status === "Open" ? "bg-red-50 border-red-200 text-red-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                      {af.status}
                    </span>
                  </td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{af.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Gap Analysis */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Compliance Gap Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Area</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Required</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Current</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Gap</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {gapAnalysis.map((g) => (
                <tr key={g.area} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[13px] font-semibold text-slate-700 px-5 py-3">{g.area}</td>
                  <td className="text-[12px] font-mono text-slate-500 px-5 py-3">{g.required}</td>
                  <td className="text-[12px] font-mono text-slate-600 px-5 py-3">{g.current}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{g.gap}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${g.status === "Compliant" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : g.status === "Warning" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PDFReportsTab() {
  const [filterCategory, setFilterCategory] = useState("All");
  const categories = ["All", ...new Set(reportsList.map((r) => r.category))];
  const filtered = reportsList.filter((r) => filterCategory === "All" || r.category === filterCategory);

  const recentReports = [
    { name: "Monthly Financial Summary", generated: "01 Mar 2026, 09:15", size: "2.4 MB", by: "Scheduled" },
    { name: "Loan Portfolio Health", generated: "08 Mar 2026, 14:30", size: "1.8 MB", by: "Ramesh (Admin)" },
    { name: "Fraud Intelligence Brief", generated: "08 Mar 2026, 16:00", size: "980 KB", by: "AI Agent" },
    { name: "Chit Fund Auction Report", generated: "05 Mar 2026, 11:45", size: "1.2 MB", by: "Scheduled" },
    { name: "Compliance & Regulatory", generated: "01 Mar 2026, 10:00", size: "3.1 MB", by: "Scheduled" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterCategory === c ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{r.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{r.id}</div>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{r.category}</span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{r.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Frequency</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.frequency}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Format</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.format}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Last Generated</div>
                <div className="text-[12px] font-semibold text-slate-700">{r.lastGenerated}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors">
                Generate
              </button>
              <button className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[12px] font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                Download Last
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Report Scheduling */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Report Scheduling</h3>
          <div className="flex flex-col gap-3">
            {[
              { report: "Monthly Financial Summary", schedule: "1st of every month, 09:00 AM", nextRun: "01 Apr 2026", status: "Active" },
              { report: "Loan Portfolio Health", schedule: "Every Monday, 08:00 AM", nextRun: "17 Mar 2026", status: "Active" },
              { report: "Compliance & Regulatory", schedule: "1st of every quarter, 10:00 AM", nextRun: "01 Apr 2026", status: "Active" },
              { report: "Fraud Intelligence Brief", schedule: "Every Friday, 04:00 PM", nextRun: "14 Mar 2026", status: "Active" },
              { report: "Member Growth Report", schedule: "1st of every month, 09:30 AM", nextRun: "01 Apr 2026", status: "Paused" },
            ].map((s) => (
              <div key={s.report} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{s.report}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${s.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                    {s.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{s.schedule}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Next: {s.nextRun}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Generated */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recently Generated Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Report</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Generated</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Size</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((rr) => (
                  <tr key={rr.name + rr.generated} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{rr.name}</td>
                    <td className="px-5 py-3">
                      <div className="text-[12px] text-slate-500">{rr.generated}</div>
                      <div className="text-[10px] text-slate-400">by {rr.by}</div>
                    </td>
                    <td className="text-[12px] font-mono text-slate-500 px-5 py-3 text-right">{rr.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Batch Generation */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mt-4">
        <h3 className="text-[15px] font-bold text-slate-900 mb-2">Batch Report Generation</h3>
        <p className="text-[12px] text-slate-400 mb-4">Generate all monthly reports in one batch. Includes Financial Summary, Member Growth, Loan Portfolio, Deposit Maturity, and Compliance reports.</p>
        <div className="flex items-center gap-3">
          <button className="py-2.5 px-6 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors">
            Generate All Monthly Reports
          </button>
          <span className="text-[11px] text-slate-400">Last batch: 01 Mar 2026 | 8 reports | 14.2 MB total</span>
        </div>
      </div>
    </div>
  );
}

function CSVExportsTab() {
  const exportCategories = [
    { name: "Members Data", description: "Complete member directory with KYC status, STI scores, deposit and loan summaries", rows: "12,450", lastExported: "08 Mar 2026", icon: "M" },
    { name: "Loan Accounts", description: "All active and closed loan accounts with EMI schedules, repayment history", rows: "5,200", lastExported: "08 Mar 2026", icon: "L" },
    { name: "Deposit Accounts", description: "FD, RD, and Savings deposit accounts with maturity dates, interest accrued", rows: "12,450", lastExported: "05 Mar 2026", icon: "D" },
    { name: "Transactions Ledger", description: "Complete transaction history — deposits, withdrawals, EMI payments, auction settlements", rows: "1,45,680", lastExported: "01 Mar 2026", icon: "T" },
    { name: "Compliance Records", description: "Regulatory filings, audit logs, KYC records, and compliance checklist status", rows: "2,840", lastExported: "01 Mar 2026", icon: "C" },
  ];

  const exportHistory = [
    { file: "members_full_20260308.csv", category: "Members", rows: "12,450", size: "4.8 MB", exportedBy: "Ramesh (Admin)", date: "08 Mar 2026, 15:20" },
    { file: "loans_active_20260308.csv", category: "Loans", rows: "5,200", size: "2.1 MB", exportedBy: "Kavitha (Finance)", date: "08 Mar 2026, 14:45" },
    { file: "deposits_all_20260305.csv", category: "Deposits", rows: "12,450", size: "3.6 MB", exportedBy: "Scheduled", date: "05 Mar 2026, 09:00" },
    { file: "transactions_feb2026.csv", category: "Transactions", rows: "24,560", size: "8.2 MB", exportedBy: "Ramesh (Admin)", date: "01 Mar 2026, 10:15" },
    { file: "compliance_q4_2025.csv", category: "Compliance", rows: "2,840", size: "1.1 MB", exportedBy: "Scheduled", date: "01 Mar 2026, 10:00" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Export Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {exportCategories.map((ec) => (
          <div key={ec.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[14px] font-bold text-indigo-600">
                {ec.icon}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-slate-900">{ec.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{ec.rows} rows</div>
              </div>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{ec.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-400">Last exported: {ec.lastExported}</span>
            </div>
            <button className="w-full py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-indigo-100 transition-colors">
              Export CSV
            </button>
          </div>
        ))}
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Export Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Date Range</div>
            <div className="text-[13px] font-semibold text-slate-700">01 Mar 2026 — 11 Mar 2026</div>
            <div className="text-[11px] text-slate-400 mt-1">Custom range supported</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Filter Options</div>
            <div className="text-[13px] font-semibold text-slate-700">Active Records Only</div>
            <div className="text-[11px] text-slate-400 mt-1">Status, branch, category filters</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Encoding</div>
            <div className="text-[13px] font-semibold text-slate-700">UTF-8 with BOM</div>
            <div className="text-[11px] text-slate-400 mt-1">Excel-compatible format</div>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Export History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">File Name</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Category</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Rows</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Size</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Exported By</th>
                <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.map((eh) => (
                <tr key={eh.file} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[12px] font-mono text-indigo-600 px-5 py-3">{eh.file}</td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{eh.category}</span>
                  </td>
                  <td className="text-[12px] font-mono text-slate-600 px-5 py-3 text-right">{eh.rows}</td>
                  <td className="text-[12px] font-mono text-slate-600 px-5 py-3 text-right">{eh.size}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{eh.exportedBy}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3">{eh.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BoardReportsTab() {
  const boardMeetings = [
    { quarter: "Q4 FY26 (Jan-Mar)", date: "28 Mar 2026", status: "Upcoming", agenda: "Annual budget review, NPA resolution, expansion plan", attendees: 7 },
    { quarter: "Q3 FY26 (Oct-Dec)", date: "22 Dec 2025", status: "Completed", agenda: "Half-year performance, compliance audit, digital transformation", attendees: 6 },
    { quarter: "Q2 FY26 (Jul-Sep)", date: "25 Sep 2025", status: "Completed", agenda: "Member growth strategy, new scheme launch, risk framework", attendees: 7 },
    { quarter: "Q1 FY26 (Apr-Jun)", date: "28 Jun 2025", status: "Completed", agenda: "Annual plan approval, director appointment, policy updates", attendees: 5 },
  ];

  const executiveMetrics = [
    { label: "Total AUM Growth", value: "+14.2%", target: "+12%", color: "#059669" },
    { label: "Member Base", value: "12,450", target: "12,000", color: "#4F46E5" },
    { label: "Net Profit Margin", value: "32.5%", target: "28%", color: "#059669" },
    { label: "Regulatory Score", value: "94%", target: "90%", color: "#0D9488" },
  ];

  const decisions = [
    { id: "BR-001", decision: "Approved expansion to Hubli-Dharwad with ₹50L capital allocation", date: "22 Dec 2025", status: "In Progress", owner: "Suresh Menon (MD)" },
    { id: "BR-002", decision: "Approved new Gold Loan scheme with 9.5% interest rate", date: "22 Dec 2025", status: "Implemented", owner: "Kavitha Nair (CFO)" },
    { id: "BR-003", decision: "Mandated 100% digital KYC for all new members from Jan 2026", date: "25 Sep 2025", status: "Implemented", owner: "Ramesh Babu (CTO)" },
    { id: "BR-004", decision: "Approved ₹25L budget for AI-powered fraud detection system", date: "25 Sep 2025", status: "In Progress", owner: "Ramesh Babu (CTO)" },
    { id: "BR-005", decision: "Resolved to maintain NOF at 2x regulatory minimum", date: "28 Jun 2025", status: "Ongoing", owner: "Kavitha Nair (CFO)" },
  ];

  const shareholderComms = [
    { type: "Annual General Meeting Notice", date: "15 Mar 2026", recipients: "All Shareholders (245)", status: "Scheduled" },
    { type: "Quarterly Performance Update", date: "05 Jan 2026", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Dividend Declaration Notice", date: "20 Dec 2025", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Special Resolution — Branch Expansion", date: "10 Nov 2025", recipients: "All Shareholders (245)", status: "Sent" },
    { type: "Half-Yearly Financial Summary", date: "05 Oct 2025", recipients: "All Shareholders (238)", status: "Sent" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Board Meeting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {boardMeetings.map((bm) => (
          <div key={bm.quarter} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{bm.quarter}</div>
                <div className="text-[12px] text-slate-400 font-mono mt-0.5">{bm.date}</div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${bm.status === "Completed" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                {bm.status}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{bm.agenda}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">{bm.attendees} directors attended</span>
              {bm.status === "Completed" && (
                <button className="ml-auto py-1.5 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-[11px] font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                  View Minutes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Executive Summary — Board Deck Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {executiveMetrics.map((em) => (
            <div key={em.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{em.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: em.color }}>{em.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">Target: {em.target}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Decisions */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Key Decisions & Resolutions</h3>
          <div className="flex flex-col gap-3">
            {decisions.map((d) => (
              <div key={d.id} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-mono text-slate-400">{d.id}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${d.status === "Implemented" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : d.status === "In Progress" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-indigo-50 border-indigo-200 text-indigo-600"}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-[13px] text-slate-700 mb-1">{d.decision}</div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{d.date}</span>
                  <span className="text-[11px] text-slate-400">{d.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shareholder Communications */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Shareholder Communication Log</h3>
          <div className="flex flex-col gap-3">
            {shareholderComms.map((sc) => (
              <div key={sc.type + sc.date} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{sc.type}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sc.status === "Sent" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                    {sc.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-400 font-mono">{sc.date}</span>
                  <span className="text-[11px] text-slate-400">{sc.recipients}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIsTab() {
  const kpis = [
    { title: "Deposit Growth Rate", value: "6.1%", target: "5.0%", status: "Above Target", color: "#059669" },
    { title: "Loan Default Rate", value: "2.1%", target: "3.0%", status: "Within Target", color: "#059669" },
    { title: "Member Retention", value: "97.8%", target: "95.0%", status: "Above Target", color: "#059669" },
    { title: "Compliance Score", value: "94%", target: "90%", status: "Above Target", color: "#059669" },
    { title: "Revenue Growth", value: "8.6%", target: "10.0%", status: "Below Target", color: "#D97706" },
    { title: "Cost Efficiency", value: "44%", target: "45%", status: "Within Target", color: "#059669" },
    { title: "AI Agent Accuracy", value: "96.2%", target: "95%", status: "Above Target", color: "#059669" },
    { title: "Fraud Detection Rate", value: "88%", target: "85%", status: "Above Target", color: "#059669" },
  ];

  const departmentKPIs = [
    { dept: "Operations", kpis: [{ name: "TAT — Loan Approval", actual: "2.1 days", target: "3 days" }, { name: "Member Onboarding", actual: "45 min", target: "60 min" }] },
    { dept: "Finance", kpis: [{ name: "Collection Efficiency", actual: "96.8%", target: "95%" }, { name: "Cost-to-Income", actual: "44%", target: "45%" }] },
    { dept: "Compliance", kpis: [{ name: "Filing Timeliness", actual: "100%", target: "100%" }, { name: "KYC Completion", actual: "97.3%", target: "100%" }] },
    { dept: "Technology", kpis: [{ name: "System Uptime", actual: "99.8%", target: "99.5%" }, { name: "AI Model Accuracy", actual: "96.2%", target: "95%" }] },
  ];

  const strategicGoals = [
    { goal: "Reach 15,000 members by FY27", progress: 83, current: "12,450", target: "15,000", status: "On Track" },
    { goal: "Achieve ₹60 Cr AUM", progress: 75, current: "₹45.2 Cr", target: "₹60 Cr", status: "On Track" },
    { goal: "Expand to 5 branches in Karnataka", progress: 40, current: "2 branches", target: "5 branches", status: "In Progress" },
    { goal: "Reduce NPA below 1.5%", progress: 60, current: "2.1%", target: "1.5%", status: "Needs Focus" },
    { goal: "100% digital KYC adoption", progress: 88, current: "88%", target: "100%", status: "On Track" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-6 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">Key Performance Indicators</h3>
        <p className="text-[13px] text-slate-400">Track organizational performance against strategic targets for FY 2025-26.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[12px] text-slate-400 mb-3">{kpi.title}</div>
            <div className="text-[26px] font-bold font-mono text-slate-900 mb-1">{kpi.value}</div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-400">Target: {kpi.target}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kpi.status === "Below Target" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                {kpi.status}
              </span>
            </div>
            <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(parseFloat(kpi.value) / parseFloat(kpi.target) * 100, 100)}%`, background: kpi.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Department KPIs */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Department-wise KPIs</h3>
          <div className="flex flex-col gap-4">
            {departmentKPIs.map((d) => (
              <div key={d.dept} className="bg-slate-50 rounded-xl p-4">
                <div className="text-[13px] font-bold text-slate-700 mb-3">{d.dept}</div>
                <div className="flex flex-col gap-2">
                  {d.kpis.map((k) => (
                    <div key={k.name} className="flex justify-between items-center">
                      <span className="text-[12px] text-slate-500">{k.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-semibold text-slate-700">{k.actual}</span>
                        <span className="text-[10px] text-slate-400">/ {k.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Strategic Goals Tracking</h3>
          <div className="flex flex-col gap-3">
            {strategicGoals.map((sg) => (
              <div key={sg.goal} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{sg.goal}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sg.status === "On Track" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : sg.status === "In Progress" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                    {sg.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] text-slate-400">Current: {sg.current}</span>
                  <span className="text-[11px] text-slate-400">Target: {sg.target}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sg.progress}%`, background: sg.progress >= 80 ? "linear-gradient(to right, #059669, #34D399)" : sg.progress >= 50 ? "linear-gradient(to right, #D97706, #FBBF24)" : "linear-gradient(to right, #DC2626, #F87171)" }} />
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 text-right">{sg.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Performance Trend — Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenue (MoM)", value: "+8.6%", trend: "up", prev: "+6.2%", color: "#059669" },
            { label: "NPA Rate", value: "2.1%", trend: "down", prev: "2.5%", color: "#059669" },
            { label: "Member Growth", value: "+540", trend: "up", prev: "+480", color: "#4F46E5" },
            { label: "Compliance", value: "94%", trend: "up", prev: "93%", color: "#0D9488" },
          ].map((t) => (
            <div key={t.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{t.label}</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: t.color }}>{t.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Prev: {t.prev} {t.trend === "up" ? "↑" : "↓"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState("financial");

  const renderTab = () => {
    switch (activeTab) {
      case "financial": return <FinancialReportsTab />;
      case "loans": return <LoanPerformanceTab />;
      case "deposits": return <DepositAnalyticsTab />;
      case "members": return <MemberGrowthTab />;
      case "risk": return <RiskAnalyticsTab />;
      case "compliance": return <ComplianceReportsTab />;
      case "pdf": return <PDFReportsTab />;
      case "csv": return <CSVExportsTab />;
      case "board": return <BoardReportsTab />;
      case "kpis": return <KPIsTab />;
      default: return <FinancialReportsTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Reports & Analytics</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Comprehensive reporting suite for Glimmora Nidhi operations. Generate financial statements,
              member reports, compliance summaries, and AI-powered business intelligence analytics.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-indigo-600 font-mono">{reportsList.length}</div>
              <div className="text-slate-400 text-[10px]">Available Reports</div>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">10</div>
              <div className="text-slate-400 text-[10px]">Analytics Modules</div>
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
