"use client";

import { useAuth } from "@/context/AuthContext";
import { depositAccounts, depositSchemes } from "@/data/mockData";

import { PRIMARY, SUCCESS, SECONDARY, TEAL, WARNING, DANGER } from "@/lib/colors";
const schemeColors = [PRIMARY, SUCCESS, SECONDARY, TEAL, WARNING, DANGER];
const schemeIcons = ["🏦", "💰", "📈", "🔒", "💎", "⭐"];
import PageHeader from "@/components/ui/PageHeader";
import HeaderStat from "@/components/ui/HeaderStat";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";

// Calculate maturity progress percentage from tenure string and start date (mock: use today vs maturityDate)
function calcMaturityPct(dep) {
  // Try to derive progress from tenure and maturityDate
  // tenure format: e.g. "12 months", "24 months"
  // maturityDate format: e.g. "15 Mar 2026"
  try {
    const tenureMonths = parseInt(dep.tenure);
    if (!tenureMonths || isNaN(tenureMonths)) return 0;
    const maturityMs = new Date(dep.maturityDate).getTime();
    const now = Date.now();
    if (isNaN(maturityMs)) return 0;
    // Compute start date from maturity date minus tenure months
    const startMs = maturityMs - tenureMonths * 30 * 24 * 60 * 60 * 1000;
    const elapsed = now - startMs;
    const total = maturityMs - startMs;
    if (total <= 0) return 100;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(pct);
  } catch {
    return 0;
  }
}

// Map deposit type to accent color classes
function getDepositAccentClass(type) {
  if (!type) return "bg-success-500";
  const t = type.toLowerCase();
  if (t.includes("fixed") || t.includes("fd")) return "bg-primary-500";
  if (t.includes("recurring") || t.includes("rd")) return "bg-success-500";
  if (t.includes("savings")) return "bg-teal-500";
  return "bg-success-500";
}

function getDepositAmountColor(type) {
  if (!type) return "text-success";
  const t = type.toLowerCase();
  if (t.includes("fixed") || t.includes("fd")) return "text-primary";
  if (t.includes("recurring") || t.includes("rd")) return "text-success";
  return "text-teal-600";
}

function getDepositProgressColor(type) {
  if (!type) return SUCCESS;
  const t = type.toLowerCase();
  if (t.includes("fixed") || t.includes("fd")) return PRIMARY;
  return SUCCESS;
}

export default function MyDeposits({ onNavigate }) {
  const { user } = useAuth();
  const memberId = user?.memberId || "M-1001";
  const myDeposits = depositAccounts.filter((d) => d.memberId === memberId);

  const totalDeposited = myDeposits.length;
  const activeCount = myDeposits.filter((d) => d.status === "Active").length;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="My Deposits"
        description="Track your fixed, recurring, and savings deposits. Browse available schemes to open new accounts."
      >
        <HeaderStat value={totalDeposited} label="Total Accounts" className="bg-slate-50 text-body" />
        <HeaderStat value={activeCount} label="Active" className="bg-slate-50 text-success" />
        <HeaderStat value="9.5%" label="Best Rate" className="bg-slate-50 text-primary" />
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-5">
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-slate-400 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Total Accounts</div>
            <div className="text-[20px] font-bold font-mono text-body">{totalDeposited}</div>
            <div className="text-[11px] text-heading mt-1">{totalDeposited === 0 ? "No accounts yet" : `${totalDeposited} deposit account${totalDeposited > 1 ? "s" : ""}`}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden">
          <div className="w-1 rounded-full bg-success-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Active</div>
            <div className="text-[20px] font-bold font-mono text-success">{activeCount}</div>
            <div className="text-[11px] text-heading mt-1">{activeCount === 0 ? "No active deposits" : "Currently earning"}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 flex overflow-hidden col-span-2 lg:col-span-1">
          <div className="w-1 rounded-full bg-primary-500 shrink-0" />
          <div className="p-4 flex-1">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Best Rate Available</div>
            <div className="text-[20px] font-bold font-mono text-primary">9.5% p.a.</div>
            <div className="text-[11px] text-heading mt-1">On select FD schemes</div>
          </div>
        </div>
      </div>

      {/* My Deposit Accounts */}
      <SectionCard title="My Deposit Accounts" className="mb-5">
        {myDeposits.length > 0 ? (
          <div className="flex flex-col gap-4">
            {myDeposits.map((dep) => {
              const maturityPct = calcMaturityPct(dep);
              const accentClass = getDepositAccentClass(dep.type);
              const amountColorClass = getDepositAmountColor(dep.type);
              const progressColor = getDepositProgressColor(dep.type);

              return (
                <div key={dep.id} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
                  {/* Colored top accent bar */}
                  <div className={`h-1.5 w-full ${accentClass}`} />

                  <div className="p-5">
                    {/* Header row with timeline dot + title + status */}
                    <div className="flex items-start gap-3 mb-4">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center shrink-0 mt-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-success-400 border-2 border-success-100" />
                        <div className="w-px flex-1 bg-success-100 mt-1 min-h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[14px] font-bold text-heading leading-tight">{dep.type}</div>
                            <div className="text-[11px] font-mono text-heading mt-0.5">{dep.id}</div>
                          </div>
                          <StatusBadge status={dep.status} />
                        </div>
                      </div>
                    </div>

                    {/* 4-stat grid with visual hierarchy */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Amount</div>
                        <div className={`text-[15px] font-bold font-mono ${amountColorClass}`}>{dep.amount}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Interest Rate</div>
                        <div className="text-[14px] font-bold text-success">{dep.rate}</div>
                        <div className="text-[10px] text-heading mt-0.5">per annum</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure</div>
                        <div className="text-[13px] font-semibold text-body">{dep.tenure}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Maturity Date</div>
                        <div className="text-[13px] font-semibold text-body">{dep.maturityDate}</div>
                      </div>
                    </div>

                    {/* Maturity progress bar */}
                    {dep.status === "Active" && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-heading uppercase tracking-wider">Tenure Progress</span>
                          <span className="text-[11px] font-mono text-slate-500">{maturityPct}% elapsed</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${maturityPct}%`, background: progressColor }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-heading">Started</span>
                          <span className="text-[10px] text-heading">Matures {dep.maturityDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-success-50 border border-success-200/60 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-[13px] font-bold text-body mb-1">No deposits yet</p>
            <p className="text-[12px] text-heading max-w-xs mx-auto">Start earning interest with a Fixed Deposit, Recurring Deposit, or Savings account. Browse the schemes below to get started.</p>
          </div>
        )}
      </SectionCard>

      {/* Available Schemes */}
      <SectionCard title="Available Deposit Schemes">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {depositSchemes.map((scheme, idx) => {
            const color = schemeColors[idx % schemeColors.length];
            const icon = schemeIcons[idx % schemeIcons.length];
            return (
              <div key={scheme.name} className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 card-shadow border border-slate-100 group">
                {/* Color Top Bar */}
                <div className="h-1.5" style={{ background: color }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: color + "15" }}>
                      {icon}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-heading">{scheme.name}</div>
                      <div className="text-[11px] font-semibold text-success">{scheme.rate} p.a.</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">Min Amount</div>
                      <div className="text-[12px] font-semibold text-body">{scheme.minAmount}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[9px] text-heading uppercase tracking-wider">Max Amount</div>
                      <div className="text-[12px] font-semibold text-body">{scheme.maxAmount}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-heading mb-4">Tenures: {scheme.tenures}</div>
                  <button
                    onClick={() => {
                      localStorage.setItem("glimmora_open_deposit_scheme", JSON.stringify(scheme));
                      onNavigate?.("open_deposit");
                    }}
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border bg-primary-50 border-primary-200 text-primary hover:bg-primary-100 hover:border-primary-300"
                  >
                    Open Account
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
