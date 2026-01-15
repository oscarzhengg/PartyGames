import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CategorySquare } from '../../components/CategorySquare';
import type { HeadbandsSettings, HeadbandsCategorySelection } from './types';
import { CATEGORIES, type Category } from '../imposter/wordBanks';

// Icon components for categories
const CategoryIcons: Record<Category, React.ReactNode> = {
  'Food': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'Animals': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="9.5" cy="9.5" r="1.5"/>
      <circle cx="14.5" cy="9.5" r="1.5"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13.5c-1.38 0-2.5 1.12-2.5 2.5 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-1.38-1.12-2.5-2.5-2.5z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16c1.5-1 3.5-1.5 4-1.5s2.5.5 4 1.5"/>
    </svg>
  ),
  'Objects': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  'Movies': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  'Songs': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  'Locations': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'Sports': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="7" ry="4.5" strokeWidth={2}/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7.5v9M8.5 10.5h7M8.5 13.5h7"/>
    </svg>
  ),
  'Brands': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  'Celebrities': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

const RandomIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClockIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BackIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

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
    <div className="h-screen-safe w-screen flex flex-col safe-area-inset overflow-hidden">
      {/* Fixed top banner */}
      <div className="flex-shrink-0 flex items-center pt-6 pb-4 px-4 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white transition-colors active:scale-95 flex-shrink-0"
          aria-label="Back"
        >
          {BackIcon}
        </button>
        <h1 className="text-2xl font-bold text-white">Headbands Categories</h1>
      </div>

      {/* Scrollable categories container */}
      <div className="flex-1 min-h-0 px-4 py-2 overflow-hidden">
        <Card className="h-full flex flex-col overflow-hidden !p-4">
          {/* Scrollable category container */}
          {/* Portrait: 2 columns vertical scroll, Landscape: 1 row horizontal scroll */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {isLandscape ? (
              /* Landscape layout: 1 row, horizontal scroll */
              <div className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide">
                <div className="flex gap-2 h-full items-start pb-2" style={{ width: 'max-content' }}>
                  {/* Random option first */}
                  <div className="flex-shrink-0 w-24">
                    <CategorySquare
                      label="Random"
                      isSelected={isRandomSelected}
                      onClick={handleRandomClick}
                      icon={RandomIcon}
                    />
                  </div>
                  {/* Rest of categories alphabetically */}
                  {sortedCategories.map((category) => (
                    <div key={category} className="flex-shrink-0 w-24">
                      <CategorySquare
                        label={category}
                        isSelected={selectedCategories.includes(category)}
                        onClick={() => toggleCategory(category)}
                        icon={CategoryIcons[category]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Portrait layout: 2 columns, vertical scroll */
              <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {/* Random option first */}
                  <CategorySquare
                    label="Random"
                    isSelected={isRandomSelected}
                    onClick={handleRandomClick}
                    icon={RandomIcon}
                  />
                  {/* Rest of categories alphabetically */}
                  {sortedCategories.map((category) => (
                    <CategorySquare
                      key={category}
                      label={category}
                      isSelected={selectedCategories.includes(category)}
                      onClick={() => toggleCategory(category)}
                      icon={CategoryIcons[category]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {errors.categories && (
            <p className="text-red-400 text-sm mt-2 flex-shrink-0">{errors.categories}</p>
          )}
        </Card>
      </div>

      {/* Fixed bottom section */}
      <div className="flex-shrink-0 px-4 pb-4 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-300 font-medium mb-3">
            <span>{ClockIcon}</span>
            <span>Guessing Time</span>
          </label>
          
          {/* Quick Select Presets */}
          <div className="flex gap-2 mb-3">
            {[30, 60, 90].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`
                  flex-1 py-2 px-2 rounded-lg font-bold text-sm transition-all duration-200
                  border-2
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
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={guessTimeSeconds <= 10}
              className="w-10 h-10 rounded-lg bg-gray-800 border-2 border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              −
            </button>
            <div className="min-w-[70px] text-center">
              <span
                className={`
                  inline-block text-2xl font-bold text-white transition-transform duration-200
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
              className="w-10 h-10 rounded-lg bg-gray-800 border-2 border-gray-700 text-white font-bold text-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-4">
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