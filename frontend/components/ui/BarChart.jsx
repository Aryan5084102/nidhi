export default function BarChart({ data, bars, maxVal, labelKey = "month", height = "200px" }) {
  // Generate Y-axis tick values
  const tickCount = 5;
  const ticks = [];
  for (let i = tickCount; i >= 0; i--) {
    ticks.push(Math.round((maxVal / tickCount) * i));
  }

  return (
    <div>
      <div className="flex" style={{ height }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-3 py-0.5" style={{ minWidth: "48px" }}>
          {ticks.map((t, i) => (
            <span key={i} className="text-[10px] text-slate-400 font-mono text-right leading-none">
              {t >= 1000 ? `${(t / 1000).toFixed(t % 1000 === 0 ? 0 : 1)}K` : t}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 flex items-end gap-4 border-l border-b border-slate-200 pl-2 pb-0.5 relative">
          {/* Horizontal grid lines */}
          {ticks.slice(0, -1).map((t, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ bottom: `${(t / maxVal) * 100}%` }}
            />
          ))}

          {data.map((d) => (
            <div key={d[labelKey]} className="flex-1 flex flex-col items-center gap-0 group relative z-10">
              <div className="w-full flex gap-1 items-end justify-center" style={{ height: "100%" }}>
                {bars.map((bar) => {
                  const val = d[bar.key] || 0;
                  const pct = maxVal > 0 ? Math.min((val / maxVal) * 100, 100) : 0;
                  return (
                    <div
                      key={bar.key}
                      className="rounded-t-md transition-all duration-500 hover:opacity-80 relative group/bar"
                      style={{
                        height: `${pct}%`,
                        minHeight: val > 0 ? "4px" : "0",
                        width: `${Math.max(100 / (bars.length + 1), 20)}%`,
                        maxWidth: "32px",
                        background: bar.gradient,
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-mono px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20">
                        {val}{bar.suffix || ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex" style={{ paddingLeft: "48px" }}>
        <div className="flex-1 flex gap-4 pl-2 pt-2">
          {data.map((d) => (
            <div key={d[labelKey]} className="flex-1 text-center">
              <span className="text-[10px] text-slate-400 font-medium">{d[labelKey]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
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
