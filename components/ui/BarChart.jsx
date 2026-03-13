export default function BarChart({ data, bars, maxVal, labelKey = "month", height = "140px" }) {
  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: `calc(${height} + 24px)` }}>
        {data.map((d) => (
          <div key={d[labelKey]} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full flex gap-0.5 items-end" style={{ height }}>
              {bars.map((bar) => (
                <div
                  key={bar.key}
                  className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90"
                  style={{
                    height: `${(d[bar.key] / maxVal) * 100}%`,
                    background: bar.gradient,
                  }}
                  title={`${bar.label}: ${d[bar.key]}${bar.suffix || ""}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">
              {d[labelKey]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-4 justify-center">
        {bars.map((bar) => (
          <div key={bar.key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: bar.gradient }} />
            <span className="text-[11px] text-slate-500">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
