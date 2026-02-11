interface SelectNivelProps {
  onChange: (nivel: "HN" | "ChG" | "ChB" | "FA" | "uHN") => void;
  disabled?: boolean;
}

const SelectNivel: React.FC<SelectNivelProps> = ({
  onChange,
  disabled = false,
}) => {
  return (
    <select
      className="border rounded px-2 py-1 text-texto w-full"
      defaultValue="HN"
      disabled={disabled}
      onChange={(e) =>
        onChange(e.target.value as "HN" | "ChG" | "ChB" | "FA" | "uHN")
      }
    >
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="HN"
      >
        Altura Nivel
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="ChG"
      >
        Corr. Guardado
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="ChB"
      >
        Corr. Búsqueda
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="FA"
      >
        Fallas
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="uHN"
      >
        Último Nivel
      </option>
    </select>
  );
};

export default SelectNivel;
