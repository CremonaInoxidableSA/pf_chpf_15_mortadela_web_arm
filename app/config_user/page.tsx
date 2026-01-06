"use client";

import { VscAccount } from "react-icons/vsc";
import { Button } from "@/components/ui/button";

export default function ConfiguracionUsuario() {
  return (
    <div className="w-full p-4 flex flex-row gap-4">
      <div className="h-full w-1/5 flex flex-col bg-background2 rounded-lg p-4 gap-4 self-stretch">
        <div className="flex w-full items-center justify-center">
          <VscAccount className="w-15 h-15" />
        </div>

        <div className="flex flex-col gap-5 text-left">
          <div>
            <p className="font-semibold text-xl">Nombre</p>
            <p>{"—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Apellido</p>
            <p>{"—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Email</p>
            <p>{"—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Rol</p>
            <p>{"—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Recibe Reportes</p>
            <p>{"—"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button className="w-full h-10 border border-botonredborder bg-botonred hover:bg-botonredhover text-botonredborder text-md">
            CREAR USUARIO
          </Button>
          <Button className="w-full h-10 border border-botonredborder bg-botonred hover:bg-botonredhover text-botonredborder text-md">
            IMPORTAR BDD
          </Button>
          <Button className="w-full h-10 border border-botonredborder bg-botonred hover:bg-botonredhover text-botonredborder text-md">
            EXPORTAR BDD
          </Button>
          <Button className="w-full h-10 border border-botonredborder bg-botonred hover:bg-botonredhover text-botonredborder text-md">
            GENERAR RECLAMO
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-full w-4/5">
        <p className="text-2xl w-full flex justify-center items-center">
          {" "}
          Lista de Usuarios{" "}
        </p>

        <div className="mt-4"></div>
      </div>
    </div>
  );
}
