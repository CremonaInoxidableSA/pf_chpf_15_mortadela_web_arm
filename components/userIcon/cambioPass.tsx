"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const CambioPass = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    key: "current_password" | "new_password",
    value: string
  ) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.current_password || !form.new_password) {
      toast.error("Completa ambos campos");
      return;
    }

    setLoading(true);

    try {
      const apiBase = `http://${
        process.env.NEXT_PUBLIC_API_IP ?? "localhost"
      }:${process.env.NEXT_PUBLIC_API_PORT ?? "8000"}`;

      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("access_token") ||
            localStorage.getItem("token"))) ||
        undefined;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/cambiar_password`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
        }),
        credentials: "include",
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }

      if (res.ok && (data.success ?? true)) {
        toast.success("Contraseña actualizada correctamente");
        setOpen(false);
        setForm({ current_password: "", new_password: "" });
      } else {
        const message =
          data.detail ??
          data.error ??
          data.message ??
          "Error al cambiar la contraseña";
        toast.error(message);
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full border border-botonblueborder bg-botonblue hover:bg-botonbluehover text-white cursor-pointer">
          <p className="text-botonblueborder font-medium">Cambiar contraseña</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 bg-background3 z-800">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Completá los datos para cambiar tu contraseña.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current_password">Contraseña actual</Label>
            <Input
              id="current_password"
              type="password"
              value={form.current_password}
              onChange={(e) => handleChange("current_password", e.target.value)}
              placeholder="Ingrese su contraseña actual"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new_password">Nueva contraseña</Label>
            <Input
              id="new_password"
              type="password"
              value={form.new_password}
              onChange={(e) => handleChange("new_password", e.target.value)}
              placeholder="Ingrese la nueva contraseña"
              required
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Cambiando...</span>
              </div>
            ) : (
              "Cambiar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CambioPass;
