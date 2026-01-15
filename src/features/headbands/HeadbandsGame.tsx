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

type GamePhase = 'countdown' | 'playing' | 'paused';

export function HeadbandsGame({ settings, onBack }: HeadbandsGameProps) {
  const [words] = useState(() => getShuffledWords(settings.selectedCategories));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(settings.guessTimeSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [lastTiltAction, setLastTiltAction] = useState<TiltAction>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

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

  // Timer effect
  useEffect(() => {
    if (phase !== 'playing' || isPaused) return;

    if (timeRemaining <= 0) {
      // Time's up - move to next word
      handleNextWord();
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
    setTimeRemaining(settings.guessTimeSeconds);
    setLastTiltAction(null);
  }, [words.length, settings.guessTimeSeconds]);

  const handlePreviousWord = useCallback(() => {
    setCurrentWordIndex((prev) => {
      if (prev === 0) {
        return words.length - 1;
      }
      return prev - 1;
    });
    setTimeRemaining(settings.guessTimeSeconds);
    setLastTiltAction(null);
  }, [words.length, settings.guessTimeSeconds]);

  const handleTilt = useCallback(
    (action: TiltAction) => {
      if (!tiltEnabled || phase !== 'playing') return;

      setLastTiltAction(action);

      if (action === 'correct' || action === 'pass') {
        // Move to next word on correct or pass
        setTimeout(() => {
          handleNextWord();
        }, 500);
      }
      // For 'wrong', just show feedback but continue with current word
    },
    [tiltEnabled, phase, handleNextWord]
  );

  useTiltDetection({
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

            {/* Tilt instructions */}
            <div className="pt-6 space-y-2 text-sm text-gray-400">
              <p>Tilt your phone to indicate:</p>
              <div className="flex flex-col gap-1 items-center">
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
            </div>
          </div>
        </Card>

        {/* Navigation buttons */}
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

        {/* Word counter */}
        <div className="text-center text-gray-400 text-sm">
          Word {currentWordIndex + 1} of {words.length}
        </div>

        {/* Back button */}
        <Button onClick={onBack} variant="secondary" fullWidth>
          Exit Game
        </Button>
      </div>
    </div>
  );
}