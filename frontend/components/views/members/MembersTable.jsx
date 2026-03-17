"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import STIBadge from "@/components/badges/STIBadge";
import RiskBadge from "@/components/badges/RiskBadge";

export default function MembersTable({
  members,
  onView,
  onEdit,
  startIndex,
  totalFiltered,
  itemsPerPage,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="hidden md:block bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {[
                "Member ID",
                "Name",
                "Deposits",
                "Loans",
                "STI Score",
                "Risk",
                "KYC Status",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] text-heading font-semibold uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={m.id}
                className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-4 py-3.5 font-mono text-xs text-heading">
                  {m.id}
                </td>
                <td className="px-4 py-3.5 text-[13px] text-body font-medium">
                  {m.name}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-success">
                  {m.deposits}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-primary">
                  {m.loans}
                </td>
                <td className="px-4 py-3.5">
                  <STIBadge score={m.sti} />
                </td>
                <td className="px-4 py-3.5">
                  <RiskBadge risk={m.risk} />
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-[11px] font-semibold ${
                      m.kyc === "Verified"
                        ? "text-success"
                        : m.kyc === "Pending"
                        ? "text-warning"
                        : "text-danger-500"
                    }`}
                  >
                    {m.kyc === "Verified" ? "✓ " : "⏳ "}
                    {m.kyc}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={m.status || "Active"} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onView(m)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-primary-50 hover:text-primary hover:border-primary-200 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(m)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 cursor-pointer hover:bg-primary-50 hover:text-primary hover:border-primary-200 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-heading">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-heading">
          Showing {totalFiltered === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalFiltered)} of {totalFiltered} members
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
              currentPage === 1
                ? "bg-white border-slate-100 text-slate-200 cursor-not-allowed"
                : "bg-white border-slate-200 text-heading hover:text-body hover:border-slate-300"
            }`}
          >
            ←
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
                page === currentPage
                  ? "bg-primary-50 border-primary-300 text-primary font-semibold"
                  : "bg-white border-slate-200 text-heading hover:text-body hover:border-slate-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`rounded-lg px-2 py-1 text-[11px] min-w-7 cursor-pointer transition-all border ${
              currentPage === totalPages
                ? "bg-white border-slate-100 text-slate-200 cursor-not-allowed"
                : "bg-white border-slate-200 text-heading hover:text-body hover:border-slate-300"
            }`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
