export default function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => Math.max(d.inflow, d.payout)));

  return (
    <div className="flex items-end gap-1.5 h-20 py-2">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex flex-col items-center flex-1 gap-0.5"
        >
          <div className="flex gap-0.5 items-end h-[60px]">
            <div
              className="w-2.5 rounded-t-sm transition-all duration-500 hover:opacity-100"
              style={{
                height: `${(d.inflow / max) * 60}px`,
                background: "linear-gradient(to top, #059669, #10B981)",
                opacity: 0.85,
              }}
            />
            <div
              className="w-2.5 rounded-t-sm transition-all duration-500 hover:opacity-100"
              style={{
                height: `${(d.payout / max) * 60}px`,
                background: "linear-gradient(to top, #4F46E5, #6366F1)",
                opacity: 0.85,
              }}
            />
          </div>
          <span className="text-[9px] text-heading font-mono">
            {d.month}
          </span>
        </div>
      ))}
    </div>
  );
}
