"use client";

import { useState } from "react";

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

export default function ChatAssistantTab() {
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
