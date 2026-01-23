import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  const accessToken = req.cookies.get("access_token");

  if (!accessToken && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isPublic) {
    const chatUrl = new URL("/chat", req.url);
    return NextResponse.redirect(chatUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/chat/:path*",
    "/login",
    "/register",
  ],
};