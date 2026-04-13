"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { type DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import ArmadoDesign from "./(comp)/design";
import SectorProductividad from "./(productividad)/sectorProductividad";
import GraficoProductos from "./(graficoProductos)/graficoProductos";
import DatosLateralesArmado from "./(comp)/datosLateralesArmado";

const getPreviousWeekRange = (): DateRange => {
  const prevWeek = subWeeks(new Date(), 1);
  return {
    from: startOfWeek(prevWeek, { weekStartsOn: 0 }),
    to: endOfWeek(prevWeek, { weekStartsOn: 0 }),
  };
};

export default function Armador() {
  const { t } = useTranslation();
  const [appliedRange, setAppliedRange] =
    useState<DateRange>(getPreviousWeekRange);

  const handleApply = (range: DateRange | undefined) => {
    if (range?.from && range?.to) setAppliedRange(range);
  };

  const rangeLabel =
    appliedRange.from && appliedRange.to
      ? `${format(appliedRange.from, "dd/MM/yyyy")} - ${format(appliedRange.to, "dd/MM/yyyy")}`
      : "-";

  const chartRange =
    appliedRange.from && appliedRange.to
      ? { from: appliedRange.from, to: appliedRange.to }
      : undefined;

  return (
    <>
      <DatosLateralesArmado />
      <div className="flex-1 min-w-0 flex flex-col gap-4 p-4 ml-67.5">
        <section id="section1">
          <ArmadoDesign />
        </section>
        <section id="section2">
          <SectorProductividad dateRange={appliedRange} onApply={handleApply} />
        </section>
        <section id="section3" className="flex flex-col gap-5">
          <div className="p-5 bg-background2 rounded-md">
            <h1 className="text-2xl font-bold">
              {t("mayus.productosRealizadosGrafico")}
            </h1>
            <h2 className="text-orange">{rangeLabel}</h2>
            <GraficoProductos dateRange={chartRange} />
          </div>
        </section>
      </div>
    </>
  );
}
