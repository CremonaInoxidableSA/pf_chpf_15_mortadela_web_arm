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
  correccion_busqueda: number;
  correccion_guardado: number;
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
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: ListadoRecetasResponse = await response.json();
      return data.ListadoRecetas;
    } catch (error) {
      throw error;
    }
  },

  obtenerListaTorres: async (idReceta: string): Promise<Torre[]> => {
    const url = getProxyUrl("lista-torres", { id_receta: idReceta });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: ListadoTorresResponse = await response.json();
      return data.ListadoTorres;
    } catch (error) {
      throw error;
    }
  },

  obtenerNivelesTorre: async (
    idTorre: string,
  ): Promise<NivelesTorreResponse> => {
    const url = getProxyUrl("niveles-torre", { id_torre: idTorre });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status}`);
      const data: NivelesTorreResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  enviarDatosTorre: async (
    datos: Record<string, unknown>,
    intento: number = 1,
  ): Promise<void> => {
    const url = getProxyUrl("tomar-datos-torre");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
    } catch (error) {
      throw error;
    }
  },

  enviarDatosNiveles: async (datos: Record<string, unknown>): Promise<void> => {
    const url = getProxyUrl("tomar-datos-niveles");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
    } catch (error) {
      throw error;
    }
  },

  resetearFallasNivel: async (
    datos: Record<string, unknown>,
  ): Promise<void> => {
    const url = getProxyUrl("reset-datos-niveles");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(`${response.status}`);
    } catch (error) {
      throw error;
    }
  },
};

// Exporta solo la API real
export const configuracionesApi = realConfiguracionesApi;
