/**
 * API Route proxy genérico para todas las llamadas a configuraciones
 * Ruta: /api/proxy/configuraciones/[...path]
 * Redirige a: https://192.168.20.151:8005/configuraciones/[...path]
 */

type Props = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: Request, props: Props) {
  try {
    const params = await props.params;
    const path = params.path.join("/");
    const url = new URL(request.url);
    const queryString = url.search;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_CORRECCIONES_URL ||
      "http://192.168.20.151:8005";
    const baseUrl = apiUrl.startsWith("http") ? apiUrl : `http://${apiUrl}`;
    const fullUrl = `${baseUrl}/configuraciones/${path}${queryString}`;

    console.log("[PROXY GET] Conectando a:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[PROXY GET] Status:", response.status, "OK:", response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.error("[PROXY GET] Error body:", text);
      return Response.json(
        {
          error: `API returned ${response.status}`,
          details: text,
          url: fullUrl,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("[PROXY GET] Success, returned keys:", Object.keys(data));

    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[PROXY GET ERROR]", errorMsg);

    if (errorMsg.includes("ECONNREFUSED")) {
      console.error("[HINT] → API no está disponible o puerto incorrecto");
    } else if (errorMsg.includes("ENOTFOUND")) {
      console.error("[HINT] → Host no encontrado (DNS/IP incorrecta)");
    }

    return Response.json(
      {
        error: errorMsg,
        hint: "Verifica que http://192.168.20.151:8005 esté disponible",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, props: Props) {
  try {
    const params = await props.params;
    const path = params.path.join("/");
    const body = await request.json();

    const apiUrl =
      process.env.NEXT_PUBLIC_API_CORRECCIONES_URL ||
      "http://192.168.20.151:8005";
    const baseUrl = apiUrl.startsWith("http") ? apiUrl : `http://${apiUrl}`;
    const fullUrl = `${baseUrl}/configuraciones/${path}`;

    console.log("[PROXY POST] Conectando a:", fullUrl);
    console.log(
      "[PROXY POST] Body:",
      JSON.stringify(body).substring(0, 100) + "...",
    );

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[PROXY POST] Status:", response.status, "OK:", response.ok);

    if (!response.ok) {
      const text = await response.text();
      console.error("[PROXY POST] Error body:", text);
      return Response.json(
        {
          error: `API returned ${response.status}`,
          details: text,
          url: fullUrl,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("[PROXY POST] Success");

    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[PROXY POST ERROR]", errorMsg);

    if (errorMsg.includes("ECONNREFUSED")) {
      console.error("[HINT] → API no está disponible o puerto incorrecto");
    } else if (errorMsg.includes("ENOTFOUND")) {
      console.error("[HINT] → Host no encontrado (DNS/IP incorrecta)");
    }

    return Response.json(
      {
        error: errorMsg,
        hint: "Verifica que http://192.168.20.151:8005 esté disponible",
      },
      { status: 500 },
    );
  }
}
