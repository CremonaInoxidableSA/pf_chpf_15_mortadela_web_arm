import { useTranslation } from "react-i18next";

export default function DatosLateralesArmado() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-semibold mb-2">{t("mayus.armado")}</h3>
      <ul className="space-y-2 text-sm text-texto2">
        <li>• {t("min.home")}</li>
        <li>• Equipos</li>
        <li>• Producción</li>
      </ul>
    </div>
  );
}
