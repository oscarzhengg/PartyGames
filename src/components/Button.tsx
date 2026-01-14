import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg active:scale-95';
  
  const isDisabled = props.disabled;
  
  const variantClasses = variant === 'primary'
    ? isDisabled
      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
      : 'bg-gradient-to-br from-green-900 to-emerald-500 text-white hover:shadow-green-500/50 hover:shadow-2xl'
    : 'bg-gray-800 text-white border border-gray-700 hover:border-gray-600';
  
  const widthClass = fullWidth ? 'w-full' : '';
  const activeClass = isDisabled ? '' : 'active:scale-95';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClass} ${activeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
