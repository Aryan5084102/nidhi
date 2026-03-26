/**
 * Central API client for Glimmora Nidhi frontend.
 * All requests go through Next.js rewrites → backend at /api/v1/*.
 * Auth token is stored in HTTP-only cookie (set by /auth-api/login).
 * The middleware.js injects the Authorization header on proxied requests.
 */

const API_BASE = "/api/v1";

function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("glimmora_current_user");
}

async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // No need to manually attach token — middleware handles it via cookie
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { ...options, headers, credentials: "same-origin" });

  // If unauthorized, redirect to login
  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      // Clear server cookie via logout endpoint
      await fetch("/auth-api/logout", { method: "POST" }).catch(() => {});
      window.location.href = "/login";
    }
    const error = new Error("Session expired. Please login again.");
    error.status = 401;
    throw error;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    const error = new Error(
      res.status >= 500
        ? "Server is unavailable. Please try again later."
        : "Unexpected response from server"
    );
    error.status = res.status;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(data.error || data.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Convenience methods ────────────────────────────────────────────────────

function get(endpoint) {
  return apiFetch(endpoint, { method: "GET" });
}

function post(endpoint, body) {
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function put(endpoint, body) {
  return apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

function del(endpoint) {
  return apiFetch(endpoint, { method: "DELETE" });
}

// ─── Auth helpers (cookie-based) ────────────────────────────────────────────

async function login(email, password) {
  // Call Next.js server route which proxies to backend and sets HTTP-only cookie
  const res = await fetch("/auth-api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "same-origin",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server is unavailable. Please try again later.");
  }

  if (!res.ok || !data.success) {
    const error = new Error(data.error || "Login failed");
    error.status = res.status;
    throw error;
  }

  return data;
}

async function logout() {
  clearAuth();
  // Clear server-side HTTP-only cookie
  await fetch("/auth-api/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
}

async function getSession() {
  try {
    const res = await fetch("/auth-api/session", { credentials: "same-origin" });
    const data = await res.json();
    if (data.success && data.user) return data.user;
    return null;
  } catch {
    return null;
  }
}

async function loginWithGoogle(credential) {
  const res = await fetch("/auth-api/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
    credentials: "same-origin",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Google login failed. Please try again.");
  }

  if (!res.ok || !data.success) {
    const error = new Error(data.error || "Google login failed");
    error.status = res.status;
    throw error;
  }

  return data;
}

// Legacy exports for backward compatibility
function getToken() { return null; } // Token is in HTTP-only cookie, not accessible from JS
function setToken() {} // No-op, cookie is set server-side

export { API_BASE, apiFetch, get, post, put, del, login, logout, loginWithGoogle, getToken, setToken, clearAuth, getSession };
