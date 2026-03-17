"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const commissionSummary = [
  { label: "Total Commission Earned", value: "₹12,45,000", color: "text-primary", bg: "bg-primary-50" },
  { label: "This Month", value: "₹1,85,000", color: "text-success", bg: "bg-success-50" },
  { label: "Pending Payout", value: "₹45,000", color: "text-warning", bg: "bg-warning-50" },
  { label: "Commission Rate", value: "5%", color: "text-secondary", bg: "bg-secondary-50" },
];

const commissionLedger = [
  { auctionId: "AUC-2026-001", scheme: "Glimmora Gold 25L", auctionDate: "2026-03-01", potSize: 2500000, commission: 125000, tds: 12500, net: 112500, status: "Paid" },
  { auctionId: "AUC-2026-002", scheme: "Glimmora Silver 10L", auctionDate: "2026-03-05", potSize: 1000000, commission: 50000, tds: 5000, net: 45000, status: "Paid" },
  { auctionId: "AUC-2026-003", scheme: "Glimmora Diamond 50L", auctionDate: "2026-03-08", potSize: 5000000, commission: 250000, tds: 25000, net: 225000, status: "Processing" },
  { auctionId: "AUC-2026-004", scheme: "Glimmora Platinum 1Cr", auctionDate: "2026-03-10", potSize: 10000000, commission: 500000, tds: 50000, net: 450000, status: "Paid" },
  { auctionId: "AUC-2026-005", scheme: "Glimmora Bronze 5L", auctionDate: "2026-03-11", potSize: 500000, commission: 25000, tds: 2500, net: 22500, status: "Paid" },
  { auctionId: "AUC-2026-006", scheme: "Glimmora Ruby 15L", auctionDate: "2026-03-12", potSize: 1500000, commission: 75000, tds: 7500, net: 67500, status: "Pending" },
  { auctionId: "AUC-2026-007", scheme: "Glimmora Gold 25L", auctionDate: "2026-03-13", potSize: 2500000, commission: 125000, tds: 12500, net: 112500, status: "Pending" },
  { auctionId: "AUC-2026-008", scheme: "Glimmora Silver 10L", auctionDate: "2026-03-14", potSize: 1000000, commission: 50000, tds: 5000, net: 45000, status: "Processing" },
  { auctionId: "AUC-2026-009", scheme: "Glimmora Diamond 50L", auctionDate: "2026-03-15", potSize: 5000000, commission: 250000, tds: 25000, net: 225000, status: "Paid" },
  { auctionId: "AUC-2026-010", scheme: "Glimmora Platinum 1Cr", auctionDate: "2026-03-16", potSize: 10000000, commission: 500000, tds: 50000, net: 450000, status: "Pending" },
];

const schemeWiseCommission = [
  { name: "Glimmora Gold 25L", totalAuctions: 8, totalDuration: 20, totalCommission: 1000000, avgCommission: 125000, color: "#F59E0B" },
  { name: "Glimmora Silver 10L", totalAuctions: 10, totalDuration: 20, totalCommission: 500000, avgCommission: 50000, color: "#94A3B8" },
  { name: "Glimmora Diamond 50L", totalAuctions: 6, totalDuration: 20, totalCommission: 1500000, avgCommission: 250000, color: "#8B5CF6" },
  { name: "Glimmora Platinum 1Cr", totalAuctions: 4, totalDuration: 20, totalCommission: 2000000, avgCommission: 500000, color: "#6366F1" },
  { name: "Glimmora Bronze 5L", totalAuctions: 12, totalDuration: 20, totalCommission: 300000, avgCommission: 25000, color: "#D97706" },
  { name: "Glimmora Ruby 15L", totalAuctions: 7, totalDuration: 20, totalCommission: 525000, avgCommission: 75000, color: "#EF4444" },
];

/* ─── Helpers ───────────────────────────────────────────────────────── */

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── Component ─────────────────────────────────────────────────────── */

export default function ForemanCommissionTab() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLedger =
    statusFilter === "All"
      ? commissionLedger
      : commissionLedger.filter((row) => row.status === statusFilter);

  const statusOptions = ["All", "Paid", "Pending", "Processing"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Commission Summary ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionSummary.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 card-shadow border border-slate-100"
          >
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">
              {stat.label}
            </div>
            <div className={`text-[22px] font-mono font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className={`mt-3 h-1 rounded-full ${stat.bg}`} />
          </div>
        ))}
      </div>

      {/* ── Commission Ledger ───────────────────────────────────────── */}
      <SectionCard title="Commission Ledger">
        {/* Filter Row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] text-heading mr-1">Filter:</span>
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                statusFilter === opt
                  ? "bg-primary-50 border-primary-300 text-primary"
                  : "bg-slate-50 border-slate-200 text-heading hover:border-slate-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Auction ID", "Scheme", "Auction Date", "Pot Size", "Commission (5%)", "TDS Deducted", "Net Payout", "Status"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-[10px] text-heading uppercase tracking-wider font-semibold pb-3 pr-4 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLedger.map((row) => (
                <tr
                  key={row.auctionId}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3 pr-4 text-[12px] font-mono font-semibold text-primary">
                    {row.auctionId}
                  </td>
                  <td className="py-3 pr-4 text-[12px] text-body font-medium">
                    {row.scheme}
                  </td>
                  <td className="py-3 pr-4 text-[12px] text-slate-500">
                    {formatDate(row.auctionDate)}
                  </td>
                  <td className="py-3 pr-4 text-[12px] font-mono font-bold text-slate-800">
                    {formatCurrency(row.potSize)}
                  </td>
                  <td className="py-3 pr-4 text-[12px] font-mono font-bold text-success">
                    {formatCurrency(row.commission)}
                  </td>
                  <td className="py-3 pr-4 text-[12px] font-mono text-danger-500">
                    -{formatCurrency(row.tds)}
                  </td>
                  <td className="py-3 pr-4 text-[12px] font-mono font-bold text-heading">
                    {formatCurrency(row.net)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-[13px] text-heading"
                  >
                    No records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-heading">
            Showing {filteredLedger.length} of {commissionLedger.length} entries
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-heading">
              Total Net Payout:{" "}
              <strong className="font-mono text-body">
                {formatCurrency(filteredLedger.reduce((sum, r) => sum + r.net, 0))}
              </strong>
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ── Scheme-wise Commission ──────────────────────────────────── */}
      <SectionCard title="Scheme-wise Commission Breakdown">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemeWiseCommission.map((scheme) => (
            <div
              key={scheme.name}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-sm transition-all duration-200"
            >
              {/* Scheme Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: scheme.color }}
                />
                <h4 className="text-[13px] font-bold text-slate-800 truncate">
                  {scheme.name}
                </h4>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-0.5">
                    Auctions Held
                  </div>
                  <div className="text-[15px] font-mono font-bold text-slate-800">
                    {scheme.totalAuctions}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-0.5">
                    Total Commission
                  </div>
                  <div className="text-[15px] font-mono font-bold text-success">
                    {formatCurrency(scheme.totalCommission)}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-heading uppercase tracking-wider mb-0.5">
                    Avg Commission / Auction
                  </div>
                  <div className="text-[14px] font-mono font-bold text-primary">
                    {formatCurrency(scheme.avgCommission)}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-heading">
                    {scheme.totalAuctions}/{scheme.totalDuration} auctions completed
                  </span>
                  <span className="text-[11px] text-heading font-mono">
                    {((scheme.totalAuctions / scheme.totalDuration) * 100).toFixed(0)}%
                  </span>
                </div>
                <ProgressBar
                  value={scheme.totalAuctions}
                  max={scheme.totalDuration}
                  color={scheme.color}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
