"use client";

import { CameraGrid } from "@/components/cameras";
import { NetworkProvider } from "@/context/NetworkContext";
import { useTranslation } from "react-i18next";

export default function Camaras() {
  const { t } = useTranslation();

  return (
    <NetworkProvider>
      <div className="w-full h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-texto">
            {t("mayus.camaras")}
          </h1>
          <p className="text-sm text-texto2">
            {t("min.monitoreoTiempoReal")} - 8{" "}
            {t("cameras.camera").toLowerCase()}s
          </p>
        </div>
        <div className="flex-1">
          <CameraGrid columns={4} />
        </div>
      </div>
    </NetworkProvider>
  );
}
