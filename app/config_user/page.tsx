"use client";

import { useAuth } from "@/context/AuthProvider";

import { VscAccount } from "react-icons/vsc";

import { Button } from "@/components/ui/button";

export default function ConfiguracionUsuario() {
  const { user } = useAuth();

  const nombre = (() => {
    if (!user) return "";
    if ((user as any).nombre) return (user as any).nombre;
    if (typeof user.name === "string" && user.name.trim()) {
      const parts = user.name.trim().split(" ");
      return parts[0] ?? "";
    }
    return "";
  })();

  const apellido = (() => {
    if (!user) return "";
    if ((user as any).apellido) return (user as any).apellido;
    if (typeof user.name === "string" && user.name.trim()) {
      const parts = user.name.trim().split(" ");
      return parts.slice(1).join(" ") || "";
    }
    return "";
  })();

  const email = user?.email ?? "";

  const roleMap: Record<string, string> = {
    superadmin: "Superadministrador",
    admin: "Administrador",
    user: "Usuario",
  };

  const rawRole = user ? user.role ?? (user as any).rol : undefined;
  const role = rawRole ? roleMap[rawRole] ?? rawRole : "";

  return (
    <div className="w-full h-full p-4 flex flex-row gap-4">
      <div className="h-full w-1/5 flex flex-col bg-background2 rounded-lg p-4 gap-4">
        <div className="flex w-full items-center justify-center">
          <VscAccount className="w-20 h-20" />
        </div>

        <div className="flex flex-col gap-5 text-left">
          <div>
            <p className="font-bold text-xl">Nombre</p>
            <p>{nombre || "—"}</p>
          </div>

          <div>
            <p className="font-bold text-xl">Apellido</p>
            <p>{apellido || "—"}</p>
          </div>

          <div>
            <p className="font-bold text-xl">EMAIL</p>
            <p>{email || "—"}</p>
          </div>

          <div>
            <p className="font-bold text-xl">Rol</p>
            <p>{role || "—"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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
      <div className="flex h-full w-4/5 bg-background2">
        <p> Hola </p>
      </div>
    </div>
  );
}
