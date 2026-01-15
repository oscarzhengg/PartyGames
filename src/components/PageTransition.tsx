import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type TransitionDirection = 'forward' | 'backward' | 'modal' | 'fade';

interface PageTransitionProps {
  children: ReactNode;
  direction?: TransitionDirection;
  isActive: boolean;
  className?: string;
}

export function PageTransition({ 
  children, 
  direction = 'forward',
  isActive,
  className = '' 
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for exit animation before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    switch (direction) {
      case 'forward':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4'
        }`;
      case 'backward':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-4'
        }`;
      case 'modal':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`;
      case 'fade':
      default:
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-y-auto ${getTransitionClasses()} ${className}`}>
      {children}
    </div>
  );
}
