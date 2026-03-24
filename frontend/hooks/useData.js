"use client";

import { useState, useEffect, useCallback } from "react";
import { get } from "@/lib/api";

// ─── Formatters ─────────────────────────────────────────────────────────────

export function fmtCurrency(n) {
  if (n == null || n === 0) return "₹0";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtPct(v) { return v != null ? `${v}%` : "—"; }
export function fmtDuration(m) { return m ? `${m} months` : "—"; }
export function fmtNumber(n) { return n != null ? Number(n).toLocaleString("en-IN") : "0"; }

export function fmtCurrencyShort(n) {
  if (n == null) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return fmtCurrency(n);
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── API Cache + Request Deduplication ────────────────────────────────────────
// 1. Caches RAW API responses for CACHE_TTL ms so remounts don't re-fetch.
//    Each hook applies its own transform on the cached raw response.
// 2. Deduplicates in-flight requests: if 3 hooks call the same endpoint
//    concurrently, only ONE network request fires — others await the same Promise.

const CACHE_TTL = 30000; // 30 seconds
const rawCache = new Map();      // endpoint → { raw, ts }
const inflight = new Map();      // endpoint → Promise<Response>

function getCachedRaw(key) {
  const entry = rawCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > CACHE_TTL) {
    rawCache.delete(key);
    return undefined;
  }
  return entry.raw;
}

function setCacheRaw(key, raw) {
  rawCache.set(key, { raw, ts: Date.now() });
}

export function clearApiCache() {
  rawCache.clear();
  inflight.clear();
}

/** Fetch with deduplication — same endpoint returns same Promise */
function deduplicatedGet(endpoint) {
  const existing = inflight.get(endpoint);
  if (existing) return existing;

  const promise = get(endpoint).finally(() => {
    inflight.delete(endpoint);
  });
  inflight.set(endpoint, promise);
  return promise;
}

// ─── Generic Fetch Hook ─────────────────────────────────────────────────────

function useApi(endpoint, options = {}) {
  const { transform, fallback = null, skip = false } = options;

  // On initial render, check cache for raw response and transform it
  const initialData = (() => {
    if (skip || !endpoint) return fallback;
    const raw = getCachedRaw(endpoint);
    if (raw === undefined) return fallback;
    try { return transform ? transform(raw) : raw.data; } catch { return fallback; }
  })();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip && initialData === fallback);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (bypassCache = false) => {
    if (skip || !endpoint) { setLoading(false); return; }

    // Check cache for raw response
    if (!bypassCache) {
      const cachedRaw = getCachedRaw(endpoint);
      if (cachedRaw !== undefined) {
        try {
          const result = transform ? transform(cachedRaw) : cachedRaw.data;
          setData(result);
        } catch { /* ignore transform errors on cache */ }
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = bypassCache ? await get(endpoint) : await deduplicatedGet(endpoint);
      setCacheRaw(endpoint, res);
      const result = transform ? transform(res) : res.data;
      setData(result);
    } catch (err) {
      setError(err);
      console.error(`API [${endpoint}]:`, err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, skip]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchData(); }, [fetchData]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export function useDashboardMetrics() {
  return useApi("/dashboard/metrics", {
    transform: (res) => {
      const items = res.data?.metrics || [];
      return items.map((m) => ({
        label: m.label,
        value: fmtNumber(m.value),
        change: m.change >= 0 ? `+${m.change}%` : `${m.change}%`,
      }));
    },
    fallback: [],
  });
}

export function useLiquidityChart() {
  return useApi("/dashboard/charts/liquidity", {
    transform: (res) => {
      const d = res.data;
      return (d?.labels || []).map((month, i) => ({
        month,
        inflow: d.inflow?.[i] || 0,
        payout: d.payout?.[i] || 0,
      }));
    },
    fallback: [],
  });
}

export function useDepositChart() {
  return useApi("/dashboard/charts/deposits", {
    transform: (res) => {
      const d = res.data;
      return (d?.labels || []).map((month, i) => ({
        month,
        fd: Math.round((d.fd?.[i] || 0) / 100000),
        rd: Math.round((d.rd?.[i] || 0) / 100000),
        savings: Math.round((d.savings?.[i] || 0) / 100000),
      }));
    },
    fallback: [],
  });
}

export function useRiskHeatmap() {
  return useApi("/dashboard/charts/risk-heatmap", {
    transform: (res) => res.data,
    fallback: { low: 0, medium: 0, high: 0, distribution: [] },
  });
}

// ─── AI Risk / Agents ───────────────────────────────────────────────────────

const AGENT_COLORS = ["#5B9E8A", "#E8A838", "#4B7BE5", "#8B5CF6", "#EF4444", "#10B981"];

export function useAgents() {
  return useApi("/ai-risk/dashboard", {
    transform: (res) => {
      const agents = res.data?.agents || [];
      return agents.map((a, i) => ({
        name: a.name,
        status: a.status,
        processed: a.processed,
        pending: a.pending,
        color: AGENT_COLORS[i % AGENT_COLORS.length],
      }));
    },
    fallback: [],
  });
}

export function useAIRiskDashboard() {
  return useApi("/ai-risk/dashboard", {
    transform: (res) => res.data,
    fallback: null,
  });
}

export function useTransactionAnomalies() {
  return useApi("/ai-risk/transaction-anomalies", {
    transform: (res) => res.data || [],
    fallback: [],
  });
}

export function useMemberRisk(memberId) {
  return useApi(memberId ? `/ai-risk/member-risk/${memberId}` : null, {
    transform: (res) => res.data,
    fallback: null,
    skip: !memberId,
  });
}

export function useLiquidityRisk() {
  return useApi("/ai-risk/liquidity", {
    transform: (res) => res.data,
    fallback: null,
  });
}

// ─── Members ────────────────────────────────────────────────────────────────

function transformMember(m) {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email,
    address: m.address,
    deposits: fmtCurrency(m.deposits),
    loans: fmtCurrency(m.loans),
    risk: m.risk,
    sti: m.sti,
    kyc: m.kyc,
    joinDate: fmtDate(m.joinDate),
    status: m.status,
  };
}

export function useMembers() {
  return useApi("/members?limit=100", {
    transform: (res) => (res.data || []).map(transformMember),
    fallback: [],
  });
}

export function useMember(id) {
  return useApi(id ? `/members/${id}` : null, {
    transform: (res) => (res.data ? transformMember(res.data) : null),
    fallback: null,
    skip: !id,
  });
}

export function useMemberSTI(id) {
  return useApi(id ? `/members/${id}/sti` : null, {
    transform: (res) => res.data,
    fallback: null,
    skip: !id,
  });
}

// ─── Chit Funds ─────────────────────────────────────────────────────────────

function transformChitScheme(s) {
  return {
    id: s.id,
    name: s.name,
    monthlyAmount: fmtCurrency(s.monthlyAmount),
    duration: fmtDuration(s.duration),
    totalMembers: s.totalMembers,
    enrolledMembers: s.enrolledMembers,
    potSize: fmtCurrency(s.potSize),
    currentMonth: s.currentMonth || 0,
    nextPayout: s.nextAuction || "—",
    status: s.status,
    description: s.description,
    minSTI: s.minSTI,
    kycRequired: s.kycRequired,
  };
}

export function useChitSchemes(status) {
  const qp = status ? `?status=${status}` : "";
  return useApi(`/chit-schemes${qp}`, {
    transform: (res) => (res.data || []).map(transformChitScheme),
    fallback: [],
  });
}

export function useChitScheme(id) {
  return useApi(id ? `/chit-schemes/${id}` : null, {
    transform: (res) =>
      res.data ? { ...transformChitScheme(res.data), members: res.data.members || [] } : null,
    fallback: null,
    skip: !id,
  });
}

export function useMemberEnrollments(memberId) {
  return useApi(memberId ? `/members/${memberId}/chit-enrollments` : null, {
    transform: (res) =>
      (res.data || []).map((e) => ({
        ...e,
        monthlyAmount: fmtCurrency(e.monthlyAmount),
        potSize: fmtCurrency(e.potSize),
        enrolledDate: fmtDate(e.enrolledDate),
        nextAuction: e.nextAuction || "—",
      })),
    fallback: [],
    skip: !memberId,
  });
}

export function useChitEnrollments() {
  return useApi("/chit-enrollments", {
    transform: (res) =>
      (res.data || []).map((e) => ({
        id: e.id,
        memberId: e.memberId,
        memberName: e.memberName,
        schemeId: e.schemeId,
        schemeName: e.schemeName,
        monthlyAmount: fmtCurrency(e.monthlyAmount),
        stiScore: e.stiScore,
        kyc: e.kyc,
        nomineeName: e.nomineeName || "—",
        nomineeRelation: e.nomineeRelation || "—",
        appliedDate: fmtDate(e.appliedDate),
        status: e.status,
      })),
    fallback: [],
  });
}

export function useChitSchemeMembers(schemeId) {
  return useApi(schemeId ? `/chit-schemes/${schemeId}` : null, {
    transform: (res) => {
      const d = res.data;
      if (!d) return { scheme: null, members: [] };
      return {
        scheme: transformChitScheme(d),
        members: (d.members || []).map((m) => ({
          memberId: m.memberId,
          name: m.name,
          enrolledDate: fmtDate(m.enrolledDate),
          hasWonAuction: m.hasWonAuction,
        })),
      };
    },
    fallback: { scheme: null, members: [] },
    skip: !schemeId,
  });
}

export function useSchemeAuctions(schemeId) {
  return useApi(schemeId ? `/chit-schemes/${schemeId}/auctions` : null, {
    transform: (res) => res.data || [],
    fallback: [],
    skip: !schemeId,
  });
}

// ─── Loans ──────────────────────────────────────────────────────────────────

function transformLoan(l) {
  return {
    id: l.id,
    memberId: l.memberId,
    memberName: l.memberName,
    amount: fmtCurrency(l.amount),
    purpose: l.purpose,
    tenure: fmtDuration(l.tenure),
    interestRate: fmtPct(l.interestRate),
    risk: l.risk,
    stiScore: l.stiScore,
    status: l.status,
    appliedDate: fmtDate(l.appliedDate),
    emi: l.emi ? fmtCurrency(l.emi) : "—",
    nextEmi: l.nextEmi ? fmtDate(l.nextEmi) : "—",
  };
}

export function useLoanApplications() {
  return useApi("/loans/applications?limit=100", {
    transform: (res) => (res.data || []).map(transformLoan),
    fallback: [],
  });
}

const PORTFOLIO_COLORS = ["#4B7BE5", "#5B9E8A", "#8B5CF6", "#E8A838", "#EF4444", "#10B981"];

export function useLoanPortfolio() {
  return useApi("/loans/portfolio", {
    transform: (res) =>
      (res.data || []).map((p, i) => ({
        category: p.category,
        count: p.count,
        sanctioned: p.sanctioned,
        disbursed: p.disbursed,
        npa: p.npa,
        avgRate: fmtPct(p.avgRate),
        color: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length],
      })),
    fallback: [],
  });
}

export function useLoanDefaults() {
  return useApi("/loans/defaults", {
    transform: (res) =>
      (res.data || []).map((d) => ({
        id: d.id,
        memberId: d.memberId,
        memberName: d.memberName,
        outstanding: fmtCurrency(d.outstanding),
        missedEmis: d.missedEmis,
        defaultDate: fmtDate(d.defaultDate),
        status: d.status,
      })),
    fallback: [],
  });
}

export function useMemberLoans(memberId) {
  return useApi(memberId ? `/loans/members/${memberId}/loans` : null, {
    transform: (res) =>
      (res.data || []).map((l) => ({
        ...l,
        amount: fmtCurrency(l.amount),
        emi: l.emi ? fmtCurrency(l.emi) : "—",
        nextEmi: l.nextEmi ? fmtDate(l.nextEmi) : "—",
        interestRate: fmtPct(l.interestRate),
        tenure: fmtDuration(l.tenure),
      })),
    fallback: [],
    skip: !memberId,
  });
}

export function useEMISchedule(loanId) {
  return useApi(loanId ? `/loans/${loanId}/emi-schedule` : null, {
    transform: (res) => res.data,
    fallback: null,
    skip: !loanId,
  });
}

// ─── Deposits ───────────────────────────────────────────────────────────────

function transformDeposit(d) {
  return {
    id: d.id,
    memberId: d.memberId,
    memberName: d.memberName,
    type: d.type,
    amount: fmtCurrency(d.amount),
    rate: fmtPct(d.rate),
    tenure: d.tenure ? fmtDuration(d.tenure) : "—",
    maturityDate: d.maturityDate ? fmtDate(d.maturityDate) : "—",
    maturityAmount: d.maturityAmount ? fmtCurrency(d.maturityAmount) : "—",
    status: d.status,
    openDate: fmtDate(d.openDate),
    autoRenewal: d.autoRenewal,
  };
}

export function useDepositAccounts() {
  return useApi("/deposits/accounts?limit=100", {
    transform: (res) => (res.data || []).map(transformDeposit),
    fallback: [],
  });
}

export function useDepositApplications() {
  return useApi("/deposits/accounts?limit=100", {
    transform: (res) =>
      (res.data || []).map((d) => ({
        id: d.id,
        memberId: d.memberId,
        memberName: d.memberName,
        type: d.type,
        amount: d.type === "Recurring Deposit" ? `₹${fmtNumber(d.amount)}/mo` : fmtCurrency(d.amount),
        rate: fmtPct(d.rate),
        tenure: d.tenure ? fmtDuration(d.tenure) : "—",
        nomineeName: "—",
        nomineeRelation: "—",
        appliedDate: fmtDate(d.openDate),
        status: d.status,
        approvedDate: fmtDate(d.openDate),
        accountId: d.id,
      })),
    fallback: [],
  });
}

export function useDepositSchemes() {
  return useApi("/deposits/schemes", {
    transform: (res) =>
      (res.data || []).map((s) => {
        const rates = s.rates || {};
        const rateValues = Object.values(rates);
        const minRate = rateValues.length ? Math.min(...rateValues) : 0;
        const maxRate = rateValues.length ? Math.max(...rateValues) : 0;
        return {
          name: s.name,
          type: s.type,
          minAmount: s.type === "Recurring Deposit" ? `₹${fmtNumber(s.minAmount)}/mo` : fmtCurrency(s.minAmount),
          maxAmount: s.maxAmount ? fmtCurrency(s.maxAmount) : "No Limit",
          tenures: (s.tenures || []).join("/") + " months",
          rate: rateValues.length > 1 ? `${minRate}% - ${maxRate}%` : `${minRate}%`,
          members: s.members,
          totalCorpus: fmtCurrencyShort(s.totalCorpus),
        };
      }),
    fallback: [],
  });
}

export function useMaturityTracker(days = 90) {
  return useApi(`/deposits/maturity-tracker?days=${days}`, {
    transform: (res) =>
      (res.data || []).map((d) => ({
        ...d,
        amount: fmtCurrency(d.amount),
        maturityDate: fmtDate(d.maturityDate),
        maturityAmount: fmtCurrency(d.maturityAmount),
      })),
    fallback: [],
  });
}

export function useMemberDeposits(memberId) {
  return useApi(memberId ? `/deposits/members/${memberId}/deposits` : null, {
    transform: (res) =>
      (res.data || []).map((d) => ({
        ...d,
        amount: fmtCurrency(d.amount),
        rate: fmtPct(d.rate),
        tenure: d.tenure ? fmtDuration(d.tenure) : "—",
        maturityDate: d.maturityDate ? fmtDate(d.maturityDate) : "—",
        maturityAmount: d.maturityAmount ? fmtCurrency(d.maturityAmount) : "—",
        openDate: fmtDate(d.openDate),
      })),
    fallback: [],
    skip: !memberId,
  });
}

// ─── Collections ────────────────────────────────────────────────────────────

export function useCollectionsDashboard() {
  return useApi("/collections/dashboard", {
    transform: (res) => res.data,
    fallback: null,
  });
}

export function useCollectionsSchedule() {
  return useApi("/collections/schedule?limit=100", {
    transform: (res) =>
      (res.data || []).map((c) => ({
        ...c,
        amount: fmtCurrency(c.amount),
        dueDate: fmtDate(c.dueDate),
      })),
    fallback: [],
  });
}

export function useOverdueCollections() {
  return useApi("/collections/overdue", {
    transform: (res) =>
      (res.data || []).map((c) => ({
        ...c,
        amount: fmtCurrency(c.amount),
        dueDate: fmtDate(c.dueDate),
      })),
    fallback: [],
  });
}

export function useRecoveryCases() {
  return useApi("/collections/recovery", {
    transform: (res) =>
      (res.data || []).map((r) => ({
        ...r,
        outstanding: fmtCurrency(r.outstanding),
        lastContact: fmtDate(r.lastContact),
        nextFollowUp: fmtDate(r.nextFollowUp),
      })),
    fallback: [],
  });
}

export function useMemberPayments(memberId) {
  return useApi(memberId ? `/collections/members/${memberId}/payments` : null, {
    transform: (res) =>
      (res.data || []).map((p) => ({
        ...p,
        amount: fmtCurrency(p.amount),
        date: fmtDate(p.date),
      })),
    fallback: [],
    skip: !memberId,
  });
}

// ─── Compliance ─────────────────────────────────────────────────────────────

export function useComplianceDashboard() {
  return useApi("/compliance/dashboard", {
    transform: (res) => res.data,
    fallback: null,
  });
}

export function useComplianceChecklist() {
  return useApi("/compliance/checklist", {
    transform: (res) =>
      (res.data || []).map((c) => ({
        id: c.id,
        rule: c.rule,
        category: c.category,
        status: c.status,
        lastAudit: fmtDate(c.lastAudit),
        details: c.details,
        weight: c.weight,
      })),
    fallback: [],
  });
}

export function useComplianceScore() {
  return useApi("/compliance/dashboard", {
    transform: (res) => {
      const d = res.data;
      if (!d) return { overall: 0, categories: [] };
      return {
        overall: d.overallScore || 0,
        categories: [
          { name: "Capital Adequacy", score: Math.round(d.overallScore * 1.02) || 0, weight: 20 },
          { name: "Membership", score: Math.round(d.overallScore * 0.98) || 0, weight: 15 },
          { name: "Deposit Limit", score: Math.round(d.overallScore * 1.0) || 0, weight: 15 },
          { name: "Lending", score: Math.round(d.overallScore * 0.95) || 0, weight: 10 },
          { name: "Regulatory Filing", score: d.warnings > 0 ? 70 : 90, weight: 10 },
        ],
      };
    },
    fallback: { overall: 0, categories: [] },
  });
}

export function useKYCMonitoring() {
  return useApi("/compliance/kyc-monitoring", {
    transform: (res) => ({ data: res.data || [], summary: res.summary }),
    fallback: { data: [], summary: null },
  });
}

export function useAMLMonitoring() {
  return useApi("/compliance/aml-monitoring", {
    transform: (res) =>
      (res.data || []).map((a) => ({
        ...a,
        totalAmount: fmtCurrency(a.totalAmount),
        detectedDate: fmtDate(a.detectedDate),
      })),
    fallback: [],
  });
}

export function useRegulatoryFilings() {
  return useApi("/compliance/regulatory-filings", {
    transform: (res) =>
      (res.data || []).map((f) => ({
        form: f.form,
        description: f.description,
        frequency: f.frequency,
        dueDate: f.dueDate ? fmtDate(f.dueDate) : "—",
        status: f.status,
        filedDate: f.lastFiled ? fmtDate(f.lastFiled) : "—",
      })),
    fallback: [],
  });
}

export function useAuditLogs() {
  return useApi("/compliance/audit-logs?limit=100", {
    transform: (res) =>
      (res.data || []).map((l) => ({
        id: l.id,
        action: l.action,
        user: l.userName || "System",
        detail: l.details || "",
        timestamp: l.timestamp
          ? new Date(l.timestamp).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
        module: l.module,
        ip: l.ip,
        role: l.role,
      })),
    fallback: [],
  });
}

// ─── Fraud ──────────────────────────────────────────────────────────────────

export function useFraudDashboard() {
  return useApi("/fraud/dashboard", {
    transform: (res) => {
      const d = res.data;
      return {
        totalAlerts: d?.totalAlerts || 0,
        criticalAlerts: d?.criticalAlerts || 0,
        resolvedThisMonth: d?.resolvedThisMonth || 0,
        avgResolutionTime: d?.avgResolutionDays ? `${d.avgResolutionDays} days` : "—",
        falsePositiveRate: d?.falsePositiveRate != null ? `${d.falsePositiveRate}%` : "—",
        totalPreventedLoss: fmtCurrency(d?.totalLossPrevented),
      };
    },
    fallback: null,
  });
}

export function useFraudCases() {
  return useApi("/fraud/cases?limit=100", {
    transform: (res) =>
      (res.data || []).map((c) => ({
        id: c.id,
        type: c.type,
        description: c.description,
        member: (c.members || []).join(", "),
        severity: c.severity,
        detectedBy: c.detectedBy,
        time: timeAgo(c.detectedAt),
        status: c.status,
        potentialLoss: fmtCurrency(c.potentialLoss),
        assignedTo: c.assignedTo,
      })),
    fallback: [],
  });
}

export function useFraudAlerts() {
  return useApi("/fraud/cases?limit=5", {
    transform: (res) =>
      (res.data || []).slice(0, 3).map((c) => ({
        id: c.id,
        type: c.type,
        member: (c.members || []).join(", "),
        severity: c.severity,
        time: timeAgo(c.detectedAt),
        status: c.status,
      })),
    fallback: [],
  });
}

export function useFraudPatterns() {
  return useApi("/fraud/patterns", {
    transform: (res) => res.data || { patterns: [], monthlyTrend: [] },
    fallback: { patterns: [], monthlyTrend: [] },
  });
}

// ─── Collateral ─────────────────────────────────────────────────────────────

export function useCollateralRegistry() {
  return useApi("/collateral/registry", {
    transform: (res) => res.data || { items: [], totalValue: 0, totalItems: 0, byType: [] },
    fallback: { items: [], totalValue: 0, totalItems: 0, byType: [] },
  });
}

export function useGuarantors() {
  return useApi("/collateral/guarantors", {
    transform: (res) => res.data || { guarantors: [], totalGuarantors: 0 },
    fallback: { guarantors: [], totalGuarantors: 0 },
  });
}

export function useExposureAnalysis() {
  return useApi("/collateral/exposure", {
    transform: (res) => res.data || { totalExposure: 0, totalLoans: 0, byRisk: [], byCategory: [] },
    fallback: { totalExposure: 0, totalLoans: 0, byRisk: [], byCategory: [] },
  });
}

// ─── Governance ─────────────────────────────────────────────────────────────

export function useBoardPack() {
  return useApi("/governance/board-pack", {
    transform: (res) => res.data || { kpis: [], complianceScore: 0, filings: [] },
    fallback: { kpis: [], complianceScore: 0, filings: [] },
  });
}

export function useComplianceReview() {
  return useApi("/governance/compliance-review", {
    transform: (res) => res.data || { rules: [], riskDistribution: {}, stiDistribution: {}, totalMembers: 0 },
    fallback: { rules: [], riskDistribution: {}, stiDistribution: {}, totalMembers: 0 },
  });
}

export function useGovernanceAuditTrail() {
  return useApi("/governance/audit-trail", {
    transform: (res) => (res.data || []).map((l) => ({
      ...l,
      timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString("en-IN") : "—",
    })),
    fallback: [],
  });
}

// ─── AI Assistant ───────────────────────────────────────────────────────────

export function useAIInsights() {
  return useApi("/ai-assistant/insights", {
    transform: (res) => res.data || [],
    fallback: [],
  });
}

// ─── Reports ────────────────────────────────────────────────────────────────

export function useFinancialSummary(month, year) {
  const qp = new URLSearchParams();
  if (month) qp.set("month", month);
  if (year) qp.set("year", year);
  return useApi(`/reports/financial-summary?${qp.toString()}`, {
    transform: (res) => res.data,
    fallback: null,
  });
}

export function useMemberGrowthReport() {
  return useApi("/reports/member-growth", {
    transform: (res) => res.data,
    fallback: null,
  });
}

export function useLoanPortfolioReport() {
  return useApi("/reports/loan-portfolio", {
    transform: (res) => res.data,
    fallback: null,
  });
}

// ─── Config ─────────────────────────────────────────────────────────────────

const CONFIG_LABELS = {
  name: "Company Name", cin: "CIN Number", address: "Registered Address",
  financialYear: "Financial Year", currency: "Currency",
  fdMinAmount: "FD Minimum Amount", fdMaxRate: "FD Maximum Rate",
  rdMinMonthly: "RD Minimum Monthly", savingsRate: "Savings Interest Rate",
  autoRenewal: "Auto Renewal Default",
  maxAmount: "Maximum Loan Amount", minSTI: "Minimum STI Score",
  maxRate: "Maximum Interest Rate", defaultThreshold: "Default Threshold (EMIs)",
  foremanCommission: "Foreman Commission %", minBidDecrement: "Min Bid Decrement %",
  maxSubscribers: "Max Subscribers", auctionFrequency: "Auction Frequency",
  riskModelVersion: "Risk Model Version", fraudSensitivity: "Fraud Sensitivity",
  autoKYC: "Auto KYC Verification", stiRecalcFrequency: "STI Recalc Frequency",
  escalationThreshold: "Escalation Threshold",
  smsEnabled: "SMS Notifications", emailEnabled: "Email Notifications",
  whatsappEnabled: "WhatsApp Notifications", emiReminderDays: "EMI Reminder Days",
  maturityAlertDays: "Maturity Alert Days",
};

function configSectionToArray(data, categoryName) {
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => ({
    key,
    label: CONFIG_LABELS[key] || key,
    value: typeof value === "boolean" ? value : String(value),
    type: typeof value === "boolean" ? "toggle" : "text",
    category: categoryName,
  }));
}

export function useSystemConfig() {
  return useApi("/config", {
    transform: (res) => {
      const d = res.data;
      if (!d) return { general: [], deposits: [], loans: [], chitFunds: [], ai: [], notifications: [] };
      return {
        general: configSectionToArray(d.company, "General"),
        deposits: configSectionToArray(d.deposits, "Deposits"),
        loans: configSectionToArray(d.loans, "Loans"),
        chitFunds: configSectionToArray(d.chitFunds, "Chit Funds"),
        ai: configSectionToArray(d.ai, "AI & Risk"),
        notifications: configSectionToArray(d.notifications, "Notifications"),
      };
    },
    fallback: { general: [], deposits: [], loans: [], chitFunds: [], ai: [], notifications: [] },
  });
}

export function useUsers() {
  return useApi("/config/users", {
    transform: (res) => res.data || [],
    fallback: [],
  });
}

// ─── Notifications ──────────────────────────────────────────────────────────

export function useNotifications() {
  return useApi("/notifications", {
    transform: (res) => ({ items: res.data || [], unreadCount: res.unreadCount || 0 }),
    fallback: { items: [], unreadCount: 0 },
  });
}

// ─── Profile ────────────────────────────────────────────────────────────────

export function useProfile() {
  return useApi("/profile", {
    transform: (res) => {
      const d = res.data;
      if (!d) return null;
      const result = {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        role: d.role,
        roleLabel: d.roleLabel,
        avatar: d.avatar,
        joinDate: fmtDate(d.joinDate),
        lastLogin: d.lastLogin,
      };
      if (d.member) {
        result.member = {
          id: d.member.id,
          name: d.member.name,
          phone: d.member.phone,
          email: d.member.email,
          address: d.member.address,
          deposits: fmtCurrency(d.member.deposits),
          loans: fmtCurrency(d.member.loans),
          risk: d.member.risk,
          sti: d.member.sti,
          kyc: d.member.kyc,
          status: d.member.status,
          joinDate: fmtDate(d.member.joinDate),
          kycDocuments: d.member.kycDocuments,
        };
      }
      return result;
    },
    fallback: null,
  });
}
