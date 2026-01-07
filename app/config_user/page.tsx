"use client";

import { useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { authFetch } from "@/app/api/api";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FormUsuario from "./(formulario)/FormUsuario";

import { columns, User } from "./(table)/columns";
import { DataTable } from "./(table)/data-table";

import { useAuth } from "@/context/AuthProvider";

export default function ConfiguracionUsuario() {
  const refetchUsuarios = async () => {
    const res = await authFetch(
      `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/usuarios`
    );
    const users = await res.json();
    setData(users);
  };

  const deshabilitarUsuario = async (username: string) => {
    try {
      const res = await authFetch(
        `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/deshabilitar_usuario`,
        {
          method: "POST",
          body: JSON.stringify({ username }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.detail || "Error al deshabilitar usuario");
        return;
      }

      setData((prev) =>
        prev.map((u) => (u.username === username ? { ...u, habilitado: 0 } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Error de conexión con la API");
    }
  };

  const habilitarUsuario = async (username: string) => {
    const res = await authFetch(
      `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/habilitar_usuario`,
      {
        method: "POST",
        body: JSON.stringify({ username }),
      }
    );

    if (!res.ok) return;

    setData((prev: User[]) =>
      prev.map((u: User) =>
        u.username === username ? { ...u, habilitado: 1 } : u
      )
    );
  };

  const eliminarUsuario = async (username: string) => {
    const confirmar = confirm(
      "¿Estás seguro de que querés eliminar este usuario? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    try {
      // Use POST to delete for compatibility with servers that don't accept bodies on DELETE
      const res = await authFetch(
        `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/eliminar_usuario`,
        {
          method: "DELETE",
          body: JSON.stringify({ username }),
        }
      );

      // Parse JSON only when possible
      let result: any = {};
      try {
        result = await res.json();
      } catch (e) {
        // no JSON response
        result = { detail: res.statusText || "Error" };
      }

      if (!res.ok) {
        alert(result.detail || "Error al eliminar usuario");
        return;
      }

      setData((prev: User[]) =>
        prev.filter((u: User) => u.username !== username)
      );
    } catch (error) {
      console.error(error);
      alert("Error de conexión con la API");
    }
  };

  const { nombre, apellido, email, rol, reporte } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    authFetch(
      `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/usuarios`
    )
      .then((res) => res.json())
      .then((users: User[]) => {
        if (mounted) setData(users);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const getRoleName = (role?: string) => {
    const roleMap: Record<string, string> = {
      superadmin: "Super Administrador",
      admin: "Administrador",
      user: "Usuario",
    };
    return (role && roleMap[role]) || role || "—";
  };

  const fullname = `${nombre ?? ""}${nombre || apellido ? " " : ""}${
    apellido ?? ""
  }`.trim();

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-10 border border-botonredborder bg-botonred hover:bg-botonredhover text-botonredborder text-md">
                CREAR USUARIO
              </Button>
            </DialogTrigger>

            <FormUsuario onUserCreated={refetchUsuarios} />
          </Dialog>
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
        <div className="flex items-center justify-between">
          <p className="text-2xl">Lista de Usuarios</p>
          {isLoading && (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>Cargando...</span>
            </div>
          )}
        </div>

        <DataTable
          columns={columns(
            deshabilitarUsuario,
            habilitarUsuario,
            eliminarUsuario
          )}
          data={data}
        />

        <div className="mt-4"></div>
      </div>
    </div>
  );
}
