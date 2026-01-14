import type { Category } from './wordBanks';

export type PlayerId = number; // 1..N

export interface ImposterSettings {
  playerCount: number;
  imposterCount: number;
  noImposterFirst: boolean; // "Imposter never goes first"
  selectedCategories: Category[];
  secretWord: string; // Selected word from categories
  imposterGetsCategory: boolean; // Whether imposters see the category
  imposterGetsHint: boolean; // Whether imposters see a hint
}

export interface RoleAssignment {
  imposters: PlayerId[];
  civilians: PlayerId[];
}

export interface Player {
  id: PlayerId;
  hasViewed: boolean;
}
