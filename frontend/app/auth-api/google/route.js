import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const COOKIE_NAME = "glimmora_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { success: false, error: "No Google credential provided" },
        { status: 400 }
      );
    }

    // Send Google ID token to FastAPI backend for verification
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleToken: credential }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || "Google login failed" },
        { status: backendRes.status }
      );
    }

    const token = data.data?.token;
    const user = data.data?.user;
    const isNewUser = data.data?.isNewUser || false;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token received" },
        { status: 500 }
      );
    }

    // Set HTTP-only cookie (same as regular login)
    const response = NextResponse.json({
      success: true,
      data: { user, isNewUser },
    });

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
      { success: false, error: "Google login failed. Please try again." },
      { status: 503 }
    );
  }
}
