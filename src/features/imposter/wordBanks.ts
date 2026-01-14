export type Category = 
  | 'Food'
  | 'Animals'
  | 'Objects'
  | 'Movies'
  | 'Songs'
  | 'Locations'
  | 'Sports'
  | 'Brands'
  | 'Celebrities';

export const CATEGORIES: Category[] = [
  'Food',
  'Animals',
  'Objects',
  'Movies',
  'Songs',
  'Locations',
  'Sports',
  'Brands',
  'Celebrities',
];

export interface WordWithHint {
  word: string;
  hint: string;
}

export const WORD_BANKS: Record<Category, WordWithHint[]> = {
  Food: [
    { word: 'Pizza', hint: 'Round' },
    { word: 'Sushi', hint: 'Japanese' },
    { word: 'Tacos', hint: 'Mexican' },
    { word: 'Burger', hint: 'Grilled' },
    { word: 'Pasta', hint: 'Italian' },
    { word: 'Ice Cream', hint: 'Cold' },
    { word: 'Chocolate', hint: 'Sweet' },
    { word: 'Apple', hint: 'Red' },
    { word: 'Banana', hint: 'Yellow' },
    { word: 'Steak', hint: 'Meat' },
    { word: 'Salad', hint: 'Fresh' },
    { word: 'Soup', hint: 'Hot' },
    { word: 'Sandwich', hint: 'Bread' },
    { word: 'Cake', hint: 'Dessert' },
    { word: 'Cookie', hint: 'Baked' },
  ],
  Animals: [
    { word: 'Dog', hint: 'Loyal' },
    { word: 'Cat', hint: 'Feline' },
    { word: 'Elephant', hint: 'Large' },
    { word: 'Lion', hint: 'King' },
    { word: 'Tiger', hint: 'Striped' },
    { word: 'Bear', hint: 'Furry' },
    { word: 'Penguin', hint: 'Antarctic' },
    { word: 'Dolphin', hint: 'Aquatic' },
    { word: 'Eagle', hint: 'Flying' },
    { word: 'Shark', hint: 'Ocean' },
    { word: 'Monkey', hint: 'Playful' },
    { word: 'Zebra', hint: 'Striped' },
    { word: 'Giraffe', hint: 'Tall' },
    { word: 'Rabbit', hint: 'Hopping' },
    { word: 'Whale', hint: 'Massive' },
  ],
  Objects: [
    { word: 'Chair', hint: 'Seating' },
    { word: 'Table', hint: 'Flat' },
    { word: 'Lamp', hint: 'Light' },
    { word: 'Clock', hint: 'Time' },
    { word: 'Book', hint: 'Reading' },
    { word: 'Phone', hint: 'Communication' },
    { word: 'Camera', hint: 'Photography' },
    { word: 'Guitar', hint: 'Musical' },
    { word: 'Umbrella', hint: 'Protection' },
    { word: 'Backpack', hint: 'Carrying' },
    { word: 'Glasses', hint: 'Vision' },
    { word: 'Wallet', hint: 'Money' },
    { word: 'Key', hint: 'Access' },
    { word: 'Watch', hint: 'Wrist' },
    { word: 'Mirror', hint: 'Reflection' },
  ],
  Movies: [
    { word: 'Titanic', hint: 'Ship' },
    { word: 'Star Wars', hint: 'Space' },
    { word: 'The Matrix', hint: 'Reality' },
    { word: 'Inception', hint: 'Dreams' },
    { word: 'Avatar', hint: 'Blue' },
    { word: 'Jurassic Park', hint: 'Dinosaurs' },
    { word: 'The Lion King', hint: 'Animation' },
    { word: 'Frozen', hint: 'Ice' },
    { word: 'Toy Story', hint: 'Toys' },
    { word: 'Harry Potter', hint: 'Magic' },
    { word: 'The Godfather', hint: 'Mafia' },
    { word: 'Pulp Fiction', hint: 'Crime' },
    { word: 'The Dark Knight', hint: 'Superhero' },
    { word: 'Forrest Gump', hint: 'Running' },
    { word: 'Casablanca', hint: 'Classic' },
  ],
  Songs: [
    { word: 'Bohemian Rhapsody', hint: 'Queen' },
    { word: 'Stairway to Heaven', hint: 'Rock' },
    { word: 'Billie Jean', hint: 'Michael' },
    { word: 'Hotel California', hint: 'Eagles' },
    { word: 'Sweet Child O Mine', hint: 'Guns' },
    { word: 'Imagine', hint: 'Lennon' },
    { word: 'Hey Jude', hint: 'Beatles' },
    { word: 'Smells Like Teen Spirit', hint: 'Nirvana' },
    { word: 'Thunderstruck', hint: 'ACDC' },
    { word: 'Dancing Queen', hint: 'ABBA' },
    { word: 'Like a Rolling Stone', hint: 'Dylan' },
    { word: 'Purple Rain', hint: 'Prince' },
    { word: 'Yesterday', hint: 'Beatles' },
    { word: 'We Will Rock You', hint: 'Anthem' },
    { word: 'Eye of the Tiger', hint: 'Motivation' },
  ],
  Locations: [
    { word: 'Paris', hint: 'France' },
    { word: 'Tokyo', hint: 'Japan' },
    { word: 'New York', hint: 'USA' },
    { word: 'London', hint: 'England' },
    { word: 'Sydney', hint: 'Australia' },
    { word: 'Dubai', hint: 'Desert' },
    { word: 'Rome', hint: 'Italy' },
    { word: 'Barcelona', hint: 'Spain' },
    { word: 'Amsterdam', hint: 'Netherlands' },
    { word: 'Singapore', hint: 'City' },
    { word: 'Bali', hint: 'Island' },
    { word: 'Hawaii', hint: 'Pacific' },
    { word: 'Iceland', hint: 'Ice' },
    { word: 'Egypt', hint: 'Pyramids' },
    { word: 'Brazil', hint: 'South' },
  ],
  Sports: [
    { word: 'Football', hint: 'Team' },
    { word: 'Basketball', hint: 'Hoops' },
    { word: 'Soccer', hint: 'World' },
    { word: 'Tennis', hint: 'Racket' },
    { word: 'Baseball', hint: 'Bat' },
    { word: 'Golf', hint: 'Green' },
    { word: 'Swimming', hint: 'Water' },
    { word: 'Boxing', hint: 'Fighting' },
    { word: 'Cycling', hint: 'Bike' },
    { word: 'Running', hint: 'Track' },
    { word: 'Volleyball', hint: 'Net' },
    { word: 'Hockey', hint: 'Ice' },
    { word: 'Cricket', hint: 'Bat' },
    { word: 'Rugby', hint: 'Tough' },
    { word: 'Skateboarding', hint: 'Board' },
  ],
  Brands: [
    { word: 'Apple', hint: 'Tech' },
    { word: 'Nike', hint: 'Swoosh' },
    { word: 'Coca Cola', hint: 'Drink' },
    { word: 'Google', hint: 'Search' },
    { word: 'Amazon', hint: 'Online' },
    { word: 'McDonald\'s', hint: 'Fast' },
    { word: 'Starbucks', hint: 'Coffee' },
    { word: 'Tesla', hint: 'Electric' },
    { word: 'Microsoft', hint: 'Windows' },
    { word: 'Disney', hint: 'Magic' },
    { word: 'Adidas', hint: 'Stripes' },
    { word: 'Samsung', hint: 'Korean' },
    { word: 'BMW', hint: 'German' },
    { word: 'Netflix', hint: 'Streaming' },
    { word: 'Spotify', hint: 'Music' },
  ],
  Celebrities: [
    { word: 'Leonardo DiCaprio', hint: 'Actor' },
    { word: 'Beyoncé', hint: 'Singer' },
    { word: 'Taylor Swift', hint: 'Pop' },
    { word: 'Tom Hanks', hint: 'Oscar' },
    { word: 'Oprah Winfrey', hint: 'Talk' },
    { word: 'Brad Pitt', hint: 'Hollywood' },
    { word: 'Emma Watson', hint: 'Hermione' },
    { word: 'Will Smith', hint: 'Fresh' },
    { word: 'Jennifer Lawrence', hint: 'Hunger' },
    { word: 'Chris Hemsworth', hint: 'Thor' },
    { word: 'Adele', hint: 'Hello' },
    { word: 'Ryan Reynolds', hint: 'Deadpool' },
    { word: 'Meryl Streep', hint: 'Actress' },
    { word: 'Dwayne Johnson', hint: 'Rock' },
    { word: 'Selena Gomez', hint: 'Wizards' },
  ],
};

/**
 * Gets the category for a given word
 */
export function getCategoryForWord(word: string): Category | null {
  for (const [category, words] of Object.entries(WORD_BANKS)) {
    if (words.some(w => w.word === word)) {
      return category as Category;
    }
  }
  return null;
}

/**
 * Gets the hint for a given word
 */
export function getHintForWord(word: string): string | null {
  for (const words of Object.values(WORD_BANKS)) {
    const wordData = words.find(w => w.word === word);
    if (wordData) {
      return wordData.hint;
    }
  }
  return null;
}

/**
 * Selects a random word from the selected categories
 */
export function selectRandomWord(selectedCategories: Category[]): string {
  if (selectedCategories.length === 0) {
    throw new Error('At least one category must be selected');
  }

  // Combine all words from selected categories
  const allWords: WordWithHint[] = [];
  for (const category of selectedCategories) {
    allWords.push(...WORD_BANKS[category]);
  }

  // Select a random word
  const randomIndex = Math.floor(Math.random() * allWords.length);
  return allWords[randomIndex].word;
}
