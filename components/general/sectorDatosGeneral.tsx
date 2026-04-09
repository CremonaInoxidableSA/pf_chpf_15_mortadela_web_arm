"use client";
import { useTranslation } from "react-i18next";

const DatosGeneral = {
  "Hola": "Hola",
  "Ejemplo": "Ejemplo",
  "Este es otro ejemplo": "Este es otro ejemplo",
  "Demasiados ejemplos": "Demasiados ejemplos",
  "Puedo poner mas ejemplos": "Puedo poner mas ejemplos",
  "Posta, mira": "Posta, mira",
  "Ejemplo 1": "Ejemplo 1",
  "Ejemplo 2": "Ejemplo 2",
  "Ejemplo 3": "Ejemplo 3",
  "Ejemplo 4": "Ejemplo 4",
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full overflow-y-auto">
      {Object.keys(DatosGeneral).map((key) => (
        <p
          className="text-lg py-1 px-3 w-full bg-background3 rounded-md"
          key={key}
        >
          {t(key)}
        </p>
      ))}
    </div>
  );
}
