import { useState, useRef, useEffect } from 'react';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberStepper({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 100,
  className = '' 
}: NumberStepperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleNumberClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(inputValue, 10);
    
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
      setInputValue(clampedValue.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      inputRef.current?.blur();
    }
  };

  return (
    <div className={className}>
      <label className="block text-gray-300 font-medium mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          −
        </button>
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={max}
            className="w-16 text-center text-2xl font-bold text-white bg-gray-800 border border-green-500 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ) : (
          <div 
            onClick={handleNumberClick}
            className="w-16 text-center text-2xl font-bold text-white cursor-text hover:text-green-400 transition-colors"
          >
            {value}
          </div>
        )}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
