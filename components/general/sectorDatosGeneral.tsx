"use client";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const DatosGeneral = {
  Hola: "Hola",
  Ejemplo: "Ejemplo",
  "Este es otro ejemplo": "Este es otro ejemplo",
  "Demasiados ejemplos": "Demasiados ejemplos",
  "Puedo poner mas ejemplos": "Puedo poner mas ejemplos",
  "Posta, mira": "Posta, mira",
  "Ejemplo 1": "Ejemplo 1",
  "Ejemplo 2": "Ejemplo 2",
  "Ejemplo 3": "Ejemplo 3",
  "Ejemplo 4": "Ejemplo 4",
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <div className="flex flex-row gap-5 w-full h-3/4">
        <div className="w-1/2 flex flex-col gap-5 overflow-y-auto z-10">
          {Object.keys(DatosGeneral).map((key) => (
            <p
              className="text-lg py-1 px-3 w-full bg-background3 rounded-md"
              key={key}
            >
              {t(key)}
            </p>
          ))}
        </div>
        <div className="w-1/2 flex items-center justify-center relative">
          <Image
            alt={t("mayus.general")}
            src={"/general/RACK.png"}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
      <div className="w-full h-1/4 bg-background3 rounded-md flex p-5">
        Hola Nigga
      </div>
    </div>
  );
}
