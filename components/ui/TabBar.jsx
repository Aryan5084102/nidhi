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
              ? "bg-indigo-50 border-indigo-300 text-indigo-600 font-semibold"
              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
