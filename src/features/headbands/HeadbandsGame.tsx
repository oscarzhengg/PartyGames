import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { HeadbandsSettings } from './types';
import { getShuffledWords } from './logic';

interface HeadbandsGameProps {
  settings: HeadbandsSettings;
  onBack: () => void;
}

type GamePhase = 'countdown' | 'playing' | 'finished';

export function HeadbandsGame({ settings, onBack }: HeadbandsGameProps) {
  const [words, setWords] = useState(() => getShuffledWords(settings.selectedCategories));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(settings.guessTimeSeconds);
  const [correctGuessed, setCorrectGuessed] = useState(0);
  const [totalGuessed, setTotalGuessed] = useState(0);
  const [wordColor, setWordColor] = useState<'white' | 'green' | 'red'>('white');
  const isProcessingTap = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const touchHandledRef = useRef(false);

  // Countdown effect
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdown <= 0) {
      setPhase('playing');
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
    if (phase !== 'playing') return;

    if (timeRemaining <= 0) {
      // Time's up - end the game
      setPhase('finished');
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeRemaining]);

  // Disable scrolling during gameplay
  useEffect(() => {
    if (phase === 'playing') {
      // Prevent scrolling on touch devices
      const preventScroll = (e: TouchEvent) => {
        e.preventDefault();
      };

      // Prevent scroll on wheel
      const preventWheel = (e: WheelEvent) => {
        e.preventDefault();
      };

      // Add event listeners
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });

      // Disable body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventWheel);
        document.body.style.overflow = '';
      };
    }
  }, [phase]);

  const handleNextWord = () => {
    setCurrentWordIndex((prev) => {
      if (prev >= words.length - 1) {
        // All words used, restart from beginning
        return 0;
      }
      return prev + 1;
    });
  };

  const handleTap = (side: 'left' | 'right', event?: React.TouchEvent | React.MouseEvent) => {
    if (phase !== 'playing') return;
    if (isProcessingTap.current) return; // Prevent multiple taps

    // Prevent default to stop any other event handlers
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Mark as processing
    isProcessingTap.current = true;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (side === 'left') {
      // Left tap = correct - show green, then move to next word
      setWordColor('green');
      setCorrectGuessed((prev) => prev + 1);
      setTotalGuessed((prev) => prev + 1);
      timeoutRef.current = window.setTimeout(() => {
        handleNextWord();
        setWordColor('white');
        isProcessingTap.current = false;
        timeoutRef.current = null;
      }, 500);
    } else {
      // Right tap = wrong/pass - show red, then move to next word
      setWordColor('red');
      setTotalGuessed((prev) => prev + 1);
      timeoutRef.current = window.setTimeout(() => {
        handleNextWord();
        setWordColor('white');
        isProcessingTap.current = false;
        timeoutRef.current = null;
      }, 500);
    }
  };

  const handleRestart = () => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isProcessingTap.current = false;
    
    // Reshuffle words for new game
    setWords(getShuffledWords(settings.selectedCategories));
    setPhase('countdown');
    setCountdown(3);
    setCurrentWordIndex(0);
    setTimeRemaining(settings.guessTimeSeconds);
    setCorrectGuessed(0);
    setTotalGuessed(0);
    setWordColor('white');
  };

  const currentWord = words[currentWordIndex] || '';

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (phase === 'countdown') {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
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
      <div className="h-screen w-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Time's Up!</h2>
              <p className="text-gray-400">Great job!</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  {correctGuessed}/{totalGuessed}
                </div>
                <div className="text-gray-300 text-sm">
                  Correct guesses out of {totalGuessed > 0 ? 'total' : '0'} guesses
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  in {formatTime(settings.guessTimeSeconds)}
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

  const getWordColorClass = () => {
    switch (wordColor) {
      case 'green':
        return 'text-green-400';
      case 'red':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden touch-none">
      {/* Timer at top */}
      <div className="text-center pt-4 pb-2 flex-shrink-0">
        <div className="text-4xl font-bold text-white">
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Split screen - left and right halves (invisible, for tap detection) */}
      <div className="flex-1 flex relative min-h-0">
        {/* Left half - tap for correct */}
        <div
          className="flex-1 cursor-pointer touch-none"
          onClick={(e) => {
            // Only handle click if touch wasn't already handled
            if (!touchHandledRef.current) {
              handleTap('left', e);
            }
            touchHandledRef.current = false;
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            touchHandledRef.current = true;
            handleTap('left', e);
          }}
          onTouchEnd={(e) => e.preventDefault()}
        />

        {/* Right half - tap for wrong/pass */}
        <div
          className="flex-1 cursor-pointer touch-none"
          onClick={(e) => {
            // Only handle click if touch wasn't already handled
            if (!touchHandledRef.current) {
              handleTap('right', e);
            }
            touchHandledRef.current = false;
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            touchHandledRef.current = true;
            handleTap('right', e);
          }}
          onTouchEnd={(e) => e.preventDefault()}
        />

        {/* Centered word overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6">
            <h2 className={`text-7xl md:text-8xl font-bold break-words transition-colors duration-200 ${getWordColorClass()}`}>
              {currentWord}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}