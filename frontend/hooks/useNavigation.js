"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// Maps navId → URL path
const NAV_TO_PATH = {
  // Admin/Staff routes
  executive:        "/dashboard",
  members:          "/members",
  chitfunds:        "/chit-funds",
  agents:           "/agents",
  loans:            "/loans",
  deposits:         "/deposits",
  collections:      "/collections",
  compliance:       "/compliance",
  airisk:           "/ai-risk",
  fraud:            "/fraud-intel",
  reports:          "/reports",
  config:           "/settings",
  collateral:       "/collateral",
  governance:       "/governance",
  aiassistant:      "/ai-assistant",
  // Member portal routes
  member_dashboard: "/member/dashboard",
  my_loans:         "/member/loans",
  my_deposits:      "/member/deposits",
  open_deposit:     "/member/deposits/open",
  my_chitfunds:     "/member/chit-funds",
  my_payments:      "/member/payments",
  enroll_chitfund:  "/member/chit-funds/enroll",
  apply_loan:       "/member/loans/apply",
  // Shared
  helpcenter:       "/help-center",
  profile:          "/profile",
};

// Reverse map: path → navId
const PATH_TO_NAV = {};
for (const [navId, path] of Object.entries(NAV_TO_PATH)) {
  PATH_TO_NAV[path] = navId;
}

export function getNavIdFromPath(pathname) {
  if (!pathname) return null;
  const clean = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  // Exact match first
  if (PATH_TO_NAV[clean]) return PATH_TO_NAV[clean];
  if (PATH_TO_NAV[pathname]) return PATH_TO_NAV[pathname];
  // Dynamic route fallback — match parent path (e.g. /member/chit-funds/CS-001 → my_chitfunds)
  const segments = clean.split("/");
  while (segments.length > 1) {
    segments.pop();
    const parent = segments.join("/");
    if (PATH_TO_NAV[parent]) return PATH_TO_NAV[parent];
  }
  return null;
}

export function getPathFromNavId(navId) {
  return NAV_TO_PATH[navId] || null;
}

export default function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const activeNav = getNavIdFromPath(pathname);

  const navigate = useCallback((navId) => {
    const path = NAV_TO_PATH[navId];
    if (path) {
      router.push(path);
    }
  }, [router]);

  return { activeNav, navigate, pathname };
}
