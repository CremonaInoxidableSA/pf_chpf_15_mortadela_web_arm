import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserSession } from './types';

const JWT_SECRET = process.env.JWT_SECRET as Secret | undefined;
const SALT_ROUNDS = 10;

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verificar contraseña
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generar JWT
export function generateToken(user: UserSession): string {
  const secret = JWT_SECRET as Secret | undefined;
  if (!secret) {
    throw new Error('JWT_SECRET no está definida en las variables de entorno');
  }

  const options = { expiresIn: process.env.JWT_EXPIRES_IN ?? '24h' } as any;

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    options
  );
} 

// Verificar JWT
export function verifyToken(token: string): UserSession | null {
  try {
    const secret = JWT_SECRET as Secret | undefined;
    if (!secret) {
      console.error('verifyToken: JWT_SECRET no está definida');
      return null;
    }

    return jwt.verify(token, secret) as UserSession;
  } catch (error) {
    return null;
  }
} 

// Obtener usuario actual desde cookies
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  return verifyToken(token);
}

// Verificar rol
export function hasRole(user: UserSession | null, requiredRole: 'superadmin' | 'admin' | 'user'): boolean {
  if (!user) return false;
  // superadmin tiene todos los permisos
  if (user.role === 'superadmin') return true;
  return user.role === requiredRole;
}

// Middleware de autenticación (para usar en endpoints API)
export function withAuth(handler: Function, requiredRole?: 'superadmin' | 'admin' | 'user') {
  return async (req: Request) => {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        return Response.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }
      
      if (requiredRole && user.role !== requiredRole && user.role !== 'superadmin') {
        return Response.json(
          { success: false, error: 'Permisos insuficientes' },
          { status: 403 }
        );
      }
      
      return handler(req, user);
    } catch (error) {
      console.error('Auth error:', error);
      return Response.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      );
    }
  };
}