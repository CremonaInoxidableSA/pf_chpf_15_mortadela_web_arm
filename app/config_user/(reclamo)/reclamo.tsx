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

import { Textarea } from "@/components/ui/textarea";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { authFetch } from "@/app/api/api";

export default function GenerarReclamo() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
      nombre: "",
      apellido: "",
      reporte: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    
  };
  
  return (
    <DialogContent className="sm:max-w-150 bg-background3 z-800">
      <DialogHeader>
        <DialogTitle>{t("min.generarReclamo")}</DialogTitle>
        <DialogDescription>
          {t("min.completaDatosCrearUsuario")}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">{t("min.nombre")}</Label>
          <Input
            id="name"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder={t("min.ingreseNombreUsuario")}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="surname">{t("min.apellido")}</Label>
          <Input
            id="surname"
            value={form.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder={t("min.ingreseApellidoUsuario")}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>{t("min.dondeProblema")}</Label>
          <Select onValueChange={(v) => handleChange("rol", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("min.seleccioneArea")} />
            </SelectTrigger>
            <SelectContent className="z-900">
              <SelectGroup>
                <SelectLabel>{t("min.rol")}</SelectLabel>
                <SelectItem value="admin">{t("min.exportacion")}</SelectItem>
                <SelectItem value="user">{t("min.visual")}</SelectItem>
                <SelectItem value="user">{t("min.reportes")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Textarea
        className="w-full mt-4"
        placeholder={t("min.detalleReclamo")}
        rows={5}
      ></Textarea>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{t("min.cancelar")}</Button>
        </DialogClose>
        <Button onClick={handleSubmit}>{t("min.crearUsuario")}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
