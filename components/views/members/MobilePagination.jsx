"use client";

export default function MobilePagination({
  startIndex,
  itemsPerPage,
  totalFiltered,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="md:hidden flex flex-col items-center gap-2 mt-3 px-1">
      <span className="text-xs text-heading">
        {totalFiltered === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalFiltered)} of {totalFiltered}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`rounded-lg px-3 py-1.5 text-xs cursor-pointer border ${currentPage === 1 ? "text-slate-200 border-slate-100" : "text-slate-500 border-slate-200"}`}
        >
          Prev
        </button>
        <span className="text-xs text-heading flex items-center">{currentPage}/{totalPages}</span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`rounded-lg px-3 py-1.5 text-xs cursor-pointer border ${currentPage === totalPages ? "text-slate-200 border-slate-100" : "text-slate-500 border-slate-200"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
