import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { HeadbandsSettings } from './types';
import { getShuffledWords } from './logic';
import { useTiltDetection, type TiltAction } from './useTiltDetection';

interface HeadbandsGameProps {
  settings: HeadbandsSettings;
  onBack: () => void;
}

type GamePhase = 'countdown' | 'playing' | 'finished';

export function HeadbandsGame({ settings, onBack }: HeadbandsGameProps) {
  const [words] = useState(() => getShuffledWords(settings.selectedCategories));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(settings.guessTimeSeconds);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [wordsGuessed, setWordsGuessed] = useState(0); // Track how many words were correctly guessed/passed
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleNextWord = useCallback(() => {
    setCurrentWordIndex((prev) => {
      if (prev >= words.length - 1) {
        // All words used, restart from beginning
        return 0;
      }
      return prev + 1;
    });
  }, [words.length]);

  const handleTilt = useCallback(
    (action: TiltAction) => {
      if (!tiltEnabled || phase !== 'playing') return;

      if (action === 'correct' || action === 'pass') {
        // Move to next word on correct or pass
        setWordsGuessed((prev) => prev + 1);
        setTimeout(() => {
          handleNextWord();
        }, 500);
      }
      // For 'wrong', just continue with current word
    },
    [tiltEnabled, phase, handleNextWord]
  );

  // Get permission state from tilt detection hook (must be called before useEffects that use it)
  const {
    permissionState,
  } = useTiltDetection({
    onTilt: handleTilt,
    enabled: tiltEnabled && phase === 'playing',
    tiltThreshold: 25,
  });

  // Check permission state - start countdown once we know the permission status
  useEffect(() => {
    // If permission is not 'unknown' or 'prompt', we can proceed (either granted, denied, or unsupported)
    if (permissionState !== 'unknown' && permissionState !== 'prompt' && !permissionGranted) {
      setPermissionGranted(true);
    }
  }, [permissionState, permissionGranted]);

  // Countdown effect - only start when permission status is determined (not waiting for permission)
  useEffect(() => {
    if (phase !== 'countdown') return;
    // Don't start countdown if we're still waiting for permission
    if (permissionState === 'unknown' || permissionState === 'prompt') return;

    if (countdown <= 0) {
      setPhase('playing');
      setTiltEnabled(true);
      setTimeRemaining(settings.guessTimeSeconds);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, countdown, settings.guessTimeSeconds, permissionState]);

  // Timer effect - constant timer for the entire round
  useEffect(() => {
    if (phase !== 'playing') return;

    if (timeRemaining <= 0) {
      // Time's up - end the game
      setPhase('finished');
      setTiltEnabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeRemaining]);

  const handleRestart = () => {
    setPhase('countdown');
    setCountdown(3);
    setCurrentWordIndex(0);
    setTimeRemaining(settings.guessTimeSeconds);
    setTiltEnabled(false);
    setWordsGuessed(0);
  };

  const currentWord = words[currentWordIndex] || '';

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (phase === 'countdown') {
    // Show permission prompt if still needed (shouldn't happen but as fallback)
    if (permissionState === 'prompt' || permissionState === 'unknown') {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <div className="text-center space-y-4">
              <p className="text-yellow-400 font-medium">
                Enabling motion detection...
              </p>
              <p className="text-gray-300 text-sm">
                Please grant permission to continue
              </p>
            </div>
          </Card>
        </div>
      );
    }

    // Show countdown only when permission is granted
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-9xl font-bold text-white mb-4 animate-pulse">
            {countdown}
          </div>
          <p className="text-gray-400 text-xl">Get ready!</p>
        </div>
      </div>
    );
  }

  if (phase === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Time's Up!</h2>
              <p className="text-gray-400">Great job!</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  {wordsGuessed}
                </div>
                <div className="text-gray-300 text-sm">
                  Words guessed in {formatTime(settings.guessTimeSeconds)}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleRestart}
                variant="primary"
                className="flex-1"
              >
                Play Again
              </Button>
              <Button
                onClick={onBack}
                variant="secondary"
                className="flex-1"
              >
                Exit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Timer at top */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Word display - full screen, just the word */}
        <div className="text-center">
          <h2 className="text-7xl md:text-8xl font-bold text-white break-words px-6">
            {currentWord}
          </h2>
        </div>
      </div>
    </div>
  );
}