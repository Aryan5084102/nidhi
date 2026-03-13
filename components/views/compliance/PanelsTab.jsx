import StatusBadge from "@/components/ui/StatusBadge";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";

const committees = [
  {
    name: "Audit Committee",
    chairperson: "CA Venkatesh Murthy",
    members: ["Smt. Lakshmi Narayan (Independent Director)", "Shri Ramachandran K. (Non-Executive Director)", "CA Priya Subramanian (External Expert)"],
    lastMeeting: "01 Mar 2026",
    nextMeeting: "01 Jun 2026",
    frequency: "Quarterly",
    mandate: "Review financial statements, internal controls, statutory audit observations, and compliance with Nidhi Rules 2014.",
  },
  {
    name: "Compliance Committee",
    chairperson: "Adv. Suresh Bhat",
    members: ["Shri Mohan Rao (Managing Director)", "Smt. Kavitha Nair (Compliance Officer)", "Shri Anil Kumar (Company Secretary)"],
    lastMeeting: "15 Feb 2026",
    nextMeeting: "15 May 2026",
    frequency: "Quarterly",
    mandate: "Ensure compliance with MCA regulations, Nidhi Rules, PMLA requirements, and RBI directives applicable to Nidhi companies.",
  },
  {
    name: "Risk Management Committee",
    chairperson: "Dr. Padma Krishnamurthy",
    members: ["Shri Rajesh Kumar (Chief Risk Officer)", "Smt. Deepa Hegde (Credit Head)", "Shri Vinod Kamath (Operations Head)"],
    lastMeeting: "20 Feb 2026",
    nextMeeting: "20 May 2026",
    frequency: "Quarterly",
    mandate: "Oversee credit risk, operational risk, liquidity risk, and fraud risk. Review risk appetite and tolerance levels.",
  },
  {
    name: "Grievance Redressal Committee",
    chairperson: "Smt. Annapurna Devi",
    members: ["Shri Prakash Joshi (Member Relations)", "Smt. Meena Iyer (Branch Head)", "Shri Harish Shenoy (Legal Advisor)"],
    lastMeeting: "10 Mar 2026",
    nextMeeting: "10 Apr 2026",
    frequency: "Monthly",
    mandate: "Address member complaints, resolve disputes, and ensure fair treatment as per Nidhi Company member charter.",
  },
];

const boardMembers = [
  { name: "Shri Mohan Rao", designation: "Managing Director", since: "Jan 2024", din: "08765432" },
  { name: "Smt. Lakshmi Narayan", designation: "Independent Director", since: "Apr 2024", din: "09876543" },
  { name: "Shri Ramachandran K.", designation: "Non-Executive Director", since: "Jan 2024", din: "07654321" },
  { name: "CA Venkatesh Murthy", designation: "Director (Finance)", since: "Jul 2024", din: "08654321" },
  { name: "Adv. Suresh Bhat", designation: "Director (Legal)", since: "Oct 2024", din: "09543210" },
];

const meetingMinutes = [
  { date: "01 Mar 2026", committee: "Audit Committee", agenda: "Q3 FY26 financial review, internal audit findings, compliance score discussion", status: "Minutes Filed" },
  { date: "20 Feb 2026", committee: "Risk Management", agenda: "NPA review, liquidity stress test results, fraud trend analysis", status: "Minutes Filed" },
  { date: "15 Feb 2026", committee: "Compliance Committee", agenda: "NDH-1 filing preparation, KYC re-verification drive planning, PMLA compliance update", status: "Minutes Filed" },
  { date: "10 Feb 2026", committee: "Board Meeting", agenda: "Q3 results approval, dividend declaration, director rotation", status: "Minutes Filed" },
  { date: "05 Feb 2026", committee: "Grievance Redressal", agenda: "12 pending complaints review, new grievance policy approval", status: "Minutes Filed" },
  { date: "15 Jan 2026", committee: "Board Meeting", agenda: "Annual budget FY27, branch expansion proposal, technology roadmap", status: "Minutes Filed" },
];

const minutesColumns = [
  { key: "date", label: "Date" },
  { key: "committee", label: "Committee" },
  { key: "agenda", label: "Agenda Items" },
  { key: "status", label: "Status" },
];

export default function PanelsTab() {
  return (
    <div className="animate-fade-in">
      {/* Board Composition */}
      <SectionCard title="Board of Directors" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {boardMembers.map((b) => (
            <div key={b.din} className="bg-slate-50 rounded-xl p-4">
              <div className="text-[13px] font-semibold text-slate-700">{b.name}</div>
              <div className="text-[12px] text-indigo-500 mt-0.5">{b.designation}</div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-slate-400">Since: {b.since}</span>
                <span className="text-[11px] text-slate-300">DIN: {b.din}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Committees */}
      <div className="flex flex-col gap-4 mb-6">
        {committees.map((c) => (
          <SectionCard key={c.name}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">{c.name}</h3>
                <div className="text-[12px] text-indigo-500 mt-0.5">Chairperson: {c.chairperson}</div>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c.frequency}</span>
            </div>
            <div className="text-[12px] text-slate-400 mb-3">{c.mandate}</div>
            <div className="flex flex-col gap-1 mb-3">
              {c.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  {m}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Last Meeting</div>
                <div className="text-[13px] font-semibold text-slate-700">{c.lastMeeting}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Next Meeting</div>
                <div className="text-[13px] font-semibold text-slate-700">{c.nextMeeting}</div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Meeting Minutes */}
      <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-900">Meeting Minutes Tracker</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Minutes filed with ROC as per Section 118 of Companies Act 2013</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 whitespace-nowrap">
              {minutesColumns.map((col) => (
                <th key={col.key} className="text-left text-[11px] text-slate-400 uppercase tracking-wider font-medium px-5 py-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meetingMinutes.map((m, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] text-slate-400 whitespace-nowrap">{m.date}</td>
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700 whitespace-nowrap">{m.committee}</td>
                <td className="px-5 py-3 text-[12px] text-slate-400">
                  <span className="line-clamp-2 max-w-45 md:line-clamp-none md:max-w-none" title={m.agenda}>{m.agenda}</span>
                </td>

                <td className="px-5 py-3"><StatusBadge status="Filed" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
