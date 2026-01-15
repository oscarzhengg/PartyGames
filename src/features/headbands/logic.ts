import type { Category } from '../imposter/wordBanks';
import { CATEGORIES, WORD_BANKS } from '../imposter/wordBanks';
import type { HeadbandsCategorySelection } from './types';

/**
 * Gets the list of categories to use based on the selection
 */
export function getCategoriesToUse(selection: HeadbandsCategorySelection): Category[] {
  if (selection === 'random') {
    // Pick one random category
    const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
    return [CATEGORIES[randomIndex]];
  } else {
    // Return selected categories
    return selection;
  }
}

/**
 * Gets all words from the specified categories
 */
export function getWordsFromCategories(categories: Category[]): string[] {
  const words: string[] = [];
  
  for (const category of categories) {
    const wordBank = WORD_BANKS[category];
    for (const wordData of wordBank) {
      words.push(wordData.word);
    }
  }
  
  return words;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets a shuffled list of words for the game
 */
export function getShuffledWords(selection: HeadbandsCategorySelection): string[] {
  const categories = getCategoriesToUse(selection);
  const words = getWordsFromCategories(categories);
  return shuffleArray(words);
}