import type { ChartConfiguration, ChartDataset } from "chart.js";

export function createProductosConfig(
  labels: string[],
  datasets: ChartDataset<"bar", number[]>[]
): ChartConfiguration<"bar", number[], string> {
  return {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: "Producto" } },
        y: { beginAtZero: true, title: { display: true, text: "Ventas" } },
      },
    },
  };
}
