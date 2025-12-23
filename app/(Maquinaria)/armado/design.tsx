import Image from "next/image";

import ArmadoDesign from "@/public/designs/Armado.png";

export default function DatosLateralesArmado() {
  return (
    <div className="h-full w-full bg-background2 p-1.25">
      <Image
        src={ArmadoDesign}
        alt="Diseño de máquina de armado"
      />
    </div>
  );
}
