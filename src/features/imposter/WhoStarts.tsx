import { useMemo } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface WhoStartsProps {
  playerCount: number;
  onContinue: () => void;
}

export function WhoStarts({ playerCount, onContinue }: WhoStartsProps) {
  const startingPlayer = useMemo(
    () => Math.floor(Math.random() * playerCount) + 1,
    [playerCount]
  );

  return (
    <div className="h-screen-safe w-screen flex items-center justify-center p-4 safe-area-inset">
      <div className="max-w-md w-full space-y-6">
        <Card className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-gray-400 text-lg">Starting the discussion...</p>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-400/50">
                <span className="text-4xl font-bold text-amber-400">
                  {startingPlayer}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Player {startingPlayer} starts!
            </h1>
            <p className="text-gray-300">
              Pass the device so everyone can see, then begin the discussion.
            </p>
          </div>
        </Card>

        <Button onClick={onContinue} fullWidth variant="primary">
          Continue to discussion
        </Button>
      </div>
    </div>
  );
}
