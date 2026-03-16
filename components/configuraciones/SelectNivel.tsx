interface SelectNivelProps {
  onChange: (nivel: "ChG" | "ChB") => void;
  disabled?: boolean;
}

const SelectNivel: React.FC<SelectNivelProps> = ({
  onChange,
  disabled = false,
}) => {
  return (
    <select
      className="border rounded px-2 py-1 text-texto w-full"
      defaultValue="ChG"
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as "ChG" | "ChB")}
    >
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
    </select>
  );
};

export default SelectNivel;
