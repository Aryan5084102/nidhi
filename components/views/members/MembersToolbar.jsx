"use client";

const filterOptions = ["All", "Low", "Medium", "High"];

export default function MembersToolbar({ search, onSearch, filter, onFilter, onAddMember }) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-5 items-center">
      <div className="w-full sm:flex-1 sm:w-auto min-w-0 sm:min-w-[200px] relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search members..."
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 pl-9 text-slate-700 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
        />
      </div>

      <div className="flex items-center justify-between gap-2 w-full sm:w-auto sm:justify-start">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`rounded-xl px-3 sm:px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${
                filter === f
                  ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
                  : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={onAddMember}
          className="shrink-0 bg-emerald-50 border border-emerald-300 rounded-xl px-3 sm:px-4 py-2 text-emerald-600 text-xs font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          + Add Member
        </button>
      </div>
    </div>
  );
}
