import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that are accessible without logging in
const PUBLIC_PATHS = ["/", "/login", "/register", "/favicon.ico"];

// Common static file extensions to skip middleware
const PUBLIC_FILE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Skip middleware for internal Next.js paths, API routes, and common static assets
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    PUBLIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
    pathname.includes(".") // Catch-all for other files with extensions
  ) {
    return NextResponse.next();
  }

  const hasToken = request.cookies.has("accessToken");
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // 2. Redirect unauthenticated users trying to access protected paths
  if (!hasToken && !isPublicPath) {
    // If not logged in, redirect to login page
    // Using session_expired=true can trigger a SweetAlert in the login page for better UX
    const loginUrl = new URL("/login", request.url);
    // Only add session_expired if they were trying to reach a significant protected area
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admindashboard") || pathname.startsWith("/nutritionist")) {
       // We can optionally add this, but just a standard redirect is cleaner for "not logged in"
       // loginUrl.searchParams.set("session_expired", "true");
    }
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect authenticated users away from public auth pages to dashboard
  if (hasToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
