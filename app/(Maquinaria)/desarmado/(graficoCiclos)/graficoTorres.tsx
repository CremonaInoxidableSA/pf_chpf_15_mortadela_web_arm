"use client";

import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { labels, datasets } from "./dataTorres";
import { createCiclosConfig } from "./configTorres";

Chart.register(...registerables);

const GraficoCiclos: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const config = createCiclosConfig(labels, datasets);

    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="h-75">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GraficoCiclos;
