"use client";

import type {
  DatoCorreccion,
  DatoReceta,
  Torre,
  TipoNivel,
} from "@/types/configuraciones";

import React from "react";
import { toast } from "sonner";

import SelectTorre from "./SelectTorre";
import SelectNivel from "./SelectNivel";
import BotonAplicar2 from "./BotonAplicar2";
import BotonRefresh from "./BotonRefresh";

import { configuracionesApi } from "@/services/configuracionesApi";
import { validacionesConfiguraciones } from "@/utils/configuraciones/validaciones";

interface CorreccionesSectionProps {
  selectedOption: number;
  selectedNivel: TipoNivel;
  selectedTorre: string | null;
  selectedReceta: string;
  datosActuales: DatoCorreccion[];
  loading: boolean;
  isButtonDisabled: boolean;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  datosGeneralesIzq: DatoReceta[];

  handleOptionChange: (option: number) => void;
  handleNivelChange: (nivel: TipoNivel) => void;
  handleTorreChange: (torre: string) => void;
  handleTorresChange: (torres: Torre[]) => void;
  validarTAGDuplicado: (value: string) => string;
  refreshData: () => void;
}

const opcionesCorrecciones = [
  { id: 1, nombre: "TORRE" },
  { id: 2, nombre: "NIVEL" },
];

const CorreccionesSection: React.FC<CorreccionesSectionProps> = ({
  selectedOption,
  selectedNivel,
  selectedTorre,
  selectedReceta,
  datosActuales,
  loading,
  isButtonDisabled,
  inputRefs,
  datosGeneralesIzq,
  handleOptionChange,
  handleNivelChange,
  handleTorreChange,
  handleTorresChange,
  validarTAGDuplicado,
  refreshData,
}) => {
  // Función para limpiar los inputs después de aplicar cambios
  const limpiarInputs = () => {
    if (inputRefs.current) {
      inputRefs.current.forEach((input) => {
        if (input) {
          input.value = "";
        }
      });
    }
  };

  const handleAplicarTorre = async () => {
    const inputValues = validacionesConfiguraciones.procesarValoresInput(
      inputRefs.current || [],
      2,
    );

    const finalData = {
      id_torre: parseInt(selectedTorre!, 10),
      correccion_busqueda:
        typeof inputValues[0] === "number" ? inputValues[0] : null,
      correccion_guardado:
        typeof inputValues[1] === "number" ? inputValues[1] : null,
      actualizar_tag: "",
    };

    const intentarEnvio = async (reintentos: number = 5) => {
      for (let i = 1; i <= reintentos; i++) {
        try {
          await configuracionesApi.enviarDatosTorre(finalData, i);
          limpiarInputs();
          refreshData();

          return;
        } catch {
          if (i === reintentos) {
            toast.error("Error al enviar los datos de la torre", {
              position: "bottom-center",
            });
          }
        }
      }
    };

    intentarEnvio();
  };

  const handleAplicarNiveles = async () => {
    const cantidadNiveles = datosActuales.length;
    const inputValues = validacionesConfiguraciones.procesarValoresInput(
      inputRefs.current || [],
      cantidadNiveles,
    );

    const correcciones: Record<string, number | null> = {};

    for (let i = 1; i <= 12; i++) {
      const inputIdx = i - 1;
      correcciones[`correccion${i}`] =
        inputIdx < cantidadNiveles && typeof inputValues[inputIdx] === "number"
          ? (inputValues[inputIdx] as number)
          : null;
    }

    const finalData = {
      id_torre: parseInt(selectedTorre!, 10),
      tipo: selectedNivel,
      ...correcciones,
    };

    try {
      await configuracionesApi.enviarDatosNiveles(finalData);
      limpiarInputs();
      refreshData();
    } catch {
      toast.error("Error al enviar los datos de niveles", {
        position: "bottom-center",
      });
    }
  };

  const handleAplicarReset = async (index: number) => {
    const correcciones: Record<string, number | null> = {};

    for (let i = 1; i <= 12; i++) {
      correcciones[`correccion${i}`] = i === index + 1 ? 0 : null;
    }

    const datos = {
      id_torre: parseInt(selectedTorre!, 10),
      tipo: selectedNivel,
      ...correcciones,
    };

    try {
      await configuracionesApi.resetearFallasNivel(datos);
      refreshData();
    } catch {
      toast.error("Error al resetear la falla", {
        position: "bottom-center",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(".")) {
      e.target.value = e.target.value.split(".")[0];
    }
  };

  const renderListaItems = () => {
    if (selectedOption === 2) {
      return (
        <>
          <ul
            className="rounded-lg h-full grid gap-5"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            {datosActuales.map(({ id, texto, dato }, index) => (
              <li
                key={id}
                className={`bg-background3 p-2 rounded-lg flex flex-col ${
                  index === datosActuales.length - 1 &&
                  datosActuales.length % 2 !== 0
                    ? "col-span-2"
                    : ""
                }`}
              >
                <label className="flex flex-col w-full">
                  <p className="w-full">{texto}</p>
                  <p className="flex flex-row items-center w-full gap-2">
                    {dato}
                    -
                    <input
                      ref={(el) => {
                        if (inputRefs.current) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      className="bg-background4 rounded-lg px-2 w-full"
                      pattern="\d+"
                      type="number"
                      onInput={(e) =>
                        handleInputChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                        )
                      }
                    />
                  </p>
                </label>
              </li>
            ))}
          </ul>
          <div className="col-span-2 flex flex-col gap-2">
            <BotonAplicar2 className="p-2" onClick={handleAplicarNiveles} />
            <BotonRefresh className="p-2" onClick={refreshData} />
          </div>
        </>
      );
    } else if (selectedOption === 1) {
      return (
        <ul className="flex flex-col rounded-lg h-full justify-between">
          {datosActuales.map(({ id, texto, dato }, index) => (
            <li
              key={id}
              className="bg-background3 p-2 rounded-lg flex flex-col"
            >
              <p>{texto}</p>
              <div className="flex flex-row items-center gap-2">
                {dato}
                -
                <input
                  ref={(el) => {
                    if (inputRefs.current) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  className="bg-background4 rounded-lg w-full px-2"
                  pattern="\d+"
                  type="number"
                  onInput={(e) =>
                    handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                />
              </div>
            </li>
          ))}
          <div className="col-span-2 flex flex-col gap-2">
            <BotonAplicar2
              className="p-2"
              isDisabled={isButtonDisabled}
              onClick={handleAplicarTorre}
            />
            <BotonRefresh className="p-2" onClick={refreshData} />
          </div>
        </ul>
      );
    }
  };

  return (
    <div className="bg-background2 flex-1 p-5 rounded-lg h-full flex flex-col gap-5 w-2/4">
      <p className="text-xl font-semibold">CORRECCIONES</p>
      <ul className="flex flex-row justify-between w-full gap-5">
        {opcionesCorrecciones.map(({ id, nombre }) => (
          <li key={id} className="flex flex-col flex-1">
            <button
              className={`flex flex-col rounded-sm transition-all p-2 ${
                selectedOption === id ? "bg-blue text-white" : "bg-background3"
              }`}
              onClick={() => handleOptionChange(id)}
            >
              <p className="flex justify-center text-center">{nombre}</p>
              {id === 1 && (
                <SelectTorre
                  disabled={loading || datosGeneralesIzq[0].dato === "null"}
                  refreshTorres={() => {}}
                  refreshTorres2={() => {}}
                  selectedReceta={selectedReceta}
                  selectedTorre={selectedTorre}
                  onChange={handleTorreChange}
                  onTorresChange={handleTorresChange}
                />
              )}
              {id === 2 && (
                <SelectNivel
                  disabled={loading || datosGeneralesIzq[0].dato === "null"}
                  onChange={handleNivelChange}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      {renderListaItems()}
    </div>
  );
};

export default CorreccionesSection;
