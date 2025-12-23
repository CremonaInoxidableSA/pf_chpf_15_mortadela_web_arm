import ArmadoDesign from "./design";
import Productividad from "./(productividad)/productividad";
import GraficoCiclos from "./(graficoCiclos)/graficoTorres";
import GraficoProductos from "./(graficoProductos)/graficoProductos";

export default function Armado() {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <ArmadoDesign />
      </section>
      <section>
        <Productividad />
      </section>
      <section className="flex flex-col gap-5">
        <div className="p-5 bg-background2 rounded-lg">
          <h1 className="text-2xl font-bold">Torres por dia</h1>
          <h2 className="text-orange">23/11/2025 - 23/12/2025</h2>
          <GraficoCiclos />
        </div>

        <div className="p-5 bg-background2 rounded-lg">
          <h1 className="text-2xl font-bold">Productos Realizados</h1>
          <h2 className="text-orange">23/11/2025 - 23/12/2025</h2>
          <GraficoProductos />
        </div>
      </section>
    </div>
  );
}
