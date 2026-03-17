/**
 * API Route proxy genérico para todas las llamadas a configuraciones
 * Ruta: /api/proxy/configuraciones/[...path]
 * Redirige a: process.env.API_CORRECCIONES_URL/configuraciones/[...path]
 *
 * Corre únicamente en el servidor — la URL real de la API nunca se envía al navegador.
 */

type Props = {
  params: Promise<{
    path: string[];
  }>;
};

function getBaseUrl(): string {
  const raw = process.env.API_CORRECCIONES_URL ?? "http://192.168.20.151:8005";
  return raw.startsWith("http") ? raw : `http://${raw}`;
}

function buildHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const cookie = request.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;
  const auth = request.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;
  return headers;
}

export async function GET(request: Request, props: Props) {
  try {
    const params = await props.params;
    const path = params.path.join("/");
    const url = new URL(request.url);
    const queryString = url.search;

    const fullUrl = `${getBaseUrl()}/configuraciones/${path}${queryString}`;
    const proxyHeaders = buildHeaders(request);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: proxyHeaders,
    });

    if (!response.ok) {
      const text = await response.text();
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

    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

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

    const fullUrl = `${getBaseUrl()}/configuraciones/${path}`;
    const proxyHeaders = buildHeaders(request);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: proxyHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
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

    return Response.json(data, {
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    return Response.json(
      {
        error: errorMsg,
        hint: "Verifica que http://192.168.20.151:8005 esté disponible",
      },
      { status: 500 },
    );
  }
}
