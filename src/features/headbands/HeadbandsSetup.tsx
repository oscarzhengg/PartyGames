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

type PermissionState = 'unknown' | 'prompt' | 'granted' | 'denied' | 'unsupported';

export function HeadbandsSetup({ onContinue, onBack }: HeadbandsSetupProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoryMode, setCategoryMode] = useState<'select' | 'random'>('select');
  const [guessTimeSeconds, setGuessTimeSeconds] = useState(30);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');
  const [isRequesting, setIsRequesting] = useState(false);

  // Check if device orientation is supported
  useEffect(() => {
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    const hasOrientationEvent = typeof DeviceOrientationEvent !== 'undefined';
    
    if (!isSecureContext) {
      setPermissionState('unsupported');
    } else if (!hasOrientationEvent) {
      setPermissionState('unsupported');
    } else if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS 13+ requires permission
      setPermissionState('prompt');
    } else {
      // Permission not required, already granted
      setPermissionState('granted');
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (permissionState === 'unsupported') {
      return false;
    }

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        setIsRequesting(true);
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          setIsRequesting(false);
          return true;
        } else {
          setPermissionState('denied');
          setIsRequesting(false);
          return false;
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionState('denied');
        setIsRequesting(false);
        return false;
      }
    } else {
      // Permission not required
      setPermissionState('granted');
      return true;
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (categoryMode === 'select' && selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category or choose Random';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    // Request permission first if needed
    if (permissionState === 'prompt' || permissionState === 'unknown') {
      const granted = await requestPermission();
      if (!granted) {
        return; // Don't continue if permission denied
      }
    }

    // Permission granted or not needed, continue with game
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
      : selectedCategories.length === CATEGORIES.length
      ? 'All Categories'
      : `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}`;

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

        {permissionState === 'denied' && (
          <Card className="bg-red-500/20 border border-red-500/50">
            <div className="text-center space-y-2">
              <p className="text-red-400 font-medium">
                Motion & Orientation access denied
              </p>
              <p className="text-red-300 text-xs">
                Please enable motion & orientation in your browser settings to use tilt detection.
              </p>
            </div>
          </Card>
        )}

        {permissionState === 'unsupported' && (
          <Card className="bg-yellow-500/20 border border-yellow-500/50">
            <div className="text-center space-y-2">
              <p className="text-yellow-400 font-medium">
                Tilt detection not available
              </p>
              <p className="text-yellow-300 text-xs">
                Your device or browser doesn't support tilt detection. The game will use button controls instead.
              </p>
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            variant="primary" 
            className="flex-1"
            disabled={
              (categoryMode === 'select' && selectedCategories.length === 0) ||
              isRequesting ||
              permissionState === 'denied'
            }
          >
            {isRequesting ? 'Requesting Permission...' : 'Start Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}