import Image from "next/image";

import ArmadoDesign from "@/public/designs/Armado.png";

export default function DatosLateralesArmado() {
  return (
    <div className="bg-background2 p-4 rounded-md">
      <Image src={ArmadoDesign} alt="Diseño de máquina de armado" />
    </div>
  );
}
