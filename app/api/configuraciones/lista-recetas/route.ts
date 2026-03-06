/**
 * API Route proxy para configuraciones
 * Evita problemas de CORS y certificados autofirmados
 */

export async function GET(request: Request) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_CORRECCIONES_URL || "192.168.20.151:8005";
    const baseUrl = apiUrl.startsWith("http") ? apiUrl : `http://${apiUrl}`;
    const fullUrl = `${baseUrl}/configuraciones/lista-recetas`;

    console.log("[PROXY] GET →", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "[PROXY ERROR]",
      error instanceof Error ? error.message : error,
    );
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al conectar con la API",
        hint: "Verifica que http://192.168.20.151:8005 esté disponible",
      },
      { status: 500 },
    );
  }
}
