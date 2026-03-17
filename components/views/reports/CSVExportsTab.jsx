import SectionCard from "@/components/ui/SectionCard";

export default function CSVExportsTab() {
  const exportCategories = [
    { name: "Members Data", description: "Complete member directory with KYC status, STI scores, deposit and loan summaries", rows: "12,450", lastExported: "08 Mar 2026", icon: "M" },
    { name: "Loan Accounts", description: "All active and closed loan accounts with EMI schedules, repayment history", rows: "5,200", lastExported: "08 Mar 2026", icon: "L" },
    { name: "Deposit Accounts", description: "FD, RD, and Savings deposit accounts with maturity dates, interest accrued", rows: "12,450", lastExported: "05 Mar 2026", icon: "D" },
    { name: "Transactions Ledger", description: "Complete transaction history \u2014 deposits, withdrawals, EMI payments, auction settlements", rows: "1,45,680", lastExported: "01 Mar 2026", icon: "T" },
    { name: "Compliance Records", description: "Regulatory filings, audit logs, KYC records, and compliance checklist status", rows: "2,840", lastExported: "01 Mar 2026", icon: "C" },
  ];

  const exportHistory = [
    { file: "members_full_20260308.csv", category: "Members", rows: "12,450", size: "4.8 MB", exportedBy: "Ramesh (Admin)", date: "08 Mar 2026, 15:20" },
    { file: "loans_active_20260308.csv", category: "Loans", rows: "5,200", size: "2.1 MB", exportedBy: "Kavitha (Finance)", date: "08 Mar 2026, 14:45" },
    { file: "deposits_all_20260305.csv", category: "Deposits", rows: "12,450", size: "3.6 MB", exportedBy: "Scheduled", date: "05 Mar 2026, 09:00" },
    { file: "transactions_feb2026.csv", category: "Transactions", rows: "24,560", size: "8.2 MB", exportedBy: "Ramesh (Admin)", date: "01 Mar 2026, 10:15" },
    { file: "compliance_q4_2025.csv", category: "Compliance", rows: "2,840", size: "1.1 MB", exportedBy: "Scheduled", date: "01 Mar 2026, 10:00" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Export Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {exportCategories.map((ec) => (
          <div key={ec.name} className="bg-white rounded-2xl p-5 card-shadow border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-[14px] font-bold text-primary">
                {ec.icon}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-heading">{ec.name}</div>
                <div className="text-[11px] text-heading mt-0.5">{ec.rows} rows</div>
              </div>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{ec.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-heading">Last exported: {ec.lastExported}</span>
            </div>
            <button className="w-full py-2 bg-primary-50 border border-primary-200 text-primary rounded-xl text-[12px] font-semibold cursor-pointer hover:bg-primary-100 transition-colors">
              Export CSV
            </button>
          </div>
        ))}
      </div>

      {/* Export Configuration */}
      <SectionCard title="Export Configuration" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Date Range</div>
            <div className="text-[13px] font-semibold text-body">01 Mar 2026 \u2014 11 Mar 2026</div>
            <div className="text-[11px] text-heading mt-1">Custom range supported</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Filter Options</div>
            <div className="text-[13px] font-semibold text-body">Active Records Only</div>
            <div className="text-[11px] text-heading mt-1">Status, branch, category filters</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-[10px] text-heading uppercase tracking-wider mb-2">Encoding</div>
            <div className="text-[13px] font-semibold text-body">UTF-8 with BOM</div>
            <div className="text-[11px] text-heading mt-1">Excel-compatible format</div>
          </div>
        </div>
      </SectionCard>

      {/* Export History */}
      <SectionCard title="Export History">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">File Name</th>
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">Category</th>
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-right whitespace-nowrap">Rows</th>
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-right whitespace-nowrap">Size</th>
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">Exported By</th>
                <th className="text-[11px] text-heading uppercase tracking-wider font-medium px-5 py-3 text-left whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.map((eh) => (
                <tr key={eh.file} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="text-[12px] font-mono text-primary px-5 py-3 whitespace-nowrap">{eh.file}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200">{eh.category}</span>
                  </td>
                  <td className="text-[12px] font-mono text-body px-5 py-3 text-right whitespace-nowrap">{eh.rows}</td>
                  <td className="text-[12px] font-mono text-body px-5 py-3 text-right whitespace-nowrap">{eh.size}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3 whitespace-nowrap">{eh.exportedBy}</td>
                  <td className="text-[12px] text-slate-500 px-5 py-3 whitespace-nowrap">{eh.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
