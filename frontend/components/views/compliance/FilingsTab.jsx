"use client";

import { useRegulatoryFilings } from "@/hooks/useData";
import StatusBadge from "@/components/ui/StatusBadge";
import HeaderStat from "@/components/ui/HeaderStat";

export default function FilingsTab() {
  const { data: regulatoryFilings = [] } = useRegulatoryFilings();
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl p-5 mb-5 card-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-heading mb-1">Regulatory Filing Tracker</h3>
            <p className="text-[13px] text-heading">Track all mandatory filings with MCA/ROC as per Nidhi Company regulations.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <HeaderStat
              value={regulatoryFilings.filter((f) => f.status === "Filed").length}
              label="Filed"
              className="bg-success-50 border border-success-200/60 text-success"
            />
            <HeaderStat
              value={regulatoryFilings.filter((f) => f.status === "Upcoming").length}
              label="Upcoming"
              className="bg-blue-50 border border-blue-200/60 text-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulatoryFilings.map((f) => (
          <div key={f.form} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[15px] font-bold text-heading">{f.form}</div>
                <div className="text-[12px] text-heading mt-0.5">{f.description}</div>
              </div>
              <StatusBadge status={f.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Due Date</div>
                <div className="text-[13px] font-semibold text-body">{f.dueDate}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Filed Date</div>
                <div className="text-[13px] font-semibold text-body">{f.filedDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
