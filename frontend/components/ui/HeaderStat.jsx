export default function HeaderStat({ value, label, className = "bg-slate-50" }) {
  return (
    <div className={`${className} rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-center`}>
      <div className="text-sm sm:text-lg font-bold font-mono">{value}</div>
      <div className="text-heading text-[9px] sm:text-[10px]">{label}</div>
    </div>
  );
}
