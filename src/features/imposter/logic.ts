import type { ImposterSettings, RoleAssignment, PlayerId } from './types';
import type { WordWithHint } from './wordBanks';
import { selectRandomWord } from './wordBanks';

/**
 * Assigns roles to players based on settings and selects a random word.
 * Returns the role assignment and the selected secret word with hint.
 */
export function assignRoles(settings: ImposterSettings): { assignment: RoleAssignment; secretWord: WordWithHint } {
  const { playerCount, imposterCount, noImposterFirst, selectedCategories } = settings;
  
  // Select a random word from the selected categories (includes randomly selected hint)
  const secretWord = selectRandomWord(selectedCategories);
  
  // Generate all player IDs (1..N)
  const allPlayers: PlayerId[] = Array.from({ length: playerCount }, (_, i) => i + 1);
  
  // Create a pool of players who can be imposters
  let imposterPool = [...allPlayers];
  
  // If "no imposter first" is enabled, remove player 1 from the pool
  if (noImposterFirst && playerCount > 1) {
    imposterPool = allPlayers.filter(id => id !== 1);
  }
  
  // Randomly select imposters from the pool
  const imposters: PlayerId[] = [];
  const pool = [...imposterPool];
  
  for (let i = 0; i < imposterCount && pool.length > 0; i++) {
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
