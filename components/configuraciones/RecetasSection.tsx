"use client";

import { BiReceipt } from "react-icons/bi";

import SelectConfiguracion from "./SelectConfiguracion";

import { DatoReceta } from "@/types/configuraciones";

interface RecetasSectionProps {
  datosGeneralesIzq: DatoReceta[];
  selectedReceta: string;
  loading: boolean;
  onRecetaChange: (receta: string) => void;
  onRecetaApply: () => void;
}

const RecetasSection: React.FC<RecetasSectionProps> = ({
  datosGeneralesIzq,
  loading,
  onRecetaChange,
  onRecetaApply,
}) => {
  return (
    <div className="flex flex-col w-1/4 h-full bg-background2 p-5 rounded-lg gap-5">
      <SelectConfiguracion
        disabled={loading}
        onChange={onRecetaChange}
        onClick={onRecetaApply}
      />
      <ul className="flex flex-col h-full justify-between w-full">
        {datosGeneralesIzq.map(({ id, texto, dato }) => (
          <li key={id} className="">
            <div className="flex flex-row bg-background3 items-center justify-between p-2 rounded-lg">
              <div className="flex flex-col">
                <p className="">{texto}</p>
                <p className="">
                  {dato === "null" || dato === undefined || dato === null
                    ? "null"
                    : dato}
                </p>
              </div>
              <BiReceipt className="flex h-[7%] w-[7%]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecetasSection;
