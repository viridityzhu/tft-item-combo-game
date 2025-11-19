export enum ItemType {
  COMPONENT = 'COMPONENT',
  COMPLETED = 'COMPLETED',
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  color: string; // Tailwind class for bg color accent
  description: string;
  image: string;
}

export interface Recipe {
  components: [string, string]; // IDs of the two components
  result: string; // ID of the completed item
}

export interface GameState {
  score: number;
  streak: number;
  lives: number;
  gameOver: boolean;
}

export interface CoachFeedback {
  message: string;
  tone: 'encouraging' | 'neutral' | 'critical';
}

export interface HistoryEntry {
  id: number;
  targetItem: Item;
  isCorrect: boolean;
  timestamp: number;
}