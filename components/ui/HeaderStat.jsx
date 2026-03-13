export default function HeaderStat({ value, label, className = "bg-slate-50" }) {
  return (
    <div className={`${className} rounded-xl px-3 py-2 text-center`}>
      <div className="text-lg font-bold font-mono">{value}</div>
      <div className="text-slate-400 text-[10px]">{label}</div>
    </div>
  );
}
