"use client";

import { useState, useEffect } from "react";

import { configuracionesApi } from "@/services/configuracionesApi";

interface Receta {
  id: number;
  codigoProducto: string;
}

interface SelectConfiguracionProps {
  onChange: (value: string) => void;
  onClick: () => void;
  disabled?: boolean;
}

const SelectConfiguracion: React.FC<SelectConfiguracionProps> = ({
  onChange,
  onClick,
  disabled = false,
}) => {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [selectedKey, setSelectedKey] = useState("loading");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await configuracionesApi.obtenerListaRecetas();

        if (data.ListadoRecetas && Array.isArray(data.ListadoRecetas)) {
          const recetasFiltradas = data.ListadoRecetas.filter(
            (receta: Receta) =>
              receta.codigoProducto && receta.codigoProducto.trim() !== "",
          );

          setRecetas(recetasFiltradas);

          if (recetasFiltradas.length > 0) {
            const primerReceta = recetasFiltradas[0];

            setSelectedKey(primerReceta.id.toString());
            onChange(primerReceta.id.toString());
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
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
              key={receta.id}
              className="text-texto bg-background4 hover:bg-background5"
              value={receta.id}
            >
              {receta.codigoProducto}
            </option>
          ))
        ) : (
          <option value="">No hay recetas disponibles</option>
        )}
      </select>
      <button
        className="bg-blue flexfjustify-center items-center text-white rounded-sm disabled:opacity-50 w-1/3"
        disabled={disabled || loading}
        onClick={onClick}
      >
        Aplicar
      </button>
    </div>
  );
};

export default SelectConfiguracion;
