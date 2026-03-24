"use client";

import { useState } from "react";
import { useCollateralRegistry, useGuarantors, useExposureAnalysis, fmtCurrency } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";

const tabs = [
  { id: "registry", label: "Collateral Registry" },
  { id: "guarantors", label: "Guarantor Management" },
  { id: "exposure", label: "Exposure Analysis" },
];

export default function CollateralView() {
  const [activeTab, setActiveTab] = useState("registry");
  const [search, setSearch] = useState("");
  const { data: registryData, loading: l1 } = useCollateralRegistry();
  const { data: guarantorData, loading: l2 } = useGuarantors();
  const { data: exposureData, loading: l3 } = useExposureAnalysis();

  const loading = l1 || l2 || l3;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Collateral & Guarantors" description="Manage pledged collateral, guarantors, and exposure analysis across all active loans.">
        <HeaderStat value={registryData?.totalItems || 0} label="Collateral Items" className="bg-slate-50 text-primary" />
        <HeaderStat value={guarantorData?.totalGuarantors || 0} label="Guarantors" className="bg-slate-50 text-success" />
        <HeaderStat value={fmtCurrency(exposureData?.totalExposure || 0)} label="Total Exposure" className="bg-slate-50 text-warning" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>
      ) : (
        <>
          {/* ── Registry Tab ── */}
          {activeTab === "registry" && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search collateral..."
                  className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[12px] text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 placeholder:text-subtle" />
              </div>

              {/* Type Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {(registryData?.byType || []).map((t) => (
                  <div key={t.type} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">{t.type}</div>
                    <div className="text-[16px] font-bold font-mono text-body">{fmtCurrency(t.value)}</div>
                  </div>
                ))}
                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-200/60">
                  <div className="text-[10px] text-primary uppercase tracking-wider mb-1">Total Value</div>
                  <div className="text-[16px] font-bold font-mono text-primary">{fmtCurrency(registryData?.totalValue || 0)}</div>
                </div>
              </div>

              {/* Items */}
              <SectionCard>
                <div className="space-y-3">
                  {(registryData?.items || [])
                    .filter((i) => !search || i.memberName?.toLowerCase().includes(search.toLowerCase()) || i.type?.toLowerCase().includes(search.toLowerCase()))
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center text-primary font-bold text-[11px]">
                            {item.type === "FD Receipt" ? "FD" : item.type === "Loan Collateral" ? "LC" : "OT"}
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-body">{item.memberName}</div>
                            <div className="text-[11px] text-heading font-mono">{item.memberId} · {item.id} · {item.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[14px] font-bold font-mono text-body">{fmtCurrency(item.value)}</div>
                            <div className="text-[10px] text-heading">{item.type}</div>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    ))}
                  {(registryData?.items || []).length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-8">No collateral records found</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── Guarantors Tab ── */}
          {activeTab === "guarantors" && (
            <div className="animate-fade-in">
              <SectionCard>
                <div className="space-y-3">
                  {(guarantorData?.guarantors || []).map((g) => (
                    <div key={g.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${g.sti >= 80 ? "bg-success-100 text-success" : g.sti >= 60 ? "bg-warning-100 text-warning" : "bg-danger-100 text-danger-500"}`}>
                          {g.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-body">{g.name}</div>
                          <div className="text-[11px] text-heading font-mono">{g.memberId} · STI: {g.sti} · KYC: {g.kyc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[14px] font-bold font-mono text-body">{fmtCurrency(g.totalExposure)}</div>
                          <div className="text-[10px] text-heading">{g.loansBacked} loan{g.loansBacked > 1 ? "s" : ""} backed</div>
                        </div>
                        <StatusBadge status={g.status} />
                      </div>
                    </div>
                  ))}
                  {(guarantorData?.guarantors || []).length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-8">No guarantors found</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── Exposure Tab ── */}
          {activeTab === "exposure" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <SectionCard title="Exposure by Risk Level">
                  <div className="space-y-3">
                    {(exposureData?.byRisk || []).map((r) => {
                      const maxAmt = Math.max(...(exposureData?.byRisk || []).map((x) => x.amount), 1);
                      return (
                        <div key={r.risk} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[13px] font-semibold ${r.risk === "High" ? "text-danger-500" : r.risk === "Medium" ? "text-warning" : "text-success"}`}>{r.risk} Risk</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-heading">{r.count} loans</span>
                              <span className="text-[13px] font-bold font-mono text-body">{fmtCurrency(r.amount)}</span>
                            </div>
                          </div>
                          <ProgressBar value={r.amount} max={maxAmt} color={r.risk === "High" ? "#DC2626" : r.risk === "Medium" ? "#D97706" : "#059669"} />
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard title="Exposure by Category">
                  <div className="space-y-3">
                    {(exposureData?.byCategory || []).map((c) => {
                      const maxAmt = Math.max(...(exposureData?.byCategory || []).map((x) => x.amount), 1);
                      return (
                        <div key={c.category} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[13px] font-semibold text-body">{c.category}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-heading">{c.count} loans</span>
                              <span className="text-[13px] font-bold font-mono text-body">{fmtCurrency(c.amount)}</span>
                            </div>
                          </div>
                          <ProgressBar value={c.amount} max={maxAmt} color="#6366F1" />
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Overall Exposure Summary">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Total Exposure</div>
                    <div className="text-[18px] font-bold font-mono text-primary">{fmtCurrency(exposureData?.totalExposure || 0)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Active Loans</div>
                    <div className="text-[18px] font-bold font-mono text-body">{exposureData?.totalLoans || 0}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Collateral Items</div>
                    <div className="text-[18px] font-bold font-mono text-success">{registryData?.totalItems || 0}</div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
