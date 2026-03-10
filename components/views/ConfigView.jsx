"use client";

import { useState } from "react";
import { systemConfig, auditLog } from "@/data/mockData";

const tabs = [
  { id: "general", label: "General" },
  { id: "deposits", label: "Deposits" },
  { id: "loans", label: "Loans" },
  { id: "chitfunds", label: "Chit Funds" },
  { id: "ai", label: "AI & Agents" },
  { id: "notifications", label: "Notifications" },
  { id: "audit", label: "Audit Log" },
];

function ConfigSection({ title, description, configs }) {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-[13px] text-slate-400">{description}</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <div className="flex flex-col divide-y divide-slate-100">
          {configs.map((config) => (
            <div key={config.key} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-700">{config.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{config.key}</div>
              </div>
              <div className="flex items-center gap-3">
                {config.type === "toggle" ? (
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${config.value === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${config.value === "Enabled" ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-slate-700 font-mono min-w-[200px] text-right">
                    {config.value}
                  </div>
                )}
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLogTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">System Audit Log</h3>
        <p className="text-[13px] text-slate-400">Track all administrative actions, configuration changes, and system events.</p>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">ID</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Action</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">User</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Details</th>
              <th className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((log) => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{log.id}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    log.action.includes("Alert") || log.action.includes("Suspended")
                      ? "bg-red-50 text-red-500 border-red-200/60"
                      : log.action.includes("Updated") || log.action.includes("Changed")
                      ? "bg-blue-50 text-blue-600 border-blue-200/60"
                      : log.action.includes("Completed") || log.action.includes("Restarted")
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[12px] font-medium ${log.user === "System" ? "text-slate-400" : log.user === "AI Agent" ? "text-indigo-500" : "text-slate-700"}`}>
                    {log.user}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[300px]">{log.detail}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ConfigView() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <ConfigSection title="General Settings" description="Core company information and system-wide configuration for Glimmora Nidhi Limited." configs={systemConfig.general} />;
      case "deposits":
        return <ConfigSection title="Deposit Configuration" description="Configure interest rates, limits, and rules for Fixed, Recurring, and Savings deposit schemes." configs={systemConfig.deposits} />;
      case "loans":
        return <ConfigSection title="Loan Configuration" description="Set lending parameters, interest rate caps, and risk thresholds as per Nidhi Rules." configs={systemConfig.loans} />;
      case "chitfunds":
        return <ConfigSection title="Chit Fund Configuration" description="Configure auction rules, foreman commission, and subscriber limits governed by Chit Funds Act 1982." configs={systemConfig.chitFunds} />;
      case "ai":
        return <ConfigSection title="AI & Agent Settings" description="Manage AI model versions, fraud detection sensitivity, and autonomous agent configurations." configs={systemConfig.ai} />;
      case "notifications":
        return <ConfigSection title="Notification Settings" description="Configure member communication channels and alert thresholds for EMIs, maturities, and events." configs={systemConfig.notifications} />;
      case "audit":
        return <AuditLogTab />;
      default:
        return <ConfigSection title="General Settings" description="Core company settings." configs={systemConfig.general} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-1">Admin & Configuration</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
              System-wide settings for Glimmora Nidhi operations. Configure deposit schemes,
              loan parameters, chit fund rules, AI agent behaviour, and notification preferences.
              All settings are audited and comply with Nidhi Company regulatory requirements.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-slate-600 font-mono">v2.4</div>
              <div className="text-slate-400 text-[10px]">System Version</div>
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
