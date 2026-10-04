import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/contact", "/about", "/services", "/coverage"];
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isPublicPage = publicPaths.includes(pathname);

  if (token && isAuthPage) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "provider") return NextResponse.redirect(new URL("/provider", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isPublicPage && !isAuthPage && !pathname.startsWith("/payment")) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (token) {
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(role === "provider" ? "/provider" : "/dashboard", request.url));
    }
    if (pathname.startsWith("/provider") && role !== "provider") {
      return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/dashboard", request.url));
    }
    if (pathname.startsWith("/dashboard") && role !== "customer") {
      return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/provider", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
  ],
};