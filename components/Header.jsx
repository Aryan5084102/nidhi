"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_COLORS } from "@/lib/roles";
import { useNotifications, ICON_MAP } from "@/context/NotificationContext";

export default function Header({ pageTitle, onNavigateProfile }) {
  const { user, logout, roleLabel, isMember } = useAuth();
  const { notifications, memberNotifications, unreadCount, memberUnreadCount, markAsRead, markAllRead } = useNotifications();
  const userName = user?.name;
  const roleColor = ROLE_COLORS[user?.role];
  const activeNotifs = isMember ? memberNotifications : notifications;
  const activeUnread = isMember ? memberUnreadCount : unreadCount;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("glimmora_dark_mode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("glimmora_dark_mode", String(next));
  };

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
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Logo - visible only on mobile where sidebar is hidden */}
        <div className="md:hidden w-8 h-8 bg-gradient-to-br from-success-400 to-teal-500 rounded-xl flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-md shadow-success-500/20">
          G
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-heading hidden sm:inline">Home</span>
            <svg className="w-3 h-3 text-subtle hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-[10px] text-primary-500 font-medium hidden sm:inline">{pageTitle}</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-heading tracking-tight truncate">
            {pageTitle}
          </h1>
          <div className="text-[10px] md:text-[11px] text-heading font-mono hidden sm:block">
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            &middot; {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2.5 items-center shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg className="w-4 h-4 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </button>

        {/* System Status - hidden on mobile */}
        <div className="hidden lg:flex bg-success-50 border border-success-200/60 rounded-full px-3 py-1.5 items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-success-500 rounded-full inline-block animate-pulse-dot" />
          <span className="text-[11px] text-success font-semibold">
            System Operational
          </span>
        </div>

        {/* Alerts Button - hidden on mobile, only for staff */}
        {!isMember && activeUnread > 0 && (
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="hidden sm:block bg-danger-50 dark:bg-red-900/20 border border-danger-200/60 dark:border-red-800/50 rounded-lg px-3 py-1.5 text-danger dark:text-danger-400 text-[11px] font-semibold cursor-pointer hover:bg-danger-100/60 dark:hover:bg-red-900/30 transition-colors"
          >
            {activeUnread} Alert{activeUnread !== 1 ? "s" : ""}
          </button>
        )}

        {/* Notification Bell + Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {activeUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {activeUnread}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute -right-12 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden animate-fade-in z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
                <div className="flex items-center gap-2">
                  {activeUnread > 0 && (
                    <span className="text-[10px] font-semibold text-primary-500 bg-primary-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                      {activeUnread} new
                    </span>
                  )}
                  {activeUnread > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-medium text-heading hover:text-body dark:hover:text-subtle cursor-pointer">
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {activeNotifs.map((notif) => {
                  const iconData = ICON_MAP[notif.icon] || { emoji: "📌", bg: "bg-slate-50 dark:bg-slate-700" };
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? "bg-primary-50/30 dark:bg-indigo-900/10" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${iconData.bg}`}>
                        {iconData.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[13px] leading-snug ${!notif.read ? "text-slate-800 dark:text-slate-200 font-medium" : "text-body dark:text-heading"}`}>
                            {notif.message}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        <span className="text-[10px] text-heading mt-0.5 block">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <button className="w-full text-center text-[12px] font-semibold text-primary-500 hover:text-primary-700 transition-colors cursor-pointer">
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-md shadow-primary-500/20">
              {initials}
            </div>
            {userName && (
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-body leading-tight">{userName}</div>
                <div className={`text-[10px] leading-tight font-medium ${roleColor?.text || "text-heading"}`}>{roleLabel}</div>
              </div>
            )}
            <svg
              className={`w-3.5 h-3.5 text-heading hidden sm:block transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
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
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md shadow-primary-500/20">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{userName || "User"}</div>
                    <div className="text-[11px] text-heading truncate">{user?.email}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${roleColor?.bg || ""} ${roleColor?.text || "text-heading"}`}>{roleLabel}</span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button onClick={() => { setShowProfileMenu(false); onNavigateProfile?.(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-body hover:bg-slate-50 hover:text-heading transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-body hover:bg-slate-50 hover:text-heading transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-body hover:bg-slate-50 hover:text-heading transition-colors cursor-pointer">
                  <svg className="w-4 h-4 text-heading" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                    logout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-danger-500 hover:bg-danger-50 hover:text-danger transition-colors cursor-pointer"
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
