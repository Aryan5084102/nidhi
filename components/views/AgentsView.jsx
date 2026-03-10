import AgentCard from "../AgentCard";
import { agents } from "@/data/mockData";

export default function AgentsView() {
  return (
    <div className="animate-fade-in">
      {/* Description Card */}
      <div className="bg-white rounded-2xl p-5 mb-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-800 mb-2">
          Agentic AI Architecture
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          All AI agents operate as governed co-pilots. Every agent action is
          logged, attributable, policy-bounded, and reviewable. Human approval
          is required for all material regulatory, payout, or disciplinary
          actions.
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((a, i) => (
          <AgentCard key={i} agent={a} detailed />
        ))}
      </div>
    </div>
  );
}
