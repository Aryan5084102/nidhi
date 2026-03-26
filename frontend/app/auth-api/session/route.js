import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const COOKIE_NAME = "glimmora_session";

export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    // Validate token with backend
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      // Token expired or invalid — clear cookie
      const response = NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({ success: true, user: data.data });
  } catch {
    return NextResponse.json(
      { success: false, user: null, error: "Backend unavailable" },
      { status: 503 }
    );
  }
}
