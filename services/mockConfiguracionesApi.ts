// Mock data imports - estos se copian a memoria para ser mutables
import listaRecetasOriginal from "@/mocks/configuraciones/lista-recetas.json";
import listaTorresOriginal from "@/mocks/configuraciones/lista-torres.json";
import datosRecetasOriginal from "@/mocks/configuraciones/datos-recetas.json";
import nivelesTorreOriginal from "@/mocks/configuraciones/niveles-torre.json";

// Interfaces for POST data structures
interface TorreData {
  id: string;
  hBastidor?: number | null;
  hAjuste?: number | null;
  hAjusteN1?: number | null;
  DisteNivel?: number | null;
  ActualizarTAG?: string;
  id_recetario: number;
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
}

interface ResetFallasData {
  id: string;
  tipo: string;
  [key: string]: string | number | null;
}

// Type definitions for imported JSON
type ListaTorresType = {
  [key: string]: { ListadoTorres: { id: string }[] };
};

type DatosRecetasType = {
  [key: string]: {
    DatosRecetas: Array<{
      nroGripper?: number;
      tipoMolde?: string;
      anchoProducto?: number;
      altoProducto?: number;
      largoProducto?: number;
      pesoProducto?: number;
      moldesNivel?: number;
      productosMolde?: number;
      altoMolde?: number;
      largoMolde?: number;
      ajusteAltura?: number;
      cantidadNiveles?: number;
      deltaNiveles?: number;
      n1Altura?: number;
      bastidorAltura?: number;
      ajusteN1Altura?: number;
    }>;
  };
};

type NivelesTorreType = {
  [key: string]: {
    DatosTorre: {
      hBastidor?: number;
      hAjuste?: number;
      hAjusteN1?: number;
      DisteNivel?: number;
      ActualizarTAG?: string;
    };
    DatosNivelesHN?: number[];
    DatosNivelesChG?: number[];
    DatosNivelesChB?: number[];
    DatosNivelesFallas?: number[];
    DatosNivelesuHN?: number[];
  };
};

// ============================================
// ESTADO EN MEMORIA - Datos mutables
// ============================================
// Hacemos una copia profunda de los datos originales para que sean mutables
const mockDataStore = {
  listaRecetas: JSON.parse(JSON.stringify(listaRecetasOriginal)),
  listaTorres: JSON.parse(
    JSON.stringify(listaTorresOriginal),
  ) as ListaTorresType,
  datosRecetas: JSON.parse(
    JSON.stringify(datosRecetasOriginal),
  ) as DatosRecetasType,
  nivelesTorre: JSON.parse(
    JSON.stringify(nivelesTorreOriginal),
  ) as NivelesTorreType,
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock mode flag - set to false to use real API
export const MOCK_MODE = false;

// Función para resetear los datos al estado original (útil para testing)
export const resetMockData = () => {
  mockDataStore.listaRecetas = JSON.parse(JSON.stringify(listaRecetasOriginal));
  mockDataStore.listaTorres = JSON.parse(JSON.stringify(listaTorresOriginal));
  mockDataStore.datosRecetas = JSON.parse(JSON.stringify(datosRecetasOriginal));
  mockDataStore.nivelesTorre = JSON.parse(JSON.stringify(nivelesTorreOriginal));
  console.log("[MOCK] Datos reseteados al estado original");
};

export const mockConfiguracionesApi = {
  /**
   * GET /configuraciones/lista-recetas
   * Obtiene la lista de recetas disponibles
   */
  obtenerListaRecetas: async () => {
    await delay(300);
    console.log("[MOCK GET] /configuraciones/lista-recetas");
    console.log("[MOCK RESPONSE]", mockDataStore.listaRecetas);
    return mockDataStore.listaRecetas;
  },

  /**
   * GET /configuraciones/lista-torres?id_receta=X
   * Obtiene la lista de torres para una receta específica
   */
  obtenerListaTorres: async (idReceta: string) => {
    await delay(200);
    const key = `receta_${idReceta}`;
    const data = mockDataStore.listaTorres[key] || { ListadoTorres: [] };
    console.log(
      `[MOCK GET] /configuraciones/lista-torres?id_receta=${idReceta}`,
    );
    console.log("[MOCK RESPONSE]", data);
    return data;
  },

  /**
   * GET /configuraciones/datos-recetas?id_receta=X
   * Obtiene los datos de una receta específica
   */
  obtenerDatosRecetas: async (idReceta: string) => {
    await delay(250);
    const key = `receta_${idReceta}`;
    const data = mockDataStore.datosRecetas[key] || { DatosRecetas: [] };
    console.log(
      `[MOCK GET] /configuraciones/datos-recetas?id_receta=${idReceta}`,
    );
    console.log("[MOCK RESPONSE]", data);
    return data;
  },

  /**
   * GET /configuraciones/niveles-torre?id_torre=XXXXXXXX
   * Obtiene los valores actuales de las correcciones de una torre
   */
  obtenerNivelesTorre: async (idTorre: string) => {
    await delay(200);
    const data = mockDataStore.nivelesTorre[idTorre] || {
      DatosTorre: {},
      DatosNivelesHN: [],
      DatosNivelesChG: [],
      DatosNivelesChB: [],
      DatosNivelesFallas: [],
      DatosNivelesuHN: [],
    };
    console.log(
      `[MOCK GET] /configuraciones/niveles-torre?id_torre=${idTorre}`,
    );
    console.log("[MOCK RESPONSE]", JSON.parse(JSON.stringify(data)));
    return JSON.parse(JSON.stringify(data)); // Retornar copia para evitar mutaciones externas
  },

  /**
   * POST /configuraciones/tomar-datos-torre
   * Aplica configuraciones nuevas sobre una torre
   */
  enviarDatosTorre: async (datos: TorreData) => {
    await delay(300);
    console.log("[MOCK POST] /configuraciones/tomar-datos-torre");
    console.log("[MOCK REQUEST BODY]", JSON.stringify(datos, null, 2));

    const { id, hBastidor, hAjuste, hAjusteN1, DisteNivel, ActualizarTAG } =
      datos;

    // Verificar si la torre existe
    if (!mockDataStore.nivelesTorre[id]) {
      console.warn(`[MOCK] Torre ${id} no encontrada, creando nueva entrada`);
      mockDataStore.nivelesTorre[id] = {
        DatosTorre: {},
        DatosNivelesHN: Array(10).fill(0),
        DatosNivelesChG: Array(10).fill(0),
        DatosNivelesChB: Array(10).fill(0),
        DatosNivelesFallas: Array(10).fill(0),
        DatosNivelesuHN: Array(10).fill(0),
      };
    }

    const torre = mockDataStore.nivelesTorre[id];

    // Actualizar solo los campos que no son null (reemplazo directo, no suma)
    if (hBastidor !== null && hBastidor !== undefined) {
      torre.DatosTorre.hBastidor = hBastidor;
    }
    if (hAjuste !== null && hAjuste !== undefined) {
      torre.DatosTorre.hAjuste = hAjuste;
    }
    if (hAjusteN1 !== null && hAjusteN1 !== undefined) {
      torre.DatosTorre.hAjusteN1 = hAjusteN1;
    }
    if (DisteNivel !== null && DisteNivel !== undefined) {
      torre.DatosTorre.DisteNivel = DisteNivel;
    }
    if (ActualizarTAG && ActualizarTAG.trim() !== "") {
      // Si se actualiza el TAG, renombramos la torre
      const oldId = id;
      const newId = ActualizarTAG.trim();

      if (oldId !== newId) {
        mockDataStore.nivelesTorre[newId] = {
          ...torre,
          DatosTorre: { ...torre.DatosTorre, ActualizarTAG: newId },
        };
        delete mockDataStore.nivelesTorre[oldId];

        // Actualizar la lista de torres
        for (const key in mockDataStore.listaTorres) {
          const listaItem = mockDataStore.listaTorres[key];
          const index = listaItem.ListadoTorres.findIndex(
            (t) => t.id === oldId,
          );
          if (index !== -1) {
            listaItem.ListadoTorres[index].id = newId;
          }
        }
        console.log(`[MOCK] Torre renombrada de ${oldId} a ${newId}`);
      }
    }

    console.log(
      "[MOCK] Datos de torre actualizados:",
      mockDataStore.nivelesTorre[ActualizarTAG?.trim() || id]?.DatosTorre,
    );
    return { success: true, message: "Datos de torre actualizados (MOCK)" };
  },

  /**
   * POST /configuraciones/tomar-datos-niveles
   * Actualiza los datos de las configuraciones por NIVEL de la torre
   * tipo: "1" = HN (Altura), "2" = ChG/ChB (Guardado/Búsqueda)
   */
  enviarDatosNiveles: async (datos: NivelData) => {
    await delay(300);
    console.log("[MOCK POST] /configuraciones/tomar-datos-niveles");
    console.log("[MOCK REQUEST BODY]", JSON.stringify(datos, null, 2));

    const { id, tipo } = datos;

    if (!mockDataStore.nivelesTorre[id]) {
      console.warn(`[MOCK] Torre ${id} no encontrada`);
      return { success: false, message: "Torre no encontrada" };
    }

    const torre = mockDataStore.nivelesTorre[id];

    // Determinar qué array de niveles actualizar según el tipo
    let targetArray: number[] | undefined;
    let arrayName: string;

    switch (tipo) {
      case "1": // HN - Correcciones de altura
        targetArray = torre.DatosNivelesHN;
        arrayName = "DatosNivelesHN";
        break;
      case "2": // ChG/ChB - Correcciones de guardado/búsqueda
        targetArray = torre.DatosNivelesChG;
        arrayName = "DatosNivelesChG";
        break;
      default:
        console.warn(`[MOCK] Tipo ${tipo} no reconocido`);
        return { success: false, message: "Tipo no reconocido" };
    }

    if (!targetArray) {
      targetArray = Array(10).fill(0);
      if (tipo === "1") torre.DatosNivelesHN = targetArray;
      else torre.DatosNivelesChG = targetArray;
    }

    // Aplicar las correcciones (reemplazo directo, no suma)
    for (let i = 1; i <= 10; i++) {
      const correccion = datos[`Correccion${i}` as keyof NivelData] as
        | number
        | null
        | undefined;
      if (
        correccion !== null &&
        correccion !== undefined &&
        typeof correccion === "number"
      ) {
        targetArray[i - 1] = correccion;
      }
    }

    console.log(`[MOCK] ${arrayName} actualizado:`, targetArray);
    return { success: true, message: "Datos de niveles actualizados (MOCK)" };
  },

  /**
   * POST /configuraciones/reset-datos-niveles
   * Resetea valores de fallas. El tipo siempre es "3"
   * Si un dato se tiene que resetear, viene como "0"
   */
  resetearFallasNivel: async (datos: ResetFallasData) => {
    await delay(300);
    console.log("[MOCK POST] /configuraciones/reset-datos-niveles");
    console.log("[MOCK REQUEST BODY]", JSON.stringify(datos, null, 2));

    const { id } = datos;

    if (!mockDataStore.nivelesTorre[id]) {
      console.warn(`[MOCK] Torre ${id} no encontrada`);
      return { success: false, message: "Torre no encontrada" };
    }

    const torre = mockDataStore.nivelesTorre[id];

    if (!torre.DatosNivelesFallas) {
      torre.DatosNivelesFallas = Array(10).fill(0);
    }

    // Resetear las fallas que vienen con valor 0
    for (let i = 1; i <= 10; i++) {
      const correccion = datos[`Correccion${i}`];
      if (correccion === 0) {
        torre.DatosNivelesFallas[i - 1] = 0;
        console.log(`[MOCK] Falla ${i} reseteada a 0`);
      }
    }

    console.log(
      "[MOCK] DatosNivelesFallas actualizado:",
      torre.DatosNivelesFallas,
    );
    return { success: true, message: "Fallas reseteadas (MOCK)" };
  },
};
