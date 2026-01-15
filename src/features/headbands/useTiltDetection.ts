import { useEffect, useCallback, useRef } from 'react';

export type TiltAction = 'correct' | 'wrong' | 'pass' | null;

interface UseTiltDetectionOptions {
  onTilt: (action: TiltAction) => void;
  tiltThreshold?: number; // Degrees to trigger tilt (default: 25)
  enabled?: boolean;
}

/**
 * Custom hook to detect device tilt using DeviceOrientationEvent
 * 
 * Gestures:
 * - Tilt up (beta > threshold): Correct
 * - Tilt down (beta < -threshold): Wrong
 * - Tilt left/right (gamma > threshold or < -threshold): Pass
 */
export function useTiltDetection({
  onTilt,
  tiltThreshold = 25,
  enabled = true,
}: UseTiltDetectionOptions) {
  const lastActionRef = useRef<TiltAction>(null);
  const actionTimeoutRef = useRef<number | null>(null);

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (!enabled) return;

      const beta = event.beta ?? 0; // Front-to-back tilt (-180 to 180)
      const gamma = event.gamma ?? 0; // Left-to-right tilt (-90 to 90)

      let action: TiltAction = null;

      // Tilt up (forward) = Correct
      if (beta > tiltThreshold) {
        action = 'correct';
      }
      // Tilt down (backward) = Wrong
      else if (beta < -tiltThreshold) {
        action = 'wrong';
      }
      // Tilt left or right = Pass
      else if (Math.abs(gamma) > tiltThreshold) {
        action = 'pass';
      }

      // Only trigger if action changed and action is not null
      if (action !== null && action !== lastActionRef.current) {
        // Clear any pending timeout
        if (actionTimeoutRef.current) {
          clearTimeout(actionTimeoutRef.current);
          actionTimeoutRef.current = null;
        }

        // Debounce the action to avoid rapid firing
        actionTimeoutRef.current = window.setTimeout(() => {
          if (action !== null && action !== lastActionRef.current) {
            lastActionRef.current = action;
            onTilt(action);
          }
        }, 150); // 150ms debounce
      } else if (action === null && lastActionRef.current !== null) {
        // Reset when device returns to neutral
        if (actionTimeoutRef.current) {
          clearTimeout(actionTimeoutRef.current);
          actionTimeoutRef.current = null;
        }
        // Small delay before resetting to allow for natural movement
        actionTimeoutRef.current = window.setTimeout(() => {
          lastActionRef.current = null;
        }, 300);
      }
    },
    [onTilt, tiltThreshold, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    // Request permission on iOS 13+
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            console.warn('Device orientation permission denied');
          }
        })
        .catch((error: Error) => {
          console.error('Error requesting device orientation permission:', error);
        });
    } else {
      // For browsers that don't require permission
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
      }
    };
  }, [handleOrientation, enabled]);
}