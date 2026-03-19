"use client";

import ArmadoDesign from "./design";
import Productividad from "./(productividad)/sectorProductividad";
import GraficoCiclos from "./(graficoCiclos)/graficoTorres";
import GraficoProductos from "./(graficoProductos)/graficoProductos";
import DatosLateralesArmado from "./datosLateralesArmado";

export default function Armado() {
  return (
    <>
      <DatosLateralesArmado />
      <div className="flex flex-col gap-4 p-4 ml-67.5">
        <section id="section1">
          <ArmadoDesign />
        </section>
        <section id="section2">
          <Productividad />
        </section>
        <section id="section3" className="flex flex-col gap-5">
          <div className="p-5 bg-background2 rounded-md">
            <h1 className="text-2xl font-bold">Torres por dia</h1>
            <h2 className="text-orange">23/11/2025 - 23/12/2025</h2>
            <GraficoCiclos />
          </div>

          <div className="p-5 bg-background2 rounded-md">
            <h1 className="text-2xl font-bold">Productos Realizados</h1>
            <h2 className="text-orange">23/11/2025 - 23/12/2025</h2>
            <GraficoProductos />
          </div>
        </section>
      </div>
    </>
  );
}
