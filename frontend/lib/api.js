/**
 * Central API client for Glimmora Nidhi frontend.
 * All requests go through Next.js rewrites → backend at /api/v1/*.
 */

const API_BASE = "/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("glimmora_token");
}

function setToken(token) {
  if (token) {
    localStorage.setItem("glimmora_token", token);
  } else {
    localStorage.removeItem("glimmora_token");
  }
}

function clearAuth() {
  localStorage.removeItem("glimmora_token");
  localStorage.removeItem("glimmora_current_user");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { ...options, headers });

  // If unauthorized, clear auth and redirect to login
  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
    const error = new Error("Session expired. Please login again.");
    error.status = 401;
    throw error;
  }

  const data = await res.json();

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

// ─── Auth helpers ───────────────────────────────────────────────────────────

async function login(email, password) {
  const data = await post("/auth/login", { email, password });
  if (data.success && data.data?.token) {
    setToken(data.data.token);
  }
  return data;
}

function logout() {
  clearAuth();
}

export { API_BASE, apiFetch, get, post, put, del, login, logout, getToken, setToken, clearAuth };
