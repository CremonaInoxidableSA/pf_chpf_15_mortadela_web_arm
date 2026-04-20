"use client";
import { useTranslation } from "react-i18next";
import Rack from "./rack";
import { GoDotFill } from "react-icons/go";

const DatosGeneral = [
  { data: "rackActual", label: "NOMBRE DEL RACK", valor: "PF-1239-A2" },
  { data: "recetaActual", label: "TIPO DE CORTE", valor: "Mortadela Larga" },
  {
    data: "seleccionador",
    label: "ESTADO DEL SELECCIONADOR",
    valor: "ENTREGANDO PRODUCTO",
  },
  {
    data: "mesaEspera",
    label: "ESTADO DE LA MESA DE ESPERA",
    valor: "ENTREGANDO PRODUCTO",
  },
  {
    data: "tiempoTranscurrido",
    label: "TIEMPO TRANSCURRIDO",
    valor: "hh:mm:ss",
  },
];

const ActivoInactivo = [
  { label: "RACK ACTIVO", seleccionado: true },
  { label: "RACK FINALIZADO", seleccionado: false },
  { label: "RACK EN ESPERA CONFIRMADO", seleccionado: true },
  { label: "BANDA DE ENTRADA", seleccionado: false },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <div className="flex flex-row gap-5 w-full h-3/4">
        <div className="flex flex-col w-full h-full gap-5 overflow-y-auto z-10">
          <h1 className="text-xl font-bold">RACK ACTUAL EN TIEMPO REAL</h1>
          {DatosGeneral.map((item, index) => (
            <div
              key={index}
              className="
                flex flex-col flex-1 w-full justify-center py-1 px-3 bg-background3 rounded-md
                "
            >
              <p className="text-lg font-semibold w-full" key={index}>
                {t(item.label)}:
              </p>
              <p className="text-lg w-full">{item.valor}</p>
            </div>
          ))}
        </div>
        <Rack />
      </div>
      <div className="flex flex-col w-full h-1/4 bg-background3 rounded-md p-3 justify-between gap-2">
        <h1 className="w-full text-xl">ESTADO DEL RACK</h1>
        <div className="grid grid-cols-2 gap-2 flex-1 w-full">
          {ActivoInactivo.map((item, index) => (
            <div
              key={index}
              className="w-full bg-background4 rounded-md p-2 flex items-center"
            >
              <GoDotFill
                className={`aspect-square w-auto h-full ${item.seleccionado ? "text-green-500" : "text-gray-500"}`}
              />
              {t(item.label)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
