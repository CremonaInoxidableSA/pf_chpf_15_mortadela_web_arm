import Image from "next/image";

import DesarmadoDesign from "@/public/designs/Armado.png";

export default function DatosLateralesDesarmado() {
  return (
    <div className="bg-background2 p-4 rounded-md">
      <Image src={DesarmadoDesign} alt="Diseño de máquina de armado" />
    </div>
  );
}
