import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Skip static files and internal paths
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    const hasToken = request.cookies.get("accessToken")?.value;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Redirect unauthenticated users to login
    if (!hasToken && !isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from login/register
    if (hasToken && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

