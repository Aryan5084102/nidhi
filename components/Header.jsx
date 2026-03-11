"use client";

import { useState, useEffect, useRef } from "react";

const notifications = [
  {
    id: 1,
    icon: "⚠️",
    iconBg: "bg-red-50",
    message: "Critical: Suspicious transaction detected for member M-1005",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    icon: "🤖",
    iconBg: "bg-indigo-50",
    message: "Risk Review Agent flagged 3 new high-risk accounts",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    icon: "✅",
    iconBg: "bg-emerald-50",
    message: "KYC verification completed for 12 members",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    icon: "📊",
    iconBg: "bg-amber-50",
    message: "Monthly compliance report is ready for review",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    icon: "💰",
    iconBg: "bg-purple-50",
    message: "Chit Fund CS-001 auction scheduled for tomorrow",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    icon: "🛡️",
    iconBg: "bg-teal-50",
    message: "RBI compliance check passed successfully",
    time: "Yesterday",
    read: true,
  },
];

export default function Header({ pageTitle, userName, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userName ? userName.charAt(0).toUpperCase() : "A";

  return (
    <div className="bg-white border-b border-slate-200/80 px-3 sm:px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shrink-0 gap-2">
      <div className="min-w-0">
        <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
          {pageTitle}
        </h1>
        <div className="text-[10px] md:text-[11px] text-slate-400 font-mono hidden sm:block">
          {currentTime.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          &middot; {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2.5 items-center shrink-0">
        {/* System Status - hidden on mobile */}
        <div className="hidden lg:flex bg-emerald-50 border border-emerald-200/60 rounded-full px-3 py-1.5 items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse-dot" />
          <span className="text-[11px] text-emerald-600 font-semibold">
            System Operational
          </span>
        </div>

        {/* Alerts Button - compact on mobile */}
        <button className="bg-red-50 border border-red-200/60 rounded-lg px-2 sm:px-3 py-1.5 text-red-600 text-[11px] font-semibold cursor-pointer hover:bg-red-100/60 transition-colors">
          <span className="hidden sm:inline">23 </span>Alerts
        </button>

        {/* Notification Bell + Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {notifications.filter((n) => !n.read).length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute -right-12 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden animate-fade-in z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {notifications.filter((n) => !n.read).length} new
                </span>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3 ${
                      !notif.read ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${notif.iconBg}`}>
                      {notif.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[13px] leading-snug ${!notif.read ? "text-slate-800 font-medium" : "text-slate-600"}`}>
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full text-center text-[12px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200/80"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-md shadow-indigo-500/20">
              {initials}
            </div>
            {userName && (
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-700 leading-tight">{userName}</div>
                <div className="text-[10px] text-slate-400 leading-tight">Administrator</div>
              </div>
            )}
            <svg
              className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden animate-fade-in z-50">
              {/* User info */}
              <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md shadow-indigo-500/20">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{userName || "User"}</div>
                    <div className="text-[11px] text-slate-400 truncate">admin@glimmora.com</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  Help & Support
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 py-1.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
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
    </div>
  );
}
