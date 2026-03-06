import type { ChartDataset } from "chart.js";

export const labels: string[] = ["Enero", "Feb", "Mar", "Abr", "May", "Jun"];

export const datasets: ChartDataset<"line", number[]>[] = [
  {
    label: "Ciclos",
    data: [12, 19, 3, 5, 2, 3],
    borderColor: "rgba(75,192,192,1)",
    backgroundColor: "rgba(75,192,192,0.2)",
    fill: true,
    tension: 0.4,
  },
];

const chartData = { labels, datasets };
export default chartData;
