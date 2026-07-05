import type { OpponentLevel, MiniGame } from '../types';

export const OPPONENT_LEVELS: OpponentLevel[] = [
  { id: 'age-5', name: 'Beginner', age: 5, elo: 400, skill: 1, description: 'Just learning the rules — makes occasional mistakes.', xpReward: 50 },
  { id: 'age-8', name: 'Novice', age: 8, elo: 800, skill: 3, description: 'Knows the basics but misses simple tactics.', xpReward: 75 },
  { id: 'age-12', name: 'Club Player', age: 12, elo: 1200, skill: 6, description: 'Solid fundamentals with growing tactical awareness.', xpReward: 100 },
  { id: 'age-16', name: 'Talented Junior', age: 16, elo: 1600, skill: 10, description: 'Strong tactics and decent opening knowledge.', xpReward: 150 },
  { id: 'age-20', name: 'Expert', age: 20, elo: 2000, skill: 14, description: 'Deep calculation and positional understanding.', xpReward: 200 },
  { id: 'age-30', name: 'Grandmaster', age: 30, elo: 2800, skill: 20, description: 'World-class strength. Good luck!', xpReward: 500 },
];

export const MINI_GAMES: MiniGame[] = [
  { id: 'piece-memory', title: 'Piece Memory', description: 'Memorize a position, then recall where pieces were.', icon: '🧠', difficulty: 'easy', xpReward: 30 },
  { id: 'mate-in-one', title: 'Mate in One', description: 'Find the checkmate in a single move.', icon: '👑', difficulty: 'easy', xpReward: 25 },
  { id: 'capture-hunt', title: 'Capture Hunt', description: 'Find the best capture on the board.', icon: '🎯', difficulty: 'medium', xpReward: 35 },
  { id: 'square-control', title: 'Square Control', description: 'Count how many squares a piece attacks.', icon: '📐', difficulty: 'medium', xpReward: 30 },
  { id: 'piece-quiz', title: 'Piece Quiz', description: 'Identify pieces and their values quickly.', icon: '❓', difficulty: 'easy', xpReward: 20 },
];
