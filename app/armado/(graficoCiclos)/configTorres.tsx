import type { ChartConfiguration, ChartDataset } from "chart.js";
import type { ChartBuildResult } from "./chartDataBuilder";

export function createCiclosConfig(
  {
    labels,
    products,
    colors,
    colorsBg,
    toneladasByProduct,
    aggregated,
  }: ChartBuildResult,
  i18n: { toneladas: string; fecha: string; ciclos: string; tiempo: string },
): ChartConfiguration<"line", number[], string> {
  const datasets: ChartDataset<"line", number[]>[] = products.map(
    (prod, i) => ({
      label: prod,
      data: toneladasByProduct[i],
      borderColor: colors[i],
      backgroundColor: colorsBg[i],
      fill: false,
      tension: 0.3,
      pointRadius: 4,
    }),
  );

  return {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label(ctx) {
              const prod = ctx.dataset.label ?? "";
              const dayLabel = ctx.label; // dd/MM
              // find the dateStr that matches this label
              const dateStr = Object.keys(aggregated).find((k) => {
                const [y, m, d] = k.split("-");
                return `${d}/${m}` === dayLabel;
              });
              if (!dateStr) return `${prod}: ${ctx.parsed.y} ${i18n.toneladas}`;
              const entry = aggregated[dateStr][prod];
              if (!entry || entry.ciclos === 0)
                return `${prod}: 0 ${i18n.toneladas}`;
              return [
                prod,
                `${i18n.ciclos}: ${entry.ciclos}`,
                `${i18n.toneladas}: ${entry.toneladas.toFixed(2)} Tn`,
                `${i18n.tiempo}: ${entry.tiempo}`,
              ];
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: i18n.fecha } },
        y: {
          beginAtZero: true,
          title: { display: true, text: i18n.toneladas },
        },
      },
    },
  };
}
