import { Button } from '../components/Button';
import { Card } from '../components/Card';

type GameMode = 'imposter' | 'headbands';

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export function ModeSelection({ onSelectMode, onBack }: ModeSelectionProps) {
  return (
    <div className="h-screen-safe w-screen flex flex-col overflow-y-auto safe-area-inset">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Choose Game Mode</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card
            variant="interactive"
            onClick={() => onSelectMode('imposter')}
            className="text-center"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Imposter
              </h2>
              <p className="text-gray-400">
                Find the imposters among your friends
              </p>
            </div>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onSelectMode('headbands')}
            className="text-center"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Headbands
              </h2>
              <p className="text-gray-400">
                Guess your word from clues
              </p>
            </div>
          </Card>
        </div>

        <div className="pt-4 flex-shrink-0">
          <Button onClick={onBack} fullWidth variant="secondary">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
