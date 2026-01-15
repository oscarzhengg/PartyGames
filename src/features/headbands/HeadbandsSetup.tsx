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
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoryMode, setCategoryMode] = useState<'select' | 'random'>('select');
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(30);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (categoryMode === 'select' && selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category or choose Random';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    let categorySelection: HeadbandsCategorySelection;
    
    if (categoryMode === 'random') {
      categorySelection = 'random';
    } else {
      categorySelection = selectedCategories;
    }

    onContinue({
      selectedCategories: categorySelection,
      guessTimeSeconds,
    });
  };

  const toggleCategory = (category: Category) => {
    // Only allow one category to be selected at a time
    if (selectedCategories.includes(category)) {
      // If clicking the same category, deselect it
      setSelectedCategories([]);
    } else {
      // Otherwise, select only this category
      setSelectedCategories([category]);
    }
  };

  const categoryDisplayText = 
    categoryMode === 'random' 
      ? 'Random Category'
      : selectedCategories.length > 0
      ? selectedCategories[0]
      : 'No category selected';

  return (
    <div className="h-screen w-screen flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Headbands Setup</h1>
          <p className="text-gray-400">Configure your game settings</p>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Categories
              </label>
              
              {/* Mode selection buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => {
                    setCategoryMode('select');
                  }}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    categoryMode === 'select'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Select Category
                </button>
                <button
                  onClick={() => {
                    setCategoryMode('random');
                    setSelectedCategories([]);
                  }}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    categoryMode === 'random'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Random
                </button>
              </div>

              {/* Category grid (only show when in select mode) */}
              {categoryMode === 'select' && (
                <>
                  {selectedCategories.length > 0 && (
                    <div className="mb-3">
                      <p className="text-gray-300 font-medium text-sm">
                        Selected: {selectedCategories[0]}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {CATEGORIES.map((category) => (
                      <CategorySquare
                        key={category}
                        label={category}
                        isSelected={selectedCategories.includes(category)}
                        onClick={() => toggleCategory(category)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Display selected mode */}
              {categoryMode === 'random' && (
                <div className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center">
                  <span className="font-medium">{categoryDisplayText}</span>
                </div>
              )}

              {errors.categories && (
                <p className="text-red-400 text-sm mt-2">{errors.categories}</p>
              )}
            </div>

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
            disabled={categoryMode === 'select' && selectedCategories.length === 0}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}