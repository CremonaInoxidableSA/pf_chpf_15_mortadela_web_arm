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
  const [selectedReceta, setSelectedReceta] = useState("1");
  const [selectedTorre, setSelectedTorre] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectedNivel, setSelectedNivel] = useState<TipoNivel>("HN");
  const [torres, setTorres] = useState<Torre[]>([]);

  const { targetAddress } = useApp();

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
    Array(11)
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
    Array(11)
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
    Array(11)
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
    Array(11)
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
    Array(11)
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
      const data: RecetaResponse =
        await configuracionesApi.obtenerDatosRecetas(idReceta);
      const receta = data.DatosRecetas[0];

      setDatosRecetas1([
        {
          id: 1,
          texto: "NUMERO DE GRIPPER",
          dato: receta.nroGripper?.toString() ?? "null",
          icono: NGripper,
        },
        {
          id: 2,
          texto: "TIPO DE MOLDE",
          dato: receta.tipoMolde ?? "null",
          icono: obtenerIconoTipoMolde(receta.tipoMolde || ""),
        },
        {
          id: 3,
          texto: "ANCHO DEL PRODUCTO",
          dato:
            receta.anchoProducto != null
              ? `${receta.anchoProducto} mm`
              : "null",
          icono: Ancho,
        },
        {
          id: 4,
          texto: "ALTO DEL PRODUCTO",
          dato:
            receta.altoProducto != null ? `${receta.altoProducto} mm` : "null",
          icono: Alto,
        },
        {
          id: 5,
          texto: "LARGO DEL PRODUCTO",
          dato:
            receta.largoProducto != null
              ? `${receta.largoProducto} mm`
              : "null",
          icono: Largo,
        },
        {
          id: 6,
          texto: "PESO DEL PRODUCTO",
          dato:
            receta.pesoProducto != null ? `${receta.pesoProducto} kg` : "null",
          icono: Peso,
        },
        {
          id: 7,
          texto: "MOLDES POR NIVEL",
          dato: receta.moldesNivel?.toString() ?? "null",
          icono: MoldesNivel,
        },
        {
          id: 8,
          texto: "PRODUCTOS POR MOLDE",
          dato: receta.productosMolde?.toString() ?? "null",
          icono: ProductosMolde,
        },
      ]);

      setDatosRecetas2([
        {
          id: 1,
          texto: "ALTURA DE MOLDE",
          dato: receta.altoMolde != null ? `${receta.altoMolde} mm` : "null",
          icono: AlturaMolde,
        },
        {
          id: 2,
          texto: "LARGO DE MOLDE",
          dato: receta.largoMolde != null ? `${receta.largoMolde} mm` : "null",
          icono: LargoMolde,
        },
        {
          id: 3,
          texto: "ALTURA AJUSTE",
          dato:
            receta.ajusteAltura != null ? `${receta.ajusteAltura} mm` : "null",
          icono: AlturaAjuste,
        },
        {
          id: 4,
          texto: "NIVELES POR TORRE",
          dato: receta.cantidadNiveles?.toString() ?? "null",
          icono: Niveles,
        },
        {
          id: 5,
          texto: "DELTA ENTRE NIVELES",
          dato:
            receta.deltaNiveles != null ? `${receta.deltaNiveles} mm` : "null",
          icono: DisteNivel,
        },
        {
          id: 6,
          texto: "ALTURA N1",
          dato: receta.n1Altura != null ? `${receta.n1Altura} mm` : "null",
          icono: AlturaN1,
        },
        {
          id: 7,
          texto: "ALTURA DE BASTIDOR",
          dato:
            receta.bastidorAltura != null
              ? `${receta.bastidorAltura} mm`
              : "null",
          icono: AlturaBastidor,
        },
        {
          id: 8,
          texto: "ALTURA AJUSTE N1",
          dato:
            receta.ajusteN1Altura != null
              ? `${receta.ajusteN1Altura} mm`
              : "null",
          icono: AlturaAjusteN1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cargarTorres = async (idReceta: string) => {
    const data = await configuracionesApi.obtenerListaTorres(idReceta);

    if (data.ListadoTorres) {
      setTorres(data.ListadoTorres);
      if (!selectedTorre && data.ListadoTorres.length > 0) {
        setSelectedTorre(data.ListadoTorres[0].id);
      }
    }
  };

  const cargarDatosTorre = async (idTorre: string) => {
    if (!idTorre) return;

    setLoading(true);
    try {
      const data: NivelesTorreResponse =
        await configuracionesApi.obtenerNivelesTorre(idTorre);

      setDatosCorrecionesTorre([
        {
          id: 1,
          texto: "Correccion_hBastidor",
          dato: data.DatosTorre?.hBastidor?.toString() ?? "0",
        },
        {
          id: 2,
          texto: "Correccion_hAjuste",
          dato: data.DatosTorre?.hAjuste?.toString() ?? "0",
        },
        {
          id: 3,
          texto: "Correccion_hAjusteN1",
          dato: data.DatosTorre?.hAjusteN1?.toString() ?? "0",
        },
        {
          id: 4,
          texto: "Correccion_DisteNivel",
          dato: data.DatosTorre?.DisteNivel?.toString() ?? "0",
        },
        {
          id: 5,
          texto: "ActualizarTAG",
          dato: data.DatosTorre?.ActualizarTAG ?? "",
        },
      ]);

      const actualizarNiveles = (
        datos: number[] | undefined,
        setter: React.Dispatch<React.SetStateAction<DatoCorreccion[]>>,
        prefijo: string,
      ) => {
        const nivelesArray = Array.isArray(datos) ? datos : [];

        setter(
          [...nivelesArray, ...Array(11 - nivelesArray.length).fill(null)].map(
            (dato, index) => ({
              id: index + 1,
              texto: `${prefijo}${index + 1}`,
              dato: dato?.toString() ?? "0",
            }),
          ),
        );
      };

      actualizarNiveles(
        data.DatosNivelesHN,
        setDatosCorrecionesNivelesHN,
        "Correcion_hN",
      );
      actualizarNiveles(
        data.DatosNivelesChG,
        setDatosCorrecionesNivelesChG,
        "Correccion_hguardado_N",
      );
      actualizarNiveles(
        data.DatosNivelesChB,
        setDatosCorrecionesNivelesChB,
        "Correccion_hbusqueda_N",
      );
      actualizarNiveles(
        data.DatosNivelesFallas,
        setDatosCorrecionesNivelesFA,
        "FallasN",
      );
      actualizarNiveles(
        data.DatosNivelesuHN,
        setDatosCorrecionesNivelesuHN,
        "ultimo_hNivel",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetAddress && selectedReceta) {
      cargarDatosReceta(selectedReceta);
      cargarTorres(selectedReceta);
    }
  }, [selectedReceta, targetAddress]);

  useEffect(() => {
    if (targetAddress && selectedTorre && selectedReceta) {
      cargarDatosTorre(selectedTorre);
    }
  }, [selectedTorre, selectedReceta, targetAddress]);

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
