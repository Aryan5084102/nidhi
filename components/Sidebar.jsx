"use client";

import { useState } from "react";
import { navItems } from "@/data/mockData";
import Image from "next/image";
import Tooltip from "./Tooltip";
import logo from '../public/icon/logo.png'

export default function Sidebar({ activeNav, setActiveNav, expanded, setExpanded, userName, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`${
        expanded ? "w-[240px]" : "w-[68px]"
      } bg-gradient-to-b from-[#0F172A] to-[#1a2744] flex-col transition-all duration-300 shrink-0 z-10 relative hidden md:flex`}
    >
      {/* Subtle right edge glow */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-indigo-500/20 via-emerald-500/10 to-transparent" />

      {/* Logo + Collapse Toggle */}
      <div className="p-4 pb-3 border-b border-white/[0.08] flex items-center gap-3 overflow-hidden">
        {/* <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-[15px] font-bold text-white shrink-0 shadow-lg shadow-emerald-500/20">
          G
        </div> */}
          <Image 
            src={logo}
            alt="Error"
            width={50}
            height={50}
          />
        {expanded && (
          <div className="overflow-hidden animate-fade-in flex-1 min-w-0">
            <div className="text-[14px] font-bold text-white whitespace-nowrap tracking-tight">
              Glimmora Nidhi
            </div>
            <div className="text-[10px] text-slate-400 whitespace-nowrap">
              Agentic AI Platform
            </div>
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all duration-200 cursor-pointer shrink-0"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 w-full group relative
                ${expanded ? "px-3 py-2.5 justify-start" : "p-2.5 justify-center"}
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/15 to-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full"/>
              )}
              <Tooltip label={item.label} expanded={expanded}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                />
              </Tooltip>
              {expanded && (
                <span className="text-[13px] font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-2.5 border-t border-white/[0.08] relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`flex items-center gap-3 w-full rounded-xl hover:bg-white/[0.06] transition-all duration-200 cursor-pointer ${
            expanded ? "px-3 py-2.5" : "p-2.5 justify-center"
          }`}
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-md shadow-indigo-500/20">
            {initials}
          </div>
          {expanded && (
            <div className="flex-1 min-w-0 text-left animate-fade-in">
              <div className="text-[13px] font-semibold text-white truncate">
                {userName || "User"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">View profile</div>
            </div>
          )}
          {expanded && (
            <svg
              className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div
            className={`absolute bottom-full mb-2 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in ${
              expanded ? "left-2.5 right-2.5" : "left-2.5 w-48"
            }`}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {userName || "User"}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Administrator</div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <button className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                My Profile
              </button>
              <button className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-white/[0.08] py-1.5">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout?.();
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
