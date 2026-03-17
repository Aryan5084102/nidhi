"use client";

import SectionCard from "@/components/ui/SectionCard";
import ProgressBar from "@/components/ui/ProgressBar";

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

function ImpactBadge({ level }) {
  const styles = {
    High: "bg-danger-50 text-danger border-danger-200",
    Medium: "bg-warning-50 text-warning border-warning-200",
    Low: "bg-success-50 text-success border-success-200",
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
    Growth: "bg-success-50 text-success border-success-200",
    Compliance: "bg-violet-50 text-violet-600 border-violet-200",
    Operational: "bg-sky-50 text-sky-600 border-sky-200",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[category] || "bg-slate-50 text-body border-slate-200"}`}>
      {category}
    </span>
  );
}

export default function InsightsDashboardTab() {
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
            <p className="text-[11px] text-heading uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
            <p className="text-[11px] text-heading mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insightsData.map((insight, i) => (
          <SectionCard key={i}>
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
              <span className="text-[10px] text-heading uppercase tracking-wide">Confidence</span>
              <div className="flex-1">
                <ProgressBar
                  value={insight.confidence}
                  max={100}
                  color={insight.confidence >= 90 ? "#10B981" : insight.confidence >= 75 ? "#F59E0B" : "#EF4444"}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500">{insight.confidence}%</span>
            </div>

            {/* Recommended action */}
            <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100">
              <p className="text-[10px] text-primary-500 uppercase tracking-wide font-semibold mb-1">Recommended Action</p>
              <p className="text-[12px] text-primary-700 leading-relaxed">{insight.action}</p>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
