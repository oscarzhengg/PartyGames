import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CategorySquare } from '../../components/CategorySquare';
import type { HeadbandsSettings, HeadbandsCategorySelection } from './types';
import { CATEGORIES, type Category } from '../imposter/wordBanks';
import { 
  FaUtensils, 
  FaPaw, 
  FaBox, 
  FaFilm, 
  FaMusic, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaTags, 
  FaUserStar,
  FaRandom,
  FaClock,
  FaChevronLeft
} from 'react-icons/fa';

// Icon components for categories
const CategoryIcons: Record<Category, React.ReactNode> = {
  'Food': <FaUtensils className="w-6 h-6" />,
  'Animals': <FaPaw className="w-6 h-6" />,
  'Objects': <FaBox className="w-6 h-6" />,
  'Movies': <FaFilm className="w-6 h-6" />,
  'Songs': <FaMusic className="w-6 h-6" />,
  'Locations': <FaMapMarkerAlt className="w-6 h-6" />,
  'Sports': <FaTrophy className="w-6 h-6" />,
  'Brands': <FaTags className="w-6 h-6" />,
  'Celebrities': <FaUserStar className="w-6 h-6" />,
};

const RandomIcon = <FaRandom className="w-6 h-6" />;
const ClockIcon = <FaClock className="w-5 h-5" />;
const BackIcon = <FaChevronLeft className="w-6 h-6" />;

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

  // Prevent page scrolling in portrait - only allow scrolling within the categories container
  // In landscape, allow page scrolling
  useEffect(() => {
    if (isLandscape) return; // Allow scrolling in landscape mode

    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const preventPageScroll = (e: TouchEvent | WheelEvent) => {
      const target = e.target as HTMLElement;
      // Allow scrolling only within elements that have overflow-auto or overflow-y-auto
      const isScrollableContainer = target.closest('.overflow-y-auto, .overflow-x-auto');
      if (!isScrollableContainer) {
        e.preventDefault();
      }
    };

    // Prevent touch scrolling on the page
    rootElement.addEventListener('touchmove', preventPageScroll, { passive: false });
    rootElement.addEventListener('wheel', preventPageScroll, { passive: false });

    return () => {
      rootElement.removeEventListener('touchmove', preventPageScroll);
      rootElement.removeEventListener('wheel', preventPageScroll);
    };
  }, [isLandscape]);

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
    <div className={`h-screen-safe w-screen flex flex-col safe-area-inset ${isLandscape ? 'overflow-y-auto' : 'overflow-hidden touch-none'}`} style={isLandscape ? {} : { maxHeight: '100dvh', height: '100dvh' }}>
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
      <div className={`flex-1 min-h-0 px-4 py-2 ${isLandscape ? '' : 'overflow-hidden'}`}>
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
      <div className="flex-shrink-0 px-4 pb-4 space-y-4 overflow-hidden">
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