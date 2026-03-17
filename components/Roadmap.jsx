import { roadmap } from "@/data/mockData";

export default function Roadmap() {
  return (
    <div className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-300 card-shadow border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">
        Implementation Roadmap
      </h3>

      <div className="flex flex-col gap-2">
        {roadmap.map((r, i) => {
          const dotColor =
            r.status === "complete"
              ? "bg-success-500"
              : r.status === "active"
              ? "bg-primary-500"
              : "bg-slate-300";

          const textColor =
            r.status === "active"
              ? "text-primary"
              : r.status === "complete"
              ? "text-success"
              : "text-heading";

          return (
            <div key={i} className="flex items-center gap-2.5 group">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor} ${
                  r.status === "active"
                    ? "ring-2 ring-primary-500/30"
                    : ""
                }`}
              />
              <div
                className={`flex-1 h-px ${
                  r.status === "complete"
                    ? "bg-success-200"
                    : "bg-slate-200"
                }`}
              />
              <div className="flex justify-between w-[220px]">
                <span
                  className={`text-[11px] ${textColor} ${
                    r.status === "active" ? "font-semibold" : "font-normal"
                  }`}
                >
                  {r.phase}: {r.title}
                </span>
                <span className="text-[10px] text-heading font-mono">
                  {r.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
