import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { NumberStepper } from '../../components/NumberStepper';
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
  const [categoryMode, setCategoryMode] = useState<'select' | 'random' | 'mixed'>('select');
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(60);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (categoryMode === 'select' && selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category or choose Random/Mixed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      let categorySelection: HeadbandsCategorySelection;
      
      if (categoryMode === 'random') {
        categorySelection = 'random';
      } else if (categoryMode === 'mixed') {
        categorySelection = 'mixed';
      } else {
        categorySelection = selectedCategories;
      }

      onContinue({
        selectedCategories: categorySelection,
        guessTimeSeconds,
      });
    }
  };

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const selectAll = () => {
    setSelectedCategories(CATEGORIES);
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const allSelected = selectedCategories.length === CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  const categoryDisplayText = 
    categoryMode === 'random' 
      ? 'Random Category'
      : categoryMode === 'mixed'
      ? 'All Categories Mixed'
      : selectedCategories.length === CATEGORIES.length
      ? 'All Categories'
      : `${selectedCategories.length} categories`;

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
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
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => {
                    setCategoryMode('select');
                    setSelectedCategories([]);
                  }}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    categoryMode === 'select'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Select
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
                <button
                  onClick={() => {
                    setCategoryMode('mixed');
                    setSelectedCategories([]);
                  }}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    categoryMode === 'mixed'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Mixed
                </button>
              </div>

              {/* Category grid (only show when in select mode) */}
              {categoryMode === 'select' && (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-gray-300 font-medium text-sm">
                        {selectedCategories.length} of {CATEGORIES.length} selected
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!allSelected && (
                        <button
                          onClick={selectAll}
                          className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          Select All
                        </button>
                      )}
                      {!noneSelected && (
                        <button
                          onClick={deselectAll}
                          className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          Deselect All
                        </button>
                      )}
                    </div>
                  </div>

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
              {categoryMode !== 'select' && (
                <div className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center">
                  <span className="font-medium">{categoryDisplayText}</span>
                </div>
              )}

              {errors.categories && (
                <p className="text-red-400 text-sm mt-2">{errors.categories}</p>
              )}
            </div>

            <NumberStepper
              label="Guess Time (seconds)"
              value={guessTimeSeconds}
              onChange={setGuessTimeSeconds}
              min={10}
              max={300}
            />
          </div>
        </Card>

        <div className="flex gap-4">
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