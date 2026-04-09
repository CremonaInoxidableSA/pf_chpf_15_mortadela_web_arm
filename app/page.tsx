"use client";
import Image from "next/image";
import General from "@/public/designs/General.png";
import DatosGeneral from "@/components/general/sectorDatosGeneral";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 p-5 w-full">
      <div className="flex bg-background2 w-full rounded-md p-5 gap-5">
        <div className="w-3/4 relative shrink-0">
          <Image
            alt={t("mayus.general")}
            src={General}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="w-full overflow-y-auto pr-2 h-full">
          <DatosGeneral />
        </div>
      </div>
    </div>
  );
}
