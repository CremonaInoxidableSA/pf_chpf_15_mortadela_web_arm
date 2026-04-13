"use client";
import Image from "next/image";
import ARMADOR_D from "@/public/general/ARMADOR_D.png";
import ARMADOR_L from "@/public/general/ARMADOR_L.png";
import DatosGeneral from "@/components/general/sectorDatosGeneral";
import { useTranslation } from "react-i18next";
import { useThemeToggle } from "@/components/theme/themeToggleLogic";

export default function Home() {
  const { t } = useTranslation();
  const { theme } = useThemeToggle();

  const imageSource = theme === "dark" ? ARMADOR_D : ARMADOR_L;

  return (
    <div className="flex flex-col gap-5 p-5 w-full">
      <div className="flex bg-background2 w-full rounded-md p-5 gap-5">
        <div className="w-4/7 relative shrink-0">
          <Image
            alt={t("mayus.general")}
            src={imageSource}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="w-3/7 overflow-y-auto pr-2 h-full">
          <DatosGeneral />
        </div>
      </div>
    </div>
  );
}
