"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BiReceipt } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { BiCabinet } from "react-icons/bi";
import { GrResources } from "react-icons/gr";
import { TbBowl } from "react-icons/tb";
import { FaWeightHanging } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { MdPrecisionManufacturing } from "react-icons/md";

interface NavOption {
  id: number;
  nombre: string;
}

interface DatoTiempoReal {
  id: number;
  nombre: string;
  dato: string | number | null;
  icono: React.ElementType;
  isReactIcon?: boolean;
}

const DatosLaterales: React.FC = () => {
  const { t } = useTranslation();

  const idRecetaProxima = 1;
  const CodigoProducto = 2;
  const TotalNiveles = 3;
  const TipoMolde = 4;
  const estadoMaquina: "CICLO ACTIVO" | "CICLO INACTIVO" = "CICLO ACTIVO";
  const PesoPorNivel = 6;
  const TiempoTranscurrido: string = "00:15 mm:ss";
  const sdda_nivel_actual = 8;
  const NGripperActual = 9;
  const PesoActualDesmoldado = 10;
  const TorreActual = 11;

  const opcionesAlarma = useMemo<NavOption[]>(
    () => [
      { id: 1, nombre: t("mayus.layout") },
      { id: 2, nombre: t("mayus.productividad") },
    ],
    [t],
  );

  const datosTiempoReal: DatoTiempoReal[] = [
    {
      id: 1,
      nombre: t("min.recetaActual"),
      dato: CodigoProducto ?? null,
      icono: BiReceipt,
      isReactIcon: true,
    },
    {
      id: 2,
      nombre: t("min.nroMolde"),
      dato: TipoMolde ?? null,
      icono: TbBowl,
      isReactIcon: true,
    },
    {
      id: 3,
      nombre: t("min.nroGripperActual"),
      dato: NGripperActual ?? null,
      icono: MdPrecisionManufacturing,
      isReactIcon: true,
    },
    {
      id: 4,
      nombre: t("min.nroTorreActual"),
      dato: TorreActual ?? null,
      icono: BiCabinet,
      isReactIcon: true,
    },
    {
      id: 5,
      nombre: t("min.pesoFila"),
      dato: PesoPorNivel != null ? `${PesoPorNivel} kg` : null,
      icono: FaWeightHanging,
      isReactIcon: true,
    },
    {
      id: 6,
      nombre: t("min.pesoDesmoldado"),
      dato:
        estadoMaquina === "CICLO INACTIVO"
          ? "0 kg"
          : PesoActualDesmoldado != null
            ? `${PesoActualDesmoldado} kg`
            : null,
      icono: FaWeightHanging,
      isReactIcon: true,
    },
    {
      id: 7,
      nombre: t("min.torreNivelActual"),
      dato:
        sdda_nivel_actual != null && TotalNiveles != null
          ? `${sdda_nivel_actual}/${TotalNiveles}`
          : null,
      icono: GrResources,
      isReactIcon: true,
    },
    {
      id: 8,
      nombre: t("min.tiempoTranscurrido"),
      dato:
        TiempoTranscurrido != null
          ? TiempoTranscurrido === "0"
            ? "00:00 mm:ss"
            : TiempoTranscurrido
          : null,
      icono: FaRegClock,
      isReactIcon: true,
    },
    {
      id: 9,
      nombre: t("min.idProxReceta"),
      dato: idRecetaProxima ?? null,
      icono: PiChefHat,
      isReactIcon: true,
    },
  ];

  const [activeSection, setActiveSection] = useState<number>(1);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        let closestSection = null;
        let closestDistance = Infinity;

        opcionesAlarma.forEach(({ id }) => {
          const section = document.getElementById(`section${id}`);

          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            const offsetMargin = 200;
            const distanceFromTop = Math.abs(sectionTop);

            if (
              sectionTop < window.innerHeight + offsetMargin &&
              sectionBottom >= 0 - offsetMargin
            ) {
              if (distanceFromTop < closestDistance) {
                closestDistance = distanceFromTop;
                closestSection = id;
              }
            }
          }
        });

        if (closestSection) {
          setActiveSection(closestSection);
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [opcionesAlarma]);

  const handleScrollClick = (id: number) => {
    const section = document.getElementById(`section${id}`);

    if (section) {
      const offset = -133;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(id);
    }
  };

  return (
    <div className="fixed left-0 w-67.5 bg-background2 p-5 z-550 flex flex-col h-[calc(100vh-112px)] overflow-auto">
      <ul className="flex flex-col gap-2 list-none">
        {opcionesAlarma.map(({ id, nombre }) => (
          <li key={id} className="gap-2.5">
            <Link
              className={`block p-1.25 text-center  no-underline rounded-md font-semibold border ${
                activeSection === id
                  ? " border-blue bg-datosblueback hover:bg-datosbluebackhover"
                  : "bg-background3 hover:bg-background4 border-background6"
              }`}
              href={`#section${id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollClick(id);
              }}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="w-[98%] flex mx-auto my-5" />

      <div className="overflow-auto flex flex-col h-full gap-5">
        <p className="font-semibold block text-center justify-center text-lg">
          {t("mayus.datosGenerales")}
        </p>
        <ul className="flex flex-col gap-2" lang="es">
          {datosTiempoReal.map(({ id, nombre, dato, icono }) => (
            <Link key={id} className="block" href="/desmoldeo/equipos">
              <li className="flex flex-row items-center justify-between border border-background6 bg-background3 rounded-md p-1.25">
                <p className="flex flex-col text-md font-bold">
                  {nombre}{" "}
                  {dato != null && <span className="text-sm">{dato}</span>}
                </p>
                {React.createElement(icono, { size: 24 })}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatosLaterales;
