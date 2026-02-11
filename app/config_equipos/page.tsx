"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthProvider";
import { useConfiguracionData } from "@/hooks/configuraciones/useConfiguracionData";
import RecetasSection from "@/components/configuraciones/RecetasSection";
import DatosGeneralesSection from "@/components/configuraciones/DatosGeneralesSection";
import CorreccionesSection from "@/components/configuraciones/CorreccionesSection";

const Configuraciones = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const configuracionData = useConfiguracionData();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");

      return;
    }

    if (user.rol !== "admin" && user.rol !== "superadmin") {
      router.push("/completo");
    }
  }, [user, router]);

  if (
    !mounted ||
    !user ||
    (user.rol !== "admin" && user.rol !== "superadmin")
  ) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between gap-5 p-5 h-200 w-full">
      <RecetasSection
        datosGeneralesIzq={configuracionData.datosGeneralesIzq}
        loading={configuracionData.loading}
        selectedReceta={configuracionData.selectedReceta}
        onRecetaApply={() =>
          configuracionData.cargarDatosReceta(configuracionData.selectedReceta)
        }
        onRecetaChange={configuracionData.handleRecetaChange}
      />

      <DatosGeneralesSection
        datosGeneralesDer={configuracionData.datosGeneralesDer}
      />

      <CorreccionesSection
        datosActuales={configuracionData.datosActuales}
        datosGeneralesIzq={configuracionData.datosGeneralesIzq}
        handleNivelChange={configuracionData.handleNivelChange}
        handleOptionChange={configuracionData.handleOptionChange}
        handleTorreChange={configuracionData.handleTorreChange}
        handleTorresChange={configuracionData.handleTorresChange}
        inputRefs={configuracionData.inputRefs}
        isButtonDisabled={configuracionData.isButtonDisabled}
        loading={configuracionData.loading}
        refreshData={configuracionData.refreshData}
        selectedNivel={configuracionData.selectedNivel}
        selectedOption={configuracionData.selectedOption}
        selectedReceta={configuracionData.selectedReceta}
        selectedTorre={configuracionData.selectedTorre}
        validarTAGDuplicado={configuracionData.validarTAGDuplicado}
      />
    </div>
  );
};

export default Configuraciones;
