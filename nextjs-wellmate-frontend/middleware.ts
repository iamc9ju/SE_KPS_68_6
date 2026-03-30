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

  const accessToken = request.cookies.get("accessToken")?.value;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isHealthDataPath = pathname === "/healthdata";

  // 2. Redirect unauthenticated users
  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Handle authenticated users
  if (accessToken) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    try {
      // Decode JWT payload (middle part of the token)
      const payloadBase64 = accessToken.split(".")[1];
      if (payloadBase64) {
        // Safe base64 decoding in Edge Runtime
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const { role, isProfileComplete } = JSON.parse(jsonPayload);

        // Redirect patients with incomplete profiles to /healthdata
        if (role === "patient" && isProfileComplete === false && !isHealthDataPath && !pathname.startsWith("/auth")) {
            const allowedAuthPaths = ["/auth/sign-out", "/auth/logout"];
            if (!allowedAuthPaths.includes(pathname)) {
                return NextResponse.redirect(new URL("/healthdata", request.url));
            }
        }

        // Redirect patients with COMPLETE profiles AWAY from /healthdata
        if (role === "patient" && isProfileComplete === true && isHealthDataPath) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    } catch (e) {
      console.error("Middleware JWT decode error:", e);
    }
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
