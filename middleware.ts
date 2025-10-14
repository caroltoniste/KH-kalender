import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("kitten-session");
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");

  // Allow API auth routes
  if (isApiAuth) {
    return NextResponse.next();
  }

  // Redirect to calendar if already logged in and trying to access login
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (except auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
