import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Chequear si existen usuarios en la DB
    try {
      const result = await query('SELECT COUNT(*) AS count FROM Usuarios') as any[];
      const count = result?.[0]?.count ?? 0;

      if (count === 0) {
        // No hay usuarios: indicar que se necesita bootstrap
        return NextResponse.json<ApiResponse>({
          success: true,
          data: { needBootstrap: true },
        });
      }
    } catch (dbError) {
      console.error('DB check error:', dbError);
      // Si hay un error de BD, no bloqueamos el proceso de auth; seguir con la verificación normal
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}