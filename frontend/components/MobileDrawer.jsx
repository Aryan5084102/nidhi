"use client";

import { useEffect } from "react";
import Image from "next/image";
import { navItems } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { ROLE_COLORS } from "@/lib/roles";
import useNavigation from "@/hooks/useNavigation";

export default function MobileDrawer({ open, onClose }) {
  const { activeNav, navigate: setActiveNav } = useNavigation();
  const { user, canAccessNav, logout, roleLabel } = useAuth();
  const userName = user?.name;
  const roleColor = ROLE_COLORS[user?.role];
  const filteredNavItems = navItems.filter((item) => canAccessNav(item.id));
  const initials = userName ? userName.charAt(0).toUpperCase() : "U";

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0F172A]/80 backdrop-blur-xl border-r border-white/[0.08] animate-slide-in flex flex-col">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-success-400 to-teal-500 rounded-xl flex items-center justify-center text-[15px] font-bold text-white shadow-lg shadow-success-500/20">
              G
            </div>
            <div>
              <div className="text-[14px] font-bold text-white tracking-tight">Glimmora Nidhi</div>
              <div className="text-[10px] text-slate-400">Agentic AI Platform</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 hover:text-white cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); onClose(); }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 w-full relative
                  ${isActive
                    ? "bg-gradient-to-r from-primary-500/15 to-success-500/10 text-success-400"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-success-400 rounded-r-full" />
                )}
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white truncate">{userName || "User"}</div>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium ${roleColor?.bg || ""} ${roleColor?.text || "text-slate-400"}`}>{roleLabel}</span>
            </div>
          </div>
          <button
            onClick={() => { onClose(); logout(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 mt-1 rounded-xl text-[13px] text-danger-400 hover:bg-danger-500/10 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
