"use client";

import DatosLateralesArmado from "./datosLateralesArmado";

export default function ArmadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <aside className="w-67.5 bg-background2 p-4 hidden md:block">
        <DatosLateralesArmado />
      </aside>
      <section className="flex flex-col flex-1 p-4">{children}</section>
    </div>
  );
}
