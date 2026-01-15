import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Toggle } from '../../components/Toggle';
import type { ImposterSettings } from './types';
import { CATEGORIES, type Category } from './wordBanks';

const BackIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

interface ImposterSetupProps {
  selectedCategories: Category[];
  onCategoriesClick: () => void;
  onContinue: (settings: ImposterSettings) => void;
  onBack: () => void;
}

interface ValidationErrors {
  playerCount?: string;
  imposterCount?: string;
  categories?: string;
}

export function ImposterSetup({ 
  selectedCategories, 
  onCategoriesClick,
  onContinue, 
  onBack 
}: ImposterSetupProps) {
  const [playerCount, setPlayerCount] = useState(6);
  const [imposterCount, setImposterCount] = useState(1);
  const [noImposterFirst, setNoImposterFirst] = useState(false);
  const [imposterGetsCategory, setImposterGetsCategory] = useState(true);
  const [imposterGetsHint, setImposterGetsHint] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (playerCount < 3) {
      newErrors.playerCount = 'Need at least 3 players';
    }

    if (imposterCount < 1) {
      newErrors.imposterCount = 'Need at least 1 imposter';
    }

    if (imposterCount >= playerCount) {
      newErrors.imposterCount = 'Imposters must be fewer than total players';
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = 'At least one category must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      // The secret word will be selected later in the logic
      onContinue({
        playerCount,
        imposterCount,
        noImposterFirst,
        selectedCategories,
        secretWord: { word: '', hint: '' }, // Will be replaced during role assignment
        imposterGetsCategory,
        imposterGetsHint,
      });
    }
  };

  const maxImposters = playerCount - 1;
  const adjustedImposterCount = Math.min(imposterCount, maxImposters);

  const categoryDisplayText = selectedCategories.length === CATEGORIES.length
    ? 'All categories'
    : `${selectedCategories.length} categories`;

  return (
    <div className="h-screen-safe w-screen flex flex-col overflow-y-auto safe-area-inset">
      {/* Fixed top banner */}
      <div className="flex-shrink-0 flex items-center justify-center pt-6 pb-4 px-4 relative">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 p-2 text-gray-400 hover:text-white transition-colors active:scale-95 flex-shrink-0"
          aria-label="Back"
        >
          {BackIcon}
        </button>
        <h1 className="text-2xl font-bold text-white">Imposter Setup</h1>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 py-6 space-y-6">
        <Card>
          <div className="space-y-6">
            {/* Number of Players - Centered with green "players" text */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-300 font-medium mb-2 text-center">
                Number of <span className="text-green-500">Players</span>
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(3, playerCount - 1);
                    setPlayerCount(newValue);
                    if (imposterCount >= newValue) {
                      setImposterCount(Math.max(1, newValue - 1));
                    }
                  }}
                  disabled={playerCount <= 3}
                  className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <div className="w-16 text-center text-2xl font-bold text-white">
                  {playerCount}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.min(20, playerCount + 1);
                    setPlayerCount(newValue);
                  }}
                  disabled={playerCount >= 20}
                  className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              {errors.playerCount && (
                <p className="text-red-400 text-sm mt-2">{errors.playerCount}</p>
              )}
            </div>

            {/* Number of Imposters - Centered with red "imposters" text */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-300 font-medium mb-2 text-center">
                Number of <span className="text-red-500">Imposters</span>
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setImposterCount(Math.max(1, adjustedImposterCount - 1))}
                  disabled={adjustedImposterCount <= 1}
                  className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <div className="w-16 text-center text-2xl font-bold text-white">
                  {adjustedImposterCount}
                </div>
                <button
                  type="button"
                  onClick={() => setImposterCount(Math.min(maxImposters, adjustedImposterCount + 1))}
                  disabled={adjustedImposterCount >= maxImposters}
                  className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              {errors.imposterCount && (
                <p className="text-red-400 text-sm mt-2">{errors.imposterCount}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Categories
              </label>
              <button
                onClick={onCategoriesClick}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white hover:border-green-500/50 hover:bg-gray-700 transition-all text-left flex items-center justify-between group"
              >
                <span className="font-medium">{categoryDisplayText}</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {errors.categories && (
                <p className="text-red-400 text-sm mt-2">{errors.categories}</p>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <Toggle
                label="Imposter gets category"
                checked={imposterGetsCategory}
                onChange={setImposterGetsCategory}
              />
              <Toggle
                label="Imposter gets hint"
                checked={imposterGetsHint}
                onChange={setImposterGetsHint}
              />
              <Toggle
                label="Imposter never goes first"
                checked={noImposterFirst}
                onChange={setNoImposterFirst}
              />
              {noImposterFirst && (
                <p className="text-gray-400 text-sm ml-2">
                  Player 1 will never be an imposter
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-4 flex-shrink-0">
          <Button 
            onClick={handleContinue} 
            variant="primary" 
            className="flex-1"
            disabled={selectedCategories.length === 0}
          >
            {selectedCategories.length === 0 ? 'Select a category' : 'Start Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}
