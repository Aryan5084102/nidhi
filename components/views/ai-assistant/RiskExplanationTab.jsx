"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";

const riskCategories = [
  {
    id: "credit",
    name: "Credit Risk",
    score: 62,
    level: "Medium",
    explanation:
      "Credit risk refers to the possibility that borrowers may fail to repay their loans or meet contractual obligations. For a Nidhi company, this is the most significant risk as lending to members constitutes the primary business activity. Under Nidhi Rules 2014, loans can only be given to members against specified securities — fixed deposits, gold, or property. The credit risk score evaluates the overall health of the loan portfolio based on repayment patterns, STI scores, and collateral adequacy.",
    factors: [
      { name: "Overdue EMIs > 60 days", weight: 30, value: "Rs.18.4 Lakhs across 12 accounts" },
      { name: "Average STI of borrowers", weight: 25, value: "Score: 58 (declining from 64 last quarter)" },
      { name: "Collateral coverage ratio", weight: 20, value: "1.8x (healthy, above 1.5x threshold)" },
      { name: "NPA ratio", weight: 15, value: "3.2% (industry avg: 4.5%)" },
      { name: "Concentration risk", weight: 10, value: "Top 10 borrowers hold 28% of loan book" },
    ],
    trend: [45, 48, 52, 55, 58, 62],
    actions: [
      "Review all accounts with STI below 40 for early warning signals",
      "Increase collateral requirements for unsecured personal loans",
      "Implement monthly portfolio stress testing",
      "Set up automated EMI reminder system 7 days before due date",
    ],
    regulation: "Nidhi Rules 2014, Rule 15 — Loan limits: max Rs.15 Lakhs against FD, max Rs.2 Lakhs against gold. Rule 7 — Net owned funds ratio not to exceed 1:20.",
  },
  {
    id: "liquidity",
    name: "Liquidity Risk",
    score: 48,
    level: "Medium",
    explanation:
      "Liquidity risk is the danger that the company may not have sufficient cash or liquid assets to meet member withdrawal requests, loan disbursements, or operational expenses. Nidhi companies are particularly vulnerable because they rely on member deposits as the primary funding source. A sudden surge in withdrawals or a drop in new deposits can create cash flow stress. RBI mandates that Nidhi companies maintain at least 10% of deposits as unencumbered term deposits with scheduled commercial banks.",
    factors: [
      { name: "FD maturity concentration", weight: 35, value: "Rs.3.2 Cr maturing in Q2 — 22% of total FDs" },
      { name: "Cash reserve adequacy", weight: 25, value: "Rs.4.1 Cr available (covers 3.8 months of outflows)" },
      { name: "Deposit renewal rate", weight: 20, value: "72% (down from 81% last quarter)" },
      { name: "Loan-to-deposit ratio", weight: 15, value: "78% (within safe range of < 85%)" },
      { name: "Unencumbered deposit ratio", weight: 5, value: "10.4% (above minimum 10%)" },
    ],
    trend: [35, 38, 40, 42, 45, 48],
    actions: [
      "Build Rs.1.5 Cr liquidity buffer before Q2 FD maturity spike",
      "Launch attractive FD renewal offers for maturing deposits",
      "Stagger new loan disbursements to manage cash outflows",
      "Negotiate standby credit facility with partner bank",
    ],
    regulation: "Nidhi Rules 2014, Rule 14 — Minimum 10% of outstanding deposits as unencumbered term deposits. Rule 7 — Deposits not exceeding 20 times net owned funds.",
  },
  {
    id: "fraud",
    name: "Fraud Risk",
    score: 31,
    level: "Low",
    explanation:
      "Fraud risk encompasses the potential for deliberate deception by members, employees, or external parties that results in financial loss. In Nidhi companies, common fraud vectors include identity theft for loan applications, deposit receipt tampering, employee embezzlement, chit fund bid manipulation, and fictitious member accounts. Robust KYC processes, dual authorization controls, and AI-based anomaly detection are critical defenses.",
    factors: [
      { name: "Suspicious transaction alerts", weight: 30, value: "4 alerts this month (avg: 6)" },
      { name: "KYC compliance rate", weight: 25, value: "94.2% verified (target: 98%)" },
      { name: "Dual authorization coverage", weight: 20, value: "100% for transactions > Rs.50K" },
      { name: "Employee audit status", weight: 15, value: "Last audit: 15 Feb 2026 — No issues" },
      { name: "Chit bid pattern anomalies", weight: 10, value: "1 scheme flagged (CS-002)" },
    ],
    trend: [28, 30, 32, 29, 30, 31],
    actions: [
      "Investigate CS-002 chit bid patterns for possible suppression",
      "Complete KYC re-verification for remaining 342 members",
      "Implement biometric verification for high-value transactions",
      "Conduct quarterly fraud awareness training for staff",
    ],
    regulation: "Nidhi Rules 2014, Rule 21 — Proper records and registers. Companies Act 2013, Sec 447 — Punishment for fraud (imprisonment 6 months to 10 years).",
  },
  {
    id: "compliance",
    name: "Compliance Risk",
    score: 44,
    level: "Medium",
    explanation:
      "Compliance risk arises from potential violations of laws, regulations, or internal policies governing Nidhi companies. The regulatory framework includes the Companies Act 2013, Nidhi Rules 2014, and various MCA directives. Non-compliance can result in penalties, restrictions on accepting deposits, or even cancellation of Nidhi status. Key compliance areas include timely filing of NDH forms, maintaining member and deposit ceilings, director qualifications, and audit requirements.",
    factors: [
      { name: "Filing deadline proximity", weight: 30, value: "NDH-1 due in 20 days — preparation in progress" },
      { name: "KYC backlog", weight: 25, value: "342 members overdue for re-verification" },
      { name: "Deposit ceiling compliance", weight: 20, value: "3 members near Rs.1.5 Cr individual limit" },
      { name: "Director compliance", weight: 15, value: "All directors meet qualification requirements" },
      { name: "Audit status", weight: 10, value: "FY2025 audit completed, no major qualifications" },
    ],
    trend: [38, 40, 42, 44, 43, 44],
    actions: [
      "Prioritize NDH-1 preparation — assign dedicated team",
      "Clear KYC backlog within 30 days — schedule camp drives",
      "Monitor 3 members approaching deposit ceiling, notify proactively",
      "Begin FY2026 audit preparation documentation",
    ],
    regulation: "Nidhi Rules 2014, Rule 5 — NDH-1 filing within 90 days of financial year end. Rule 4 — Minimum 200 members. Rule 6 — Net owned funds minimum Rs.20 Lakhs.",
  },
  {
    id: "operational",
    name: "Operational Risk",
    score: 37,
    level: "Low",
    explanation:
      "Operational risk stems from inadequate or failed internal processes, people, systems, or external events. For Nidhi companies, this includes IT system failures, manual processing errors, branch security incidents, natural disasters affecting records, and key-person dependency. As digital adoption increases, cybersecurity and data protection become increasingly important operational risks to manage.",
    factors: [
      { name: "System uptime", weight: 25, value: "99.7% uptime this month (target: 99.5%)" },
      { name: "Manual process dependency", weight: 25, value: "33% of transactions still processed manually" },
      { name: "Staff adequacy", weight: 20, value: "2 vacancies in accounts team — hiring in progress" },
      { name: "Data backup status", weight: 15, value: "Daily automated backup — last verified 10 Mar 2026" },
      { name: "Business continuity plan", weight: 15, value: "Updated Jan 2026, tested Feb 2026" },
    ],
    trend: [42, 40, 38, 37, 36, 37],
    actions: [
      "Fast-track hiring for accounts team vacancies",
      "Migrate remaining manual processes to digital workflow",
      "Conduct quarterly disaster recovery drill",
      "Implement two-factor authentication for all admin access",
    ],
    regulation: "Companies Act 2013, Sec 128 — Books of account to be kept for 8 years. IT Act 2000 — Data protection and cybersecurity requirements for financial institutions.",
  },
];

function SimpleBarChart({ data }) {
  const max = Math.max(...data);
  const labels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return (
    <div className="flex items-end gap-2 h-24 mt-2">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[10px] text-heading font-mono">{val}</span>
          <div
            className="w-full rounded-t-md bg-primary-400 transition-all"
            style={{ height: `${(val / max) * 64}px` }}
          />
          <span className="text-[10px] text-heading">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function RiskExplanationTab() {
  const [selectedRisk, setSelectedRisk] = useState("credit");

  const risk = riskCategories.find((r) => r.id === selectedRisk);

  const scoreColor = (score) => {
    if (score >= 70) return "text-danger";
    if (score >= 40) return "text-warning";
    return "text-success";
  };

  const scoreBg = (score) => {
    if (score >= 70) return "#DC2626";
    if (score >= 40) return "#D97706";
    return "#059669";
  };

  return (
    <div className="space-y-5">
      {/* Risk category selector */}
      <div className="flex flex-wrap gap-2">
        {riskCategories.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRisk(r.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              selectedRisk === r.id
                ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {risk && (
        <>
          {/* Risk overview */}
          <SectionCard>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-800">{risk.name}</h3>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mt-1 inline-block ${
                  risk.level === "High" ? "bg-danger-50 text-danger border-danger-200" :
                  risk.level === "Medium" ? "bg-warning-50 text-warning border-warning-200" :
                  "bg-success-50 text-success border-success-200"
                }`}>
                  {risk.level} Risk
                </span>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${scoreColor(risk.score)}`}>{risk.score}</p>
                <p className="text-[10px] text-heading">out of 100</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-4">
              <ProgressBar value={risk.score} max={100} color={scoreBg(risk.score)} height="h-2" />
            </div>

            <p className="text-[13px] text-body leading-relaxed">{risk.explanation}</p>
          </SectionCard>

          {/* Contributing factors */}
          <SectionCard title="Contributing Factors">
            <div className="space-y-3">
              {risk.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 text-right">
                    <span className="text-[11px] font-mono font-semibold text-primary">{f.weight}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-medium text-body">{f.name}</p>
                    </div>
                    <div className="mb-1">
                      <ProgressBar value={f.weight * 3.3} max={100} color="#818CF8" />
                    </div>
                    <p className="text-[11px] text-heading">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Trend and actions side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Historical trend */}
            <SectionCard title="Historical Trend (6 Months)">
              <SimpleBarChart data={risk.trend} />
            </SectionCard>

            {/* Recommended actions */}
            <SectionCard title="Recommended Actions">
              <div className="space-y-2.5">
                {risk.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-[12px] text-body leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Regulatory context */}
          <div className="bg-violet-50/50 rounded-2xl p-5 border border-violet-100">
            <h3 className="text-sm font-semibold text-violet-800 mb-2">Regulatory Context</h3>
            <p className="text-[12px] text-violet-700 leading-relaxed">{risk.regulation}</p>
          </div>
        </>
      )}
    </div>
  );
}
