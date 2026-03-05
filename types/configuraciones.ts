import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface DatoReceta {
  id: number;
  texto: string;
  dato: string | null;
  icono: StaticImageData | ReactNode;
}

export interface DatoCorreccion {
  id: number;
  texto: string;
  dato: string | null;
}

export interface Torre {
  id_torre: number;
  nombre_torre: string;
}

export interface RecetaResponse {
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
}

export interface NivelesTorreResponse {
  DatosTorre?: {
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
}

export interface TorresResponse {
  ListadoTorres?: Torre[];
}

export interface RecetasResponse {
  ListadoRecetas?: Array<{
    id: number;
    codigoProducto: string;
  }>;
}

export type TipoNivel = "HN" | "ChG" | "ChB" | "FA" | "uHN";

// Estructura para POST /configuraciones/tomar-datos-torre
export interface TorreDataPayload {
  id: string;
  hBastidor: number | null;
  hAjuste: number | null;
  hAjusteN1: number | null;
  DisteNivel: number | null;
  ActualizarTAG: string;
  id_recetario: number;
}

// Estructura para POST /configuraciones/tomar-datos-niveles (tipo: "1" o "2")
export interface NivelDataPayload {
  id: string;
  tipo: string; // "1" para Altura, "2" para Guardado
  Correccion1: number | null;
  Correccion2: number | null;
  Correccion3: number | null;
  Correccion4: number | null;
  Correccion5: number | null;
  Correccion6: number | null;
  Correccion7: number | null;
  Correccion8: number | null;
  Correccion9: number | null;
  Correccion10: number | null;
}

// Estructura para POST /configuraciones/reset-datos-niveles (tipo: "3")
export interface ResetFallasPayload {
  id: string;
  tipo: "3"; // Siempre "3" para reset de fallas
  Correccion1: number | null;
  Correccion2: number | null;
  Correccion3: number | null;
  Correccion4: number | null;
  Correccion5: number | null;
  Correccion6: number | null;
  Correccion7: number | null;
  Correccion8: number | null;
  Correccion9: number | null;
  Correccion10: number | null;
}

export interface ConfiguracionData {
  datosGeneralesIzq: DatoReceta[];
  datosGeneralesDer: DatoReceta[];
  selectedReceta: string;

  torres: Torre[];
  selectedTorre: string | null;

  datosCorrecionesTorre: DatoCorreccion[];
  datosCorrecionesNivelesHN: DatoCorreccion[];
  datosCorrecionesNivelesChG: DatoCorreccion[];
  datosCorrecionesNivelesChB: DatoCorreccion[];
  datosCorrecionesNivelesFA: DatoCorreccion[];
  datosCorrecionesNivelesuHN: DatoCorreccion[];

  selectedOption: number;
  selectedNivel: TipoNivel;
  loading: boolean;
  isButtonDisabled: boolean;
}
