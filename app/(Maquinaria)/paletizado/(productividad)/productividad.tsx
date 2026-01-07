"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductoRealizado {
  id_recetario: number;
  NombreProducto: string;
  cantidadCiclos: number;
  pesoTotal: number;
  tiempoTotal: string;
}

export interface ProductividadData {
  ProductosRealizados: ProductoRealizado[];
  PesoTotalCiclos: number;
  CantidadCiclosCorrectos: number;
}

interface ProductoVisual {
  nombre: string;
  peso: string;
  cantidadCiclos: number;
  porcentaje: string;
  color: string;
}

interface DatoMetrica {
  id: number;
  titulo: string;
  dato: ReactNode;
}

interface DateRange {
  start: string;
  end: string;
}

const colors: string[] = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F333FF",
  "#FF33A6",
  "#33FFF5",
  "#FF9A33",
  "#33FFBD",
  "#FF3333",
  "#A633FF",
  "#FFD933",
  "#33FFD4",
  "#A6FF33",
  "#337BFF",
  "#33FF76",
  "#FF3357",
  "#33FF8D",
  "#FF8633",
  "#FF33C5",
  "#33FFC5",
];

const getColorById = (id: number): string => {
  return colors[(id - 1) % colors.length];
};

const parseTimeToSeconds = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

const formatSecondsToHHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

const Productividad = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState<ProductividadData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: today,
    end: today,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDataUpdate = (
    newData: ProductividadData,
    startDate: string,
    endDate: string,
  ): void => {
    setData(newData);
    setDateRange({ start: startDate, end: endDate });
  };

  const cantidadCiclosF = isLoading
    ? t("min.cargando")
    : data?.CantidadCiclosCorrectos !== undefined
      ? data.CantidadCiclosCorrectos.toFixed(2)
      : t("min.cargando");

  const PesoTotalCiclos = isLoading
    ? t("min.cargando")
    : data?.PesoTotalCiclos !== undefined
      ? data.PesoTotalCiclos.toFixed(2)
      : t("min.cargando");

  const Horas_Uso = isLoading
    ? t("min.cargando")
    : data?.ProductosRealizados && Array.isArray(data.ProductosRealizados)
      ? data.ProductosRealizados.reduce(
          (acc, prod) => acc + parseTimeToSeconds(prod.tiempoTotal),
          0,
        )
      : t("min.cargando");

  const cantDias =
    dateRange.start && dateRange.end
      ? (new Date(dateRange.end).getTime() -
          new Date(dateRange.start).getTime()) /
          (1000 * 60 * 60 * 24) +
        1
      : 1;

  const Promedio_Horas = (
    horasUso: number | string,
    cantDias: number,
  ): string =>
    horasUso !== t("min.cargando")
      ? formatSecondsToHHMM((horasUso as number) / cantDias)
      : t("min.cargando");

  const datos: DatoMetrica[] = [
    { id: 1, titulo: t("min.torrescantidad"), dato: cantidadCiclosF },
    {
      id: 2,
      titulo: t("min.productoRealizado"),
      dato: (
        <>
          {PesoTotalCiclos} <span className="text-lg">Tn</span>
        </>
      ),
    },
    {
      id: 3,
      titulo: t("min.promedioUsoDiario"),
      dato: (
        <>
          {Promedio_Horas(Horas_Uso, cantDias)}{" "}
          <span className="text-lg">hh:mm</span>
        </>
      ),
    },
  ];

  const productos: ProductoVisual[] = isLoading
    ? []
    : (data?.ProductosRealizados?.map((producto) => {
        const porcentaje = data.PesoTotalCiclos
          ? (producto.pesoTotal * 100) / data.PesoTotalCiclos / 1000
          : 0;
        const pesoEnToneladas = (producto.pesoTotal / 1000).toFixed(1) + "Tn";

        return {
          nombre: producto.NombreProducto,
          peso: pesoEnToneladas,
          cantidadCiclos: producto.cantidadCiclos,
          porcentaje: porcentaje.toFixed(2),
          color: getColorById(producto.id_recetario),
        };
      }) ?? []);

  return (
    <div
      className="flex flex-col-reverse md:flex-row gap-5"
      id="ProductividadSection"
    >
      <div className="w-full md:w-[78%] flex flex-col bg-background2 rounded-md p-5 relative">
        <p className="text-left text-xl font-bold mb-[-5]">
          {t("mayus.productividad")}
        </p>
        <div className="flex items-center">
          <p className="inline text-[#ffa500] font-system-ui text-md">
            {dateRange.start}
            <span className="inline px-1.25 font-semibold"> - </span>
            {dateRange.end}
          </p>
        </div>
        <div className="flex justify-between w-full px-12.5">
          {datos.map((dato, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <p className="text-[2.5vw] font-semibold">{dato.dato}</p>
              <p className="text-[1vw] text-texto2">{dato.titulo}</p>
            </div>
          ))}
        </div>
        <hr className="border-t-4 border-texto rounded-md mx-auto my-5 w-4/5" />
        <div className="relative">
          <p>% {t("min.productoRealizado")}</p>
          <div className="flex h-5 rounded-md overflow-hidden bg-background5 mb-3.75">
            {productos.map((producto, index) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TooltipContent>
                    <div
                      className="h-full"
                      style={{
                        width: `${producto.porcentaje}%`,
                        backgroundColor: producto.color,
                      }}
                    />
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            ))}
          </div>
          <div className="flex justify-around flex-wrap">
            {productos.map((producto, index) => (
              <div key={index} className="flex items-center m-[5px_10px]">
                <p
                  className="w-3.75 h-3.75 rounded-md mr-1.25"
                  style={{ backgroundColor: producto.color }}
                />
                <p>{`${producto.nombre} - ${producto.porcentaje}% (${producto.peso})`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-[22%] flex flex-col gap-5 ocultar-en-pdf"></div>
    </div>
  );
};

export default Productividad;
