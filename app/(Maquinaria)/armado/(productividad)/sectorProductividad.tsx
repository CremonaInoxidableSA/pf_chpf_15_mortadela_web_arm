"use client";

import { useState } from "react";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { type DateRange } from "react-day-picker";
import Productividad from "./productividad";
import DateRangePicker from "./dateRangePicker";

const getPreviousWeekRange = (): DateRange => {
  const prevWeek = subWeeks(new Date(), 1);
  return {
    from: startOfWeek(prevWeek, { weekStartsOn: 0 }),
    to: endOfWeek(prevWeek, { weekStartsOn: 0 }),
  };
};

const SectorProductividad = () => {
  const [appliedRange, setAppliedRange] =
    useState<DateRange>(getPreviousWeekRange);

  const handleApply = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setAppliedRange(range);
    }
  };

  return (
    <div className="flex gap-5" id="ProductividadSection">
      <Productividad
        dateRange={
          appliedRange.from && appliedRange.to
            ? { from: appliedRange.from, to: appliedRange.to }
            : undefined
        }
      />
      <DateRangePicker onApply={handleApply} />
    </div>
  );
};

export default SectorProductividad;
