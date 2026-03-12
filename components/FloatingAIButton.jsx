"use client";

import { useState } from "react";

export default function FloatingAIButton({ onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#27c08d] to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
    >
      <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />

      {/* Tooltip - visible on hover on large screens */}
      {showTooltip && (
        <div className="hidden lg:block absolute right-full mr-3 px-3 py-1.5 bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl shadow-black/60 text-white text-[12px] font-medium whitespace-nowrap pointer-events-none animate-tooltip-pop origin-right">
          AI Assistant
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-t border-slate-600/50" />
        </div>
      )}
    </button>
  );
}
