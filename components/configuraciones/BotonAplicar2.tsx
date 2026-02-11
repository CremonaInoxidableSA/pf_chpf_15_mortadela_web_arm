interface BotonAplicar2Props {
  onClick: () => void;
  className?: string;
  isDisabled?: boolean;
}

const BotonAplicar2: React.FC<BotonAplicar2Props> = ({
  onClick,
  className = "",
  isDisabled = false,
}) => {
  return (
    <button
      className={`bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      Aplicar Cambios
    </button>
  );
};

export default BotonAplicar2;
