import type { ChartConfiguration, ChartDataset } from "chart.js";

export function createCiclosConfig(
  labels: string[],
  datasets: ChartDataset<"line", number[]>[],
): ChartConfiguration<"line", number[], string> {
  return {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: "Mes" } },
        y: { beginAtZero: true, title: { display: true, text: "Cantidad" } },
      },
    },
  };
}
