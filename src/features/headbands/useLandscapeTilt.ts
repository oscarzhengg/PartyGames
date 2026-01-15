import { useEffect, useCallback, useRef, useState } from 'react';

export type TiltAction = 'correct' | 'wrong' | null;

interface UseLandscapeTiltOptions {
  onTilt: (action: TiltAction) => void;
  tiltThreshold?: number; // Degrees to trigger tilt (default: 25)
  enabled?: boolean;
}

interface OrientationState {
  isLandscape: boolean;
  angle: number; // 0, 90, 180, -90
}

/**
 * Custom hook to detect device tilt in landscape orientation
 * 
 * Only works when device is in landscape mode
 * Gestures:
 * - Tilt up (gamma > threshold): Correct
 * - Tilt down (gamma < -threshold): Wrong/Pass
 */
export function useLandscapeTilt({
  onTilt,
  tiltThreshold = 25,
  enabled = true,
}: UseLandscapeTiltOptions) {
  const lastActionRef = useRef<TiltAction>(null);
  const actionTimeoutRef = useRef<number | null>(null);
  const [orientation, setOrientation] = useState<OrientationState>({
    isLandscape: false,
    angle: 0,
  });
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Detect device orientation
  useEffect(() => {
    const checkOrientation = () => {
      let isLandscape = false;
      let angle = 0;

      // Check orientation using multiple methods
      if (window.orientation !== undefined) {
        // iOS/Android orientation
        angle = window.orientation;
        isLandscape = Math.abs(angle) === 90;
      } else if (screen.orientation) {
        // Modern API
        angle = screen.orientation.angle;
        isLandscape = angle === 90 || angle === 270;
      } else {
        // Fallback: check window dimensions
        isLandscape = window.innerWidth > window.innerHeight;
      }

      setOrientation({ isLandscape, angle });
    };

    // Check initial orientation
    checkOrientation();

    // Listen for orientation changes
    if (window.orientation !== undefined) {
      window.addEventListener('orientationchange', checkOrientation);
    } else if (screen.orientation) {
      screen.orientation.addEventListener('change', checkOrientation);
    } else {
      window.addEventListener('resize', checkOrientation);
    }

    return () => {
      if (window.orientation !== undefined) {
        window.removeEventListener('orientationchange', checkOrientation);
      } else if (screen.orientation) {
        screen.orientation.removeEventListener('change', checkOrientation);
      } else {
        window.removeEventListener('resize', checkOrientation);
      }
    };
  }, []);

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (!enabled || !permissionGranted || !orientation.isLandscape) return;

      const gamma = event.gamma ?? null; // Left-to-right tilt (-90 to 90)
      
      // Skip if values are null
      if (gamma === null) return;

      let action: TiltAction = null;

      // In landscape mode:
      // Tilt up (positive gamma) = Correct
      if (gamma > tiltThreshold) {
        action = 'correct';
      }
      // Tilt down (negative gamma) = Wrong/Pass
      else if (gamma < -tiltThreshold) {
        action = 'wrong';
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
    [onTilt, tiltThreshold, enabled, permissionGranted, orientation.isLandscape]
  );

  // Request permission and set up event listener
  useEffect(() => {
    if (!enabled || !orientation.isLandscape) return;

    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    const hasOrientationEvent = typeof DeviceOrientationEvent !== 'undefined';

    if (!isSecureContext || !hasOrientationEvent) {
      return;
    }

    const requestPermission = async () => {
      // Check if permission is needed (iOS 13+)
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission();
          if (response === 'granted') {
            setPermissionGranted(true);
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
        }
      } else {
        // Permission not required, grant it
        setPermissionGranted(true);
      }
    };

    // Try to detect if permission was already granted by attempting to listen
    const testHandler = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null) {
        setPermissionGranted(true);
        window.removeEventListener('deviceorientation', testHandler);
      }
    };

    window.addEventListener('deviceorientation', testHandler);
    window.addEventListener('deviceorientation', handleOrientation);

    // Request permission if needed
    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', testHandler);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
      }
    };
  }, [handleOrientation, enabled, orientation.isLandscape]);

  return {
    isLandscape: orientation.isLandscape,
    permissionGranted,
  };
}