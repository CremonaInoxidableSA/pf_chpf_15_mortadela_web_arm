"use client";

import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Productividad from "./productividad";
import DateRangePicker from "./dateRangePicker";
import { DateRange } from "hls.js";

const sectorProductividad = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex gap-5" id="ProductividadSection">
      <Productividad />
      <DateRangePicker />
    </div>
  );
};

export default sectorProductividad;
