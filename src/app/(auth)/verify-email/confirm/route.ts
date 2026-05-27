// app/(auth)/verify-email/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing", req.url));
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/auth/verify-email/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
    }

    return NextResponse.redirect(new URL("/onboarding", req.url));
  } catch {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }
}