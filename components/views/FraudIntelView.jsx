"use client";

import { useState } from "react";
import { fraudCases, fraudMetrics, fraudTrend } from "@/data/mockData";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cases", label: "Active Cases" },
  { id: "patterns", label: "Pattern Analysis" },
  { id: "prevention", label: "Prevention" },
];

function SeverityBadge({ severity }) {
  const styles = {
    Critical: "bg-red-50 text-red-500 border-red-200/60",
    High: "bg-orange-50 text-orange-600 border-orange-200/60",
    Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[severity] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {severity}
    </span>
  );
}

function CaseStatusBadge({ status }) {
  const styles = {
    Investigating: "bg-blue-50 text-blue-600 border-blue-200/60",
    Escalated: "bg-purple-50 text-purple-600 border-purple-200/60",
    "Under Review": "bg-amber-50 text-amber-600 border-amber-200/60",
    Confirmed: "bg-red-50 text-red-500 border-red-200/60",
    Monitoring: "bg-slate-100 text-slate-500 border-slate-200",
    Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function DashboardTab() {
  const metrics = [
    { label: "Active Alerts", value: fraudMetrics.totalAlerts, color: "#BF6F6D" },
    { label: "Critical Alerts", value: fraudMetrics.criticalAlerts, color: "#DC2626" },
    { label: "Resolved This Month", value: fraudMetrics.resolvedThisMonth, color: "#059669" },
    { label: "Avg Resolution Time", value: fraudMetrics.avgResolutionTime, color: "#6B8ABF" },
    { label: "False Positive Rate", value: fraudMetrics.falsePositiveRate, color: "#C49A4C" },
    { label: "Total Prevented Loss", value: fraudMetrics.totalPreventedLoss, color: "#9585B5" },
  ];

  const maxVal = 25;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-[20px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Fraud Trend */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Fraud Alert Trend</h3>
        <div className="flex items-end gap-3 h-44">
          {fraudTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.alerts / maxVal) * 100}%`, background: "linear-gradient(to top, #DC2626, #F87171)" }} title={`Alerts: ${d.alerts}`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.resolved / maxVal) * 100}%`, background: "linear-gradient(to top, #059669, #10B981)" }} title={`Resolved: ${d.resolved}`} />
                <div className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90" style={{ height: `${(d.falsePositive / maxVal) * 100}%`, background: "linear-gradient(to top, #C9982E, #E8C65A)" }} title={`False Positive: ${d.falsePositive}`} />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 mt-4 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #DC2626, #F87171)" }} /><span className="text-[11px] text-slate-500">Total Alerts</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #059669, #10B981)" }} /><span className="text-[11px] text-slate-500">Resolved</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: "linear-gradient(to top, #C9982E, #E8C65A)" }} /><span className="text-[11px] text-slate-500">False Positive</span></div>
        </div>
      </div>

      {/* Recent Critical Cases */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Critical Cases</h3>
        <div className="flex flex-col gap-3">
          {fraudCases.filter((c) => c.severity === "Critical").map((fc) => (
            <div key={fc.id} className="flex items-start gap-3 bg-red-50/50 rounded-xl p-4 border border-red-100/60">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-700">{fc.type}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{fc.id} &middot; {fc.time}</div>
                  </div>
                  <CaseStatusBadge status={fc.status} />
                </div>
                <div className="text-[12px] text-slate-500 mt-1">{fc.description}</div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span>Members: <strong className="text-slate-600">{fc.member}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Potential Loss: <strong className="text-red-500">{fc.potentialLoss}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CasesTab() {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");

  const filtered = fraudCases.filter((c) => {
    const matchesSearch = c.type.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === "All" || c.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cases..."
          className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" />
        <div className="flex gap-2">
          {["All", "Critical", "High", "Medium"].map((f) => (
            <button key={f} onClick={() => setFilterSeverity(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterSeverity === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((fc) => (
          <div key={fc.id} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-slate-900">{fc.type}</span>
                  <SeverityBadge severity={fc.severity} />
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{fc.id} &middot; Detected: {fc.time} &middot; By: {fc.detectedBy}</div>
              </div>
              <CaseStatusBadge status={fc.status} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{fc.description}</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Involved Members</div>
                <div className="text-[12px] font-semibold text-slate-700 font-mono">{fc.member}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Potential Loss</div>
                <div className="text-[14px] font-bold text-red-500 font-mono">{fc.potentialLoss}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Detection Engine</div>
                <div className="text-[12px] font-semibold text-slate-700">{fc.detectedBy}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatternsTab() {
  const patterns = [
    { type: "Auction Manipulation", description: "Coordinated bidding by linked members to suppress auction prices and share undue benefits.", frequency: "8 cases", riskLevel: "Critical", indicators: ["Same IP/device for multiple bids", "Bids within 2-second window", "Shared bank accounts among bidders"] },
    { type: "Identity Fraud", description: "Use of fake or duplicate identity documents to create multiple member accounts.", frequency: "5 cases", riskLevel: "Critical", indicators: ["Duplicate PAN/Aadhaar across accounts", "Failed biometric verification", "Address proof inconsistencies"] },
    { type: "Deposit Layering", description: "Structuring deposits to avoid reporting thresholds, potential money laundering indicator.", frequency: "4 cases", riskLevel: "High", indicators: ["Multiple deposits just below ₹10L threshold", "Rapid deposit-withdrawal cycles", "Cash deposits from multiple locations"] },
    { type: "Collusion Rings", description: "Groups of members coordinating to exploit chit fund auctions or loan disbursements.", frequency: "3 cases", riskLevel: "Critical", indicators: ["Shared contact details / addresses", "Sequential loan applications", "Cross-guarantees between ring members"] },
    { type: "Ghost Members", description: "Fictitious member accounts created using fabricated KYC documents.", frequency: "2 cases", riskLevel: "High", indicators: ["Failed address verification", "Unreachable contact numbers", "AI-generated document detection"] },
    { type: "Behavioural Anomaly", description: "Sudden changes in member activity patterns indicating potential financial distress or fraud.", frequency: "6 cases", riskLevel: "Medium", indicators: ["Rapid STI score decline", "Multiple simultaneous loan applications", "Abrupt deposit withdrawal pattern"] },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">AI-Powered Pattern Recognition</h3>
        <p className="text-[13px] text-slate-400">Our fraud detection system uses graph analytics, behavioural AI, and pattern matching to identify fraud typologies specific to Nidhi companies and chit fund operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map((p) => (
          <div key={p.type} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[15px] font-bold text-slate-900">{p.type}</div>
              <SeverityBadge severity={p.riskLevel} />
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{p.description}</p>
            <div className="text-[11px] text-slate-400 mb-3">Detected: <strong className="text-slate-600">{p.frequency}</strong> (last 6 months)</div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Key Indicators</div>
              <div className="flex flex-col gap-1.5">
                {p.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {ind}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreventionTab() {
  const preventionMeasures = [
    { title: "Real-time Auction Monitoring", description: "AI monitors all chit fund auctions in real-time, detecting bid manipulation, price suppression, and coordinated bidding patterns.", status: "Active", effectiveness: "94%" },
    { title: "KYC Document Verification", description: "Multi-layer verification using OCR, biometric matching, and government database cross-referencing for all new member registrations.", status: "Active", effectiveness: "98%" },
    { title: "AML Transaction Screening", description: "Automated screening of all deposits and withdrawals against anti-money laundering rules, including CTR and STR filing.", status: "Active", effectiveness: "91%" },
    { title: "Network Graph Analysis", description: "Graph-based detection of collusion rings by analyzing member relationships, shared contacts, addresses, and transaction patterns.", status: "Active", effectiveness: "87%" },
    { title: "Behavioural Risk Scoring", description: "Continuous monitoring of member behaviour against their historical profile, flagging anomalies in deposit, loan, and auction activity.", status: "Active", effectiveness: "89%" },
    { title: "Device & Location Intelligence", description: "Track and analyse device fingerprints and geolocation data to detect account takeover and multi-accounting attempts.", status: "Beta", effectiveness: "82%" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preventionMeasures.map((pm) => (
          <div key={pm.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[15px] font-bold text-slate-900">{pm.title}</div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${pm.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200/60" : "bg-blue-50 text-blue-600 border-blue-200/60"}`}>
                {pm.status}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{pm.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Detection Effectiveness</span>
              <span className="text-[14px] font-bold text-emerald-600 font-mono">{pm.effectiveness}</span>
            </div>
            <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
              <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: pm.effectiveness }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FraudIntelView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "cases": return <CasesTab />;
      case "patterns": return <PatternsTab />;
      case "prevention": return <PreventionTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Fraud Intelligence Center</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              AI-powered fraud detection and prevention system designed for Nidhi companies.
              Monitors auction manipulation, identity fraud, deposit layering, and collusion patterns
              across all member activities.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-red-50 rounded-xl px-3 py-2 text-center border border-red-200/60">
              <div className="text-lg font-bold text-red-500 font-mono">{fraudMetrics.criticalAlerts}</div>
              <div className="text-slate-400 text-[10px]">Critical</div>
            </div>
            <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center border border-emerald-200/60">
              <div className="text-lg font-bold text-emerald-600 font-mono">{fraudMetrics.totalPreventedLoss}</div>
              <div className="text-slate-400 text-[10px]">Loss Prevented</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
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
