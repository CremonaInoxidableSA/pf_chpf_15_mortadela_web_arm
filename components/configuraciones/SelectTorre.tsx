import React, { useState, useEffect } from "react";

import { configuracionesApi } from "@/services/configuracionesApi";

interface Torre {
  id_torre: number;
  nombre_torre: string;
}

interface SelectTorreProps {
  onChange: (torre: string) => void;
  onTorresChange: (torres: Torre[]) => void;
  selectedReceta: string;
  refreshTorres: (tag?: string) => void;
  refreshTorres2: () => void;
  selectedTorre: string | null;
  disabled?: boolean;
  refreshKey?: number;
}

const SelectTorre: React.FC<SelectTorreProps> = ({
  onChange,
  onTorresChange,
  selectedReceta,
  refreshTorres,
  refreshTorres2,
  selectedTorre,
  disabled = false,
  refreshKey = 0,
}) => {
  const [torres, setTorres] = useState<Torre[]>([]);
  const [loading, setLoading] = useState(false);

  const canMakeApiCalls = true;

  useEffect(() => {
    const loadTorresAndSelectFirst = async () => {
      if (!selectedReceta) {
        setTorres([]);
        onTorresChange([]);
        onChange("");
        return;
      }

      if (!canMakeApiCalls) {
        return;
      }

      setLoading(true);
      try {
        const data =
          await configuracionesApi.obtenerListaTorres(selectedReceta);
        const torresData = data || [];

        setTorres(torresData);
        onTorresChange(torresData);

        if (torresData.length > 0) {
          onChange(torresData[0].id_torre.toString());
        } else {
          onChange("");
        }
      } catch {
        setTorres([]);
        onTorresChange([]);
        onChange("");
      } finally {
        setLoading(false);
      }
    };

    loadTorresAndSelectFirst();
  }, [selectedReceta, canMakeApiCalls, onChange, onTorresChange]);

  useEffect(() => {
    if (refreshTorres) {
      refreshTorres(selectedReceta);
    }
  }, [refreshTorres, refreshTorres2, selectedReceta]);

  useEffect(() => {
    if (refreshKey === 0 || !selectedReceta) return;
    const reload = async () => {
      setLoading(true);
      try {
        const data =
          await configuracionesApi.obtenerListaTorres(selectedReceta);
        const torresData = data || [];
        setTorres(torresData);
        onTorresChange(torresData);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    reload();
  }, [refreshKey, selectedReceta, onTorresChange]);

  return (
    <select
      className="border rounded px-2 py-1 w-full"
      disabled={disabled || loading}
      value={selectedTorre || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option
        disabled
        className="text-texto bg-background4 hover:bg-background5"
        value=""
      >
        {loading ? "Cargando torres..." : "Seleccionar Torre"}
      </option>
      {torres.map((torre) => (
        <option
          key={torre.id_torre}
          className="text-texto bg-background4 hover:bg-background5"
          value={torre.id_torre}
        >
          {torre.nombre_torre}
        </option>
      ))}
    </select>
  );
};

export default SelectTorre;
