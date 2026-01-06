"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Usuario = {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  rol: "superadmin" | "admin" | "user";
  created_at: string; // ISO string
};

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const map: Record<string, string> = {
        superadmin: "Superadministrador",
        admin: "Administrador",
        user: "Usuario",
      };
      return map[value] ?? value;
    },
  },
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      if (!value) return "-";
      try {
        return new Date(value).toLocaleString();
      } catch (e) {
        return value;
      }
    },
  },
  {
    id: "actions",
    header: "Acciones",
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original as Usuario;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* simple vertical ellipsis */}
              <span className="text-xl">⋮</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => console.log("edit-user", user.id)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                onClick={() => console.log("change-password", user.id)}
              >
                Cambiar contraseña
              </Button>
              <Button
                variant="destructive"
                onClick={() => console.log("delete-user", user.id)}
              >
                Borrar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
