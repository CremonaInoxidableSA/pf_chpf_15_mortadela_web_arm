import React, { useState, useEffect } from "react";

import { useApp } from "../../context/AppContext";

interface Torre {
  id: string;
}

interface SelectTorreProps {
  onChange: (torre: string) => void;
  onTorresChange: (torres: any[]) => void;
  selectedReceta: string;
  refreshTorres: (tag?: string) => void;
  refreshTorres2: () => void;
  selectedTorre: string | null;
  disabled?: boolean;
}

const SelectTorre: React.FC<SelectTorreProps> = ({
  onChange,
  onTorresChange,
  selectedReceta,
  refreshTorres,
  refreshTorres2,
  selectedTorre,
  disabled = false,
}) => {
  const { targetAddress } = useApp();
  const [torres, setTorres] = useState<Torre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTorresAndSelectFirst = async () => {
      if (!selectedReceta) {
        setTorres([]);
        onTorresChange([]);
        onChange("");

        return;
      }

      if (!targetAddress) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://${targetAddress}/configuraciones/lista-torres?id_receta=${selectedReceta}`,
        );

        if (response.ok) {
          const data = await response.json();
          const torresData = data.ListadoTorres || [];

          setTorres(torresData);
          onTorresChange(torresData);

          if (torresData.length > 0) {
            onChange(torresData[0].id);
          } else {
            onChange("");
          }
        } else {
          setTorres([]);
          onTorresChange([]);
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
  }, [selectedReceta]);

  useEffect(() => {
    if (refreshTorres) {
      refreshTorres(selectedReceta);
    }
  }, [refreshTorres, refreshTorres2, selectedReceta]);

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
          key={torre.id}
          className="text-texto bg-background4 hover:bg-background5"
          value={torre.id}
        >
          {torre.id}
        </option>
      ))}
    </select>
  );
};

export default SelectTorre;
