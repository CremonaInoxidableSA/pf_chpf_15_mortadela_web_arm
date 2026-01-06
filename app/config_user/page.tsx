"use client";

import { VscAccount } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

function getData(): Payment[] {
  // Fetch data from your API here or return mock data synchronously
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default function ConfiguracionUsuario() {
  const { nombre, apellido, email, rol, reporte } = useAuth();
  const data = getData();

  const getRoleName = (role?: string) => {
    const roleMap: Record<string, string> = {
      superadmin: "Super Administrador",
      admin: "Administrador",
      user: "Usuario",
    };
    return (role && roleMap[role]) || role || "—";
  };

  const fullname = `${nombre ?? ""}${nombre || apellido ? " " : ""}${apellido ?? ""}`.trim();

  return (
    <div className="w-full p-4 flex flex-row gap-4">
      <div className="h-full w-1/5 flex flex-col bg-background2 rounded-lg p-4 justify-between self-stretch">
        <div className="flex w-full items-center justify-center">
          <VscAccount className="w-20 h-20" />
        </div>

        <div className="flex flex-col gap-5 text-left">
          <div>
            <p className="font-semibold text-xl">Nombre</p>
            <p>{fullname || "—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Email</p>
            <p>{email || "—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Rol</p>
            <p>{rol ? getRoleName(rol) : "—"}</p>
          </div>

          <div>
            <p className="font-semibold text-lg">Recibe Reportes</p>
            <p>{reporte ? "Sí" : "No"}</p>
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
      <div className="flex flex-col h-full w-4/5 gap-4">
        <p className="text-2xl w-full flex justify-center items-center">
          {" "}
          Lista de Usuarios{" "}
        </p>
        <DataTable columns={columns} data={data} />
        <div className="mt-4"></div>
      </div>
    </div>
  );
}
