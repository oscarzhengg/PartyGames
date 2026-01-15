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

type GamePhase = 'countdown' | 'playing' | 'paused' | 'finished';

export function HeadbandsGame({ settings, onBack }: HeadbandsGameProps) {
  const [words] = useState(() => getShuffledWords(settings.selectedCategories));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(settings.guessTimeSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [lastTiltAction, setLastTiltAction] = useState<TiltAction>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [wordsGuessed, setWordsGuessed] = useState(0); // Track how many words were correctly guessed/passed

  // Countdown effect
  useEffect(() => {
    if (phase !== 'countdown') return;

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
  }, [phase, countdown, settings.guessTimeSeconds]);

  // Timer effect - constant timer for the entire round
  useEffect(() => {
    if (phase !== 'playing' || isPaused) return;

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
  }, [phase, timeRemaining, isPaused]);

  const handleNextWord = useCallback(() => {
    setCurrentWordIndex((prev) => {
      if (prev >= words.length - 1) {
        // All words used, restart from beginning
        return 0;
      }
      return prev + 1;
    });
    setLastTiltAction(null);
  }, [words.length]);

  const handlePreviousWord = useCallback(() => {
    setCurrentWordIndex((prev) => {
      if (prev === 0) {
        return words.length - 1;
      }
      return prev - 1;
    });
    setLastTiltAction(null);
  }, [words.length]);

  const handleTilt = useCallback(
    (action: TiltAction) => {
      if (!tiltEnabled || phase !== 'playing') return;

      setLastTiltAction(action);

      if (action === 'correct' || action === 'pass') {
        // Move to next word on correct or pass
        setWordsGuessed((prev) => prev + 1);
        setTimeout(() => {
          handleNextWord();
        }, 500);
      }
      // For 'wrong', just show feedback but continue with current word
    },
    [tiltEnabled, phase, handleNextWord]
  );

  const {
    requestPermission,
    permissionState,
    isSupported,
    currentOrientation,
  } = useTiltDetection({
    onTilt: handleTilt,
    enabled: tiltEnabled && phase === 'playing',
    tiltThreshold: 25,
  });

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setPhase('countdown');
    setCountdown(3);
    setCurrentWordIndex(0);
    setTimeRemaining(settings.guessTimeSeconds);
    setIsPaused(false);
    setTiltEnabled(false);
    setLastTiltAction(null);
    setWordsGuessed(0);
  };

  const currentWord = words[currentWordIndex] || '';

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get tilt action feedback color
  const getTiltFeedbackColor = () => {
    switch (lastTiltAction) {
      case 'correct':
        return 'text-green-400';
      case 'wrong':
        return 'text-red-400';
      case 'pass':
        return 'text-yellow-400';
      default:
        return 'text-transparent';
    }
  };

  // Get tilt action text
  const getTiltFeedbackText = () => {
    switch (lastTiltAction) {
      case 'correct':
        return '✓ Correct!';
      case 'wrong':
        return '✗ Wrong';
      case 'pass':
        return '→ Pass';
      default:
        return '';
    }
  };

  if (phase === 'countdown') {
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
    <div className="min-h-screen p-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with timer and controls */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-white mb-1">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-400 text-sm">Time remaining</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePause}
              variant="secondary"
              className="px-4 py-2"
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </Button>
            <Button
              onClick={handleRestart}
              variant="secondary"
              className="px-4 py-2"
            >
              ↻ Restart
            </Button>
          </div>
        </div>

        {/* Word display */}
        <Card className="min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-6 w-full">
            {/* Word (horizontal) */}
            <div className="px-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white break-words">
                {currentWord}
              </h2>
            </div>

            {/* Tilt feedback */}
            <div className={`text-3xl font-bold transition-all duration-300 ${getTiltFeedbackColor()}`}>
              {getTiltFeedbackText()}
            </div>

            {/* Tilt instructions and permission */}
            <div className="pt-6 space-y-4 text-sm">
              {permissionState === 'prompt' && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 space-y-3">
                  <p className="text-yellow-400 font-medium">
                    Tilt detection requires permission
                  </p>
                  <Button
                    onClick={requestPermission}
                    variant="primary"
                    className="w-full"
                  >
                    Enable Tilt Detection
                  </Button>
                  <p className="text-yellow-300 text-xs">
                    On iOS, you'll need to grant motion & orientation access
                  </p>
                </div>
              )}

              {permissionState === 'denied' && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 font-medium mb-2">
                    Tilt detection denied
                  </p>
                  <p className="text-red-300 text-xs mb-3">
                    Please enable motion & orientation in your browser settings, or use the buttons below.
                  </p>
                  <Button
                    onClick={requestPermission}
                    variant="secondary"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {permissionState === 'unsupported' && (
                <div className="bg-gray-500/20 border border-gray-500/50 rounded-lg p-4">
                  <p className="text-gray-400 font-medium">
                    Tilt detection not available
                  </p>
                  <p className="text-gray-300 text-xs mt-2">
                    Your device or browser doesn't support tilt detection. Use the buttons below to navigate.
                  </p>
                </div>
              )}

              {permissionState === 'granted' && (
                <div className="space-y-2 text-gray-400">
                  <p className="text-green-400 font-medium">✓ Tilt detection active</p>
                  <p className="text-xs">Tilt your phone to indicate:</p>
                  <div className="flex flex-col gap-1 items-center mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">↑</span>
                      <span>Tilt Up = Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">↓</span>
                      <span>Tilt Down = Wrong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">↔</span>
                      <span>Tilt Left/Right = Pass</span>
                    </div>
                  </div>
                  {/* Debug info (can be removed in production) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-500 mt-2">
                      Debug: β={currentOrientation.beta?.toFixed(1) ?? 'N/A'}° 
                      γ={currentOrientation.gamma?.toFixed(1) ?? 'N/A'}°
                    </div>
                  )}
                </div>
              )}

              {permissionState === 'unknown' && (
                <div className="space-y-2 text-gray-400">
                  <p>Loading tilt detection...</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation buttons - only show if tilt is not available */}
        {(permissionState === 'unsupported' || permissionState === 'denied') && (
          <div className="flex gap-4">
            <Button
              onClick={handlePreviousWord}
              variant="secondary"
              className="flex-1"
              disabled={isPaused}
            >
              ← Previous Word
            </Button>
            <Button
              onClick={handleNextWord}
              variant="primary"
              className="flex-1"
              disabled={isPaused}
            >
              Next Word →
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 text-gray-400 text-sm">
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">{wordsGuessed}</div>
            <div>Words guessed</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">{currentWordIndex + 1}</div>
            <div>Current word</div>
          </div>
        </div>

        {/* Back button */}
        <Button onClick={onBack} variant="secondary" fullWidth>
          Exit Game
        </Button>
      </div>
    </div>
  );
}