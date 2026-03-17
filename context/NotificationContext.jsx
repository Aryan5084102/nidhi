"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

const initialNotifications = [
  { id: 1, icon: "warning", type: "alert", message: "Critical: Suspicious transaction detected for member M-1005", time: "2 min ago", read: false, category: "fraud" },
  { id: 2, icon: "robot", type: "info", message: "Risk Review Agent flagged 3 new high-risk accounts", time: "15 min ago", read: false, category: "risk" },
  { id: 3, icon: "check", type: "success", message: "KYC verification completed for 12 members", time: "1 hour ago", read: false, category: "compliance" },
  { id: 4, icon: "chart", type: "info", message: "Monthly compliance report is ready for review", time: "3 hours ago", read: true, category: "reports" },
  { id: 5, icon: "money", type: "info", message: "Chit Fund CS-001 monthly payout scheduled for tomorrow", time: "5 hours ago", read: true, category: "chitfunds" },
  { id: 6, icon: "shield", type: "success", message: "RBI compliance check passed successfully", time: "Yesterday", read: true, category: "compliance" },
  { id: 7, icon: "loan", type: "warning", message: "3 loan EMIs overdue for more than 30 days", time: "Yesterday", read: true, category: "loans" },
  { id: 8, icon: "member", type: "info", message: "15 new member registrations pending KYC", time: "2 days ago", read: true, category: "members" },
];

// Member-specific notifications
const memberNotifications = [
  { id: 1, icon: "money", type: "info", message: "Your next EMI of ₹9,420 is due on 15 Mar 2026", time: "Today", read: false, category: "loans" },
  { id: 2, icon: "check", type: "success", message: "Your KYC verification has been completed", time: "2 days ago", read: false, category: "compliance" },
  { id: 3, icon: "money", type: "info", message: "Chit Fund CS-001 payout rotation scheduled for Apr 2026", time: "3 days ago", read: true, category: "chitfunds" },
  { id: 4, icon: "chart", type: "success", message: "Your trust score increased to 92/100", time: "1 week ago", read: true, category: "risk" },
  { id: 5, icon: "money", type: "success", message: "FD-001 deposit confirmed: ₹2,00,000 @ 9.0%", time: "2 weeks ago", read: true, category: "deposits" },
];

export const ICON_MAP = {
  warning: { emoji: "⚠️", bg: "bg-red-50 dark:bg-red-900/20" },
  robot: { emoji: "🤖", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  check: { emoji: "✅", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  chart: { emoji: "📊", bg: "bg-amber-50 dark:bg-amber-900/20" },
  money: { emoji: "💰", bg: "bg-purple-50 dark:bg-purple-900/20" },
  shield: { emoji: "🛡️", bg: "bg-teal-50 dark:bg-teal-900/20" },
  loan: { emoji: "🏦", bg: "bg-blue-50 dark:bg-blue-900/20" },
  member: { emoji: "👤", bg: "bg-slate-50 dark:bg-slate-700/50" },
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [memberNotifs] = useState(memberNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const memberUnreadCount = memberNotifs.filter((n) => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
