import Image from "next/image";
import AnimatedCounter from "./ui/AnimatedCounter";

export default function MetricCard({ metric }) {
  const isPositive = metric.change.startsWith("+");

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 relative overflow-hidden group hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">

      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 font-medium truncate">
            {metric.label}
          </div>
          <div className="text-xl sm:text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
            <AnimatedCounter value={metric.value} />
          </div>
        </div>
        <div
          className="rounded-xl p-1.5 sm:p-2.5 text-xl shrink-0"
          style={{
            background: `${metric.color}12`,
          }}
        >
          <Image
            src={metric.icon}
            alt=""
            width={35}
            height={35}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-[35px] md:h-[35px]"
          />
        </div>
      </div>

      <div className="mt-1.5 sm:mt-2.5 flex items-center gap-1.5">
        <span
          className={`text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
          }`}
        >
          {metric.change}
        </span>
        <span className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:inline">vs last month</span>
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
