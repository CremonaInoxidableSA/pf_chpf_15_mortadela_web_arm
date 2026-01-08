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
  t: (k: string) => string,
  onDisableUser: (username: string) => void,
  onEnableUser: (username: string) => void,
  onDeleteUser: (username: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: t("min.email"),
  },
  {
    accessorKey: "username",
    header: t("min.usuario"),
  },
  {
    accessorKey: "nombre",
    header: t("min.nombre"),
  },
  {
    accessorKey: "apellido",
    header: t("min.apellido"),
  },
  {
    accessorKey: "rol",
    header: t("min.rol"),
    cell: ({ row }) => {
      const role = row.getValue("rol") as string;
      const roleMap: Record<string, string> = {
        superadmin: t("min.superadmin"),
        admin: t("min.admin"),
        user: t("min.usuarioNormal"),
      };
      return roleMap[role] ?? role ?? "—";
    },
  },
  {
    accessorKey: "habilitado",
    header: t("min.habilitado"),
    cell: ({ row }) =>
      row.getValue("habilitado") === 1 ? t("min.si") : t("min.no"),
  },
  {
    accessorKey: "reporte",
    header: t("min.recibeReportes"),
    cell: ({ row }) =>
      row.getValue("reporte") === 1 ? t("min.si") : t("min.no"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("min.openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("min.acciones")}</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> {t("min.editar")}
            </DropdownMenuItem>
            {user.habilitado === 1 ? (
              <DropdownMenuItem onClick={() => onDisableUser(user.username)}>
                <Slash className="mr-2 h-4 w-4" />
                {t("min.deshabilitar")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onEnableUser(user.username)}>
                <Slash className="mr-2 h-4 w-4" />
                {t("min.habilitar")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDeleteUser(user.username)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("min.eliminar")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
