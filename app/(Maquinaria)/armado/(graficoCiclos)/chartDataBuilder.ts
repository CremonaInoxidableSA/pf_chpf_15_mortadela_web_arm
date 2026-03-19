import { format, eachDayOfInterval } from "date-fns";
import mockData from "@/data/mock/productividad.json";

// One colour per product name (stable order)
const COLORS = [
  "rgba(255,87,51,1)",
  "rgba(51,255,87,1)",
  "rgba(51,87,255,1)",
  "rgba(243,51,255,1)",
  "rgba(255,51,166,1)",
  "rgba(51,255,245,1)",
  "rgba(255,154,51,1)",
  "rgba(51,255,189,1)",
  "rgba(255,51,51,1)",
  "rgba(166,51,255,1)",
];

const COLORS_BG = COLORS.map((c) => c.replace(",1)", ",0.4)"));

export interface DayProductEntry {
  ciclos: number;
  toneladas: number;
  tiempo: string; // HH:MM:SS total
}

export interface DayEntry {
  [product: string]: DayProductEntry;
}

/** Pre-aggregated data indexed by date string then product name */
export type AggregatedData = Record<string, DayEntry>;

export interface ChartBuildResult {
  /** X-axis labels: dd/MM */
  labels: string[];
  /** Sorted product names */
  products: string[];
  /** Per-product colour (solid) */
  colors: string[];
  /** Per-product fill colour */
  colorsBg: string[];
  /** aggregatedData[dateStr][product] */
  aggregated: AggregatedData;
  /** datasets[i].data[j] = toneladas for product i on day j */
  toneladasByProduct: number[][];
}

export function buildChartData(dateRange: {
  from: Date;
  to: Date;
}): ChartBuildResult {
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  const labels = days.map((d) => format(d, "dd/MM"));

  // Collect all products that appear in the range
  const fromStr = format(dateRange.from, "yyyy-MM-dd");
  const toStr = format(dateRange.to, "yyyy-MM-dd");
  const filtered = mockData.filter(
    (e) => e.fecha >= fromStr && e.fecha <= toStr,
  );

  const productSet = new Set<string>();
  filtered.forEach((e) => productSet.add(e.nombre));
  const products = Array.from(productSet).sort();

  // Build aggregated map: dateStr -> product -> { ciclos, toneladas, tiempo }
  const aggregated: AggregatedData = {};
  for (const day of days) {
    const dateStr = format(day, "yyyy-MM-dd");
    aggregated[dateStr] = {};
    for (const prod of products) {
      aggregated[dateStr][prod] = { ciclos: 0, toneladas: 0, tiempo: "" };
    }
  }

  for (const entry of filtered) {
    const a = aggregated[entry.fecha][entry.nombre];
    a.ciclos += 1;
    a.toneladas += entry.toneladas;
    // Sum tiempo in seconds then back to HH:MM:SS
    const [h, m, s] = entry.tiempo.split(":").map(Number);
    const prevSecs = a.tiempo
      ? (() => {
          const [ph, pm, ps] = a.tiempo.split(":").map(Number);
          return ph * 3600 + pm * 60 + ps;
        })()
      : 0;
    const total = prevSecs + h * 3600 + m * 60 + s;
    const th = Math.floor(total / 3600);
    const tm = Math.floor((total % 3600) / 60);
    const ts = total % 60;
    a.tiempo = `${String(th).padStart(2, "0")}:${String(tm).padStart(2, "0")}:${String(ts).padStart(2, "0")}`;
  }

  // toneladas[productIdx][dayIdx]
  const toneladasByProduct = products.map((prod) =>
    days.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      return aggregated[dateStr][prod]?.toneladas ?? 0;
    }),
  );

  const assignedColors = products.map((_, i) => COLORS[i % COLORS.length]);
  const assignedColorsBg = products.map(
    (_, i) => COLORS_BG[i % COLORS_BG.length],
  );

  return {
    labels,
    products,
    colors: assignedColors,
    colorsBg: assignedColorsBg,
    aggregated,
    toneladasByProduct,
  };
}
