"use client";

import { systemConfig } from "@/data/mockData";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

/* ─── Inline Data: AI Agent Configuration ─── */
const aiAgents = [
  { name: "Onboarding Agent", status: "Active", model: "v2.4.1", lastTrained: "08 Mar 2026", accuracy: 96.2, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Compliance Agent", status: "Active", model: "v2.3.8", lastTrained: "05 Mar 2026", accuracy: 98.1, autoEscalation: true, autoApprove: false, learningMode: false },
  { name: "Risk Review Agent", status: "Warning", model: "v2.4.0", lastTrained: "01 Mar 2026", accuracy: 91.5, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Liquidity Agent", status: "Active", model: "v2.2.5", lastTrained: "06 Mar 2026", accuracy: 94.8, autoEscalation: false, autoApprove: true, learningMode: false },
  { name: "Fraud Triage Agent", status: "Alert", model: "v2.4.2", lastTrained: "10 Mar 2026", accuracy: 89.3, autoEscalation: true, autoApprove: false, learningMode: true },
  { name: "Executive Reporting", status: "Active", model: "v2.1.0", lastTrained: "03 Mar 2026", accuracy: 97.6, autoEscalation: false, autoApprove: true, learningMode: false },
];

const agentThresholds = [
  { agent: "Onboarding Agent", metric: "KYC Verification Timeout", value: "30 sec", limit: "60 sec" },
  { agent: "Compliance Agent", metric: "Regulatory Check Interval", value: "6 hours", limit: "24 hours" },
  { agent: "Risk Review Agent", metric: "STI Recalculation Delay", value: "15 min", limit: "60 min" },
  { agent: "Liquidity Agent", metric: "Cash Reserve Alert Threshold", value: "12%", limit: "10%" },
  { agent: "Fraud Triage Agent", metric: "False Positive Tolerance", value: "15%", limit: "20%" },
  { agent: "Executive Reporting", metric: "Report Generation Timeout", value: "5 min", limit: "15 min" },
];

const thresholdColumns = [
  { key: "agent", label: "Agent" },
  { key: "metric", label: "Metric" },
  { key: "value", label: "Current Value" },
  { key: "limit", label: "Limit" },
  { key: "action", label: "Action" },
];

export default function AIAgentConfigTab() {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">AI Agent Configuration</h3>
        <p className="text-[13px] text-slate-400">Manage AI model versions, fraud detection sensitivity, and autonomous agent configurations.</p>
      </SectionCard>

      {/* Existing AI config rows */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto mb-5">
        <div className="px-5 py-3 border-b border-slate-100">
          <h4 className="text-[13px] font-bold text-slate-700">Global AI Settings</h4>
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {systemConfig.ai.map((config) => (
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
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Cards */}
      <SectionCard className="mb-4">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Agent Instances</h4>
        <p className="text-[11px] text-slate-400">Individual AI agent status, model versions, and behaviour toggles.</p>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {aiAgents.map((ag) => (
          <div key={ag.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900">{ag.name}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5">Model: <span className="font-mono text-slate-600">{ag.model}</span></div>
              </div>
              <StatusBadge status={ag.status} />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-[18px] font-bold text-indigo-600">{ag.accuracy}%</div>
                <div className="text-[10px] text-slate-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-slate-500">{ag.lastTrained}</div>
                <div className="text-[10px] text-slate-400">Last Trained</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Auto-escalation", enabled: ag.autoEscalation },
                { label: "Auto-approve", enabled: ag.autoApprove },
                { label: "Learning mode", enabled: ag.learningMode },
              ].map((toggle) => (
                <div key={toggle.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-600">{toggle.label}</span>
                  <div className={`w-9 h-[18px] rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${toggle.enabled ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${toggle.enabled ? "translate-x-[18px]" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Behaviour Thresholds */}
      <SectionCard className="mb-4">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Agent Behaviour Thresholds</h4>
        <p className="text-[11px] text-slate-400">Performance and operational limits for each agent.</p>
      </SectionCard>

      <DataTable
        columns={thresholdColumns}
        data={agentThresholds}
        renderRow={(t, i) => (
          <tr key={i} className="border-b border-slate-50 whitespace-nowrap hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-3 text-[12px] font-semibold text-slate-700">{t.agent}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{t.metric}</td>
            <td className="px-5 py-3 text-[12px] font-mono text-slate-700">{t.value}</td>
            <td className="px-5 py-3 text-[12px] font-mono text-slate-400">{t.limit}</td>
            <td className="px-5 py-3">
              <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">Edit</button>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
