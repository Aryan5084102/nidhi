"use client";

import { useState } from "react";
import { complianceChecklist, complianceScore, regulatoryFilings } from "@/data/mockData";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "checklist", label: "Compliance Checklist" },
  { id: "filings", label: "Regulatory Filings" },
  { id: "regulations", label: "Nidhi Rules" },
];

function ComplianceStatusBadge({ status }) {
  const styles = {
    Compliant: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Warning: "bg-amber-50 text-amber-600 border-amber-200/60",
    "Action Required": "bg-red-50 text-red-500 border-red-200/60",
    "Non-Compliant": "bg-red-50 text-red-500 border-red-200/60",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function FilingStatusBadge({ status }) {
  const styles = {
    Filed: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Upcoming: "bg-blue-50 text-blue-600 border-blue-200/60",
    Overdue: "bg-red-50 text-red-500 border-red-200/60",
    "Not Required": "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function DashboardTab() {
  const compliant = complianceChecklist.filter((c) => c.status === "Compliant").length;
  const warning = complianceChecklist.filter((c) => c.status === "Warning").length;
  const action = complianceChecklist.filter((c) => c.status === "Action Required").length;

  return (
    <div className="animate-fade-in">
      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 lg:col-span-1">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Overall Compliance Score</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={complianceScore.overall >= 90 ? "#059669" : complianceScore.overall >= 70 ? "#D97706" : "#DC2626"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${complianceScore.overall * 3.14} 314`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[28px] font-bold font-mono text-slate-900">{complianceScore.overall}%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Score</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-emerald-600">{compliant}</div>
              <div className="text-[10px] text-slate-400">Compliant</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-amber-600">{warning}</div>
              <div className="text-[10px] text-slate-400">Warning</div>
            </div>
            <div className="bg-red-50 rounded-xl p-2">
              <div className="text-[16px] font-bold text-red-500">{action}</div>
              <div className="text-[10px] text-slate-400">Action</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 lg:col-span-2">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Category-wise Compliance</h3>
          <div className="flex flex-col gap-3">
            {complianceScore.categories.map((cat) => (
              <div key={cat.name} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-semibold text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Weight: {cat.weight}%</span>
                    <span className={`text-[13px] font-bold font-mono ${cat.score >= 90 ? "text-emerald-600" : cat.score >= 70 ? "text-amber-600" : "text-red-500"}`}>{cat.score}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: cat.score >= 90 ? "#059669" : cat.score >= 70 ? "#D97706" : "#DC2626" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Items Requiring Attention</h3>
        <div className="flex flex-col gap-3">
          {complianceChecklist.filter((c) => c.status !== "Compliant").map((item) => (
            <div key={item.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === "Warning" ? "bg-amber-50 border border-amber-200/60" : "bg-red-50 border border-red-200/60"}`}>
                <svg className={`w-4 h-4 ${item.status === "Warning" ? "text-amber-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-semibold text-slate-700">{item.rule}</div>
                  <ComplianceStatusBadge status={item.status} />
                </div>
                <div className="text-[12px] text-slate-400 mt-1">{item.details}</div>
                <div className="text-[11px] text-slate-300 mt-2">Last Audit: {item.lastAudit} &middot; {item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChecklistTab() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = complianceChecklist.filter((c) => filterStatus === "All" || c.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div className="flex gap-2 mb-5">
        {["All", "Compliant", "Warning", "Action Required"].map((f) => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${filterStatus === f ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Compliance Rule</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Category</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Last Audit</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{c.id}</td>
                <td className="px-5 py-3">
                  <div className="text-[13px] font-medium text-slate-700">{c.rule}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{c.details}</div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c.category}</span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{c.lastAudit}</td>
                <td className="px-5 py-3"><ComplianceStatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilingsTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1">Regulatory Filing Tracker</h3>
            <p className="text-[13px] text-slate-400">Track all mandatory filings with MCA/ROC as per Nidhi Company regulations.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-emerald-50 rounded-xl px-3 py-2 text-center border border-emerald-200/60">
              <div className="text-lg font-bold text-emerald-600 font-mono">{regulatoryFilings.filter((f) => f.status === "Filed").length}</div>
              <div className="text-slate-400 text-[10px]">Filed</div>
            </div>
            <div className="bg-blue-50 rounded-xl px-3 py-2 text-center border border-blue-200/60">
              <div className="text-lg font-bold text-blue-600 font-mono">{regulatoryFilings.filter((f) => f.status === "Upcoming").length}</div>
              <div className="text-slate-400 text-[10px]">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulatoryFilings.map((f) => (
          <div key={f.form} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-slate-900">{f.form}</div>
                <div className="text-[12px] text-slate-400 mt-0.5">{f.description}</div>
              </div>
              <FilingStatusBadge status={f.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
                <div className="text-[13px] font-semibold text-slate-700">{f.dueDate}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Filed Date</div>
                <div className="text-[13px] font-semibold text-slate-700">{f.filedDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegulationsTab() {
  const nidhiRules = [
    { title: "Nidhi Rules 2014", sections: [
      "Rule 3: Membership minimum 200 within 1 year of incorporation.",
      "Rule 4: Net Owned Funds shall not be less than ₹10 Lakhs (revised to ₹20 Lakhs).",
      "Rule 5: Ratio of Net Owned Funds to deposits shall not exceed 1:20.",
      "Rule 6: Unencumbered term deposits must be at least 10% of outstanding deposits.",
    ]},
    { title: "Nidhi (Amendment) Rules 2022", sections: [
      "Net Owned Funds requirement increased to ₹20 Lakhs.",
      "Introduction of NDH-4 form for Nidhi declaration application.",
      "Revised timelines for meeting membership and NOF requirements.",
      "Enhanced KYC and due diligence requirements for members.",
    ]},
    { title: "Lending & Deposit Limits", sections: [
      "Loans only to members (min 1 year membership for secured, 3 years for unsecured).",
      "Maximum unsecured loan: ₹2,00,000 per member.",
      "Deposits accepted only from members enrolled for at least 1 year.",
      "Interest on deposits must not exceed ceiling prescribed by RBI.",
    ]},
    { title: "Governance Requirements", sections: [
      "Board of Directors must have minimum 3 directors.",
      "Annual filing of NDH-1 (compliance return) and NDH-3 (half-yearly return).",
      "Annual General Meeting within 6 months of financial year end.",
      "Statutory audit by qualified Chartered Accountant.",
    ]},
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 mb-6 text-[12px] text-amber-700">
        This section provides a reference summary of key Nidhi Company regulations. For complete rules, refer to the Companies Act 2013, Nidhi Rules 2014, and subsequent amendments.
      </div>

      <div className="flex flex-col gap-4">
        {nidhiRules.map((rule) => (
          <div key={rule.title} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-900 mb-3">{rule.title}</h3>
            <div className="flex flex-col gap-2">
              {rule.sections.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] text-slate-500">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-indigo-500">
                    {i + 1}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComplianceView() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "checklist": return <ChecklistTab />;
      case "filings": return <FilingsTab />;
      case "regulations": return <RegulationsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Compliance Center</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              Monitor regulatory compliance status across all Nidhi Company rules.
              AI-powered compliance tracking ensures adherence to Nidhi Rules 2014,
              Nidhi (Amendment) Rules 2022, and MCA filing requirements.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-emerald-600 font-mono">{complianceScore.overall}%</div>
              <div className="text-slate-400 text-[10px]">Compliance Score</div>
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
