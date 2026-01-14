interface CategorySquareProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategorySquare({ label, isSelected, onClick }: CategorySquareProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        aspect-square rounded-xl p-2 font-semibold text-sm transition-all duration-200
        flex items-center justify-center min-w-0 w-full
        ${isSelected
          ? 'bg-gradient-to-br from-green-900 to-emerald-500 text-white border-2 border-emerald-400 shadow-lg shadow-green-500/30'
          : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
        }
        active:scale-95
      `}
    >
      <span className="text-center break-words overflow-hidden leading-tight px-1">
        {label}
      </span>
    </button>
  );
}
