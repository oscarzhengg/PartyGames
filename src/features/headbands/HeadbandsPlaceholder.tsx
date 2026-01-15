import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface HeadbandsPlaceholderProps {
  onBack: () => void;
}

export function HeadbandsPlaceholder({ onBack }: HeadbandsPlaceholderProps) {
  return (
    <div className="h-screen-safe w-screen flex items-center justify-center p-4 safe-area-inset">
      <div className="max-w-md w-full space-y-6">
        <Card className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-900 to-emerald-500 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white">Headbands Mode</h1>
            
            <p className="text-gray-300">
              This game mode is coming soon! Stay tuned for exciting updates.
            </p>

            <div className="pt-4 text-left">
              <p className="text-gray-400 text-sm mb-2">What to expect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm ml-2">
                <li>Each player gets a word on their "headband"</li>
                <li>Players ask yes/no questions to guess their word</li>
                <li>First to guess correctly wins!</li>
              </ul>
            </div>
          </div>
        </Card>

        <Button onClick={onBack} fullWidth variant="primary">
          Back to Mode Selection
        </Button>
      </div>
    </div>
  );
}
