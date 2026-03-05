import { mockConfiguracionesApi, MOCK_MODE } from "./mockConfiguracionesApi";

// Obtener URL base desde variables de entorno
const getCorreccionsApiUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_CORRECCIONES_URL || "192.168.20.151:8005";
  // Agregar protocolo si no lo tiene
  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return baseUrl;
  }
  // Usar HTTPS por defecto para evitar problemas de mixed content
  const fullUrl = `https://${baseUrl}`;
  console.log(
    "[DEBUG] API CORRECCIONES URL:",
    process.env.NEXT_PUBLIC_API_CORRECCIONES_URL,
    "→",
    fullUrl,
  );
  return fullUrl;
};

/**
 * Obtener la URL del endpoint proxy
 * Usa el proxy de Next.js para evitar problemas de CORS/certificados
 * @param endpoint - endpoint sin query params (ej: "lista-recetas", "datos-recetas")
 * @param queryParams - parámetros opcionales (ej: {id_receta: "1"})
 * @returns URL del proxy
 */
const getProxyUrl = (
  endpoint: string,
  queryParams?: Record<string, string | number>,
): string => {
  const query = new URLSearchParams();
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      query.append(key, String(value));
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return `/api/proxy/configuraciones/${endpoint}${queryString}`;
};

// Estructuras de respuesta GET

interface Receta {
  id_receta: number;
  codigo_producto: string;
  peso_producto: number;
  tipo_corte: number;
  alto_producto: number;
  largo_producto: number;
  ancho_producto: number;
  productos_fila: number;
  productos_columna: number;
}

interface ListadoRecetasResponse {
  ListadoRecetas: Receta[];
}

interface Torre {
  id_torre: number;
  nombre_torre: string;
}

interface ListadoTorresResponse {
  ListadoTorres: Array<{
    id_torre: number;
    nombre_torre: string;
  }>;
}

interface TorreConfig {
  id_torre: number;
  nombre_torre: string;
  ajuste_altura: number;
  delta_niveles: number;
  altura_n1: number;
  bastidor_altura: number;
  ajuste_altura_n1: number;
}

interface NivelesTorreResponse {
  torre: TorreConfig;
  configuraciones: any[];
}

interface DatosReceta {
  id: number;
  codigoProducto: string;
  pesoProducto: number;
  tipoCorte: number;
  altoProducto: number;
  largoProducto: number;
  anchoProducto: number;
}

interface DatosRecetasResponse {
  DatosRecetas: DatosReceta[];
}

// Estructura para POST /configuraciones/tomar-datos-torre
interface TorreData {
  id: string;
  hBastidor?: number | null;
  hAjuste?: number | null;
  hAjusteN1?: number | null;
  DisteNivel?: number | null;
  ActualizarTAG?: string;
  id_recetario: number;
}

// Estructura para POST /configuraciones/tomar-datos-niveles (tipo: "1" o "2")
interface NivelData {
  id: string;
  tipo: string; // "1" o "2" para correcciones normales
  Correccion1?: number | null;
  Correccion2?: number | null;
  Correccion3?: number | null;
  Correccion4?: number | null;
  Correccion5?: number | null;
  Correccion6?: number | null;
  Correccion7?: number | null;
  Correccion8?: number | null;
  Correccion9?: number | null;
  Correccion10?: number | null;
}

// Estructura para POST /configuraciones/reset-datos-niveles (tipo: "3")
interface ResetFallasData {
  id: string;
  tipo: string; // Siempre "3" para reset de fallas
  Correccion1?: number | null;
  Correccion2?: number | null;
  Correccion3?: number | null;
  Correccion4?: number | null;
  Correccion5?: number | null;
  Correccion6?: number | null;
  Correccion7?: number | null;
  Correccion8?: number | null;
  Correccion9?: number | null;
  Correccion10?: number | null;
  [key: string]: string | number | null | undefined;
}

// API real para producción
const realConfiguracionesApi = {
  obtenerListaRecetas: async (): Promise<Receta[]> => {
    const url = getProxyUrl("lista-recetas");
    console.log("[DEBUG] GET lista-recetas →", url);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: ListadoRecetasResponse = await response.json();
      console.log("[DEBUG] Datos recibidos:", data.ListadoRecetas);
      return data.ListadoRecetas;
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  obtenerDatosRecetas: async (idReceta: string): Promise<DatosReceta[]> => {
    const url = getProxyUrl("datos-recetas", { id_receta: idReceta });
    console.log("[DEBUG] GET datos-recetas →", url);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: DatosRecetasResponse = await response.json();
      return data.DatosRecetas;
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  obtenerListaTorres: async (idReceta: string): Promise<Torre[]> => {
    const url = getProxyUrl("lista-torres", { id_receta: idReceta });
    console.log("[DEBUG] GET lista-torres →", url);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: ListadoTorresResponse = await response.json();
      return data.ListadoTorres;
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  obtenerNivelesTorre: async (
    idTorre: string,
  ): Promise<NivelesTorreResponse> => {
    const url = getProxyUrl("niveles-torre", { id_torre: idTorre });
    console.log("[DEBUG] GET niveles-torre →", url);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: NivelesTorreResponse = await response.json();
      return data;
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  enviarDatosTorre: async (datos: TorreData, reintentos: number = 5) => {
    const url = getProxyUrl("tomar-datos-torre");
    console.log("[DEBUG] POST tomar-datos-torre →", url);
    for (let i = 1; i <= reintentos; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
      } catch (error) {
        if (i === reintentos) throw error;
        console.warn(`[RETRY] Intento ${i} falló, reintentando...`);
      }
    }
  },

  enviarDatosNiveles: async (datos: NivelData) => {
    const url = getProxyUrl("tomar-datos-niveles");
    console.log("[DEBUG] POST tomar-datos-niveles →", url);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      return response.text();
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  resetearFallasNivel: async (datos: ResetFallasData) => {
    const url = getProxyUrl("reset-datos-niveles");
    console.log("[DEBUG] POST reset-datos-niveles →", url);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },
};

// Exporta la API mock o real según MOCK_MODE
export const configuracionesApi = MOCK_MODE
  ? mockConfiguracionesApi
  : realConfiguracionesApi;
