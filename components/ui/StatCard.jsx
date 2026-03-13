export default function StatCard({ label, value, sub, color, className = "" }) {
  return (
    <div className={`bg-slate-50 rounded-xl p-4 text-center border border-slate-100 ${className}`}>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[20px] font-bold font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
