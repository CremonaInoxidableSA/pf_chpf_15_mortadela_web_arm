"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { useTranslation } from "react-i18next";
import { buildChartData } from "./chartDataBuilder";
import { createProductosConfig } from "./configProductos";

Chart.register(...registerables);

interface GraficoProductosProps {
  dateRange?: { from: Date; to: Date };
}

const GraficoProductos: React.FC<GraficoProductosProps> = ({ dateRange }) => {
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

    const config = createProductosConfig(chartData, {
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

export default GraficoProductos;
