import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { NumberStepper } from '../../components/NumberStepper';
import { Toggle } from '../../components/Toggle';
import type { ImposterSettings } from './types';
import { CATEGORIES, type Category } from './wordBanks';

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
    <div className="h-screen w-screen flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Imposter Setup</h1>
          <p className="text-gray-400">Configure your game settings</p>
        </div>

        <Card>
          <div className="space-y-6">
            <NumberStepper
              label="Number of Players"
              value={playerCount}
              onChange={(value) => {
                setPlayerCount(value);
                if (imposterCount >= value) {
                  setImposterCount(Math.max(1, value - 1));
                }
              }}
              min={3}
              max={20}
            />
            {errors.playerCount && (
              <p className="text-red-400 text-sm">{errors.playerCount}</p>
            )}

            <NumberStepper
              label="Number of Imposters"
              value={adjustedImposterCount}
              onChange={(value) => setImposterCount(Math.min(value, maxImposters))}
              min={1}
              max={maxImposters}
            />
            {errors.imposterCount && (
              <p className="text-red-400 text-sm">{errors.imposterCount}</p>
            )}

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
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            variant="primary" 
            className="flex-1"
            disabled={selectedCategories.length === 0}
          >
            {selectedCategories.length === 0 ? 'Select a category' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
