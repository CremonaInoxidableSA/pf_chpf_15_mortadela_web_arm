import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/lib/types';

export async function POST() {
  try {
    // Create a response and delete the cookie on the response so the client receives the deletion
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: 'Logout exitoso',
    });

    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}