import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/register"];
// Rutas que requieren rol de admin
const adminRoutes = ["/config_user", "/api/config"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // If a token is provided in the query string (e.g. after login redirect), accept it,
  // validate it, set it as a cookie and redirect to the same path without the token.
  const tokenFromQuery = request.nextUrl.searchParams.get("token");
  if (tokenFromQuery) {
    const verified = verifyToken(tokenFromQuery);
    if (verified) {
      const cleanUrl = new URL(request.nextUrl.pathname, request.url);
      const response = NextResponse.redirect(cleanUrl);
      // Set the cookie so subsequent requests include it (path=/ so it's sent for all routes)
      response.cookies.set("access_token", tokenFromQuery, { path: "/" });
      return response;
    } else {
      // Invalid token: redirect to login without token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // Accept token from multiple places: legacy `auth_token` cookie, new `access_token` cookie,
  // or Authorization header. Prefer cookie when present.
  let token =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("access_token")?.value ||
    request.cookies.get("accessToken")?.value ||
    null;

  if (!token) {
    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.split(" ", 2)[1];
    }
  }

  // Verificar si es una ruta pública (nota: '/' se compara por igualdad)
  const isPublicRoute =
    pathname === "/" ||
    publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    // Si ya está autenticado y trata de acceder a login/register, redirigir a root
    if (
      token &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificar token (decode + exp check)
  const user = verifyToken(token);
  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clean up possible token cookies (both names)
    response.cookies.delete("auth_token");
    response.cookies.delete("access_token");
    response.cookies.delete("accessToken");
    return response;
  }

  // Verificar rol de admin para rutas administrativas
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute && user.rol !== "admin" && user.rol !== "superadmin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el proxy
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
