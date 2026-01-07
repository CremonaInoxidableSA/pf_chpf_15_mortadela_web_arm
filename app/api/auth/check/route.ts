import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, verifyToken } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Chequear si existen usuarios en la DB
    try {
      const result = (await query(
        "SELECT COUNT(*) AS count FROM Usuarios",
      )) as any[];
      const count = result?.[0]?.count ?? 0;

      if (count === 0) {
        // No hay usuarios: indicar que se necesita bootstrap
        return NextResponse.json<ApiResponse>({
          success: true,
          data: { needBootstrap: true },
        });
      }
    } catch (dbError) {
      console.error("DB check error:", dbError);
      // Si hay un error de BD, no bloqueamos el proceso de auth; seguir con la verificación normal
    }

    // Primero, intentar obtener usuario desde la cookie (comportamiento actual)
    const cookieUser = await getCurrentUser();
    if (cookieUser) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { user: cookieUser },
      });
    }

    // Si no hay cookie, permitir token en Authorization Bearer como respaldo (por ejemplo, token guardado en localStorage)
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (token) {
      const tokenUser = verifyToken(token as string);
      if (tokenUser) {
        return NextResponse.json<ApiResponse>({
          success: true,
          data: { user: tokenUser },
        });
      }
    }

    // Si llegamos aquí, no hay sesión válida
    return NextResponse.json<ApiResponse>(
      { success: false, error: "No autenticado" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Check session error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al verificar sesión" },
      { status: 500 },
    );
  }
}
