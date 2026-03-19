"use client";

import { useDepositSchemes } from "@/hooks/useData";
import SectionCard from "@/components/ui/SectionCard";

export default function SchemesTab() {
  const { data: depositSchemes = [] } = useDepositSchemes();

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4">
        {depositSchemes.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[16px] font-bold text-heading">{s.name}</div>
                <div className="text-[12px] text-heading mt-1">{s.members.toLocaleString()} members enrolled &middot; Total Corpus: {s.totalCorpus}</div>
              </div>
              <div className="bg-primary-50 ml-2 rounded-xl px-3 py-2 text-center border border-primary-200/60 whitespace-nowrap">
                <div className="text-lg font-bold text-primary font-mono">{s.rate}</div>
                <div className="text-heading text-[10px]">Interest Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Min Amount</div>
                <div className="text-[14px] font-semibold text-body">{s.minAmount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Max Amount</div>
                <div className="text-[14px] font-semibold text-body">{s.maxAmount}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Tenure Options</div>
                <div className="text-[14px] font-semibold text-body">{s.tenures}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-heading uppercase tracking-wider mb-1">Total Corpus</div>
                <div className="text-[14px] font-bold text-success font-mono">{s.totalCorpus}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Nidhi Deposit Regulations" className="mt-4">
        <div className="flex flex-col gap-2">
          {[
            "Maximum deposit interest rate must not exceed the ceiling prescribed by RBI.",
            "All deposits are governed by Nidhi Rules 2014 and Nidhi (Amendment) Rules 2022.",
            "Net Owned Funds to Deposits ratio must not exceed 1:20.",
            "Members can hold multiple deposit accounts across different schemes.",
            "Premature withdrawal subject to penalty as per scheme terms.",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] text-slate-500">
              <div className="w-5 h-5 bg-success-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {rule}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
