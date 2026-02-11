"use client";

import { BiCabinet } from "react-icons/bi";

import { DatoReceta } from "@/types/configuraciones";

interface DatosGeneralesSectionProps {
  datosGeneralesDer: DatoReceta[];
}

const DatosGeneralesSection: React.FC<DatosGeneralesSectionProps> = ({
  datosGeneralesDer,
}) => {
  return (
    <div className="flex flex-col w-1/4 h-full bg-background2 p-5 rounded-lg gap-5">
      <p className="text-xl font-semibold">DATOS GENERALES</p>
      <ul className="flex flex-col h-full justify-between w-full">
        {datosGeneralesDer.map(({ id, texto, dato }) => (
          <li key={id} className="">
            <div className="flex flex-row bg-background3 items-center justify-between p-2 rounded-lg">
              {dato === "null" || dato === undefined || dato === null ? (
                <div className="flex flex-col">
                  <p className="">{texto}</p>
                  <p>null</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="">{texto}</p>
                  <p className="">{dato}</p>
                </div>
              )}
              <BiCabinet className="flex h-[7%] w-[7%]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatosGeneralesSection;
