import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { ImposterRoleModal } from './ImposterRoleModal';
import type { PlayerId, ImposterSettings, RoleAssignment } from './types';

interface ImposterPlayerGridProps {
  settings: ImposterSettings;
  roleAssignment: RoleAssignment;
  onAllReady: () => void;
  onBack: () => void;
}

interface PlayerState {
  id: PlayerId;
  hasViewed: boolean;
}

export function ImposterPlayerGrid({
  settings,
  roleAssignment,
  onAllReady,
  onBack,
}: ImposterPlayerGridProps) {
  const [players, setPlayers] = useState<PlayerState[]>(() => {
    return Array.from({ length: settings.playerCount }, (_, i) => ({
      id: (i + 1) as PlayerId,
      hasViewed: false,
    }));
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayerClick = (playerId: PlayerId) => {
    const player = players.find((p) => p.id === playerId);
    if (player && !player.hasViewed) {
      setSelectedPlayerId(playerId);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    if (selectedPlayerId !== null) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === selectedPlayerId ? { ...p, hasViewed: true } : p
        )
      );
      setIsModalOpen(false);
      setSelectedPlayerId(null);
    }
  };

  const allPlayersViewed = players.every((p) => p.hasViewed);

  useEffect(() => {
    if (allPlayersViewed) {
      // Small delay to show the final state before transitioning
      const timer = setTimeout(() => {
        onAllReady();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allPlayersViewed, onAllReady]);

  const isImposter =
    selectedPlayerId !== null && roleAssignment.imposters.includes(selectedPlayerId);

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Players</h1>
          <p className="text-gray-400">
            Tap your name to reveal your word, then pass the device.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player) => {
            const isViewed = player.hasViewed;
            return (
              <Card
                key={player.id}
                variant={isViewed ? 'dimmed' : 'interactive'}
                onClick={isViewed ? undefined : () => handlePlayerClick(player.id)}
                className="text-center"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Player {player.id}</h3>
                </div>
              </Card>
            );
          })}
        </div>

        {allPlayersViewed && (
          <div className="text-center pt-4">
            <p className="text-lg text-green-400 font-semibold">
              All players have viewed their roles!
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onBack}
            className="w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Setup
          </button>
        </div>

        {selectedPlayerId && (
          <ImposterRoleModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            playerId={selectedPlayerId}
            isImposter={isImposter}
            secretWord={settings.secretWord}
            imposterGetsCategory={settings.imposterGetsCategory}
            imposterGetsHint={settings.imposterGetsHint}
          />
        )}
      </div>
    </div>
  );
}
