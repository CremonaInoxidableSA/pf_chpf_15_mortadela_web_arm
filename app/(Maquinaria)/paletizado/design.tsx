import Image from "next/image";

import PaletizadoDesign from "@/public/designs/Armado.png";

export default function DatosLateralesPaletizado() {
  return (
    <div className="bg-background2 p-4 rounded-md">
      <Image src={PaletizadoDesign} alt="Diseño de máquina de armado" />
    </div>
  );
}
