import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CategorySquare } from '../../components/CategorySquare';
import type { HeadbandsSettings, HeadbandsCategorySelection } from './types';
import { CATEGORIES, type Category } from '../imposter/wordBanks';

interface HeadbandsSetupProps {
  onContinue: (settings: HeadbandsSettings) => void;
  onBack: () => void;
}

interface ValidationErrors {
  categories?: string;
}

export function HeadbandsSetup({ onContinue, onBack }: HeadbandsSetupProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'random' | null>(null);
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(30);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Sort categories alphabetically
  const sortedCategories = [...CATEGORIES].sort();

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedCategory) {
      newErrors.categories = 'Please select a category or choose Random';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    let categorySelection: HeadbandsCategorySelection;
    
    if (selectedCategory === 'random') {
      categorySelection = 'random';
    } else if (selectedCategory) {
      categorySelection = [selectedCategory];
    } else {
      return; // Should not happen due to validation
    }

    onContinue({
      selectedCategories: categorySelection,
      guessTimeSeconds,
    });
  };

  const handleCategorySelect = (category: Category | 'random') => {
    // Toggle selection - if clicking the same category, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="h-screen-safe w-screen flex flex-col safe-area-inset">
      {/* Fixed Top Banner */}
      <div className="flex-shrink-0 text-center py-4 px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Headbands Setup</h1>
        <p className="text-gray-400">Configure your game settings</p>
      </div>

      {/* Scrollable Categories Container */}
      <div className="flex-1 min-h-0 px-4">
        <Card className="h-full flex flex-col">
          <label className="block text-gray-300 font-medium mb-3 flex-shrink-0">
            Categories
          </label>
          
          {/* Scrollable category container */}
          {/* Portrait: 1 row horizontal scroll, Landscape: 2 columns vertical scroll */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Portrait: horizontal scroll */}
            <div className="h-full overflow-x-auto overflow-y-hidden landscape:hidden">
              <div className="flex gap-2 pb-2 h-full items-stretch" style={{ width: 'max-content' }}>
                {/* Random option first */}
                <div className="w-24 h-24 flex-shrink-0">
                  <CategorySquare
                    label="Random"
                    isSelected={selectedCategory === 'random'}
                    onClick={() => handleCategorySelect('random')}
                  />
                </div>
                {/* Then categories alphabetically */}
                {sortedCategories.map((category) => (
                  <div key={category} className="w-24 h-24 flex-shrink-0">
                    <CategorySquare
                      label={category}
                      isSelected={selectedCategory === category}
                      onClick={() => handleCategorySelect(category)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Landscape: vertical scroll with 2 columns */}
            <div className="hidden landscape:block h-full overflow-y-auto overflow-x-hidden">
              <div className="grid grid-cols-2 gap-2 pr-2">
                {/* Random option first */}
                <CategorySquare
                  label="Random"
                  isSelected={selectedCategory === 'random'}
                  onClick={() => handleCategorySelect('random')}
                />
                {/* Then categories alphabetically */}
                {sortedCategories.map((category) => (
                  <CategorySquare
                    key={category}
                    label={category}
                    isSelected={selectedCategory === category}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))}
              </div>
            </div>
          </div>

          {errors.categories && (
            <p className="text-red-400 text-sm mt-2 flex-shrink-0">{errors.categories}</p>
          )}
        </Card>
      </div>

      {/* Fixed Bottom Section */}
      <div className="flex-shrink-0 px-4 pb-4 space-y-4">
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Guess Time: {guessTimeSeconds} seconds
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={guessTimeSeconds}
            onChange={(e) => setGuessTimeSeconds(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            style={{
              background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${((guessTimeSeconds - 10) / (90 - 10)) * 100}%, rgb(55, 65, 81) ${((guessTimeSeconds - 10) / (90 - 10)) * 100}%, rgb(55, 65, 81) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10s</span>
            <span>90s</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            variant="primary" 
            className="flex-1"
            disabled={!selectedCategory}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}