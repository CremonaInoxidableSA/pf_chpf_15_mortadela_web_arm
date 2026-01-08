import Image from "next/image";
import General from "@/public/designs/General.png";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-5 gap-5 w-full h-full">
      <h1 className="flex text-4xl w-full font-bold justify-center">
        {t("mayus.general")}
      </h1>
      <div className="flex items-center justify-center bg-background2 w-full rounded-md">
        <Image
          alt={t("mayus.general")}
          src={General}
          className="rounded-md p-5"
        />
      </div>
    </div>
  );
}
