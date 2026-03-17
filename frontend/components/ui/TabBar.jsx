"use client";

export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-2 mb-4 md:mb-5 tab-scroll">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-4 py-2 text-xs cursor-pointer transition-all duration-150 border whitespace-nowrap ${
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
