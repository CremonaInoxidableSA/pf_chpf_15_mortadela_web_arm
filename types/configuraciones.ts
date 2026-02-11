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
  id: string;
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
