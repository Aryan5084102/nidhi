export default function PlaceholderView({ label }) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] gap-4 animate-fade-in">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <span className="text-3xl opacity-40">🚧</span>
      </div>
      <div className="text-xl font-semibold text-slate-400">{label}</div>
      <div className="text-[13px] text-slate-300">
        This module is part of the implementation roadmap
      </div>
      <div className="flex gap-2">
        {["Phase 1", "Phase 2", "Phase 3"].map((p) => (
          <span
            key={p}
            className="bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-[11px] text-slate-400"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
