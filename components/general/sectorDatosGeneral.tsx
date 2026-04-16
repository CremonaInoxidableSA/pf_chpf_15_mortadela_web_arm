"use client";
import { useTranslation } from "react-i18next";
import Rack from "./rack";

const DatosGeneral = [
  { label: "NOMBRE DEL RACK", valor: "PF-1239-A2" },
  { label: "TIPO DE CORTE", valor: "Mortadela Larga" },
  { label: "ESTADO DEL SELECCIONADOR", valor: "ENTREGANDO PRODUCTO" },
  { label: "ESTADO DE LA MESA DE ESPERA", valor: "ENTREGANDO PRODUCTO" },
  { label: "TIEMPO TRANSCURRIDO", valor: "hh:mm:ss" },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <div className="flex flex-row gap-5 w-full h-3/4">
        <div className="flex flex-col w-full h-full gap-5 overflow-y-auto z-10">
          {DatosGeneral.map((item, index) => (
            <div
              key={index}
              className="flex flex-col flex-1 w-full justify-center py-1 px-3 bg-background3 rounded-md"
            >
              <p className="text-xl font-semibold w-full" key={index}>
                {t(item.label)}:
              </p>
              <p className="text-lg w-full">{item.valor}</p>
            </div>
          ))}
        </div>
        <Rack />
      </div>
      <div className="w-full h-1/4 bg-background3 rounded-md flex p-5">
        Hola Nigga
      </div>
    </div>
  );
}
