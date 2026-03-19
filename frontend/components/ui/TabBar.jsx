"use client";

export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1.5 sm:gap-2 mb-4 md:mb-5 tab-scroll overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap shrink-0 ${
            activeTab === tab.id
              ? "bg-primary-50 border-primary-300 text-primary font-semibold"
              : "bg-white border-slate-200 text-heading hover:border-slate-300 hover:text-body"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
