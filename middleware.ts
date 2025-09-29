import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const PROTECTED_PATHS = [
  "/dashboard",
  "/orders",
  "/admin/menu",
  "/admin/table",
  "/admin/user",
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("user_profile")?.value;

  // Jika sudah login, jangan biarkan ke login/register
  if (token && PUBLIC_PATHS.includes(url.pathname)) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Jika belum login, blok akses ke protected paths
  if (!token && PROTECTED_PATHS.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/orders",
    "/admin/:path*", // pakai dynamic match biar lebih fleksibel
    "/login",
    "/register",
  ],
};
