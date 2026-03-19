"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { useTranslation } from "react-i18next";
import { buildChartData } from "./chartDataBuilder";
import { createCiclosConfig } from "./configTorres";

Chart.register(...registerables);

interface GraficoCiclosProps {
  dateRange?: { from: Date; to: Date };
}

const GraficoCiclos: React.FC<GraficoCiclosProps> = ({ dateRange }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const chartData = useMemo(
    () => (dateRange ? buildChartData(dateRange) : null),
    [dateRange],
  );

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !chartData) return;

    chartRef.current?.destroy();
    chartRef.current = null;

    const config = createCiclosConfig(chartData, {
      ciclos: t("mayus.ciclos"),
      toneladas: t("mayus.toneladas"),
      fecha: t("mayus.fecha"),
      tiempo: t("mayus.tiempo"),
    });
    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartData, t]);

  return (
    <div className="h-75">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GraficoCiclos;
