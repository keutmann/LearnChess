export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category =
  | 'foundation'
  | 'tactics'
  | 'strategy'
  | 'calculation'
  | 'openings'
  | 'endgames'
  | 'mates';

export type LessonStepType = 'text' | 'quiz' | 'board' | 'move' | 'highlight';

export interface BoardShape {
  orig: string;
  dest?: string;
  brush?: 'green' | 'red' | 'blue' | 'yellow';
}

export interface QuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonStep {
  type: LessonStepType;
  coach: string;
  content?: string;
  fen?: string;
  orientation?: 'white' | 'black';
  shapes?: BoardShape[];
  lastMove?: [string, string];
  quiz?: QuizData;
  expectedMove?: string;
  expectedMoves?: string[];
  hints?: string[];
}

export interface Lesson {
  id: string;
  category: Category;
  difficulty: Difficulty;
  title: string;
  description: string;
  xpReward: number;
  order: number;
  steps: LessonStep[];
}

export interface CourseNode {
  id: string;
  lessonId: string;
  x: number;
  y: number;
  requires?: string[];
}

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  themes: string[];
  difficulty: Difficulty;
  rating: number;
  description: string;
  orientation?: 'white' | 'black';
}

export interface OpponentLevel {
  id: string;
  name: string;
  age: number;
  elo: number;
  skill: number;
  description: string;
  xpReward: number;
}

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  xpReward: number;
}

export interface SrsEntry {
  puzzleId: string;
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  puzzleStats: Record<string, { solved: number; failed: number }>;
  srs: SrsEntry[];
  achievements: string[];
  gamesPlayed: number;
  gamesWon: number;
  miniGameScores: Record<string, number>;
  settings: {
    sound: boolean;
    coachName: string;
    boardOrientation: 'white' | 'black';
  };
}

export interface AppState {
  progress: UserProgress;
  currentRoute: string;
}
