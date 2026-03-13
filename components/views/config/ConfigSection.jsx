"use client";

import SectionCard from "@/components/ui/SectionCard";

export default function ConfigSection({ title, description, configs }) {
  return (
    <div className="animate-fade-in">
      <SectionCard className="mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-[13px] text-slate-400">{description}</p>
      </SectionCard>

      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="flex flex-col divide-y divide-slate-100">
          {configs.map((config) => (
            <div key={config.key} className="flex items-center justify-between gap-5  px-5 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex-1 ">
                <div className="text-[13px] font-semibold whitespace-nowrap text-slate-700">{config.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{config.key}</div>
              </div>
              <div className="flex items-center  gap-5">
                {config.type === "toggle" ? (
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${config.value === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${config.value === "Enabled" ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[13px] text-slate-700 font-mono min-w-[200px] text-right">
                    {config.value}
                  </div>
                )}
                <button className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium cursor-pointer transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
