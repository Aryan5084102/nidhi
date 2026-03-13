import { reportAnalytics } from "@/data/mockData";
import SectionCard from "@/components/ui/SectionCard";
import BarChart from "@/components/ui/BarChart";

export default function MemberGrowthTab() {
  const demographics = [
    { group: "18-25 yrs", count: 1620, pct: 13 },
    { group: "26-35 yrs", count: 3735, pct: 30 },
    { group: "36-45 yrs", count: 3486, pct: 28 },
    { group: "46-55 yrs", count: 2241, pct: 18 },
    { group: "55+ yrs", count: 1368, pct: 11 },
  ];

  const locations = [
    { city: "Bengaluru", members: 5480, pct: 44 },
    { city: "Mysuru", members: 1868, pct: 15 },
    { city: "Hubli-Dharwad", members: 1494, pct: 12 },
    { city: "Mangaluru", members: 1120, pct: 9 },
    { city: "Others", members: 2488, pct: 20 },
  ];

  const churnData = [
    { month: "Oct", churned: 18, reason: "Relocation", recovered: 5 },
    { month: "Nov", churned: 22, reason: "Dissatisfaction", recovered: 8 },
    { month: "Dec", churned: 15, reason: "Financial Hardship", recovered: 3 },
    { month: "Jan", churned: 28, reason: "Competition", recovered: 10 },
    { month: "Feb", churned: 20, reason: "Dormancy", recovered: 6 },
    { month: "Mar", churned: 25, reason: "Mixed", recovered: 9 },
  ];

  const channels = [
    { channel: "Referral Program", acquired: 4200, pct: 34, cost: "\u20B9120/member" },
    { channel: "Branch Walk-in", acquired: 2988, pct: 24, cost: "\u20B985/member" },
    { channel: "Digital Marketing", acquired: 2490, pct: 20, cost: "\u20B9210/member" },
    { channel: "Corporate Tie-ups", acquired: 1620, pct: 13, cost: "\u20B965/member" },
    { channel: "Agent Network", acquired: 1152, pct: 9, cost: "\u20B9180/member" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Member Growth Chart */}
      <SectionCard title="Member Growth Trend" className="mb-6">
        <BarChart
          data={reportAnalytics.memberGrowth}
          bars={[
            { key: "newMembers", label: "New Members", gradient: "linear-gradient(to top, #0D9488, #14B8A6)" },
            { key: "churned", label: "Churned", gradient: "linear-gradient(to top, #DC2626, #F87171)" },
          ]}
          maxVal={600}
          labelKey="month"
          height="120px"
        />
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Demographics */}
        <SectionCard title="Age Group Distribution">
          <div className="flex flex-col gap-3">
            {demographics.map((d) => (
              <div key={d.group} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{d.group}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{d.count.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{d.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, background: "linear-gradient(to right, #0D9488, #14B8A6)" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Location */}
        <SectionCard title="Geographic Distribution">
          <div className="flex flex-col gap-3">
            {locations.map((l) => (
              <div key={l.city} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700">{l.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-500">{l.members.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{l.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${l.pct}%`, background: "linear-gradient(to right, #4F46E5, #818CF8)" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Analysis */}
        <SectionCard title="Churn Analysis">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Month</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Churned</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-left">Primary Reason</th>
                  <th className="text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3 text-right">Recovered</th>
                </tr>
              </thead>
              <tbody>
                {churnData.map((c) => (
                  <tr key={c.month} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="text-[13px] font-medium text-slate-700 px-5 py-3">{c.month}</td>
                    <td className="text-[13px] font-mono text-red-500 px-5 py-3 text-right">{c.churned}</td>
                    <td className="text-[12px] text-slate-500 px-5 py-3">{c.reason}</td>
                    <td className="text-[13px] font-mono text-emerald-500 px-5 py-3 text-right">{c.recovered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Acquisition Channels */}
        <SectionCard title="Acquisition Channel Performance">
          <div className="flex flex-col gap-3">
            {channels.map((ch) => (
              <div key={ch.channel} className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-semibold text-slate-700">{ch.channel}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 border-indigo-200 text-indigo-600">{ch.pct}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-400">{ch.acquired.toLocaleString()} members</span>
                  <span className="text-[11px] text-slate-400">CAC: {ch.cost}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden mt-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${ch.pct}%`, background: "linear-gradient(to right, #7C3AED, #A78BFA)" }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
