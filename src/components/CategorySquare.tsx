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
        aspect-square rounded-xl p-4 font-semibold text-lg transition-all duration-200
        ${isSelected
          ? 'bg-gradient-to-br from-green-900 to-emerald-500 text-white border-2 border-emerald-400 shadow-lg shadow-green-500/30'
          : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
        }
        active:scale-95
      `}
    >
      {label}
    </button>
  );
}
