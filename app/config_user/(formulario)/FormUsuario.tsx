"use client";

import React, { useState } from "react";
import { authFetch } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  onUserCreated: () => void;
};

export default function FormUsuario({ onUserCreated }: Props) {
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    rol: "",
    password: "",
    reporte: true,
    habilitado: 1,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.email.includes("@")) {
      alert("Email inválido");
      return;
    }

    const payload = { ...form, habilitado: form.habilitado ? 1 : 0 };

    const res = await authFetch(
      `http://${process.env.NEXT_PUBLIC_API_IP}:${process.env.NEXT_PUBLIC_API_PORT}/crear_usuario`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Error al crear usuario");
      return;
    }

    onUserCreated();
  };

  return (
    <DialogContent className="sm:max-w-150 bg-background3 z-800">
      <DialogHeader>
        <DialogTitle>Crear usuario</DialogTitle>
        <DialogDescription>
          Completá los datos para crear un nuevo usuario.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Ingrese el correo electrónico del usuario"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Asigne un usuario unico"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Ingrese el nombre del usuario"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="surname">Apellido</Label>
          <Input
            id="surname"
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder="Ingrese el apellido del usuario"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Rol</Label>
          <Select onValueChange={(v) => handleChange("rol", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un rol para el usuario" />
            </SelectTrigger>
            <SelectContent className="z-900">
              <SelectGroup>
                <SelectLabel>Rol</SelectLabel>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Ingrese una contraseña para el usuario"
        />
      </div>

      <RadioGroup
        defaultValue={form.reporte ? "true" : "false"}
        onValueChange={(v) => handleChange("reporte", v === "true")}
      >
        <Label className="mb-2 mt-4">Recibe Reportes</Label>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="option-one" />
          <Label htmlFor="option-one">Si</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="option-two" />
          <Label htmlFor="option-two">No</Label>
        </div>
      </RadioGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button onClick={handleSubmit}>Crear</Button>
      </DialogFooter>
    </DialogContent>
  );
}
