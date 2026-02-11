interface BotonResetearProps {
  onClick: () => void;
  className?: string;
}

const BotonResetear: React.FC<BotonResetearProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`bg-red-500   px-3 py-1 rounded text-sm hover:bg-red-600 ${className}`}
      onClick={onClick}
    >
      Reset
    </button>
  );
};

export default BotonResetear;
