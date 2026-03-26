import { NextResponse } from "next/server";

const COOKIE_NAME = "glimmora_session";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Clear the auth cookie
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expire immediately
  });

  return response;
}
