import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'interactive' | 'dimmed';
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-2xl p-6 shadow-lg transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-gray-900/50 border border-gray-800/50',
    interactive: 'bg-gray-900/50 border border-gray-800/50 hover:border-green-500/50 hover:shadow-green-500/20 cursor-pointer active:scale-98',
    dimmed: 'bg-gray-900/30 border border-gray-800/30 opacity-60',
  };
  
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${clickableClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
