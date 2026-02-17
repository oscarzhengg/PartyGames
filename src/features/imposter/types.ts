import type { Category, WordWithHint } from './wordBanks';

export type PlayerId = number; // 1..N

export interface ImposterSettings {
  playerCount: number;
  imposterCount: number;
  noImposterFirst: boolean; // "Imposter never goes first"
  allowNoImposter: boolean; // Chance that everyone gets the word (no imposters)
  selectedCategories: Category[];
  secretWord: WordWithHint; // Selected word with randomly chosen hint
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
