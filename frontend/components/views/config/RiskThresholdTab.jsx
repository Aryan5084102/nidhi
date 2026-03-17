"use client";

import SectionCard from "@/components/ui/SectionCard";

/* ─── Inline Data: Risk Threshold Settings ─── */
const riskCategories = [
  {
    name: "Credit Risk", color: "indigo",
    settings: [
      { label: "Max Loan Amount", current: "\u20B915,00,000", recommended: "\u20B910,00,000", lastUpdated: "01 Mar 2026", nearLimit: false },
      { label: "Min STI Score for Approval", current: "50", recommended: "55", lastUpdated: "15 Feb 2026", nearLimit: true },
      { label: "NPA Threshold (Missed EMIs)", current: "3", recommended: "3", lastUpdated: "01 Jan 2026", nearLimit: false },
      { label: "Default EMI Limit per Member", current: "\u20B950,000", recommended: "\u20B940,000", lastUpdated: "20 Feb 2026", nearLimit: false },
    ],
  },
  {
    name: "Liquidity Risk", color: "amber",
    settings: [
      { label: "Min Liquidity Ratio", current: "1.45", recommended: "1.50", lastUpdated: "10 Mar 2026", nearLimit: true },
      { label: "Unencumbered Deposit %", current: "11.2%", recommended: "15%", lastUpdated: "28 Feb 2026", nearLimit: true },
      { label: "Cash Reserve Requirement", current: "12%", recommended: "12%", lastUpdated: "01 Mar 2026", nearLimit: false },
    ],
  },
  {
    name: "Fraud Risk", color: "red",
    settings: [
      { label: "Fraud Sensitivity Level", current: "High", recommended: "High", lastUpdated: "10 Mar 2026", nearLimit: false },
      { label: "Max Transaction Limit", current: "\u20B95,00,000", recommended: "\u20B95,00,000", lastUpdated: "01 Feb 2026", nearLimit: false },
      { label: "Structuring Threshold", current: "\u20B92,00,000", recommended: "\u20B91,50,000", lastUpdated: "15 Feb 2026", nearLimit: true },
      { label: "Collusion Detection Sensitivity", current: "Medium", recommended: "High", lastUpdated: "05 Mar 2026", nearLimit: true },
    ],
  },
  {
    name: "Compliance Risk", color: "emerald",
    settings: [
      { label: "KYC Re-verification Period", current: "12 months", recommended: "12 months", lastUpdated: "01 Jan 2026", nearLimit: false },
      { label: "Filing Reminder Days", current: "30 days", recommended: "45 days", lastUpdated: "01 Feb 2026", nearLimit: false },
      { label: "Rate Cap Margin (above bank rate)", current: "3.5%", recommended: "3.0%", lastUpdated: "01 Mar 2026", nearLimit: true },
    ],
  },
  {
    name: "Member Risk", color: "violet",
    settings: [
      { label: "STI Recalculation Frequency", current: "Weekly", recommended: "Weekly", lastUpdated: "01 Mar 2026", nearLimit: false },
      { label: "Churn Prediction Threshold", current: "65%", recommended: "60%", lastUpdated: "15 Feb 2026", nearLimit: false },
      { label: "Watch List Criteria (STI below)", current: "40", recommended: "45", lastUpdated: "01 Mar 2026", nearLimit: true },
    ],
  },
];

const colorMap = {
  indigo: { bg: "bg-primary-50", border: "border-primary-200/60", text: "text-primary" },
  amber: { bg: "bg-warning-50", border: "border-warning-200/60", text: "text-warning" },
  red: { bg: "bg-danger-50", border: "border-danger-200/60", text: "text-danger-500" },
  emerald: { bg: "bg-success-50", border: "border-success-200/60", text: "text-success" },
  violet: { bg: "bg-violet-50", border: "border-violet-200/60", text: "text-violet-600" },
};

export default function RiskThresholdTab() {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-heading mb-1">Risk Threshold Settings</h3>
        <p className="text-[13px] text-heading">Configure risk parameters across Credit, Liquidity, Fraud, Compliance, and Member risk categories. Values near regulatory limits are flagged.</p>
      </SectionCard>

      <div className="flex flex-col gap-5">
        {riskCategories.map((cat) => {
          const c = colorMap[cat.color];
          return (
            <div key={cat.name}>
              <SectionCard className="mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                    {cat.name}
                  </span>
                </div>
              </SectionCard>

              <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
                <div className="flex flex-col divide-y divide-slate-100">
                  {cat.settings.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-body">{s.label}</span>
                          {s.nearLimit && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-warning-50 text-warning border-warning-200/60">
                              Near Limit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-heading mt-0.5">Last updated: {s.lastUpdated}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-body font-mono min-w-[120px] text-right">
                            {s.current}
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="text-[10px] text-heading">Recommended</div>
                          <div className="text-[12px] font-mono text-slate-500">{s.recommended}</div>
                        </div>
                        <button className="text-[11px] text-primary-500 hover:text-primary-700 font-medium cursor-pointer transition-colors">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
