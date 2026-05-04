import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/products",
  "/payouts",
  "/affiliates",
  "/coupons",
  "/subscribers",
  "/settings",
  "/library",
  "/admin",  
];

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

export const middleware = (request:NextRequest) => {
    const { pathname } = request.nextUrl;

    const hasSession = request.cookies.has("refreshToken");

    const isProtected = protectedRoutes.some((route) => {
        pathname.startsWith(route)
    });

    if (isProtected && !hasSession) {
        const loginUrl = new URL('/login',  request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }


    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-icon.svg|.*\\.png$).*)",
  ],
};
