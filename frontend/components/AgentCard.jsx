const statusColors = {
  Active: "#059669",
  Warning: "#D97706",
  Alert: "#DC2626",
};

export default function AgentCard({ agent, detailed = false }) {
  const statusColor = statusColors[agent.status];
  const pct = (agent.processed / (agent.processed + agent.pending)) * 100;

  if (detailed) {
    return (
      <div className="bg-white rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: agent.color }}
        />

        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[15px] font-bold text-slate-800">
              {agent.name}
            </div>
            <span
              className="text-[11px] font-semibold"
              style={{ color: statusColor }}
            >
              ● {agent.status}
            </span>
          </div>
          <button
            className="rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              background: `${agent.color}15`,
              color: agent.color,
            }}
          >
            Configure
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div
              className="font-mono text-[22px] font-bold"
              style={{ color: agent.color }}
            >
              {agent.processed}
            </div>
            <div className="text-[11px] text-heading">Processed today</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="font-mono text-[22px] font-bold text-warning">
              {agent.pending}
            </div>
            <div className="text-[11px] text-heading">
              Awaiting human review
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, background: agent.color }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 relative overflow-hidden group hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: agent.color }}
      />

      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-[13px] font-semibold text-body mb-0.5">
            {agent.name}
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: statusColor }}
          >
            ● {agent.status}
          </span>
        </div>
        <div className="text-right">
          <div
            className="font-mono text-lg font-bold"
            style={{ color: agent.color }}
          >
            {agent.processed}
          </div>
          <div className="text-[10px] text-heading">processed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-full h-1 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[800ms] ease-out"
          style={{ width: `${pct}%`, background: agent.color }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-heading">
          {agent.pending} pending approval
        </span>
        <span className="text-[10px] text-heading">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}
