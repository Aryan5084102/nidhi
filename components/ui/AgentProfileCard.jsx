import StatusBadge from "./StatusBadge";
import MetricCard from "./MetricCard";

export default function AgentProfileCard({ icon, iconBg, iconColor, title, description, status = "Online", metrics }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-heading">{title}</h3>
          <p className="text-[12px] text-heading">{description}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={status} /></div>
      </div>
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[10px] text-heading uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-[16px] font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
