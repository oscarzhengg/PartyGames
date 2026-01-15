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
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(60);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLandscape, setIsLandscape] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handlePresetClick = (seconds: number) => {
    setGuessTimeSeconds(seconds);
    triggerAnimation();
  };

  const handleStepperChange = (newValue: number) => {
    setGuessTimeSeconds(newValue);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDecrement = () => {
    const newValue = Math.max(10, guessTimeSeconds - 5);
    handleStepperChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(120, guessTimeSeconds + 5);
    handleStepperChange(newValue);
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
          <label className="block text-gray-300 font-medium mb-3">
            Guess Time
          </label>
          
          {/* Quick Select Presets */}
          <div className="flex gap-3 mb-4">
            {[30, 60, 90].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`
                  flex-1 py-4 px-4 rounded-xl font-bold text-lg transition-all duration-200
                  border-4
                  ${guessTimeSeconds === preset
                    ? 'bg-gradient-to-br from-green-900 to-emerald-500 text-white border-emerald-400 shadow-lg shadow-green-500/30 scale-105'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600 active:scale-95'
                  }
                `}
              >
                {preset}s
              </button>
            ))}
          </div>

          {/* Custom Stepper */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={guessTimeSeconds <= 10}
              className="w-12 h-12 rounded-xl bg-gray-800 border-2 border-gray-700 text-white font-bold text-2xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              −
            </button>
            <div className="min-w-[80px] text-center">
              <span
                className={`
                  inline-block text-3xl font-bold text-white transition-transform duration-200
                  ${isAnimating ? 'scale-110' : 'scale-100'}
                `}
              >
                {guessTimeSeconds}s
              </span>
            </div>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={guessTimeSeconds >= 120}
              className="w-12 h-12 rounded-xl bg-gray-800 border-2 border-gray-700 text-white font-bold text-2xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              +
            </button>
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