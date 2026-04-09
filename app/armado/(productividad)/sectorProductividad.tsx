"use client";

import { type DateRange } from "react-day-picker";
import Productividad from "./productividad";
import DateRangePicker from "./dateRangePicker";

interface SectorProductividadProps {
  dateRange: DateRange;
  onApply: (range: DateRange | undefined) => void;
}

const SectorProductividad = ({
  dateRange,
  onApply,
}: SectorProductividadProps) => {
  return (
    <div className="flex gap-5" id="ProductividadSection">
      <Productividad
        dateRange={
          dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        }
      />
      <DateRangePicker onApply={onApply} />
    </div>
  );
};

export default SectorProductividad;
