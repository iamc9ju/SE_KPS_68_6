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

    // 1. Redirect unauthenticated users to login
    if (!hasToken && !isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Redirect authenticated users away from login/register
    if (hasToken && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. Handle profile completion for patients
    if (hasToken) {
      try {
        // Decode JWT payload (middle part of the token)
        const payloadBase64 = hasToken.split(".")[1];
        if (payloadBase64) {
          // Safe base64 decoding in Edge Runtime
          const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const { role, isProfileComplete } = JSON.parse(jsonPayload);
          const isHealthDataPath = pathname === "/healthdata";

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
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

