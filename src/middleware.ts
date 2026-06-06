// middleware.ts (at project root, next to app/)
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/library", "/buyer", "/creator", "/products"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/library/:path*", "/buyer/:path*", "/creator/:path*", "/products/:path*"],
};