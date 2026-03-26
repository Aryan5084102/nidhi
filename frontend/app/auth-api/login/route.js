import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const COOKIE_NAME = "glimmora_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours (matches JWT expiry)

export async function POST(request) {
  try {
    const body = await request.json();

    // Proxy login to FastAPI backend
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || "Invalid credentials" },
        { status: backendRes.status }
      );
    }

    const token = data.data?.token;
    const user = data.data?.user;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token received" },
        { status: 500 }
      );
    }

    // Build response with user data (no token exposed to client)
    const response = NextResponse.json({
      success: true,
      data: { user },
    });

    // Set HTTP-only secure cookie with the JWT token
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server is unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
