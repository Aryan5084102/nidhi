"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

const drawMinutesData = [
  { id: "DM-001", scheme: "Vasuprada Sahaya 2L", schemeId: "CS-001", drawDate: "2026-03-05", type: "Lucky Draw", winnerMemberId: "M-1001", winnerName: "Rajesh Kumar", amountDisbursed: 185000, discountOffered: "N/A", ticketDrawn: "Ticket #14", witnesses: "Anita Desai, Suresh Babu", approvedBy: "Aryan Kumar", status: "Recorded" },
  { id: "DM-002", scheme: "Vasuprada Sahaya 2L", schemeId: "CS-001", drawDate: "2026-02-05", type: "Lucky Draw", winnerMemberId: "M-1005", winnerName: "Deepa Iyer", amountDisbursed: 190000, discountOffered: "N/A", ticketDrawn: "Ticket #7", witnesses: "Anita Desai, Kavitha Nambiar", approvedBy: "Aryan Kumar", status: "Recorded" },
  { id: "DM-003", scheme: "Vasuprada Samruddhi 10L", schemeId: "CS-003", drawDate: "2026-03-10", type: "Auction", winnerMemberId: "M-1002", winnerName: "Priya Mehta", amountDisbursed: 780000, discountOffered: "22%", ticketDrawn: "—", witnesses: "Anita Desai, Arun Pillai", approvedBy: "Aryan Kumar", status: "Recorded" },
  { id: "DM-004", scheme: "Vasuprada Shikhar 30L", schemeId: "CS-008", drawDate: "2026-03-18", type: "Auction", winnerMemberId: "M-1009", winnerName: "Suresh Babu", amountDisbursed: 2400000, discountOffered: "20%", ticketDrawn: "—", witnesses: "Aryan Kumar, Anita Desai", approvedBy: "Aryan Kumar", status: "Recorded" },
  { id: "DM-005", scheme: "Vasuprada Sahaya 5L", schemeId: "CS-002", drawDate: "2026-03-08", type: "Lucky Draw", winnerMemberId: "M-1006", winnerName: "Arun Pillai", amountDisbursed: 475000, discountOffered: "N/A", ticketDrawn: "Ticket #3", witnesses: "Anita Desai, Neha Singh", approvedBy: "Aryan Kumar", status: "Recorded" },
  { id: "DM-006", scheme: "Vasuprada Unnati 15L", schemeId: "CS-005", drawDate: "2026-04-15", type: "Auction", winnerMemberId: "—", winnerName: "—", amountDisbursed: 0, discountOffered: "—", ticketDrawn: "—", witnesses: "—", approvedBy: "—", status: "Scheduled" },
];

function formatCurrency(amount) {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DrawMinutesTab() {
  const [filterType, setFilterType] = useState("All");

  const filtered = filterType === "All" ? drawMinutesData : drawMinutesData.filter((d) => d.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Draws Recorded", value: drawMinutesData.filter((d) => d.status === "Recorded").length, color: "text-primary", bg: "bg-primary-50" },
          { label: "Lucky Draws", value: drawMinutesData.filter((d) => d.type === "Lucky Draw").length, color: "text-success", bg: "bg-success-50" },
          { label: "Auction Draws", value: drawMinutesData.filter((d) => d.type === "Auction").length, color: "text-warning", bg: "bg-warning-50" },
          { label: "Upcoming Draws", value: drawMinutesData.filter((d) => d.status === "Scheduled").length, color: "text-secondary", bg: "bg-secondary-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-[22px] font-mono font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`mt-3 h-1 rounded-full ${stat.bg}`} />
          </div>
        ))}
      </div>

      <SectionCard title="Draw Minutes Register — Chit Funds Act, 1982 (Sec. 22)">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] text-heading mr-1">Type:</span>
          {["All", "Lucky Draw", "Auction"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterType(opt)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                filterType === opt
                  ? "bg-primary-50 border-primary-300 text-primary"
                  : "bg-slate-50 border-slate-200 text-heading hover:border-slate-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Draw ID", "Scheme", "Date", "Type", "Winner", "Amount", "Discount", "Ticket/Bid", "Witnesses", "Status"].map((col) => (
                  <th key={col} className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 text-[12px] font-mono font-semibold text-primary">{d.id}</td>
                  <td className="py-3 pr-4 text-[12px] text-body font-medium">{d.scheme}</td>
                  <td className="py-3 pr-4 text-[12px] text-heading">{formatDate(d.drawDate)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      d.type === "Lucky Draw" ? "bg-success-50 text-success border-success-200/60" : "bg-warning-50 text-warning border-warning-200/60"
                    }`}>{d.type}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-[12px] font-semibold text-body">{d.winnerName}</div>
                    <div className="text-[10px] text-heading">{d.winnerMemberId}</div>
                  </td>
                  <td className="py-3 pr-4 text-[12px] font-mono font-bold text-success">{formatCurrency(d.amountDisbursed)}</td>
                  <td className="py-3 pr-4 text-[12px] font-mono text-body">{d.discountOffered}</td>
                  <td className="py-3 pr-4 text-[12px] text-body">{d.ticketDrawn}</td>
                  <td className="py-3 pr-4 text-[11px] text-heading">{d.witnesses}</td>
                  <td className="py-3"><StatusBadge status={d.status === "Recorded" ? "Active" : d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-heading">Showing {filtered.length} draw records</span>
          <button className="text-[11px] text-primary font-semibold cursor-pointer hover:text-primary-700 transition-colors">
            Export as PDF
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
