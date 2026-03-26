"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ROLES, ROLE_LABELS, hasPermission, hasNavAccess, getDefaultNav } from "@/lib/roles";
import { login as apiLogin, logout as apiLogout, loginWithGoogle as apiGoogleLogin, getSession, clearAuth } from "@/lib/api";
import { clearApiCache } from "@/hooks/useData";

const AuthContext = createContext(null);

// Map backend roles to frontend roles
const ROLE_MAP = {
  ADMIN: ROLES.ADMIN,
  BRANCH_MANAGER: ROLES.BRANCH_MANAGER,
  MEMBER: ROLES.MEMBER,
};

function mapBackendUser(backendUser) {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    role: ROLE_MAP[backendUser.role] || ROLES.MEMBER,
    backendRole: backendUser.role,
    phone: backendUser.phone || "",
    memberId: backendUser.memberId || null,
    avatar: backendUser.avatar || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, validate session via HTTP-only cookie
  useEffect(() => {
    async function restoreSession() {
      try {
        const sessionUser = await getSession();
        if (sessionUser) {
          const userData = mapBackendUser(sessionUser);
          setUser(userData);
          localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      if (data.success && data.data?.user) {
        const userData = mapBackendUser(data.data.user);
        setUser(userData);
        localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (err) {
      return { success: false, error: err.message || "Login failed. Is the backend running?" };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const data = await apiGoogleLogin(credential);
      if (data.success && data.data?.user) {
        const userData = mapBackendUser(data.data.user);
        setUser(userData);
        localStorage.setItem("glimmora_current_user", JSON.stringify(userData));
        return { success: true, user: userData, isNewUser: data.data.isNewUser };
      }
      return { success: false, error: data.error || "Google login failed" };
    } catch (err) {
      return { success: false, error: err.message || "Google login failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await apiLogout();
    clearApiCache();
    // Redirect to login after logout
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
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
