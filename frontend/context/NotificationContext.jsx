"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { get, put } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const NotificationContext = createContext(null);

// Empty defaults — real data fetched from API
const fallbackNotifications = [];
const fallbackMemberNotifications = [];

export const ICON_MAP = {
  warning: { emoji: "\u26A0\uFE0F", bg: "bg-red-50 dark:bg-red-900/20" },
  robot: { emoji: "\uD83E\uDD16", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  check: { emoji: "\u2705", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  chart: { emoji: "\uD83D\uDCCA", bg: "bg-amber-50 dark:bg-amber-900/20" },
  money: { emoji: "\uD83D\uDCB0", bg: "bg-purple-50 dark:bg-purple-900/20" },
  shield: { emoji: "\uD83D\uDEE1\uFE0F", bg: "bg-teal-50 dark:bg-teal-900/20" },
  loan: { emoji: "\uD83C\uDFE6", bg: "bg-blue-50 dark:bg-blue-900/20" },
  member: { emoji: "\uD83D\uDC64", bg: "bg-slate-50 dark:bg-slate-700/50" },
  info: { emoji: "\u2139\uFE0F", bg: "bg-blue-50 dark:bg-blue-900/20" },
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [memberNotifs, setMemberNotifs] = useState(fallbackMemberNotifications);
  const { user } = useAuth();

  // Fetch notifications from backend when user is logged in
  useEffect(() => {
    if (!user) return;
    async function fetchNotifications() {
      try {
        const data = await get("/notifications");
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
          if (user.role === "member") {
            setMemberNotifs(data.data);
          }
        }
      } catch {
        // Keep fallback notifications if backend fails
      }
    }
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const memberUnreadCount = memberNotifs.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await put(`/notifications/${id}/read`);
    } catch {
      // Optimistic update — ignore backend errors
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await put("/notifications/read-all");
    } catch {
      // Optimistic update
    }
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      { id: Date.now(), read: false, time: "Just now", ...notif },
      ...prev,
    ]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        memberNotifications: memberNotifs,
        unreadCount,
        memberUnreadCount,
        markAsRead,
        markAllRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
