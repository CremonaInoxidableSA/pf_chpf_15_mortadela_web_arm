"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Slash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  rol: string;
  habilitado: number;
  reporte: number;
};

export const columns = (
  onDisableUser: (username: string) => void,
  onEnableUser: (username: string) => void,
  onDeleteUser: (username: string) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "username",
    header: "Usuario",
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
    cell: ({ row }) => {
      const role = row.getValue("rol") as string;
      const roleMap: Record<string, string> = {
        superadmin: "Super Administrador",
        admin: "Administrador",
        user: "Usuario",
      };
      return roleMap[role] ?? role ?? "—";
    },
  },
  {
    accessorKey: "habilitado",
    header: "Habilitado",
    cell: ({ row }) => (row.getValue("habilitado") === 1 ? "Sí" : "No"),
  },
  {
    accessorKey: "reporte",
    header: "Recibe Reportes",
    cell: ({ row }) => (row.getValue("reporte") === 1 ? "Sí" : "No"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            {user.habilitado === 1 ? (
              <DropdownMenuItem onClick={() => onDisableUser(user.username)}>
                <Slash className="mr-2 h-4 w-4" />
                Deshabilitar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onEnableUser(user.username)}>
                <Slash className="mr-2 h-4 w-4" />
                Habilitar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDeleteUser(user.username)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
