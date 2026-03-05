import type {
  DatoReceta,
  DatoCorreccion,
  Torre,
  TipoNivel,
  RecetaResponse,
  NivelesTorreResponse,
} from "@/types/configuraciones";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  TbCircleLetterAFilled,
  TbCircleLetterBFilled,
  TbCircleLetterCFilled,
} from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import React from "react";

import { configuracionesApi } from "@/services/configuracionesApi";
import { MOCK_MODE } from "@/services/mockConfiguracionesApi";
import { validacionesConfiguraciones } from "@/utils/configuraciones/validaciones";
import { useApp } from "@/context/AppContext";
import NGripper from "@/public/equipos/Equipo_Gripper1.png";
import Ancho from "@/public/correcciones/ancho.png";
import Alto from "@/public/correcciones/alto.png";
import Largo from "@/public/correcciones/largo.png";
import ProductosMolde from "@/public/correcciones/PRODUCTOSMOLDE.png";
import MoldesNivel from "@/public/correcciones/MOLDESNIVEL.png";
import LargoMolde from "@/public/correcciones/LARGOMOLDE.png";
import AlturaAjuste from "@/public/correcciones/ALTURAAJUSTE.png";
import AlturaMolde from "@/public/correcciones/ALTURAMOLDE.png";
import AlturaAjusteN1 from "@/public/correcciones/ALTURAN1.png";
import AlturaN1 from "@/public/correcciones/AJUSTEN1.png";
import AlturaBastidor from "@/public/correcciones/ALTURABASTIDOR.png";
import DisteNivel from "@/public/correcciones/DISTENIVEL.png";
import Peso from "@/public/equipos/Equipo_Robot1.png";
import Niveles from "@/public/equipos/Equipo_Torre1.png";

const datosIniciales = {
  datosGeneralesIzq: [
    {
      id: 1,
      texto: "NUMERO DE GRIPPER ",
      dato: "null",
      icono: React.createElement(TbCircleLetterAFilled),
    },
    {
      id: 2,
      texto: "TIPO DE MOLDE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 3,
      texto: "ANCHO DEL PRODUCTO",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 4,
      texto: "ALTO DEL PRODUCTO",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 5,
      texto: "LARGO DEL PRODUCTO",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 6,
      texto: "PESO DEL PRODUCTO",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 7,
      texto: "MOLDES POR NIVEL",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 8,
      texto: "PRODUCTOS POR MOLDE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
  ],
  datosGeneralesDer: [
    {
      id: 1,
      texto: "ALTURA DE MOLDE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 2,
      texto: "LARGO DE MOLDE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 3,
      texto: "ALTURA AJUSTE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 4,
      texto: "NIVELES POR TORRE",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 5,
      texto: "DELTA ENTRE NIVELES",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 6,
      texto: "ALTURA N1",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 7,
      texto: "ALTURA DE BASTIDOR",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 8,
      texto: "ALTURA AJUSTE N1",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
  ],
};

export const useConfiguracionData = () => {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState<string>("");
  const [selectedTorre, setSelectedTorre] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectedNivel, setSelectedNivel] = useState<TipoNivel>("HN");
  const [torres, setTorres] = useState<Torre[]>([]);
  const [initialized, setInitialized] = useState(false);

  const { targetAddress } = useApp();

  // Permitir llamadas API siempre (el proxy las maneja)
  const canMakeApiCalls = true;

  const [datosGeneralesIzq, setDatosRecetas1] = useState<DatoReceta[]>(
    datosIniciales.datosGeneralesIzq,
  );
  const [datosGeneralesDer, setDatosRecetas2] = useState<DatoReceta[]>(
    datosIniciales.datosGeneralesDer,
  );

  const [datosCorrecionesTorre, setDatosCorrecionesTorre] = useState<
    DatoCorreccion[]
  >([
    { id: 1, texto: "Correccion_hBastidor", dato: "0" },
    { id: 2, texto: "Correccion_hAjuste", dato: "0" },
    { id: 3, texto: "Correccion_hAjusteN1", dato: "0" },
    { id: 4, texto: "Correccion_DisteNivel", dato: "0" },
    { id: 5, texto: "ActualizarTAG", dato: "" },
  ]);

  const [datosCorrecionesNivelesHN, setDatosCorrecionesNivelesHN] = useState<
    DatoCorreccion[]
  >(
    Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        texto: `Correccion_hN${index + 1}`,
        dato: "0",
      })),
  );

  const [datosCorrecionesNivelesChG, setDatosCorrecionesNivelesChG] = useState<
    DatoCorreccion[]
  >(
    Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        texto: `Correccion_hguardado_N${index + 1}`,
        dato: "0",
      })),
  );

  const [datosCorrecionesNivelesChB, setDatosCorrecionesNivelesChB] = useState<
    DatoCorreccion[]
  >(
    Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        texto: `Correccion_hbusqueda_N${index + 1}`,
        dato: "0",
      })),
  );

  const [datosCorrecionesNivelesFA, setDatosCorrecionesNivelesFA] = useState<
    DatoCorreccion[]
  >(
    Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        texto: `FallasN${index + 1}`,
        dato: "0",
      })),
  );

  const [datosCorrecionesNivelesuHN, setDatosCorrecionesNivelesuHN] = useState<
    DatoCorreccion[]
  >(
    Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        texto: `ultimo_hNivel${index + 1}`,
        dato: "0",
      })),
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const obtenerIconoTipoMolde = (tipo: string) => {
    switch (tipo) {
      case "Molde A":
        return React.createElement(TbCircleLetterAFilled);
      case "Molde B":
        return React.createElement(TbCircleLetterBFilled);
      case "Molde C":
        return React.createElement(TbCircleLetterCFilled);
      default:
        return React.createElement(GoDotFill);
    }
  };

  const cargarDatosReceta = async (idReceta: string) => {
    if (!idReceta) return;

    setLoading(true);
    try {
      // Obtener datos de la receta desde lista-recetas
      const listaRecetas = await configuracionesApi.obtenerListaRecetas();
      const receta = listaRecetas.find(
        (r) => r.id_receta === parseInt(idReceta),
      );

      if (!receta) {
        throw new Error("Receta no encontrada");
      }

      // LADO IZQUIERDO - Datos de la receta (solo los que devuelve la API)
      setDatosRecetas1([
        {
          id: 1,
          texto: "CÓDIGO DE PRODUCTO",
          dato: receta.codigo_producto || "N/A",
          icono: NGripper,
        },
        {
          id: 2,
          texto: "TIPO DE CORTE",
          dato: `Tipo ${receta.tipo_corte}`,
          icono: obtenerIconoTipoMolde(
            `Molde ${String.fromCharCode(64 + receta.tipo_corte)}`,
          ),
        },
        {
          id: 3,
          texto: "ANCHO DEL PRODUCTO",
          dato: `${receta.ancho_producto} mm`,
          icono: Ancho,
        },
        {
          id: 4,
          texto: "ALTO DEL PRODUCTO",
          dato: `${receta.alto_producto} mm`,
          icono: Alto,
        },
        {
          id: 5,
          texto: "LARGO DEL PRODUCTO",
          dato: `${receta.largo_producto} mm`,
          icono: Largo,
        },
        {
          id: 6,
          texto: "PESO DEL PRODUCTO",
          dato: `${receta.peso_producto} kg`,
          icono: Peso,
        },
        {
          id: 7,
          texto: "PRODUCTOS POR FILA",
          dato: receta.productos_fila?.toString() || "N/A",
          icono: MoldesNivel,
        },
        {
          id: 8,
          texto: "PRODUCTOS POR COLUMNA",
          dato: receta.productos_columna?.toString() || "N/A",
          icono: ProductosMolde,
        },
      ]);

      // LADO DERECHO - Estos se completarán cuando se carguen datos de la torre
      setDatosRecetas2([
        {
          id: 1,
          texto: "ALTURA DE MOLDE",
          dato: `${receta.alto_producto} mm`,
          icono: AlturaMolde,
        },
        {
          id: 2,
          texto: "LARGO DE MOLDE",
          dato: `${receta.largo_producto} mm`,
          icono: LargoMolde,
        },
        {
          id: 3,
          texto: "AJUSTE ALTURA",
          dato: "Cargando...",
          icono: AlturaAjuste,
        },
        {
          id: 4,
          texto: "DELTA ENTRE NIVELES",
          dato: "Cargando...",
          icono: DisteNivel,
        },
        {
          id: 5,
          texto: "ALTURA N1",
          dato: "Cargando...",
          icono: AlturaN1,
        },
        {
          id: 6,
          texto: "ALTURA DE BASTIDOR",
          dato: "Cargando...",
          icono: AlturaBastidor,
        },
        {
          id: 7,
          texto: "AJUSTE ALTURA N1",
          dato: "Cargando...",
          icono: AlturaAjusteN1,
        },
      ]);
    } catch (error) {
      console.error("Error al cargar datos de receta:", error);
      toast.error("Error al cargar datos de la receta");
    } finally {
      setLoading(false);
    }
  };

  const cargarTorres = async (idReceta: string) => {
    try {
      const data = await configuracionesApi.obtenerListaTorres(idReceta);

      if (data && data.length > 0) {
        setTorres(data);
        // Siempre seleccionar la primera torre al cambiar de receta
        setSelectedTorre(data[0].id_torre.toString());
      } else {
        setTorres([]);
        setSelectedTorre(null);
      }
    } catch (error) {
      console.error("Error al cargar torres:", error);
      toast.error("Error al cargar torres");
      setTorres([]);
      setSelectedTorre(null);
    }
  };

  const cargarDatosTorre = async (idTorre: string) => {
    if (!idTorre) return;

    setLoading(true);
    try {
      const data = await configuracionesApi.obtenerNivelesTorre(idTorre);

      if (!data || !data.torre) {
        throw new Error("Datos de torre no encontrados");
      }

      const torre = data.torre;

      // Datos de correcciones generales de la torre (solo los que devuelve la API)
      setDatosCorrecionesTorre([
        {
          id: 1,
          texto: "Correccion_hBastidor",
          dato: `${torre.bastidor_altura ?? "0"}`,
        },
        {
          id: 2,
          texto: "Correccion_hAjuste",
          dato: `${torre.ajuste_altura ?? "0"}`,
        },
        {
          id: 3,
          texto: "Delta_Niveles",
          dato: `${torre.delta_niveles ?? "0"}`,
        },
        {
          id: 4,
          texto: "Altura_N1",
          dato: `${torre.altura_n1 ?? "0"}`,
        },
        {
          id: 5,
          texto: "Ajuste_Altura_N1",
          dato: `${torre.ajuste_altura_n1 ?? "0"}`,
        },
      ]);

      // Para los niveles, inicializar arrays vacíos
      // La API aún no proporciona datos de niveles en la estructura
      setDatosCorrecionesNivelesHN([]);
      setDatosCorrecionesNivelesChG([]);
      setDatosCorrecionesNivelesChB([]);
      setDatosCorrecionesNivelesFA([]);
      setDatosCorrecionesNivelesuHN([]);

      // Actualizar los datos generales del lado derecho con info de la torre
      setDatosRecetas2((prev) =>
        prev.map((dato) => {
          if (dato.id === 3) {
            // AJUSTE ALTURA
            return {
              ...dato,
              dato: `${torre.ajuste_altura ?? "N/A"} mm`,
            };
          }
          if (dato.id === 4) {
            // DELTA ENTRE NIVELES
            return {
              ...dato,
              dato: `${torre.delta_niveles ?? "N/A"} mm`,
            };
          }
          if (dato.id === 5) {
            // ALTURA N1
            return {
              ...dato,
              dato: `${torre.altura_n1 ?? "N/A"} mm`,
            };
          }
          if (dato.id === 6) {
            // ALTURA DE BASTIDOR
            return {
              ...dato,
              dato: `${torre.bastidor_altura ?? "N/A"} mm`,
            };
          }
          if (dato.id === 7) {
            // AJUSTE ALTURA N1
            return {
              ...dato,
              dato: `${torre.ajuste_altura_n1 ?? "N/A"} mm`,
            };
          }
          return dato;
        }),
      );

      toast.success("Datos de torre cargados correctamente");
    } catch (error) {
      console.error("Error al cargar datos de torre:", error);
      toast.error("Error al cargar datos de la torre");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales: lista-recetas primero
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (!canMakeApiCalls || initialized) return;

      try {
        setLoading(true);
        // 1. Primero obtenemos lista de recetas
        const recetasData = await configuracionesApi.obtenerListaRecetas();

        if (recetasData && recetasData.length > 0) {
          // Seleccionar la primera receta automáticamente
          const primeraReceta = recetasData[0].id_receta.toString();
          setSelectedReceta(primeraReceta);
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        toast.error("Error al cargar la lista de recetas");
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [canMakeApiCalls, initialized]);

  // Cuando cambia la receta seleccionada, cargar datos de receta y torres
  useEffect(() => {
    if (canMakeApiCalls && selectedReceta) {
      cargarDatosReceta(selectedReceta);
      cargarTorres(selectedReceta);
    }
  }, [selectedReceta, canMakeApiCalls]);

  // Cuando cambia la torre seleccionada, cargar datos de niveles
  useEffect(() => {
    if (canMakeApiCalls && selectedTorre && selectedReceta) {
      cargarDatosTorre(selectedTorre);
    }
  }, [selectedTorre, selectedReceta, canMakeApiCalls]);

  const obtenerDatosActuales = () => {
    if (selectedOption === 1) return datosCorrecionesTorre;

    switch (selectedNivel) {
      case "HN":
        return datosCorrecionesNivelesHN;
      case "ChB":
        return datosCorrecionesNivelesChB;
      case "FA":
        return datosCorrecionesNivelesFA;
      case "uHN":
        return datosCorrecionesNivelesuHN;
      default:
        return datosCorrecionesNivelesChG;
    }
  };

  const handlers = {
    handleRecetaChange: (receta: string) => {
      setSelectedReceta(receta);
    },

    handleTorreChange: (torre: string) => {
      setSelectedTorre(torre);
    },

    handleNivelChange: (nivel: TipoNivel) => {
      setSelectedNivel(nivel);
    },

    handleOptionChange: (option: number) => {
      setSelectedOption(option);
    },

    handleTorresChange: (newTorres: Torre[]) => {
      setTorres(newTorres);
    },

    validarTAGDuplicado: (inputValue: string) => {
      const tagLimpio = validacionesConfiguraciones.validarTAG(inputValue);
      const existe = validacionesConfiguraciones.existeTorreConTAG(
        tagLimpio,
        torres,
      );

      if (existe) {
        toast.error("Ya existe una torre con este TAG.", {
          position: "bottom-center",
        });
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }

      return tagLimpio;
    },

    refreshData: () => {
      if (selectedTorre && selectedReceta) {
        cargarDatosTorre(selectedTorre);
      }
    },
  };

  return {
    loading,
    isButtonDisabled,
    selectedReceta,
    selectedTorre,
    selectedOption,
    selectedNivel,
    torres,
    datosGeneralesIzq,
    datosGeneralesDer,
    datosActuales: obtenerDatosActuales(),
    inputRefs,

    ...handlers,

    cargarDatosReceta,
    cargarTorres,
    cargarDatosTorre,

    configuracionesApi,
    validacionesConfiguraciones,
  };
};
