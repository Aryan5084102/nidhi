"use client";

import { useState } from "react";
import { useBoardPack, useComplianceReview, useGovernanceAuditTrail, fmtCurrency } from "@/hooks/useData";
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import TabBar from "@/components/ui/TabBar";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";

const tabs = [
  { id: "boardpack", label: "Board Pack" },
  { id: "governance", label: "Governance Review" },
  { id: "audit", label: "Audit Trail" },
];

export default function GovernanceView() {
  const [activeTab, setActiveTab] = useState("boardpack");
  const { data: boardData, loading: l1 } = useBoardPack();
  const { data: reviewData, loading: l2 } = useComplianceReview();
  const { data: auditLogs = [], loading: l3 } = useGovernanceAuditTrail();

  const loading = l1 || l2 || l3;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Governance & Board Pack" description="Board-level KPIs, compliance governance review, and audit trail for regulatory oversight.">
        <HeaderStat value={`${boardData?.complianceScore || 0}%`} label="Compliance" className="bg-slate-50 text-success" />
        <HeaderStat value={(reviewData?.rules || []).length} label="Rules" className="bg-slate-50 text-primary" />
        <HeaderStat value={auditLogs.length} label="Audit Entries" className="bg-slate-50 text-warning" />
      </PageHeader>

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" /></div>
      ) : (
        <>
          {/* ── Board Pack ── */}
          {activeTab === "boardpack" && (
            <div className="animate-fade-in">
              <SectionCard title="KPI Snapshot" className="mb-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(boardData?.kpis || []).map((kpi) => (
                    <div key={kpi.label} className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-[10px] text-heading uppercase tracking-wider mb-1">{kpi.label}</div>
                      <div className="text-[16px] font-bold font-mono text-body">
                        {kpi.type === "currency" ? fmtCurrency(kpi.value) : kpi.value}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Regulatory Filings">
                <div className="space-y-3">
                  {(boardData?.filings || []).map((f) => (
                    <div key={f.form} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="text-[13px] font-semibold text-body">{f.form}</div>
                        <div className="text-[11px] text-heading">{f.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[11px] text-heading">Due: {f.dueDate}</div>
                          {f.lastFiled && <div className="text-[10px] text-slate-400">Last: {f.lastFiled}</div>}
                        </div>
                        <StatusBadge status={f.status} />
                      </div>
                    </div>
                  ))}
                  {(boardData?.filings || []).length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-6">No filings data</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── Governance Review ── */}
          {activeTab === "governance" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <SectionCard title="Risk Distribution">
                  <div className="space-y-3">
                    {Object.entries(reviewData?.riskDistribution || {}).map(([risk, count]) => (
                      <div key={risk} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[13px] font-semibold ${risk === "High" ? "text-danger-500" : risk === "Medium" ? "text-warning" : "text-success"}`}>{risk} Risk</span>
                          <span className="text-[13px] font-bold font-mono text-body">{count} members</span>
                        </div>
                        <ProgressBar value={count} max={reviewData?.totalMembers || 1} color={risk === "High" ? "#DC2626" : risk === "Medium" ? "#D97706" : "#059669"} />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="STI Score Distribution">
                  <div className="space-y-3">
                    {[
                      { label: "Excellent (90+)", key: "excellent", color: "#059669" },
                      { label: "Good (70-89)", key: "good", color: "#3B82F6" },
                      { label: "Average (50-69)", key: "average", color: "#D97706" },
                      { label: "Poor (<50)", key: "poor", color: "#DC2626" },
                    ].map(({ label, key, color }) => {
                      const val = reviewData?.stiDistribution?.[key] || 0;
                      return (
                        <div key={key} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[13px] font-semibold text-body">{label}</span>
                            <span className="text-[13px] font-bold font-mono" style={{ color }}>{val}</span>
                          </div>
                          <ProgressBar value={val} max={reviewData?.totalMembers || 1} color={color} />
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Compliance Rules Checklist">
                <div className="space-y-2">
                  {(reviewData?.rules || []).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-body">{r.rule}</div>
                        <div className="text-[10px] text-heading mt-0.5">{r.category} · Last audit: {r.lastAudit || "—"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.weight && <span className="text-[10px] text-slate-400">{r.weight}%</span>}
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                  {(reviewData?.rules || []).length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-6">No compliance rules found</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── Audit Trail ── */}
          {activeTab === "audit" && (
            <div className="animate-fade-in">
              <SectionCard title="Recent Audit Log">
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200/60 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                        {(log.module || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-body">{log.action}</div>
                        <div className="text-[10px] text-heading mt-0.5">
                          {log.module && <span className="font-mono">{log.module}</span>}
                          {log.userId && <span> · User: {log.userId}</span>}
                          {log.ip && <span> · IP: {log.ip}</span>}
                        </div>
                        {log.details && <div className="text-[10px] text-slate-400 mt-1">{log.details}</div>}
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-[13px] text-slate-400 text-center py-8">No audit logs found</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
