import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  let isAuthenticated = false;

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/admin/me`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      credentials: "include",
    });

    isAuthenticated = response.ok;
  } catch {
    // If backend is unreachable, fail open - allow the request through
    // The protected layout will handle auth check server-side
  }

  // Authenticated user on login page -> redirect to /admin
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Unauthenticated user on protected route -> redirect to login with redirect param
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}