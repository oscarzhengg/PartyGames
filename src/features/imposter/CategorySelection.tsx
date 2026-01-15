import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CategorySquare } from '../../components/CategorySquare';
import { CATEGORIES, type Category } from './wordBanks';

interface CategorySelectionProps {
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  onBack: () => void;
}

export function CategorySelection({
  selectedCategories,
  onCategoriesChange,
  onBack,
}: CategorySelectionProps) {
  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const selectAll = () => {
    onCategoriesChange(CATEGORIES);
  };

  const deselectAll = () => {
    onCategoriesChange([]);
  };

  const allSelected = selectedCategories.length === CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  return (
    <div className="h-screen-safe w-screen flex flex-col overflow-y-auto safe-area-inset">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Select Categories</h1>
          <p className="text-gray-400">
            Choose which categories to include in the game
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300 font-medium">
                  {selectedCategories.length} of {CATEGORIES.length} selected
                </p>
              </div>
              <div className="flex gap-2">
                {!allSelected && (
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Select All
                  </button>
                )}
                {!noneSelected && (
                  <button
                    onClick={deselectAll}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Deselect All
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {CATEGORIES.map((category) => (
                <CategorySquare
                  key={category}
                  label={category}
                  isSelected={selectedCategories.includes(category)}
                  onClick={() => toggleCategory(category)}
                />
              ))}
            </div>
          </div>
        </Card>

        <div className="flex gap-4 flex-shrink-0">
          <Button onClick={onBack} variant="secondary" className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
