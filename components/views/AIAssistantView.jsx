"use client";

import { useState } from "react";

const tabs = [
  { id: "chat", label: "AI Chat Assistant" },
  { id: "query", label: "AI Query Panel" },
  { id: "reports", label: "AI Report Generator" },
  { id: "insights", label: "AI Insights Dashboard" },
  { id: "risk", label: "AI Risk Explanation" },
  { id: "queries", label: "AI Queries" },
];

const initialMessages = [
  {
    id: 1,
    role: "user",
    text: "What's the current compliance status?",
    time: "10:32 AM",
  },
  {
    id: 2,
    role: "ai",
    text: `Here's your current compliance overview:\n\n**Compliance Score: 87/100** (Good)\n\n**Pending Items:**\n- 34 KYC re-verifications overdue (Rule 14, Nidhi Rules 2014)\n- Annual return filing due by 30th April 2026\n- 3 members exceeding deposit ceiling of Rs.1.5 Cr\n- Board resolution for FY2026 interest rate revision pending\n\n**Upcoming Deadlines:**\n- NDH-1 filing — 31 Mar 2026 (20 days left)\n- NDH-3 half-yearly return — 30 Apr 2026\n- Annual General Meeting — before 30 Sep 2026\n\n**Recent Actions:**\n- RBI net-owned-fund ratio recalculated — Compliant (1:22 vs max 1:20)\n- Unencumbered term deposits maintained at 10.4% (min 10% required)`,
    time: "10:32 AM",
  },
  {
    id: 3,
    role: "user",
    text: "Show me high risk members",
    time: "10:34 AM",
  },
  {
    id: 4,
    role: "ai",
    text: `Here are the top 5 high-risk members:\n\n| Member ID | Name | STI Score | Risk Score | Key Concern |\n|-----------|------|-----------|------------|-------------|\n| M-1023 | Rajesh Malhotra | 28 | 89/100 | 3 overdue EMIs, declining deposits |\n| M-1047 | Priya Venkatesh | 31 | 84/100 | KYC expired, irregular payments |\n| M-1089 | Sunil Agarwal | 35 | 81/100 | Business loan default risk, STI declining |\n| M-1112 | Kavitha Nair | 38 | 78/100 | Withdrawal pattern anomaly detected |\n| M-1056 | Deepak Sharma | 40 | 76/100 | Multiple loan applications, high leverage |\n\nWould you like me to generate a detailed risk report for any of these members?`,
    time: "10:34 AM",
  },
];

const suggestedQueries = [
  "Show high risk members",
  "Explain liquidity risk",
  "Generate compliance report",
  "Loan default prediction",
  "Member churn analysis",
];

const suggestedResponses = {
  "Show high risk members": `Identified 18 high-risk members across all branches.\n\nTop concerns:\n- **Whitefield Branch**: 7 members with STI below 35\n- **Koramangala Branch**: 5 members with overdue EMIs > 90 days\n- **Indiranagar Branch**: 6 members with KYC non-compliance\n\nAggregate exposure: Rs.2.84 Cr in at-risk loans. Recommend immediate review of members with STI below 30.`,
  "Explain liquidity risk": `**Liquidity Risk Assessment**\n\nCurrent liquidity ratio: 1.32 (Healthy — min 1.0 required)\n\n**Key Factors:**\n- Rs.3.2 Cr in FDs maturing in Q2 2026\n- Loan disbursement pipeline: Rs.1.8 Cr approved, pending release\n- Cash reserves: Rs.4.1 Cr across all accounts\n\n**Risk Level: Medium**\nWhile current ratios are healthy, the Q2 FD maturity spike could create short-term pressure. Recommend maintaining Rs.1.5 Cr buffer and staggering new loan disbursements.`,
  "Generate compliance report": `Starting compliance report generation...\n\n**Report: Monthly Compliance Status — March 2026**\n\nSections included:\n- NDH-1 filing status\n- Member ceiling compliance (200 minimum — Current: 1,247)\n- Net owned fund ratio\n- Unencumbered term deposit ratio\n- KYC compliance status\n- Director qualification compliance\n\nEstimated completion: 2 minutes\nFormat: PDF (24 pages)\n\nReport will be available in the Reports section once generated.`,
  "Loan default prediction": `**Loan Default Prediction — Next Quarter (Q2 2026)**\n\nBased on STI trends, payment history, and macro indicators:\n\n- **Expected defaults**: 8-12 loans (Rs.42-58 Lakhs exposure)\n- **High probability (>80%)**: 4 loans — M-1023, M-1089, M-1156, M-1201\n- **Medium probability (50-80%)**: 6 loans\n- **Category most at risk**: Business Loans (62% of predicted defaults)\n\n**Recommended Actions:**\n- Initiate early collection follow-up for high-probability accounts\n- Restructure EMI schedules for medium-probability accounts\n- Increase provision coverage to 15% for business loan portfolio`,
  "Member churn analysis": `**Member Churn Analysis — Last 6 Months**\n\nChurn Rate: 3.2% (40 members closed accounts)\n\n**Churn by Branch:**\n- Whitefield: 14 members (4.1% — highest)\n- Koramangala: 12 members (3.5%)\n- Indiranagar: 8 members (2.4%)\n- Jayanagar: 6 members (2.1% — lowest)\n\n**Common Patterns:**\n- 68% had not made deposits in 60+ days before closure\n- 45% cited better rates from banks as reason\n- Average tenure of churned members: 1.8 years\n\n**Retention Recommendations:**\n- Launch loyalty bonus scheme for 2+ year members\n- Offer competitive FD rates for Rs.5L+ deposits\n- Implement proactive engagement when deposit gap exceeds 30 days`,
};

const queryCategories = [
  {
    name: "Members",
    color: "indigo",
    queries: [
      "Top 10 members by deposit value",
      "Members with KYC pending > 30 days",
      "Members with STI score below 50",
      "New members this month",
    ],
  },
  {
    name: "Loans",
    color: "emerald",
    queries: [
      "Overdue loans > 60 days",
      "Loans with high NPA risk",
      "EMI collection rate this month",
    ],
  },
  {
    name: "Deposits",
    color: "amber",
    queries: [
      "FDs maturing this quarter",
      "RD default list",
      "Deposit growth vs target",
    ],
  },
  {
    name: "Compliance",
    color: "violet",
    queries: [
      "NDH-1 filing checklist",
      "KYC non-compliant members",
      "Regulatory deadline tracker",
    ],
  },
  {
    name: "Risk",
    color: "rose",
    queries: [
      "Members with declining STI",
      "Fraud risk hotspots",
      "Liquidity stress test results",
    ],
  },
  {
    name: "Fraud",
    color: "red",
    queries: [
      "Suspicious transaction alerts",
      "Duplicate KYC detection",
      "Unusual withdrawal patterns",
    ],
  },
];

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

const insightsData = [
  {
    title: "Member churn risk increasing in Whitefield branch",
    desc: "12 members showing disengagement patterns — no deposits in 45+ days, reduced login frequency. Predicted churn probability: 68%.",
    impact: "High",
    category: "Risk",
    action: "Initiate proactive retention outreach for flagged members. Consider offering loyalty incentives.",
    confidence: 92,
  },
  {
    title: "Loan default probability rising for Business Loans",
    desc: "STI trend analysis shows 8 business loan accounts with declining scores. Combined exposure: Rs.38 Lakhs.",
    impact: "High",
    category: "Risk",
    action: "Tighten STI threshold for new business loans from 45 to 55. Review existing accounts for restructuring.",
    confidence: 87,
  },
  {
    title: "Deposit maturity spike expected in Q2",
    desc: "Rs.3.2 Cr in fixed deposits maturing between April-June 2026. Potential liquidity pressure if renewal rate drops below 60%.",
    impact: "High",
    category: "Operational",
    action: "Prepare liquidity buffer of Rs.1.5 Cr. Launch attractive renewal rates 30 days before maturity.",
    confidence: 95,
  },
  {
    title: "KYC re-verification backlog growing",
    desc: "342 members overdue for KYC re-verification. Compliance risk elevated — Nidhi Rules mandate periodic KYC updates.",
    impact: "Medium",
    category: "Compliance",
    action: "Deploy bulk SMS/email reminders. Schedule branch-level KYC camps for top 100 high-value members.",
    confidence: 98,
  },
  {
    title: "Chit fund auction prices trending below optimal",
    desc: "CS-002 and CS-005 schemes showing 8% lower bid values than expected. Possible bid suppression or member disinterest.",
    impact: "Medium",
    category: "Operational",
    action: "Investigate bid patterns in CS-002. Consider adding incentive structure for competitive bidding.",
    confidence: 74,
  },
  {
    title: "Revenue growth slowing — commission income flat",
    desc: "Commission income has plateaued at Rs.12.4 Lakhs/month for 3 consecutive months. No new scheme launches in 90 days.",
    impact: "Medium",
    category: "Growth",
    action: "Launch new chit scheme targeting Rs.50K-1L segment. Explore RD product for salaried members.",
    confidence: 81,
  },
  {
    title: "Strong deposit growth in Indiranagar branch",
    desc: "22% month-over-month deposit growth driven by 18 new members. Branch exceeding quarterly target by 15%.",
    impact: "Low",
    category: "Growth",
    action: "Replicate Indiranagar engagement model in underperforming branches. Recognize branch team performance.",
    confidence: 96,
  },
  {
    title: "Operational efficiency improving — digital payments up 34%",
    desc: "UPI and net-banking collections now account for 67% of total. Cash handling costs reduced by Rs.1.2 Lakhs/month.",
    impact: "Low",
    category: "Operational",
    action: "Continue digital adoption push. Set target of 80% digital collections by Q3 2026.",
    confidence: 93,
  },
];

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

const featuredQueries = [
  {
    text: "Show high risk members",
    category: "Risk",
    responseType: "Table",
    response: "table",
    data: [
      { id: "M-1023", name: "Rajesh Malhotra", sti: 28, risk: 89, branch: "Whitefield" },
      { id: "M-1047", name: "Priya Venkatesh", sti: 31, risk: 84, branch: "Koramangala" },
      { id: "M-1089", name: "Sunil Agarwal", sti: 35, risk: 81, branch: "Indiranagar" },
      { id: "M-1112", name: "Kavitha Nair", sti: 38, risk: 78, branch: "Jayanagar" },
      { id: "M-1056", name: "Deepak Sharma", sti: 40, risk: 76, branch: "Whitefield" },
    ],
  },
  {
    text: "Explain liquidity risk",
    category: "Risk",
    responseType: "Text",
    response: "text",
    content:
      "Liquidity risk is the potential inability to meet cash obligations. Current ratio: 1.32 (healthy). Key concern: Rs.3.2 Cr FDs maturing in Q2. Maintain Rs.1.5 Cr buffer and monitor renewal rates closely.",
  },
  {
    text: "Generate compliance report",
    category: "Compliance",
    responseType: "Report",
    response: "status",
    content: "Compliance report generation initiated. Estimated time: 3 minutes. Sections: NDH-1 status, KYC compliance, deposit ratios, director qualifications.",
  },
  {
    text: "Predict loan defaults for next quarter",
    category: "Risk",
    responseType: "Chart",
    response: "text",
    content:
      "Prediction: 8-12 defaults expected (Rs.42-58L exposure). Business loans at highest risk (62%). 4 accounts with >80% default probability identified. Recommend early intervention for flagged accounts.",
  },
  {
    text: "Analyze member growth trends",
    category: "Growth",
    responseType: "Chart",
    response: "text",
    content:
      "Net member growth: +34 this quarter (vs +28 last quarter). Indiranagar leading with 18 new members. Whitefield showing negative trend (-6 net). Overall growth rate: 2.8% QoQ.",
  },
  {
    text: "Identify suspicious transactions",
    category: "Fraud",
    responseType: "Table",
    response: "table",
    data: [
      { id: "TXN-8821", name: "Arun Kumar", sti: 0, risk: 72, branch: "Whitefield" },
      { id: "TXN-8834", name: "Meena Reddy", sti: 0, risk: 68, branch: "Koramangala" },
      { id: "TXN-8847", name: "Vikram Joshi", sti: 0, risk: 65, branch: "Jayanagar" },
    ],
  },
];

const recentQueryHistory = [
  { text: "Show all overdue loans > 60 days", time: "11 Mar, 10:15 AM", category: "Loans" },
  { text: "Members with declining STI trend", time: "11 Mar, 09:48 AM", category: "Risk" },
  { text: "FD maturity schedule for April", time: "10 Mar, 04:22 PM", category: "Deposits" },
  { text: "Branch-wise collection summary", time: "10 Mar, 02:10 PM", category: "Members" },
  { text: "KYC pending list — Whitefield", time: "10 Mar, 11:30 AM", category: "Compliance" },
  { text: "NPA classification report", time: "09 Mar, 03:45 PM", category: "Loans" },
];

// ─── Helper components ──────────────────────────────────────────────

function ImpactBadge({ level }) {
  const styles = {
    High: "bg-red-50 text-red-600 border-red-200",
    Medium: "bg-amber-50 text-amber-600 border-amber-200",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[level]}`}>
      {level} Impact
    </span>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    Risk: "bg-rose-50 text-rose-600 border-rose-200",
    Growth: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Compliance: "bg-violet-50 text-violet-600 border-violet-200",
    Operational: "bg-sky-50 text-sky-600 border-sky-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[category] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {category}
    </span>
  );
}

function SimpleBarChart({ data, label }) {
  const max = Math.max(...data);
  const labels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return (
    <div className="flex items-end gap-2 h-24 mt-2">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[10px] text-slate-400 font-mono">{val}</span>
          <div
            className="w-full rounded-t-md bg-indigo-400 transition-all"
            style={{ height: `${(val / max) * 64}px` }}
          />
          <span className="text-[10px] text-slate-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Tab content components ─────────────────────────────────────────

function ChatAssistantTab() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
    const aiResponse = suggestedResponses[text.trim()] ||
      `I've analyzed your query: "${text.trim()}"\n\nBased on current data, I'll need a moment to compile the results. In the meantime, here's a quick summary:\n\n- Total active members: 1,247\n- Active loans: Rs.8.4 Cr\n- Total deposits: Rs.14.2 Cr\n- Overall portfolio health: Good\n\nWould you like me to drill down into any specific area?`;
    const aiMsg = {
      id: messages.length + 2,
      role: "ai",
      text: aiResponse,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const handleChipClick = (query) => {
    handleSend(query);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-md"
              }`}
            >
              {msg.role === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-[10px] text-indigo-600 font-bold">AI</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600">Glimmora AI</span>
                </div>
              )}
              <div className={`text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "text-slate-700"}`}>
                {msg.text}
              </div>
              <div className={`text-[10px] mt-2 ${msg.role === "user" ? "text-indigo-200 text-right" : "text-slate-400"}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested queries */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestedQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleChipClick(q)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Ask anything about your Nidhi company..."
          className="flex-1 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-indigo-600 text-white rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
        >
          Send
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function QueryPanelTab() {
  const [selectedCategory, setSelectedCategory] = useState("Members");
  const [selectedQuery, setSelectedQuery] = useState(null);

  const sampleResults = {
    "Top 10 members by deposit value": [
      { id: "M-1001", name: "Anand Krishnan", deposits: "Rs.14.8 Lakhs", branch: "Indiranagar" },
      { id: "M-1015", name: "Sunita Rao", deposits: "Rs.12.3 Lakhs", branch: "Koramangala" },
      { id: "M-1008", name: "Venkatesh Iyer", deposits: "Rs.11.7 Lakhs", branch: "Jayanagar" },
      { id: "M-1022", name: "Lakshmi Devi", deposits: "Rs.10.5 Lakhs", branch: "Whitefield" },
      { id: "M-1034", name: "Mohan Reddy", deposits: "Rs.9.8 Lakhs", branch: "Indiranagar" },
    ],
    "Members with KYC pending > 30 days": [
      { id: "M-1047", name: "Priya Venkatesh", deposits: "KYC Pending 45 days", branch: "Koramangala" },
      { id: "M-1089", name: "Sunil Agarwal", deposits: "KYC Pending 38 days", branch: "Indiranagar" },
      { id: "M-1134", name: "Ramesh Babu", deposits: "KYC Pending 62 days", branch: "Whitefield" },
      { id: "M-1156", name: "Geeta Sharma", deposits: "KYC Pending 51 days", branch: "Jayanagar" },
    ],
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
  };

  const currentCategory = queryCategories.find((c) => c.name === selectedCategory);
  const resultData = sampleResults[selectedQuery] || null;

  return (
    <div className="space-y-5">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {queryCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => { setSelectedCategory(cat.name); setSelectedQuery(null); }}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              selectedCategory === cat.name
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Query cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentCategory?.queries.map((q) => (
          <button
            key={q}
            onClick={() => handleQueryClick(q)}
            className={`text-left bg-white rounded-2xl p-4 card-shadow border transition-all cursor-pointer ${
              selectedQuery === q
                ? "border-indigo-300 ring-2 ring-indigo-500/10"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <p className="text-[13px] text-slate-700 font-medium">{q}</p>
            <p className="text-[11px] text-slate-400 mt-1">Click to execute query</p>
          </button>
        ))}
      </div>

      {/* Results area */}
      {selectedQuery && (
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Query Results: {selectedQuery}</h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
              Completed
            </span>
          </div>
          {resultData ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["ID", "Name", "Value", "Branch"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{row.id}</td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-700 font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-emerald-600">{row.deposits}</td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-500">{row.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-slate-400">
              Processing query... Results will appear here.
            </div>
          )}
        </div>
      )}

      {/* Recent queries */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Queries</h3>
        <div className="space-y-2.5">
          {recentQueryHistory.map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <p className="text-[13px] text-slate-700">{q.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                  {q.category}
                </span>
                <span className="text-[11px] text-slate-400">{q.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportGeneratorTab() {
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
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Report Name", "Generated", "Format", "Size", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generatedReports.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-slate-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">{r.format}</span>
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

function InsightsDashboardTab() {
  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Insights", value: "8", sub: "This month" },
          { label: "High Impact", value: "3", sub: "Requires attention" },
          { label: "Avg Confidence", value: "90%", sub: "AI certainty" },
          { label: "Actions Pending", value: "12", sub: "Across all insights" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insightsData.map((insight, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-slate-800 flex-1 pr-3">{insight.title}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <ImpactBadge level={insight.impact} />
                <CategoryBadge category={insight.category} />
              </div>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{insight.desc}</p>

            {/* Confidence bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">Confidence</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    insight.confidence >= 90 ? "bg-emerald-500" : insight.confidence >= 75 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500">{insight.confidence}%</span>
            </div>

            {/* Recommended action */}
            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
              <p className="text-[10px] text-indigo-500 uppercase tracking-wide font-semibold mb-1">Recommended Action</p>
              <p className="text-[12px] text-indigo-700 leading-relaxed">{insight.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskExplanationTab() {
  const [selectedRisk, setSelectedRisk] = useState("credit");

  const risk = riskCategories.find((r) => r.id === selectedRisk);

  const scoreColor = (score) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-amber-600";
    return "text-emerald-600";
  };

  const scoreBg = (score) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-emerald-500";
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
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {risk && (
        <>
          {/* Risk overview */}
          <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-800">{risk.name}</h3>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mt-1 inline-block ${
                  risk.level === "High" ? "bg-red-50 text-red-600 border-red-200" :
                  risk.level === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                  "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  {risk.level} Risk
                </span>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${scoreColor(risk.score)}`}>{risk.score}</p>
                <p className="text-[10px] text-slate-400">out of 100</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${scoreBg(risk.score)}`}
                style={{ width: `${risk.score}%` }}
              />
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed">{risk.explanation}</p>
          </div>

          {/* Contributing factors */}
          <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Contributing Factors</h3>
            <div className="space-y-3">
              {risk.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 text-right">
                    <span className="text-[11px] font-mono font-semibold text-indigo-600">{f.weight}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-medium text-slate-700">{f.name}</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full bg-indigo-400" style={{ width: `${f.weight * 3.3}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend and actions side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Historical trend */}
            <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Historical Trend (6 Months)</h3>
              <SimpleBarChart data={risk.trend} />
            </div>

            {/* Recommended actions */}
            <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Recommended Actions</h3>
              <div className="space-y-2.5">
                {risk.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
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

function AIQueriesTab() {
  const [activeQuery, setActiveQuery] = useState(null);

  return (
    <div className="space-y-5">
      {/* Featured queries */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Featured Queries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => setActiveQuery(activeQuery === i ? null : i)}
              className={`text-left bg-white rounded-2xl p-4 card-shadow border transition-all cursor-pointer ${
                activeQuery === i
                  ? "border-indigo-300 ring-2 ring-indigo-500/10"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <p className="text-[13px] text-slate-700 font-medium">{q.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  q.category === "Risk" ? "bg-rose-50 text-rose-600 border-rose-200" :
                  q.category === "Compliance" ? "bg-violet-50 text-violet-600 border-violet-200" :
                  q.category === "Growth" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                  "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {q.category}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                  {q.responseType}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active query response */}
      {activeQuery !== null && (
        <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Response: {featuredQueries[activeQuery].text}</h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
              Completed
            </span>
          </div>

          {featuredQueries[activeQuery].response === "table" && featuredQueries[activeQuery].data ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["ID", "Name", "STI/Alert", "Risk Score", "Branch"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featuredQueries[activeQuery].data.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{row.id}</td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-700 font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-amber-600">{row.sti || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          row.risk >= 80 ? "bg-red-50 text-red-600 border-red-200" :
                          row.risk >= 60 ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}>
                          {row.risk}/100
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] text-slate-500">{row.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {featuredQueries[activeQuery].content}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Export high risk members",
            "Generate NPA report",
            "Run STI analysis",
            "Check compliance status",
            "Analyze deposit trends",
            "Review chit fund performance",
          ].map((action) => (
            <button
              key={action}
              className="text-[11px] font-medium px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Query history */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Query History</h3>
        <div className="space-y-2.5">
          {[
            { text: "Show high risk members", time: "11 Mar, 10:34 AM", type: "Table" },
            { text: "What is the current compliance score?", time: "11 Mar, 10:32 AM", type: "Text" },
            { text: "List overdue EMIs for March", time: "10 Mar, 04:45 PM", type: "Table" },
            { text: "Predict member churn for Q2", time: "10 Mar, 02:20 PM", type: "Chart" },
            { text: "Summarize loan portfolio health", time: "10 Mar, 11:10 AM", type: "Report" },
            { text: "Flag suspicious transactions this week", time: "09 Mar, 03:30 PM", type: "Table" },
            { text: "Calculate branch-wise deposit growth", time: "09 Mar, 01:15 PM", type: "Chart" },
            { text: "Generate board summary for Feb", time: "08 Mar, 05:00 PM", type: "Report" },
          ].map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <p className="text-[13px] text-slate-700">{q.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200">
                  {q.type}
                </span>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{q.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────

export default function AIAssistantView() {
  const [activeTab, setActiveTab] = useState("chat");

  const renderTab = () => {
    switch (activeTab) {
      case "chat":
        return <ChatAssistantTab />;
      case "query":
        return <QueryPanelTab />;
      case "reports":
        return <ReportGeneratorTab />;
      case "insights":
        return <InsightsDashboardTab />;
      case "risk":
        return <RiskExplanationTab />;
      case "queries":
        return <AIQueriesTab />;
      default:
        return <ChatAssistantTab />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-800">AI Assistant</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Intelligent insights, natural language queries, and automated reports for your Nidhi company
        </p>
        <div className="hidden sm:flex gap-4 mt-3">
          {[
            { label: "Queries Today", value: "47" },
            { label: "Reports Generated", value: "12" },
            { label: "Active Insights", value: "8" },
            { label: "AI Confidence", value: "92%" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{s.value}</span>
              <span className="text-[11px] text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border ${
              activeTab === tab.id
                ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">{renderTab()}</div>
    </div>
  );
}
