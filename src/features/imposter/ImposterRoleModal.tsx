import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import type { PlayerId } from './types';
import { getCategoryForWord, getHintForWord } from './wordBanks';

interface ImposterRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: PlayerId;
  isImposter: boolean;
  secretWord: string;
  imposterGetsCategory: boolean;
  imposterGetsHint: boolean;
}

export function ImposterRoleModal({
  isOpen,
  onClose,
  playerId,
  isImposter,
  secretWord,
  imposterGetsCategory,
  imposterGetsHint,
}: ImposterRoleModalProps) {
  const category = getCategoryForWord(secretWord);
  const hint = getHintForWord(secretWord);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Player ${playerId}`}>
      <div className="space-y-6 py-4">
        {isImposter ? (
          <>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                You are the Imposter!
              </h3>
              <div className="pt-4 space-y-4">
                {imposterGetsCategory && category && (
                  <div>
                    <p className="text-gray-400 mb-2">Category:</p>
                    <p className="text-xl text-white font-semibold bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      {category}
                    </p>
                  </div>
                )}
                {imposterGetsHint && hint && (
                  <div>
                    <p className="text-gray-400 mb-2">Hint:</p>
                    <p className="text-xl text-white font-semibold bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      {hint}
                    </p>
                  </div>
                )}
                {!imposterGetsCategory && !imposterGetsHint && (
                  <p className="text-gray-400">You have no clues. Good luck!</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">You are a regular player</p>
              <div className="pt-4">
                <p className="text-gray-400 mb-2">The secret word is:</p>
                <p className="text-5xl font-bold text-white bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  {secretWord}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="pt-4">
          <Button onClick={onClose} fullWidth variant="primary">
            Hide &amp; Return
          </Button>
        </div>
      </div>
    </Modal>
  );
}
