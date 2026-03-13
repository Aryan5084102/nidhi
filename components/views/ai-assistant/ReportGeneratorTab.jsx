"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";

const reportTemplates = [
  { name: "Monthly Financial", desc: "P&L, balance sheet, cash flow summary", pages: 28, lastGen: "28 Feb 2026" },
  { name: "Compliance Status", desc: "NDH filings, regulatory ratios, KYC status", pages: 18, lastGen: "01 Mar 2026" },
  { name: "Risk Assessment", desc: "Credit, liquidity, fraud & operational risk", pages: 34, lastGen: "25 Feb 2026" },
  { name: "Member Analytics", desc: "Growth, churn, deposit & loan behavior", pages: 22, lastGen: "01 Mar 2026" },
  { name: "Loan Portfolio", desc: "NPA analysis, collection efficiency, provisioning", pages: 26, lastGen: "28 Feb 2026" },
  { name: "Board Summary", desc: "Executive dashboard for board review", pages: 12, lastGen: "15 Feb 2026" },
];

const generatedReports = [
  { name: "Monthly Financial — Feb 2026", date: "28 Feb 2026", format: "PDF", size: "2.4 MB", status: "Ready" },
  { name: "Compliance Status — Mar 2026", date: "01 Mar 2026", format: "PDF", size: "1.8 MB", status: "Ready" },
  { name: "Risk Assessment — Q1 2026", date: "25 Feb 2026", format: "Excel", size: "3.1 MB", status: "Ready" },
  { name: "Member Analytics — Feb 2026", date: "01 Mar 2026", format: "PDF", size: "2.0 MB", status: "Generating" },
  { name: "Board Summary — Jan 2026", date: "15 Feb 2026", format: "PDF", size: "1.2 MB", status: "Ready" },
];

export default function ReportGeneratorTab() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [format, setFormat] = useState("PDF");
  const [sections, setSections] = useState({
    summary: true,
    details: true,
    charts: true,
    recommendations: true,
    appendix: false,
  });

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      {/* Report templates */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Report Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportTemplates.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTemplate(t.name)}
              className={`text-left bg-white rounded-2xl p-5 card-shadow border transition-all cursor-pointer ${
                selectedTemplate === t.name
                  ? "border-indigo-300 ring-2 ring-indigo-500/10"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <h4 className="text-[13px] font-semibold text-slate-800">{t.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] text-slate-400">{t.pages} pages</span>
                <span className="text-[10px] text-slate-400">Last: {t.lastGen}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration panel */}
      {selectedTemplate && (
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Configure: {selectedTemplate} Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Date range */}
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">Date Range</p>
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue="01 Mar 2026"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  readOnly
                />
                <input
                  type="text"
                  defaultValue="31 Mar 2026"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  readOnly
                />
              </div>
            </div>

            {/* Sections */}
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">Include Sections</p>
              <div className="space-y-2">
                {Object.entries(sections).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() => toggleSection(key)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[13px] text-slate-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-2">Output Format</p>
              <div className="space-y-2">
                {["PDF", "Excel", "CSV"].map((f) => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={format === f}
                      onChange={() => setFormat(f)}
                      className="border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[13px] text-slate-700">{f}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button className="bg-indigo-600 text-white rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Generated reports table */}
      <div className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 whitespace-nowrap">
                {["Report Name", "Generated", "Format", "Size", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generatedReports.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors whitespace-nowrap">
                  <td className="px-4 py-3 text-[13px] text-slate-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500">{r.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.format} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-slate-500 font-mono">{r.size}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        r.status === "Ready"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : r.status === "Generating"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-red-50 text-red-500 border-red-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={`text-[11px] font-semibold px-3 py-1 rounded-lg border cursor-pointer transition-all ${
                        r.status === "Ready"
                          ? "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                          : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      }`}
                      disabled={r.status !== "Ready"}
                    >
                      Download
                    </button>
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
