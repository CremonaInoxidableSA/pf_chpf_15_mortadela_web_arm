import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validaciones básicas
    if (!username || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por username
    const users = await query(
      'SELECT id, email, username, nombre, apellido, password_hash, rol, habilitado, reporte FROM Usuarios WHERE username = ? LIMIT 1',
      [username]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verificar contraseña (columna password_hash)
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.username,
      habilitado: user.habilitado,
      reporte: user.reporte,
    });

    // Responder sin password
    const { password_hash: _, ...userWithoutPassword } = user;

    // Crear la respuesta y adjuntar la cookie en la respuesta (no en el cookie store de solo lectura)
    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login exitoso',
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);

    const message = error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}