import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/'];
// Rutas que requieren rol de admin
const adminRoutes = ['/admin', '/api/config'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    // Si ya está autenticado y trata de acceder a login/register, redirigir a root
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar token
  const user = verifyToken(token);
  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  // Verificar rol de admin para rutas administrativas
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdminRoute && user.rol !== 'admin' && user.rol !== 'superadmin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};