"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ROLES, ROLE_LABELS, hasPermission, hasNavAccess, getDefaultNav } from "@/lib/roles";

const AuthContext = createContext(null);

// Demo users — 3 roles: Admin, Branch Manager (Foreman), Member
const DEMO_USERS = [
  { email: "admin@glimmora.com", password: "Admin@123", name: "Aryan Kumar", role: ROLES.ADMIN, phone: "9876500001", memberId: null },
  { email: "manager@glimmora.com", password: "Manager@123", name: "Vikram Singh", role: ROLES.BRANCH_MANAGER, phone: "9876500003", memberId: null },
  { email: "member@glimmora.com", password: "Member@123", name: "Rajesh Kumar", role: ROLES.MEMBER, phone: "9876543210", memberId: "M-1001" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("glimmora_current_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure role exists (backward compat)
        if (!parsed.role) parsed.role = ROLES.ADMIN;
        setUser(parsed);
      } catch {
        localStorage.removeItem("glimmora_current_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    // Check demo users first
    const demoUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (demoUser) {
      const userData = {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        phone: demoUser.phone,
        memberId: demoUser.memberId,
      };
      setUser(userData);
      localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    // Check registered users in localStorage
    const users = JSON.parse(localStorage.getItem("glimmora_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const userData = {
        email: found.email,
        name: found.name,
        role: found.role || ROLES.MEMBER,
        phone: found.phone,
        memberId: found.memberId || null,
      };
      setUser(userData);
      localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: "Invalid email or password." };
  }, []);

  const loginWithGoogle = useCallback((googleUser) => {
    const userData = {
      ...googleUser,
      role: googleUser.role || ROLES.MEMBER,
    };
    setUser(userData);
    localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("glimmora_current_user");
  }, []);

  const can = useCallback(
    (permission) => {
      if (!user) return false;
      return hasPermission(user.role, permission);
    },
    [user]
  );

  const canAccessNav = useCallback(
    (navId) => {
      if (!user) return false;
      return hasNavAccess(user.role, navId);
    },
    [user]
  );

  const value = {
    user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    can,
    canAccessNav,
    isAdmin: user?.role === ROLES.ADMIN,
    isMember: user?.role === ROLES.MEMBER,
    roleLabel: user ? ROLE_LABELS[user.role] : "",
    defaultNav: user ? getDefaultNav(user.role) : "executive",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
