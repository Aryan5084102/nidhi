"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import STIBadge from "@/components/badges/STIBadge";
import RiskBadge from "@/components/badges/RiskBadge";

export default function MemberCardList({ members, onView, onEdit }) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {members.map((m) => (
        <div key={m.id} className="bg-white rounded-2xl p-4 card-shadow border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-sm">
                {m.name.charAt(0)}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-body">{m.name}</div>
                <div className="text-[11px] text-heading font-mono">{m.id}</div>
              </div>
            </div>
            <StatusBadge status={m.status || "Active"} />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-[10px] text-heading">Deposits</div>
              <div className="text-[12px] font-mono text-success font-semibold">{m.deposits}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <div className="text-[10px] text-heading">Loans</div>
              <div className="text-[12px] font-mono text-primary font-semibold">{m.loans}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiskBadge risk={m.risk} />
              <STIBadge score={m.sti} />
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => onView(m)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-500 cursor-pointer">View</button>
              <button onClick={() => onEdit(m)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-500 cursor-pointer">Edit</button>
            </div>
          </div>
        </div>
      ))}
      {members.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-sm text-heading card-shadow border border-slate-100">
          No members found
        </div>
      )}
    </div>
  );
}
