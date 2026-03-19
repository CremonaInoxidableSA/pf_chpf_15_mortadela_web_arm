"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { format, eachDayOfInterval } from "date-fns";
import { useTranslation } from "react-i18next";
import mockData from "@/data/mock/productividad.json";
import { createCiclosConfig } from "./configTorres";

Chart.register(...registerables);

interface GraficoCiclosProps {
  dateRange?: { from: Date; to: Date };
}

const GraficoCiclos: React.FC<GraficoCiclosProps> = ({ dateRange }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const { labels, ciclosPorDia, toneladasPorDia } = useMemo(() => {
    if (!dateRange)
      return { labels: [], ciclosPorDia: [], toneladasPorDia: [] };

    const days = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    const labels = days.map((d) => format(d, "dd/MM"));

    const ciclosPorDia = days.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      return mockData.filter((e) => e.fecha === dateStr).length;
    });

    const toneladasPorDia = days.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      return mockData
        .filter((e) => e.fecha === dateStr)
        .reduce((acc, e) => acc + e.toneladas, 0);
    });

    return { labels, ciclosPorDia, toneladasPorDia };
  }, [dateRange]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    chartRef.current?.destroy();
    chartRef.current = null;

    const config = createCiclosConfig(labels, ciclosPorDia, toneladasPorDia, {
      ciclos: t("mayus.ciclos"),
      toneladas: t("mayus.toneladas"),
      fecha: t("mayus.fecha"),
    });
    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, ciclosPorDia, toneladasPorDia]);

  return (
    <div className="h-75">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GraficoCiclos;
