import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if user has an access token
  const hasToken = request.cookies.has("accessToken");

  // If they have a token and are trying to access the root path (landing page)
  if (hasToken && request.nextUrl.pathname === "/") {
    // Redirect them to the dashboard immediately
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue normally for all other requests
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
