"use client";

import { useState, useEffect } from "react";

import { configuracionesApi } from "@/services/configuracionesApi";

interface Receta {
  id_receta: number;
  codigo_producto: string;
  peso_producto: number;
  tipo_corte: number;
  alto_producto: number;
  largo_producto: number;
  ancho_producto: number;
  productos_fila: number;
  productos_columna: number;
}

interface SelectConfiguracionProps {
  onChange: (value: string) => void;
  onClick: () => void;
  disabled?: boolean;
}

const SelectConfiguracion: React.FC<SelectConfiguracionProps> = ({
  onChange,
  disabled = false,
}) => {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [selectedKey, setSelectedKey] = useState("loading");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await configuracionesApi.obtenerListaRecetas();

        if (data && Array.isArray(data)) {
          const recetasFiltradas = data.filter(
            (receta: Receta) =>
              receta.codigo_producto && receta.codigo_producto.trim() !== "",
          );

          setRecetas(recetasFiltradas);

          if (recetasFiltradas.length > 0) {
            const primerReceta = recetasFiltradas[0];

            setSelectedKey(primerReceta.id_receta.toString());
            onChange(primerReceta.id_receta.toString());
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectionChange = (value: string) => {
    setSelectedKey(value);
    onChange(value);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full gap-5">
      <select
        className="border bg-background2 rounded-sm px-1 w-2/3"
        disabled={disabled || loading}
        value={selectedKey}
        onChange={(e) => handleSelectionChange(e.target.value)}
      >
        {loading ? (
          <option value="loading">Cargando recetas...</option>
        ) : recetas.length > 0 ? (
          recetas.map((receta) => (
            <option
              key={receta.id_receta}
              className="text-texto bg-background4 hover:bg-background5"
              value={receta.id_receta.toString()}
            >
              {receta.codigo_producto}
            </option>
          ))
        ) : (
          <option value="">No hay recetas disponibles</option>
        )}
      </select>
    </div>
  );
};

export default SelectConfiguracion;
