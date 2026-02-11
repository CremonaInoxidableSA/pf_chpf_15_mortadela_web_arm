interface BotonRefreshProps {
  onClick: () => void;
  className?: string;
}

const BotonRefresh: React.FC<BotonRefreshProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
      onClick={onClick}
    >
      Actualizar
    </button>
  );
};

export default BotonRefresh;
