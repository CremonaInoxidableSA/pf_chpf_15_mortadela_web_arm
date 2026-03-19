"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { CalendarIcon, FileDown, Sheet } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getPreviousWeekRange = (): DateRange => {
  const prevWeek = subWeeks(new Date(), 1);
  return {
    from: startOfWeek(prevWeek, { weekStartsOn: 0 }),
    to: endOfWeek(prevWeek, { weekStartsOn: 0 }),
  };
};

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  onApply?: (range: DateRange | undefined) => void;
  onDownloadPDF?: () => void;
  onDownloadExcel?: () => void;
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onApply,
  onDownloadPDF,
  onDownloadExcel,
}) => {
  const { t } = useTranslation();
  const [date, setDate] = React.useState<DateRange | undefined>(
    value ?? getPreviousWeekRange(),
  );

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange?.(range);
  };

  return (
    <div className="bg-background2 rounded-md p-5 flex flex-col gap-3 w-[25%]">
      <p className="text-left text-xl font-bold mb-[-5]">
        {t("mayus.rangoDeFechas")}
      </p>
      <div className="w-full h-full flex flex-col justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start px-3 font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span>{t("min.seleccionarFechas")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="flex flex-col w-fill h-[60%] justify-between">
          <Button onClick={() => onApply?.(date)} className="w-full">
            {t("min.aplicar")}
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownloadPDF?.()}
            className="w-full"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {t("min.descargarPDF")}
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownloadExcel?.()}
            className="w-full"
          >
            <Sheet className="mr-2 h-4 w-4" />
            {t("min.descargarExcel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePickerComponent;
