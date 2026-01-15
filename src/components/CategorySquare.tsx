interface CategorySquareProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function CategorySquare({ label, isSelected, onClick, icon }: CategorySquareProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        aspect-[4/3] rounded-xl p-2 font-semibold text-sm transition-all duration-200
        flex flex-col items-center justify-center min-w-0 w-full gap-1
        ${isSelected
          ? 'bg-gradient-to-br from-green-900 to-emerald-500 text-white border-2 border-emerald-400 shadow-lg shadow-green-500/30'
          : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-600'
        }
        active:scale-95
      `}
    >
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}
      <span className="text-center break-words overflow-hidden leading-tight px-1 text-xs">
        {label}
      </span>
    </button>
  );
}
