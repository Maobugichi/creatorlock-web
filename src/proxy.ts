// proxy.ts (was middleware.ts — same root location)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, errors } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

interface SessionPayload {
  id: string;
  email: string;
  role?: "creator" | "buyer" | "admin";
  email_verified: boolean;
}

async function getSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return err.payload as unknown as SessionPayload;
    }
    return null;
  }
}

function getDefaultRoute(role: string | undefined) {
  if (role === "creator") return "/dashboard";
  if (role === "admin") return "/admin-payouts";
  return "/discover";
}

const CREATOR_ONLY = [
  "/dashboard", "/products", "/payouts",
  "/affiliates", "/coupons", "/subscribers", "/settings",
];
const ADMIN_ONLY = ["/admin-payouts"];
const LOGIN_REQUIRED = ["/library"];
const BUYER_ONLY = ["/profile"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const session = await getSession(token);

  const needsOnboarding = !!session && !session.role;
  const needsVerification = !!session && session.role && !session.email_verified;

  if (pathname === "/") {
    if (needsOnboarding) return NextResponse.redirect(new URL("/onboarding", request.url));
    if (session) return NextResponse.redirect(new URL(getDefaultRoute(session.role), request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/onboarding")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  const isCreatorOnly = CREATOR_ONLY.some((r) => pathname.startsWith(r));
  const isBuyerOnly = BUYER_ONLY.some((r) => pathname.startsWith(r));
  const isAdminOnly = ADMIN_ONLY.some((r) => pathname.startsWith(r));
  const isLoginRequired = LOGIN_REQUIRED.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isCreatorOnly) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (needsOnboarding) return NextResponse.redirect(new URL("/onboarding", request.url));
    if (needsVerification) return NextResponse.redirect(new URL("/verify-email", request.url));
    if (session.role !== "creator") {
      return NextResponse.redirect(new URL(getDefaultRoute(session.role), request.url));
    }
    return NextResponse.next();
  }

  if (isAdminOnly) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

   if (isBuyerOnly) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (needsOnboarding) return NextResponse.redirect(new URL("/onboarding", request.url));
    if (needsVerification) return NextResponse.redirect(new URL("/verify-email", request.url));
    if (session.role !== "buyer") {
      return NextResponse.redirect(new URL(getDefaultRoute(session.role), request.url));
    }
    return NextResponse.next();
  }

  if (isLoginRequired) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (needsOnboarding) return NextResponse.redirect(new URL("/onboarding", request.url));
    return NextResponse.next();
  }

  if (isAuthRoute && session) {
    if (needsOnboarding) return NextResponse.redirect(new URL("/onboarding", request.url));
    if (needsVerification) return NextResponse.redirect(new URL("/verify-email", request.url));
    return NextResponse.redirect(new URL(getDefaultRoute(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-icon.svg|.*\\.png$).*)",
  ],
};