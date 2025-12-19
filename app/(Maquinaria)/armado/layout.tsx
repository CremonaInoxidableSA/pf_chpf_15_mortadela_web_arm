import DatosLateralesArmado from "./datosLateralesArmado";

export default function ArmadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <aside className="w-72 bg-background2 p-4 hidden md:block">
        <DatosLateralesArmado />
      </aside>
      <section className="flex-1 p-4">{children}</section>
    </div>
  );
}
