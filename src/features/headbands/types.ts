import type { Category } from '../imposter/wordBanks';

export type HeadbandsCategorySelection = Category[] | 'random' | 'mixed';

export interface HeadbandsSettings {
  selectedCategories: HeadbandsCategorySelection;
  guessTimeSeconds: number; // How long each player gets to guess
}

export interface HeadbandsGameState {
  currentWord: string;
  wordIndex: number;
  startTime: number | null;
  isCountdown: boolean;
  countdownValue: number;
}