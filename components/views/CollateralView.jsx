"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

// ── Mock Data: Collateral Registry ──────────────────────────────────────────
const collateralData = [
  { id: "COL-001", member: "Rajesh Kumar", memberId: "M-1042", type: "Gold", description: "22K Gold Chain – 45g", value: "\u20B93,37,500", pledgedDate: "2025-06-12", status: "Active", linkedLoan: "LN-3021" },
  { id: "COL-002", member: "Priya Sharma", memberId: "M-1078", type: "Property", description: "Residential Plot – 1200 sq.ft, Whitefield", value: "\u20B928,00,000", pledgedDate: "2025-03-20", status: "Active", linkedLoan: "LN-2987" },
  { id: "COL-003", member: "Anil Reddy", memberId: "M-1103", type: "FD Receipt", description: "FD #FD-8821 – Glimmora Nidhi", value: "\u20B95,00,000", pledgedDate: "2025-08-01", status: "Under Review", linkedLoan: "LN-3105" },
  { id: "COL-004", member: "Sunita Devi", memberId: "M-1015", type: "Gold", description: "24K Gold Bangle – 30g", value: "\u20B92,25,000", pledgedDate: "2024-11-18", status: "Released", linkedLoan: "LN-2750" },
  { id: "COL-005", member: "Mohan Babu", memberId: "M-1130", type: "Property", description: "Commercial Shop – 400 sq.ft, MG Road", value: "\u20B945,00,000", pledgedDate: "2025-01-10", status: "Active", linkedLoan: "LN-2890" },
  { id: "COL-006", member: "Kavitha Nair", memberId: "M-1056", type: "Gold", description: "22K Gold Necklace Set – 60g", value: "\u20B94,50,000", pledgedDate: "2025-09-05", status: "Active", linkedLoan: "LN-3150" },
  { id: "COL-007", member: "Venkatesh Iyer", memberId: "M-1089", type: "FD Receipt", description: "FD #FD-9102 – SBI Branch Koramangala", value: "\u20B98,00,000", pledgedDate: "2025-04-22", status: "Under Review", linkedLoan: "LN-3012" },
  { id: "COL-008", member: "Lakshmi Prasad", memberId: "M-1145", type: "Property", description: "Agricultural Land – 2 Acres, Mandya", value: "\u20B936,00,000", pledgedDate: "2025-07-14", status: "Active", linkedLoan: "LN-3080" },
  { id: "COL-009", member: "Dinesh Patel", memberId: "M-1062", type: "Gold", description: "22K Gold Coins (10 pcs) – 100g", value: "\u20B97,50,000", pledgedDate: "2024-12-30", status: "Released", linkedLoan: "LN-2820" },
  { id: "COL-010", member: "Fatima Begum", memberId: "M-1121", type: "FD Receipt", description: "FD #FD-8654 – Glimmora Nidhi", value: "\u20B93,50,000", pledgedDate: "2025-10-02", status: "Active", linkedLoan: "LN-3190" },
];

// ── Mock Data: Guarantor Management ─────────────────────────────────────────
const guarantorData = [
  { id: "GRT-001", name: "Suresh Menon", phone: "+91 98450 12345", guaranteedFor: "Rajesh Kumar", scheme: "Chit Scheme A-12", exposure: "\u20B92,50,000", stiScore: 82, status: "Active", registeredDate: "2025-02-15" },
  { id: "GRT-002", name: "Meena Kumari", phone: "+91 99012 67890", guaranteedFor: "Priya Sharma", scheme: "Gold Loan GL-45", exposure: "\u20B95,00,000", stiScore: 74, status: "Active", registeredDate: "2025-03-10" },
  { id: "GRT-003", name: "Ravi Shankar", phone: "+91 98761 23456", guaranteedFor: "Anil Reddy", scheme: "Chit Scheme B-08", exposure: "\u20B93,00,000", stiScore: 68, status: "Expired", registeredDate: "2024-06-20" },
  { id: "GRT-004", name: "Anjali Desai", phone: "+91 97654 98765", guaranteedFor: "Mohan Babu", scheme: "Property Loan PL-22", exposure: "\u20B912,00,000", stiScore: 91, status: "Active", registeredDate: "2025-01-05" },
  { id: "GRT-005", name: "Prakash Rao", phone: "+91 98234 56789", guaranteedFor: "Kavitha Nair", scheme: "Chit Scheme A-15", exposure: "\u20B91,80,000", stiScore: 77, status: "Active", registeredDate: "2025-05-18" },
  { id: "GRT-006", name: "Geeta Bai", phone: "+91 99876 11223", guaranteedFor: "Sunita Devi", scheme: "Gold Loan GL-31", exposure: "\u20B91,50,000", stiScore: 45, status: "Defaulted", registeredDate: "2024-04-12" },
  { id: "GRT-007", name: "Harish Gowda", phone: "+91 98456 78901", guaranteedFor: "Venkatesh Iyer", scheme: "Chit Scheme C-03", exposure: "\u20B94,00,000", stiScore: 85, status: "Active", registeredDate: "2025-07-22" },
  { id: "GRT-008", name: "Nalini Joshi", phone: "+91 97890 34567", guaranteedFor: "Lakshmi Prasad", scheme: "Property Loan PL-18", exposure: "\u20B98,50,000", stiScore: 62, status: "Active", registeredDate: "2025-04-01" },
  { id: "GRT-009", name: "Siddharth Nair", phone: "+91 99012 45678", guaranteedFor: "Dinesh Patel", scheme: "Chit Scheme B-11", exposure: "\u20B92,20,000", stiScore: 53, status: "Expired", registeredDate: "2024-08-30" },
  { id: "GRT-010", name: "Padma Rani", phone: "+91 98123 99887", guaranteedFor: "Fatima Begum", scheme: "Gold Loan GL-52", exposure: "\u20B93,25,000", stiScore: 70, status: "Active", registeredDate: "2025-09-14" },
];

// ── Tab definitions ─────────────────────────────────────────────────────────
const tabs = [
  { id: "registry", label: "Collateral Registry" },
  { id: "guarantors", label: "Guarantor Management" },
  { id: "exposure", label: "Exposure Analysis" },
];

// ── Collateral columns ──────────────────────────────────────────────────────
const collateralColumns = [
  { key: "id", label: "ID" },
  { key: "member", label: "Member" },
  { key: "type", label: "Type" },
  { key: "description", label: "Description" },
  { key: "value", label: "Value" },
  { key: "pledgedDate", label: "Pledged Date" },
  { key: "status", label: "Status" },
  { key: "linkedLoan", label: "Linked Loan" },
];

// ── Guarantor columns ───────────────────────────────────────────────────────
const guarantorColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "guaranteedFor", label: "Guaranteed For" },
  { key: "scheme", label: "Scheme / Loan" },
  { key: "exposure", label: "Exposure" },
  { key: "stiScore", label: "STI Score" },
  { key: "status", label: "Status" },
  { key: "registeredDate", label: "Registered" },
];

// ── Helper: parse rupee string to number ────────────────────────────────────
function parseRupee(str) {
  return Number(str.replace(/[^\d]/g, ""));
}

function formatRupee(num) {
  return "\u20B9" + num.toLocaleString("en-IN");
}

// ── STI Score color ─────────────────────────────────────────────────────────
function stiColor(score) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger-500";
}

// ── Collateral Registry Tab ─────────────────────────────────────────────────
function CollateralRegistryTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = collateralData.filter((c) => {
    const matchesSearch =
      c.member.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member, ID, or description..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-heading hover:text-body transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Gold", "Property", "FD Receipt"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${
                filterType === f
                  ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                  : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
              }`}
            >
              {f === "All" ? "All Types" : f}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={collateralColumns}
        data={filtered}
        renderRow={(c) => (
          <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{c.id}</td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary-50 border border-primary-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                  {c.member.charAt(0)}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-body">{c.member}</div>
                  <div className="text-[10px] text-heading">{c.memberId}</div>
                </div>
              </div>
            </td>
            <td className="px-5 py-3">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                c.type === "Gold"
                  ? "bg-warning-50 text-warning border-warning-200/60"
                  : c.type === "Property"
                  ? "bg-blue-50 text-blue-600 border-blue-200/60"
                  : "bg-secondary-50 text-secondary border-secondary-200/60"
              }`}>
                {c.type}
              </span>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500 max-w-[200px] truncate">{c.description}</td>
            <td className="px-5 py-3 text-[13px] font-bold text-body font-mono">{c.value}</td>
            <td className="px-5 py-3 text-[12px] text-heading">{c.pledgedDate}</td>
            <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
            <td className="px-5 py-3">
              <span className="text-[12px] font-mono text-primary bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-200/60">{c.linkedLoan}</span>
            </td>
          </tr>
        )}
      />
      {filtered.length === 0 && (
        <div className="text-center py-10 text-[13px] text-heading">No collateral records found</div>
      )}
    </div>
  );
}

// ── Guarantor Management Tab ────────────────────────────────────────────────
function GuarantorManagementTab() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = guarantorData.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.guaranteedFor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guarantor name, ID, or member..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-body text-[13px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-subtle"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-heading hover:text-body transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", "Active", "Expired", "Defaulted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${
                filterStatus === f
                  ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                  : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
              }`}
            >
              {f === "All" ? "All Statuses" : f}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={guarantorColumns}
        data={filtered}
        renderRow={(g) => (
          <tr key={g.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors whitespace-nowrap">
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{g.id}</td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-success-50 border border-success-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-success">
                  {g.name.charAt(0)}
                </div>
                <div className="text-[13px] font-semibold text-body">{g.name}</div>
              </div>
            </td>
            <td className="px-5 py-3 text-[12px] text-slate-500 font-mono">{g.phone}</td>
            <td className="px-5 py-3 text-[13px] text-body">{g.guaranteedFor}</td>
            <td className="px-5 py-3 text-[12px] text-slate-500">{g.scheme}</td>
            <td className="px-5 py-3 text-[13px] font-bold text-body font-mono">{g.exposure}</td>
            <td className="px-5 py-3">
              <span className={`text-[13px] font-bold font-mono ${stiColor(g.stiScore)}`}>{g.stiScore}</span>
            </td>
            <td className="px-5 py-3"><StatusBadge status={g.status} /></td>
            <td className="px-5 py-3 text-[12px] text-heading">{g.registeredDate}</td>
          </tr>
        )}
      />
      {filtered.length === 0 && (
        <div className="text-center py-10 text-[13px] text-heading">No guarantors found</div>
      )}
    </div>
  );
}

// ── Exposure Analysis Tab ───────────────────────────────────────────────────
function ExposureAnalysisTab() {
  const totalExposure = guarantorData.reduce((sum, g) => sum + parseRupee(g.exposure), 0);
  const activeGuarantors = guarantorData.filter((g) => g.status === "Active");
  const avgExposure = activeGuarantors.length > 0 ? Math.round(totalExposure / activeGuarantors.length) : 0;
  const highRiskCount = guarantorData.filter((g) => g.stiScore < 60).length;

  const topGuarantors = [...guarantorData]
    .sort((a, b) => parseRupee(b.exposure) - parseRupee(a.exposure))
    .slice(0, 6);

  return (
    <div className="animate-fade-in space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Guarantor Exposure</div>
          <div className="text-xl font-mono font-bold text-slate-800">{formatRupee(totalExposure)}</div>
          <div className="text-[11px] text-heading mt-1">Across {guarantorData.length} guarantors</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Avg Exposure per Guarantor</div>
          <div className="text-xl font-mono font-bold text-primary">{formatRupee(avgExposure)}</div>
          <div className="text-[11px] text-heading mt-1">Active guarantors only</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">High-Risk Guarantors</div>
          <div className="text-xl font-mono font-bold text-danger-500">{highRiskCount}</div>
          <div className="text-[11px] text-heading mt-1">STI Score below 60</div>
        </div>
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Collateral Coverage</div>
          <div className="text-xl font-mono font-bold text-success">1.42x</div>
          <div className="text-[11px] text-heading mt-1">Avg collateral-to-loan ratio</div>
        </div>
      </div>

      {/* Collateral Breakdown */}
      <SectionCard title="Collateral Breakdown by Type">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: "Gold", count: collateralData.filter((c) => c.type === "Gold").length, total: collateralData.filter((c) => c.type === "Gold").reduce((s, c) => s + parseRupee(c.value), 0), color: "amber" },
            { type: "Property", count: collateralData.filter((c) => c.type === "Property").length, total: collateralData.filter((c) => c.type === "Property").reduce((s, c) => s + parseRupee(c.value), 0), color: "blue" },
            { type: "FD Receipt", count: collateralData.filter((c) => c.type === "FD Receipt").length, total: collateralData.filter((c) => c.type === "FD Receipt").reduce((s, c) => s + parseRupee(c.value), 0), color: "purple" },
          ].map((item) => (
            <div key={item.type} className={`bg-${item.color}-50/50 rounded-xl p-4 border border-${item.color}-200/40`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full bg-${item.color}-400`} />
                <span className="text-[13px] font-semibold text-body">{item.type}</span>
              </div>
              <div className={`text-lg font-mono font-bold text-${item.color}-600`}>{formatRupee(item.total)}</div>
              <div className="text-[11px] text-heading mt-0.5">{item.count} pledged assets</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Top Guarantors by Exposure */}
      <SectionCard title="Top Guarantors by Exposure">
        <div className="space-y-3">
          {topGuarantors.map((g, idx) => {
            const exposureNum = parseRupee(g.exposure);
            const maxExposure = parseRupee(topGuarantors[0].exposure);
            const pct = Math.round((exposureNum / maxExposure) * 100);

            return (
              <div key={g.id} className="flex items-center gap-4">
                <div className="w-6 text-[12px] text-heading font-mono text-right">#{idx + 1}</div>
                <div className="w-7 h-7 bg-primary-50 border border-primary-200/60 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {g.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-[13px] font-semibold text-body">{g.name}</span>
                      <span className="text-[11px] text-heading ml-2">for {g.guaranteedFor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold font-mono ${stiColor(g.stiScore)}`}>STI {g.stiScore}</span>
                      <span className="text-[13px] font-mono font-bold text-body">{g.exposure}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        g.stiScore >= 80 ? "bg-success-400" : g.stiScore >= 60 ? "bg-warning-400" : "bg-danger-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <StatusBadge status={g.status} />
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Risk Distribution */}
      <SectionCard title="Guarantor Risk Distribution">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Low Risk (STI 80+)", count: guarantorData.filter((g) => g.stiScore >= 80).length, color: "emerald", exposure: guarantorData.filter((g) => g.stiScore >= 80).reduce((s, g) => s + parseRupee(g.exposure), 0) },
            { label: "Medium Risk (STI 60-79)", count: guarantorData.filter((g) => g.stiScore >= 60 && g.stiScore < 80).length, color: "amber", exposure: guarantorData.filter((g) => g.stiScore >= 60 && g.stiScore < 80).reduce((s, g) => s + parseRupee(g.exposure), 0) },
            { label: "High Risk (STI <60)", count: guarantorData.filter((g) => g.stiScore < 60).length, color: "red", exposure: guarantorData.filter((g) => g.stiScore < 60).reduce((s, g) => s + parseRupee(g.exposure), 0) },
          ].map((tier) => (
            <div key={tier.label} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full bg-${tier.color}-400`} />
                <span className="text-[12px] font-semibold text-body">{tier.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-mono font-bold text-${tier.color}-600`}>{tier.count}</span>
                <span className="text-[11px] text-heading">guarantors</span>
              </div>
              <div className="text-[12px] text-slate-500 font-mono mt-1">{formatRupee(tier.exposure)} exposure</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Main View ───────────────────────────────────────────────────────────────
export default function CollateralView() {
  const [activeTab, setActiveTab] = useState("registry");

  const activeCollateral = collateralData.filter((c) => c.status === "Active").length;
  const totalValue = collateralData.reduce((sum, c) => sum + parseRupee(c.value), 0);

  const renderTab = () => {
    switch (activeTab) {
      case "registry":
        return <CollateralRegistryTab />;
      case "guarantors":
        return <GuarantorManagementTab />;
      case "exposure":
        return <ExposureAnalysisTab />;
      default:
        return <CollateralRegistryTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Collateral & Guarantor Management"
        description="Manage pledged collateral assets and guarantor records. Track exposure, risk scores, and ensure compliance with Nidhi Company collateral requirements under Nidhi Rules 2014."
      >
        <HeaderStat value={<span className="text-primary">{formatRupee(totalValue)}</span>} label="Total Collateral" />
        <HeaderStat value={<span className="text-success">{activeCollateral}</span>} label="Active Pledges" />
        <HeaderStat value={<span className="text-warning">{guarantorData.length}</span>} label="Guarantors" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTab()}
    </div>
  );
}
