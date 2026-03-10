import Image from "next/image";

export default function MetricCard({ metric }) {
  const isPositive = metric.change.startsWith("+");

  return (
    <div className="bg-white rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">

      <div className="flex justify-between items-start">
        <div>
          <div className="text-[11px] text-slate-400 uppercase tracking-widest mb-2 font-medium">
            {metric.label}
          </div>
          <div className="text-[28px] font-bold text-slate-900 tracking-tight">
            {metric.value}
          </div>
        </div>
        <div
          className="rounded-xl p-2.5 text-xl"
          style={{
            background: `${metric.color}12`,
          }}
        >
          <Image 
            src={metric.icon}
            alt="Error"
            width={35}
            height={35}
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
          }`}
        >
          {metric.change}
        </span>
        <span className="text-[11px] text-slate-400">vs last month</span>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${metric.color}, transparent)`,
        }}
      />
    </div>
  );
}
