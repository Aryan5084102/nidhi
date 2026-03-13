import SectionCard from "@/components/ui/SectionCard";

const nidhiRules = [
  { title: "Nidhi Rules 2014", sections: [
    "Rule 3: Membership minimum 200 within 1 year of incorporation.",
    "Rule 4: Net Owned Funds shall not be less than \u20B910 Lakhs (revised to \u20B920 Lakhs).",
    "Rule 5: Ratio of Net Owned Funds to deposits shall not exceed 1:20.",
    "Rule 6: Unencumbered term deposits must be at least 10% of outstanding deposits.",
  ]},
  { title: "Nidhi (Amendment) Rules 2022", sections: [
    "Net Owned Funds requirement increased to \u20B920 Lakhs.",
    "Introduction of NDH-4 form for Nidhi declaration application.",
    "Revised timelines for meeting membership and NOF requirements.",
    "Enhanced KYC and due diligence requirements for members.",
  ]},
  { title: "Lending & Deposit Limits", sections: [
    "Loans only to members (min 1 year membership for secured, 3 years for unsecured).",
    "Maximum unsecured loan: \u20B92,00,000 per member.",
    "Deposits accepted only from members enrolled for at least 1 year.",
    "Interest on deposits must not exceed ceiling prescribed by RBI.",
  ]},
  { title: "Governance Requirements", sections: [
    "Board of Directors must have minimum 3 directors.",
    "Annual filing of NDH-1 (compliance return) and NDH-3 (half-yearly return).",
    "Annual General Meeting within 6 months of financial year end.",
    "Statutory audit by qualified Chartered Accountant.",
  ]},
];

export default function RegulationsTab() {
  return (
    <div className="animate-fade-in">
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 mb-6 text-[12px] text-amber-700">
        This section provides a reference summary of key Nidhi Company regulations. For complete rules, refer to the Companies Act 2013, Nidhi Rules 2014, and subsequent amendments.
      </div>

      <div className="flex flex-col gap-4">
        {nidhiRules.map((rule) => (
          <SectionCard key={rule.title} title={rule.title}>
            <div className="flex flex-col gap-2">
              {rule.sections.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px] text-slate-500">
                  <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-indigo-500">
                    {i + 1}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
