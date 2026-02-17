import type { ImposterSettings, RoleAssignment, PlayerId } from './types';
import type { WordWithHint } from './wordBanks';
import { selectRandomWord } from './wordBanks';

/**
 * Assigns roles to players based on settings and selects a random word.
 * Returns the role assignment and the selected secret word with hint.
 */
/** Chance (0-1) that a round has no imposters when allowNoImposter is enabled */
const NO_IMPOSTER_CHANCE = 0.2;

export function assignRoles(settings: ImposterSettings): { assignment: RoleAssignment; secretWord: WordWithHint } {
  const { playerCount, imposterCount, noImposterFirst, allowNoImposter, selectedCategories } = settings;

  // Select a random word from the selected categories (includes randomly selected hint)
  const secretWord = selectRandomWord(selectedCategories);

  // Generate all player IDs (1..N)
  const allPlayers: PlayerId[] = Array.from({ length: playerCount }, (_, i) => i + 1);

  // When allowNoImposter is on, randomly decide whether this round has no imposters
  const useNoImposter = allowNoImposter && Math.random() < NO_IMPOSTER_CHANCE;
  const actualImposterCount = useNoImposter ? 0 : imposterCount;

  // Create a pool of players who can be imposters
  let imposterPool = [...allPlayers];
  
  // If "no imposter first" is enabled, remove player 1 from the pool
  if (noImposterFirst && playerCount > 1) {
    imposterPool = allPlayers.filter(id => id !== 1);
  }
  
  // Randomly select imposters from the pool
  const imposters: PlayerId[] = [];
  const pool = [...imposterPool];
  
  for (let i = 0; i < actualImposterCount && pool.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    imposters.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }
  
  // All other players are civilians
  const civilians = allPlayers.filter(id => !imposters.includes(id));
  
  return {
    assignment: { imposters, civilians },
    secretWord,
  };
}
