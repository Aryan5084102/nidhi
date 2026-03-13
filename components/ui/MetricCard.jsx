export default function MetricCard({ label, value, color, change }) {
  const changeColor = change
    ? change.startsWith("+")
      ? "text-emerald-500"
      : change.startsWith("-")
      ? "text-red-500"
      : "text-slate-400"
    : null;

  return (
    <div className="bg-white rounded-2xl p-4 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[20px] font-bold font-mono" style={{ color }}>{value}</div>
      {change && (
        <div className={`text-[11px] mt-1 font-medium ${changeColor}`}>{change}</div>
      )}
    </div>
  );
}
