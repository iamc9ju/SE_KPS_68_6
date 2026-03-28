import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that logged-in users should not be able to access
const AUTH_PATHS = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  // Check if user has an access token (set by the backend as an httpOnly cookie)
  const hasToken = request.cookies.has("accessToken");

  const { pathname } = request.nextUrl;

  // If the user is already authenticated and tries to visit a public auth page,
  // redirect them to the dashboard immediately.
  if (hasToken && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on /, /login, and /register
  matcher: ["/", "/login", "/register"],
};
