import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="h-screen-safe w-screen flex flex-col overflow-y-auto safe-area-inset">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            How to Play
          </h1>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-white mb-4">Imposter Mode</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Setup</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Choose the number of players (3-20)</li>
                <li>Set how many imposters (at least 1, fewer than players)</li>
                <li>Enter a secret word that regular players will see</li>
                <li>Enter a hint for the imposters</li>
                <li>Optionally enable "Imposter never goes first" rule</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Gameplay</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Pass the phone around to each player</li>
                <li>Each player taps their card to reveal their role privately</li>
                <li>Regular players see the secret word</li>
                <li>Imposters see they are the imposter and the hint</li>
                <li>Tap "Hide" after viewing to mark your card as viewed</li>
                <li>Once all players have viewed their roles, the discussion begins</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Objective</h3>
              <p>Regular players try to identify the imposters. Imposters try to blend in and avoid being caught!</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-white mb-4">Headbands Mode</h2>
          <p className="text-gray-400">Coming soon! Stay tuned for this exciting game mode.</p>
        </Card>

        <div className="pt-4 flex-shrink-0">
          <Button onClick={onBack} fullWidth variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
