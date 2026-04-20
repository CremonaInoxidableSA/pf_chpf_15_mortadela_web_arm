import type { ChartConfiguration, ChartDataset } from "chart.js";
import type { ChartBuildResult } from "./chartDataBuilder";

export function createProductosConfig(
  {
    labels,
    products,
    colors,
    colorsBg,
    toneladasByProduct,
    aggregated,
  }: ChartBuildResult,
  i18n: { toneladas: string; fecha: string; ciclos: string; tiempo: string },
): ChartConfiguration<"bar", number[], string> {
  const datasets: ChartDataset<"bar", number[]>[] = products.map((prod, i) => ({
    label: prod,
    data: toneladasByProduct[i],
    backgroundColor: colorsBg[i],
    borderColor: colors[i],
    borderWidth: 1,
  }));

  return {
    type: "bar",
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
              const dayLabel = ctx.label;
              const dateStr = Object.keys(aggregated).find((k) => {
                const [m, d] = k.split("-");
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
        x: { stacked: true, title: { display: true, text: i18n.fecha } },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: i18n.toneladas },
        },
      },
    },
  };
}
