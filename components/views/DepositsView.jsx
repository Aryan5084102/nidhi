"use client";

import { useState } from "react";
import { depositAccounts, depositSchemes, depositTrend } from "@/data/mockData";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "accounts", label: "Accounts" },
  { id: "schemes", label: "Schemes" },
  { id: "maturity", label: "Maturity Tracker" },
];

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    "Maturing Soon": "bg-amber-50 text-amber-600 border-amber-200/60",
    Matured: "bg-blue-50 text-blue-600 border-blue-200/60",
    Closed: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function OverviewTab() {
  const metrics = [
    { label: "Total Deposit Pool", value: "₹39.5 Cr", change: "+6.1%", color: "#9585B5" },
    { label: "Fixed Deposits", value: "₹18.5 Cr", change: "+8.4%", color: "#6B8ABF" },
    { label: "Recurring Deposits", value: "₹8.2 Cr", change: "+5.2%", color: "#5B9E8A" },
    { label: "Savings Deposits", value: "₹12.8 Cr", change: "+4.8%", color: "#C49A4C" },
    { label: "Active Accounts", value: "12,450", change: "+320", color: "#6B9E89" },
    { label: "Maturing This Month", value: "48", change: "₹1.2 Cr", color: "#BF6F6D" },
  ];

  const maxVal = 600;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            <div className={`text-[11px] mt-1 font-medium ${m.change.startsWith("+") ? "text-emerald-500" : "text-slate-400"}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Trend Chart */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Deposit Inflow Trend (₹ Lakhs)</h3>
        <div className="flex items-end gap-3 h-44">
          {depositTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.fd / maxVal) * 100}%`, background: "linear-gradient(to top, #4F46E5, #818CF8)" }} title={`FD: ₹${d.fd}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.rd / maxVal) * 100}%`, background: "linear-gradient(to top, #0D9488, #14B8A6)" }} title={`RD: ₹${d.rd}L`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.savings / maxVal) * 100}%`, background: "linear-gradient(to top, #C9982E, #E8C65A)" }} title={`Savings: ₹${d.savings}L`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #4F46E5, #818CF8)" }} /><span className="text-[11px] text-slate-500">Fixed Deposit</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #0D9488, #14B8A6)" }} /><span className="text-[11px] text-slate-500">Recurring Deposit</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #C9982E, #E8C65A)" }} /><span className="text-[11px] text-slate-500">Savings</span></div>
        </div>
      </div>

      {/* Scheme Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {depositSchemes.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[15px] font-bold text-slate-900 mb-1">{s.name}</div>
            <div className="text-[11px] text-slate-400 mb-4">{s.members.toLocaleString()} active members</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Rate</div>
                <div className="text-[14px] font-bold text-indigo-600 font-mono">{s.rate}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Corpus</div>
                <div className="text-[14px] font-bold text-emerald-600 font-mono">{s.totalCorpus}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Min: <strong className="text-slate-600">{s.minAmount}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Tenure: <strong className="text-slate-600">{s.tenures}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountsTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = depositAccounts.filter((a) => {
    const matchesSearch = a.memberName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or account ID..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Fixed Deposit", "Recurring Deposit", "Savings Deposit"].map((f) => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${filterType === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
              {f === "All" ? "All Types" : f.replace("Deposit", "").trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Account</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Rate</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Maturity</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-purple-50 border border-purple-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-600">
                      {a.memberName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">{a.memberName}</div>
                      <div className="text-[10px] text-slate-400">{a.memberId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{a.type}</td>
                <td className="px-5 py-3 text-[13px] font-bold text-slate-700 font-mono">{a.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.rate}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{a.maturityDate}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[13px] text-slate-400">No deposit accounts found</div>
        )}
      </div>
    </div>
  );
}

function SchemesTab() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4">
        {depositSchemes.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[16px] font-bold text-slate-900">{s.name}</div>
                <div className="text-[12px] text-slate-400 mt-1">{s.members.toLocaleString()} members enrolled &middot; Total Corpus: {s.totalCorpus}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl px-3 py-2 text-center border border-indigo-200/60">
                <div className="text-lg font-bold text-indigo-600 font-mono">{s.rate}</div>
                <div className="text-slate-400 text-[10px]">Interest Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Min Amount</div>
                <div className="text-[14px] font-semibold text-slate-700">{s.minAmount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Max Amount</div>
                <div className="text-[14px] font-semibold text-slate-700">{s.maxAmount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Tenure Options</div>
                <div className="text-[14px] font-semibold text-slate-700">{s.tenures}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Corpus</div>
                <div className="text-[14px] font-bold text-emerald-600 font-mono">{s.totalCorpus}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mt-4">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3">Nidhi Deposit Regulations</h3>
        <div className="flex flex-col gap-2">
          {[
            "Maximum deposit interest rate must not exceed the ceiling prescribed by RBI.",
            "All deposits are governed by Nidhi Rules 2014 and Nidhi (Amendment) Rules 2022.",
            "Net Owned Funds to Deposits ratio must not exceed 1:20.",
            "Members can hold multiple deposit accounts across different schemes.",
            "Premature withdrawal subject to penalty as per scheme terms.",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] text-slate-500">
              <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MaturityTab() {
  const maturing = depositAccounts.filter((a) => a.status === "Maturing Soon" || a.status === "Matured");
  const upcoming = depositAccounts.filter((a) => a.status === "Active" && a.maturityDate !== "—");

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Maturing This Month</div>
          <div className="text-[22px] font-bold font-mono text-amber-600">48</div>
          <div className="text-[11px] text-slate-400 mt-1">Worth ₹1.2 Cr</div>
        </div>
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Renewal Rate</div>
          <div className="text-[22px] font-bold font-mono text-emerald-600">72%</div>
          <div className="text-[11px] text-slate-400 mt-1">Last 3 months average</div>
        </div>
        <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Auto-Renewal Enabled</div>
          <div className="text-[22px] font-bold font-mono text-indigo-600">68%</div>
          <div className="text-[11px] text-slate-400 mt-1">Of all FD accounts</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Maturity Schedule</h3>
          <p className="text-[12px] text-slate-400 mt-1">Track upcoming deposit maturities and plan liquidity accordingly</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Account</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Member</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Type</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Amount</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Maturity Date</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...maturing, ...upcoming].map((a) => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{a.id}</td>
                <td className="px-5 py-3 text-[13px] font-semibold text-slate-700">{a.memberName}</td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{a.type}</td>
                <td className="px-5 py-3 text-[13px] font-bold text-slate-700 font-mono">{a.amount}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{a.maturityDate}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DepositsView() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "accounts": return <AccountsTab />;
      case "schemes": return <SchemesTab />;
      case "maturity": return <MaturityTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Deposits Management</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Manage Fixed Deposits, Recurring Deposits, and Savings accounts.
              All deposit schemes comply with Nidhi Rules 2014 and interest rate ceilings prescribed by RBI.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-purple-600 font-mono">₹39.5Cr</div>
              <div className="text-slate-400 text-[10px]">Total Deposits</div>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">12,450</div>
              <div className="text-slate-400 text-[10px]">Active Accounts</div>
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
