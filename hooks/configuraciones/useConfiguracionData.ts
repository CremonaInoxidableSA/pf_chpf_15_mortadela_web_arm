import type {
  DatoReceta,
  DatoCorreccion,
  Torre,
  TipoNivel,
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
import { validacionesConfiguraciones } from "@/utils/configuraciones/validaciones";
import NGripper from "@/public/equipos/Equipo_Gripper1.png";
import Ancho from "@/public/correcciones/ancho.png";
import Alto from "@/public/correcciones/alto.png";
import Largo from "@/public/correcciones/largo.png";
import ProductosMolde from "@/public/correcciones/PRODUCTOSMOLDE.png";
import MoldesNivel from "@/public/correcciones/MOLDESNIVEL.png";
import LargoMolde from "@/public/correcciones/LARGOMOLDE.png";
import AlturaAjuste from "@/public/correcciones/ALTURAAJUSTE.png";
import AlturaMolde from "@/public/correcciones/ALTURAMOLDE.png";
import DisteNivel from "@/public/correcciones/DISTENIVEL.png";
import Peso from "@/public/equipos/Equipo_Robot1.png";

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
      texto: "CORRECCIÓN GUARDADO",
      dato: "null",
      icono: React.createElement(GoDotFill),
    },
    {
      id: 4,
      texto: "CORRECCIÓN BÚSQUEDA",
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
  const [selectedNivel, setSelectedNivel] = useState<TipoNivel>("ChG");
  const [torres, setTorres] = useState<Torre[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [nombreTorreActual, setNombreTorreActual] = useState<string>("");
  const [torresRefreshKey, setTorresRefreshKey] = useState(0);

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
    { id: 1, texto: "Corrección Búsqueda", dato: "0" },
    { id: 2, texto: "Corrección Guardado", dato: "0" },
  ]);

  const [datosCorrecionesNivelesChG, setDatosCorrecionesNivelesChG] = useState<
    DatoCorreccion[]
  >([]);

  const [datosCorrecionesNivelesChB, setDatosCorrecionesNivelesChB] = useState<
    DatoCorreccion[]
  >([]);

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
      const listaRecetas = await configuracionesApi.obtenerListaRecetas();
      const receta = listaRecetas.find(
        (r) => r.id_receta === parseInt(idReceta),
      );

      if (!receta) {
        throw new Error("Receta no encontrada");
      }

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
          texto: "CORRECCIÓN GUARDADO",
          dato: "Cargando...",
          icono: AlturaAjuste,
        },
        {
          id: 4,
          texto: "CORRECCIÓN BÚSQUEDA",
          dato: "Cargando...",
          icono: DisteNivel,
        },
      ]);
    } catch (error) {
      toast.error(`Error al cargar datos de la receta: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const cargarTorres = async (idReceta: string) => {
    try {
      const data = await configuracionesApi.obtenerListaTorres(idReceta);

      if (data && data.length > 0) {
        setTorres(data);
        setSelectedTorre(data[0].id_torre.toString());
        setNombreTorreActual(data[0].nombre_torre ?? "");
      } else {
        setTorres([]);
        setSelectedTorre(null);
      }
    } catch (error) {
      toast.error(`Error al cargar torres: ${error}`);
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
      const configuraciones = data.configuraciones ?? [];

      setNombreTorreActual(torre.nombre_torre ?? "");

      setDatosCorrecionesTorre([
        {
          id: 1,
          texto: "Corrección Búsqueda",
          dato: `${torre.correccion_busqueda ?? "0"}`,
        },
        {
          id: 2,
          texto: "Corrección Guardado",
          dato: `${torre.correccion_guardado ?? "0"}`,
        },
      ]);

      const chgItems = configuraciones
        .filter((c) => c.tipo === "ChG")
        .sort((a, b) => a.nivel - b.nivel)
        .map((c) => ({
          id: c.nivel,
          texto: `Nivel ${c.nivel}`,
          dato: `${c.valor}`,
        }));

      const chbItems = configuraciones
        .filter((c) => c.tipo === "ChB")
        .sort((a, b) => a.nivel - b.nivel)
        .map((c) => ({
          id: c.nivel,
          texto: `Nivel ${c.nivel}`,
          dato: `${c.valor}`,
        }));

      setDatosCorrecionesNivelesChG(chgItems);
      setDatosCorrecionesNivelesChB(chbItems);

      setDatosRecetas2((prev) =>
        prev.map((dato) => {
          if (dato.id === 3) {
            return {
              ...dato,
              dato: `${torre.correccion_guardado ?? "N/A"}`,
            };
          }
          if (dato.id === 4) {
            return {
              ...dato,
              dato: `${torre.correccion_busqueda ?? "N/A"}`,
            };
          }
          return dato;
        }),
      );

      toast.success("Datos de torre cargados correctamente");
    } catch (error) {
      toast.error(`Error al cargar datos de la torre: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (!canMakeApiCalls || initialized) return;

      try {
        setLoading(true);
        const recetasData = await configuracionesApi.obtenerListaRecetas();

        if (recetasData && recetasData.length > 0) {
          const primeraReceta = recetasData[0].id_receta.toString();
          setSelectedReceta(primeraReceta);
          setInitialized(true);
        }
      } catch (error) {
        toast.error(`Error al cargar la lista de recetas: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, [canMakeApiCalls, initialized]);

  useEffect(() => {
    if (canMakeApiCalls && selectedReceta) {
      cargarDatosReceta(selectedReceta);
      cargarTorres(selectedReceta);
    }
  }, [selectedReceta, canMakeApiCalls]);

  useEffect(() => {
    if (canMakeApiCalls && selectedTorre && selectedReceta) {
      cargarDatosTorre(selectedTorre);
    }
  }, [selectedTorre, selectedReceta, canMakeApiCalls]);

  const obtenerDatosActuales = () => {
    if (selectedOption === 1) return datosCorrecionesTorre;

    if (selectedNivel === "ChB") return datosCorrecionesNivelesChB;
    return datosCorrecionesNivelesChG;
  };

  const handlers = {
    handleRecetaChange: (receta: string) => {
      setSelectedReceta(receta);
    },

    handleTorreChange: (torre: string) => {
      setSelectedTorre(torre);
      const found = torres.find((t) => t.id_torre.toString() === torre);
      if (found) setNombreTorreActual(found.nombre_torre);
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
        setTorresRefreshKey((k) => k + 1);
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
    nombreTorreActual,
    torresRefreshKey,
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
