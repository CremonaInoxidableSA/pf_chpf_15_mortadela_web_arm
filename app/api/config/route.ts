import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

// GET - Obtener parámetros (acceso para admin y user, pero user solo ve)
async function GETHandler(req: NextRequest, user: any) {
  try {
    const params = (await query(
      "SELECT id, param_name, param_value, description FROM config_params ORDER BY param_name",
    )) as any[];

    return NextResponse.json<ApiResponse>({
      success: true,
      data: params,
    });
  } catch (error) {
    console.error("Get config error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al obtener parámetros" },
      { status: 500 },
    );
  }
}

// POST/PUT - Actualizar parámetros (solo admin)
async function updateHandler(req: NextRequest, user: any) {
  try {
    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    const { id, param_value } = await req.json();

    if (!id || param_value === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "ID y valor son requeridos" },
        { status: 400 },
      );
    }

    await query(
      "UPDATE config_params SET param_value = ?, updated_at = NOW() WHERE id = ?",
      [param_value, id],
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Parámetro actualizado",
    });
  } catch (error) {
    console.error("Update config error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al actualizar parámetro" },
      { status: 500 },
    );
  }
}

// Exportar handlers con middleware de autenticación
export const GET = withAuth(GETHandler);
export const POST = withAuth(updateHandler, "admin");
export const PUT = withAuth(updateHandler, "admin");
