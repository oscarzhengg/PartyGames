import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { RoleAssignment } from './types';
import type { WordWithHint } from './wordBanks';

interface AllReadyProps {
  secretWord: WordWithHint;
  roleAssignment: RoleAssignment;
  onBackToHome: () => void;
  onSetupAgain?: () => void;
}

export function AllReady({ secretWord, roleAssignment, onBackToHome, onSetupAgain }: AllReadyProps) {
  const [showResults, setShowResults] = useState(false);

  const imposterText = roleAssignment.imposters.length === 1
    ? `Player ${roleAssignment.imposters[0]}`
    : `Players ${roleAssignment.imposters.join(', ')}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        {!showResults ? (
          <>
            <Card className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-green-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white">All Roles Assigned</h1>
                
                <p className="text-gray-300 text-lg">
                  Start the discussion and figure out who the imposters are.
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              <Button onClick={() => setShowResults(true)} fullWidth variant="primary">
                End Game
              </Button>
              {onSetupAgain && (
                <Button onClick={onSetupAgain} fullWidth variant="secondary">
                  Setup Again
                </Button>
              )}
              <Button onClick={onBackToHome} fullWidth variant="secondary">
                Back to Home
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card className="text-center space-y-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-4">Game Results</h1>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-2">The secret word was:</p>
                    <p className="text-4xl font-bold text-white bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      {secretWord.word}
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-gray-400 mb-2">The imposter{roleAssignment.imposters.length > 1 ? 's were' : ' was'}:</p>
                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                      {imposterText}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {onSetupAgain && (
                <Button onClick={onSetupAgain} fullWidth variant="secondary">
                  Setup Again
                </Button>
              )}
              <Button onClick={onBackToHome} fullWidth variant="primary">
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
