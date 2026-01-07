"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { VscAccount } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

const UserIcon = () => {
  const router = useRouter();
  const { logout, nombre, apellido, rol, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName =
    `${nombre ?? ""}${nombre || apellido ? " " : ""}${apellido ?? ""}`.trim() ||
    "Usuario";

  const closeSession = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error closing session:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer">
        <div className="group relative flex items-center justify-center w-6.25 h-6.25 ease-in-out">
          <div className="absolute inset-0 rounded-md bg-gray-400/0 group-hover:bg-gray-400/20 ease-in-out group-hover:scale-150" />
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
            <p className="text-xs">{rol}</p>
            <Button
              className="mt-2 w-full bg-blue hover:bg-water text-white cursor-pointer"
              onClick={() => {
                router.push("/config_user");
                setOpen(false);
              }}
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
