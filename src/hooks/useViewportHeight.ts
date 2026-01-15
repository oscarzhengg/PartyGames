import { useEffect, useState } from 'react';

/**
 * Hook to get the actual viewport height on iOS devices
 * Accounts for dynamic browser UI (address bar, etc.)
 */
export function useViewportHeight() {
  const [height, setHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    // Update on resize and orientation change
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    // iOS Safari sometimes needs a delay after orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(updateHeight, 100);
    });

    // Initial update
    updateHeight();

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return height;
}
