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
  ListadoTorres: Torre[];
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

interface Configuracion {
  id_correccion: number;
  tipo: string;
  valor: number;
  nivel: number;
}

interface NivelesTorreResponse {
  torre: TorreConfig;
  configuraciones: Configuracion[];
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
      console.log(
        "[DEBUG] Configuraciones recibidas:",
        data.configuraciones.length,
      );
      return data;
    } catch (error) {
      console.error("[ERROR]", error);
      throw error;
    }
  },

  enviarDatosTorre: async (
    datos: Record<string, unknown>,
    intento: number = 1,
  ): Promise<void> => {
    const url = getProxyUrl("tomar-datos-torre");
    console.log(
      `[DEBUG] POST tomar-datos-torre (intento ${intento}) →`,
      url,
      datos,
    );
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      console.log("[DEBUG] Datos de torre enviados exitosamente");
    } catch (error) {
      console.error("[ERROR] Fallo al enviar datos de torre:", error);
      throw error;
    }
  },

  enviarDatosNiveles: async (datos: Record<string, unknown>): Promise<void> => {
    const url = getProxyUrl("tomar-datos-niveles");
    console.log("[DEBUG] POST tomar-datos-niveles →", url, datos);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      console.log("[DEBUG] Datos de niveles enviados exitosamente");
    } catch (error) {
      console.error("[ERROR] Fallo al enviar datos de niveles:", error);
      throw error;
    }
  },

  resetearFallasNivel: async (
    datos: Record<string, unknown>,
  ): Promise<void> => {
    const url = getProxyUrl("reset-datos-niveles");
    console.log("[DEBUG] POST reset-datos-niveles →", url, datos);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      console.log("[DEBUG] Fallas de nivel reseteadas exitosamente");
    } catch (error) {
      console.error("[ERROR] Fallo al resetear fallas:", error);
      throw error;
    }
  },
};

// Exporta solo la API real
export const configuracionesApi = realConfiguracionesApi;
