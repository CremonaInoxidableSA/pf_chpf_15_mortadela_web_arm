import type { ChartConfiguration } from "chart.js";

interface CiclosLabels {
  ciclos: string;
  toneladas: string;
  fecha: string;
}

export function createCiclosConfig(
  labels: string[],
  ciclos: number[],
  toneladas: number[],
  i18n: CiclosLabels,
): ChartConfiguration<"line", number[], string> {
  return {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: i18n.ciclos,
          data: ciclos,
          borderColor: "rgba(239, 130, 37, 1)",
          backgroundColor: "rgba(255, 136, 34, 0.4)",
          tension: 0.1,
          yAxisID: "yCiclos",
        },
        {
          label: i18n.toneladas,
          data: toneladas,
          borderColor: "rgba(48, 160, 240, 1)",
          backgroundColor: "rgba(0, 102, 238, 0.33)",
          tension: 0.1,
          yAxisID: "yToneladas",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: i18n.fecha } },
        yCiclos: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          title: { display: true, text: i18n.ciclos },
        },
        yToneladas: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          title: { display: true, text: i18n.toneladas },
          grid: { drawOnChartArea: false },
        },
      },
    },
  };
}
