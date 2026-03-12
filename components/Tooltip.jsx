"use client";

import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ children, label, expanded }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (!expanded && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
      setShowTooltip(true);
    }
  }, [expanded]);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  if (expanded) return children;

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed px-3 py-1.5 min-w-[100px] bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl shadow-black/60 text-white text-[12px] font-medium whitespace-nowrap z-[9999] animate-tooltip-pop origin-left pointer-events-none"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateY(-50%)',
          }}
        >
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45 border-l border-b border-slate-600/50" />
        </div>,
        document.body
      )}
    </div>
  );
}
