import { useEffect, useCallback, useRef, useState } from 'react';

export type TiltAction = 'correct' | 'wrong' | 'pass' | null;
export type TiltPermissionState = 'unknown' | 'prompt' | 'granted' | 'denied' | 'unsupported';

interface UseTiltDetectionOptions {
  onTilt: (action: TiltAction) => void;
  tiltThreshold?: number; // Degrees to trigger tilt (default: 25)
  enabled?: boolean;
}

interface TiltDetectionResult {
  requestPermission: () => Promise<void>;
  permissionState: TiltPermissionState;
  isSupported: boolean;
  currentOrientation: { beta: number | null; gamma: number | null };
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
}: UseTiltDetectionOptions): TiltDetectionResult {
  const lastActionRef = useRef<TiltAction>(null);
  const actionTimeoutRef = useRef<number | null>(null);
  const [permissionState, setPermissionState] = useState<TiltPermissionState>('unknown');
  const [isSupported, setIsSupported] = useState(false);
  const [currentOrientation, setCurrentOrientation] = useState<{ beta: number | null; gamma: number | null }>({
    beta: null,
    gamma: null,
  });

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (!enabled || permissionState !== 'granted') return;

      const beta = event.beta ?? null; // Front-to-back tilt (-180 to 180)
      const gamma = event.gamma ?? null; // Left-to-right tilt (-90 to 90)

      // Update current orientation for debugging
      setCurrentOrientation({ beta, gamma });

      // Skip if values are null (some devices don't provide them)
      if (beta === null || gamma === null) return;

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
    [onTilt, tiltThreshold, enabled, permissionState]
  );

  // Check if device orientation is supported
  useEffect(() => {
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    const hasOrientationEvent = typeof DeviceOrientationEvent !== 'undefined';
    
    setIsSupported(isSecureContext && hasOrientationEvent);

    if (!isSecureContext) {
      setPermissionState('unsupported');
      console.warn('Device orientation requires HTTPS or localhost');
    } else if (!hasOrientationEvent) {
      setPermissionState('unsupported');
      console.warn('Device orientation not supported in this browser');
    } else if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS 13+ requires permission
      setPermissionState('prompt');
    } else {
      // Permission not required, try to use directly
      setPermissionState('granted');
    }
  }, []);

  // Set up event listener when permission is granted
  useEffect(() => {
    if (!enabled || permissionState !== 'granted' || !isSupported) return;

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
      }
    };
  }, [handleOrientation, enabled, permissionState, isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('Device orientation not supported');
      return;
    }

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
          console.warn('Device orientation permission denied');
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionState('denied');
      }
    } else {
      // Permission not required, grant it
      setPermissionState('granted');
    }
  }, [isSupported]);

  return {
    requestPermission,
    permissionState,
    isSupported,
    currentOrientation,
  };
}