import type { ChartDataset } from "chart.js";

export const labels: string[] = [
  "Producto A",
  "Producto B",
  "Producto C",
  "Producto D",
];

export const datasets: ChartDataset<"bar", number[]>[] = [
  {
    label: "Ventas",
    data: [120, 90, 150, 60],
    backgroundColor: ["#4ade80", "#60a5fa", "#f472b6", "#f59e0b"],
  },
];

const chartData = { labels, datasets };
export default chartData;
