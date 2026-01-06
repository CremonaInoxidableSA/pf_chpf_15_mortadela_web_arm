"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { VscAccount } from "react-icons/vsc";
import { useAuth } from "@/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";

const UserIcon = () => {
  const { logout, user, loading } = useAuth();

  const roleMap: Record<string, string> = {
    superadmin: "Superadministrador",
    admin: "Administrador",
    user: "Usuario",
  };

  const displayName = (() => {
    if (!user) return "Usuario";

    if (typeof user.name === "string" && user.name.trim())
      return user.name.trim();

    const nombre = (user as any).nombre;
    const apellido = (user as any).apellido;
    const full = [nombre, apellido]
      .filter((s) => typeof s === "string" && s.trim())
      .join(" ")
      .trim();
    if (full) return full;

    return (user.email && String(user.email)) || "Usuario";
  })();

  const rawRole = user ? user.role ?? (user as any).rol : undefined;

  const closeSession = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error closing session:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <div className="group relative flex items-center justify-center w-6.25 h-6.25 ease-in-out">
          <div className="absolute inset-0 rounded-lg bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150" />
          <VscAccount className="w-6.25 h-6.25 transition-transform ease-in-out group-hover:scale-110" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-901">
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Verificando...</span>
          </div>
        ) : (
          <>
            <p className="text-lg">{displayName}</p>
            <p className="text-xs">
              {rawRole ? roleMap[rawRole] ?? rawRole : "Sin rol"}
            </p>
            <Button
              className="mt-2 w-full bg-blue hover:bg-water text-white cursor-pointer"
              onClick={() => window.location.href = "/config_user"}
            >
              Configuracion del perfil
            </Button>
            <Button
              className="mt-2 w-full bg-redlogo hover:bg-red2 text-white cursor-pointer"
              onClick={closeSession}
            >
              Cerrar sesión
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserIcon;
