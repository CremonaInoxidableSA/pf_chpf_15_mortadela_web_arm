interface TorreData {
  id: string;
  hBastidor?: number | null;
  hAjuste?: number | null;
  hAjusteN1?: number | null;
  DisteNivel?: number | null;
  ActualizarTAG?: string;
  id_recetario: string;
}

interface NivelData {
  id: string;
  tipo: string;
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
  Correccion11?: number | null;
}

interface ResetFallasData {
  id: string;
  tipo: string;
  [key: string]: any;
}

export const configuracionesApi = {
  obtenerListaRecetas: async () => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/lista-recetas`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener lista de recetas: ${response.status}`);
    }

    return response.json();
  },
  obtenerDatosRecetas: async (idReceta: string) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/datos-recetas?id_receta=${idReceta}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener datos de recetas: ${response.status}`);
    }

    return response.json();
  },
  obtenerListaTorres: async (idReceta: string) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/lista-torres?id_receta=${idReceta}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener lista de torres: ${response.status}`);
    }

    return response.json();
  },
  obtenerNivelesTorre: async (idTorre: string) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/niveles-torre?id_torre=${idTorre}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener niveles de torre: ${response.status}`);
    }

    return response.json();
  },
  enviarDatosTorre: async (datos: TorreData, reintentos: number = 5) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/tomar-datos-torre`;

    for (let i = 1; i <= reintentos; i++) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`Error en el intento ${i}: ${response.status}`);
      }

      return response.json();
    }
  },
  enviarDatosNiveles: async (datos: NivelData) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/tomar-datos-niveles`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar datos de niveles: ${response.status}`);
    }

    return response.text();
  },
  resetearFallasNivel: async (datos: ResetFallasData) => {
    const target = localStorage.getItem("targetAddress");

    if (!target) throw new Error("Target address not available");
    const url = `http://${target}/configuraciones/reset-datos-niveles`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error al resetear fallas: ${response.status}`);
    }

    return response.json();
  },
};
