export default function ProgressBar({ value, max = 100, color, height = "h-1.5" }) {
  const pct = Math.min((value / max) * 100, 100);
  const bg = color || (value / max >= 0.7 ? "#DC2626" : value / max >= 0.5 ? "#D97706" : "#059669");

  return (
    <div className={`bg-slate-200 rounded-full ${height} overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: bg }}
      />
    </div>
  );
}
