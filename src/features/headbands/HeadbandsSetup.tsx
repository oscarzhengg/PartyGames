import { useState, useEffect } from 'react';
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
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isRandomSelected, setIsRandomSelected] = useState(false);
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(30);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLandscape, setIsLandscape] = useState(false);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Sort categories alphabetically
  const sortedCategories = [...CATEGORIES].sort();

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!isRandomSelected && selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category or choose Random';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    let categorySelection: HeadbandsCategorySelection;
    
    if (isRandomSelected) {
      categorySelection = 'random';
    } else {
      categorySelection = selectedCategories;
    }

    onContinue({
      selectedCategories: categorySelection,
      guessTimeSeconds,
    });
  };

  const handleRandomClick = () => {
    setIsRandomSelected(true);
    setSelectedCategories([]);
  };

  const toggleCategory = (category: Category) => {
    // If clicking random, deselect all categories
    if (isRandomSelected) {
      setIsRandomSelected(false);
    }
    
    // Only allow one category to be selected at a time
    if (selectedCategories.includes(category)) {
      // If clicking the same category, deselect it
      setSelectedCategories([]);
    } else {
      // Otherwise, select only this category
      setSelectedCategories([category]);
      setIsRandomSelected(false);
    }
  };

  return (
    <div className="h-screen-safe w-screen flex flex-col safe-area-inset">
      {/* Fixed top banner */}
      <div className="flex-shrink-0 text-center pt-6 pb-4 px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Headbands Setup</h1>
        <p className="text-gray-400">Configure your game settings</p>
      </div>

      {/* Scrollable categories container */}
      <div className="flex-1 min-h-0 px-4 py-2">
        <Card className="h-full flex flex-col overflow-hidden !p-4">
          <label className="block text-gray-300 font-medium mb-3 flex-shrink-0">
            Categories
          </label>
          
          {/* Scrollable category container */}
          {/* Portrait: 2 columns vertical scroll, Landscape: 1 row horizontal scroll */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {isLandscape ? (
              /* Landscape layout: 1 row, horizontal scroll */
              <div className="h-full overflow-x-auto overflow-y-hidden">
                <div className="flex gap-2 h-full items-start pb-2" style={{ width: 'max-content' }}>
                  {/* Random option first */}
                  <div className="flex-shrink-0 w-24">
                    <CategorySquare
                      label="Random"
                      isSelected={isRandomSelected}
                      onClick={handleRandomClick}
                    />
                  </div>
                  {/* Rest of categories alphabetically */}
                  {sortedCategories.map((category) => (
                    <div key={category} className="flex-shrink-0 w-24">
                      <CategorySquare
                        label={category}
                        isSelected={selectedCategories.includes(category)}
                        onClick={() => toggleCategory(category)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Portrait layout: 2 columns, vertical scroll */
              <div className="h-full overflow-y-auto overflow-x-hidden">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {/* Random option first */}
                  <CategorySquare
                    label="Random"
                    isSelected={isRandomSelected}
                    onClick={handleRandomClick}
                  />
                  {/* Rest of categories alphabetically */}
                  {sortedCategories.map((category) => (
                    <CategorySquare
                      key={category}
                      label={category}
                      isSelected={selectedCategories.includes(category)}
                      onClick={() => toggleCategory(category)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected category display */}
          {(isRandomSelected || selectedCategories.length > 0) && (
            <div className="mt-3 flex-shrink-0">
              <p className="text-gray-300 font-medium text-sm">
                Selected: {isRandomSelected ? 'Random' : selectedCategories[0]}
              </p>
            </div>
          )}

          {errors.categories && (
            <p className="text-red-400 text-sm mt-2 flex-shrink-0">{errors.categories}</p>
          )}
        </Card>
      </div>

      {/* Fixed bottom section */}
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
            disabled={!isRandomSelected && selectedCategories.length === 0}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}