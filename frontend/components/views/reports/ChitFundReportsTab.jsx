"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

const REPORT_TYPES = [
  { id: "collection", label: "Scheme-wise Collection Summary", description: "Monthly/quarterly collection summary by scheme with collected vs. expected analysis", icon: "C" },
  { id: "dividend", label: "Dividend Distribution Report", description: "Per subscriber per cycle dividend distribution with payout history", icon: "D" },
  { id: "discount", label: "Auction Discount Register", description: "Scheme-wise discount register showing bid amounts, discount %, and compliance status", icon: "A" },
  { id: "overdue", label: "Subscriber Overdue Instalment Report", description: "Members with overdue installments across all active chit schemes", icon: "O" },
  { id: "withdrawal", label: "Withdrawal & Refund Summary", description: "Summary of all withdrawals, commission deductions, and refund amounts", icon: "W" },
  { id: "registrar", label: "Registrar Return Format Report", description: "Exportable report in format required by Registrar of Chits per scheme", icon: "R" },
];

const collectionData = [
  { scheme: "Vasuprada Sahaya 2L", bracket: "Low", expected: 200000, collected: 180000, shortfall: 20000, collectionPct: 90 },
  { scheme: "Vasuprada Sahaya 5L", bracket: "Low", expected: 440000, collected: 440000, shortfall: 0, collectionPct: 100 },
  { scheme: "Vasuprada Samruddhi 10L", bracket: "Medium", expected: 750000, collected: 700000, shortfall: 50000, collectionPct: 93 },
  { scheme: "Vasuprada Samruddhi 7.5L", bracket: "Medium", expected: 750000, collected: 750000, shortfall: 0, collectionPct: 100 },
  { scheme: "Vasuprada Unnati 15L", bracket: "Upper Medium", expected: 900000, collected: 825000, shortfall: 75000, collectionPct: 92 },
  { scheme: "Vasuprada Unnati 25L", bracket: "Upper Medium", expected: 800000, collected: 800000, shortfall: 0, collectionPct: 100 },
  { scheme: "Vasuprada Shikhar 50L", bracket: "High", expected: 2000000, collected: 1800000, shortfall: 200000, collectionPct: 90 },
  { scheme: "Vasuprada Shikhar 30L", bracket: "High", expected: 2400000, collected: 2280000, shortfall: 120000, collectionPct: 95 },
];

const cashFlowData = [
  { month: "Apr 2026", expectedCollection: 8240000, expectedPayout: 5000000, netFlow: 3240000 },
  { month: "May 2026", expectedCollection: 8240000, expectedPayout: 5500000, netFlow: 2740000 },
  { month: "Jun 2026", expectedCollection: 8240000, expectedPayout: 4800000, netFlow: 3440000 },
  { month: "Jul 2026", expectedCollection: 8240000, expectedPayout: 5200000, netFlow: 3040000 },
  { month: "Aug 2026", expectedCollection: 8240000, expectedPayout: 5100000, netFlow: 3140000 },
  { month: "Sep 2026", expectedCollection: 8240000, expectedPayout: 4900000, netFlow: 3340000 },
];

export default function ChitFundReportsTab() {
  const [activeReport, setActiveReport] = useState("collection");

  return (
    <div className="animate-fade-in space-y-6">
      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`text-left bg-white rounded-2xl p-5 card-shadow border transition-all duration-200 cursor-pointer ${
              activeReport === r.id
                ? "border-primary-300 ring-2 ring-primary-500/10"
                : "border-slate-100 hover:border-slate-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold ${
                activeReport === r.id ? "bg-primary-50 text-primary" : "bg-slate-50 text-heading"
              }`}>{r.icon}</div>
              <h4 className="text-[13px] font-bold text-heading">{r.label}</h4>
            </div>
            <p className="text-[11px] text-heading leading-relaxed">{r.description}</p>
          </button>
        ))}
      </div>

      {/* Collection Summary Report */}
      {activeReport === "collection" && (
        <SectionCard title="Scheme-wise Collection Summary — March 2026">
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Scheme", "Bracket", "Expected", "Collected", "Shortfall", "Collection %"].map((col) => (
                    <th key={col} className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collectionData.map((row) => (
                  <tr key={row.scheme} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 text-[12px] font-semibold text-body">{row.scheme}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        row.bracket === "Low" ? "bg-success-50 text-success border-success-200/60"
                        : row.bracket === "Medium" ? "bg-blue-50 text-blue-600 border-blue-200"
                        : row.bracket === "Upper Medium" ? "bg-warning-50 text-warning border-warning-200/60"
                        : "bg-secondary-50 text-secondary border-secondary-200/60"
                      }`}>{row.bracket}</span>
                    </td>
                    <td className="py-3 pr-4 text-[12px] font-mono text-heading">{formatCurrency(row.expected)}</td>
                    <td className="py-3 pr-4 text-[12px] font-mono font-bold text-success">{formatCurrency(row.collected)}</td>
                    <td className="py-3 pr-4 text-[12px] font-mono text-danger-500">{row.shortfall > 0 ? formatCurrency(row.shortfall) : "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.collectionPct}%`, background: row.collectionPct >= 100 ? "#059669" : row.collectionPct >= 90 ? "#3B82F6" : "#EF4444" }} />
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-body">{row.collectionPct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <span className="text-[11px] text-heading">
              Total Collected: <strong className="font-mono text-success">{formatCurrency(collectionData.reduce((s, r) => s + r.collected, 0))}</strong>
            </span>
            <button className="text-[11px] text-primary font-semibold cursor-pointer hover:text-primary-700 transition-colors">Export as PDF</button>
          </div>
        </SectionCard>
      )}

      {/* Cash Flow Projections */}
      {activeReport === "collection" && (
        <SectionCard title="Cash Flow Projections — Next 6 Months">
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Month", "Expected Collections", "Expected Payouts", "Net Cash Flow"].map((col) => (
                    <th key={col} className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cashFlowData.map((row) => (
                  <tr key={row.month} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 text-[12px] font-semibold text-body">{row.month}</td>
                    <td className="py-3 pr-4 text-[12px] font-mono text-primary">{formatCurrency(row.expectedCollection)}</td>
                    <td className="py-3 pr-4 text-[12px] font-mono text-danger-500">{formatCurrency(row.expectedPayout)}</td>
                    <td className="py-3 pr-4 text-[12px] font-mono font-bold text-success">{formatCurrency(row.netFlow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Placeholder for other report types */}
      {activeReport !== "collection" && (
        <SectionCard title={REPORT_TYPES.find((r) => r.id === activeReport)?.label || ""}>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary text-lg font-bold mx-auto mb-3">
              {REPORT_TYPES.find((r) => r.id === activeReport)?.icon}
            </div>
            <p className="text-[13px] text-heading mb-2">{REPORT_TYPES.find((r) => r.id === activeReport)?.description}</p>
            <button className="mt-3 px-4 py-2 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-primary-100 transition-colors">
              Generate Report
            </button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
