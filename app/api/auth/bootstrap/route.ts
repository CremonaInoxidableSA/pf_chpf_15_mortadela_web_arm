import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

// POST - Crear superadmin si no existe
export async function POST(request: NextRequest) {
  try {
    const secretHeader = request.headers.get('x-bootstrap-secret');
    const BOOTSTRAP_SECRET = process.env.BOOTSTRAP_SECRET;

    // Validar secreto (si está configurado)
    if (BOOTSTRAP_SECRET && secretHeader !== BOOTSTRAP_SECRET) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Secreto inválido' },
        { status: 403 }
      );
    }

    // Verificar si ya existe un superadmin
    const existing = await query(
      "SELECT id, email, username, nombre, apellido, rol FROM Usuarios WHERE rol = 'superadmin' LIMIT 1"
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Superadmin ya existe',
        data: existing[0],
      });
    }

    const body = await request.json().catch(() => ({}));

    const email = body.email || process.env.ADMIN_EMAIL;
    const password = body.password || process.env.ADMIN_PASSWORD;
    const username = body.username || process.env.ADMIN_USERNAME || 'superadmin';
    const nombre = body.nombre || process.env.ADMIN_NOMBRE || 'Super';
    const apellido = body.apellido || process.env.ADMIN_APELLIDO || 'Admin';

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email y contraseña del superadmin son requeridos' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const result = await query(
      'INSERT INTO Usuarios (email, username, nombre, apellido, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [email, username, nombre, apellido, hashed, 'superadmin']
    );

    // Obtener el usuario insertado
    const inserted = await query(
      'SELECT id, email, username, nombre, apellido, rol, created_at FROM Usuarios WHERE id = LAST_INSERT_ID() LIMIT 1'
    ) as any[];

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Superadmin creado',
      data: inserted[0],
    });
  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Error al crear superadmin' },
      { status: 500 }
    );
  }
}
