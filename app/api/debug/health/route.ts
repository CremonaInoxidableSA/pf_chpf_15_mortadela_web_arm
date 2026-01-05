import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;

  try {
    const res = await query('SELECT 1 AS ok');
    dbOk = Array.isArray(res) && (res as any[]).length > 0;
  } catch (err: any) {
    dbOk = false;
    dbError = err?.message || String(err);
    console.error('DB health check error:', err);
  }

  const jwtSet = !!process.env.JWT_SECRET;

  return NextResponse.json({
    success: true,
    data: {
      dbOk,
      dbError,
      jwtSet,
    },
  });
}
