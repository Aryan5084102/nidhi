import { NextResponse } from "next/server";

const COOKIE_NAME = "glimmora_session";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/auth-api"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static assets
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    // If user is logged in and trying to access /login, redirect to dashboard
    if (pathname === "/login") {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check for auth cookie on protected routes
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // No token — redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow request
  // For API routes, inject the Authorization header so the backend proxy gets the token
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (icons, images)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon/).*)",
  ],
};
