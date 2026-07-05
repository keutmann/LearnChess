import type { Category, Difficulty, CourseNode } from '../types';

export const CATEGORY_META: Record<
  Category,
  { title: string; icon: string; color: string; description: string }
> = {
  foundation: {
    title: 'Foundation',
    icon: '🏛️',
    color: '#4a9eff',
    description: 'Learn the board, pieces, and basic rules',
  },
  tactics: {
    title: 'Tactics',
    icon: '⚡',
    color: '#ff6b4a',
    description: 'Pins, forks, skewers, and combinations',
  },
  strategy: {
    title: 'Strategy',
    icon: '🧭',
    color: '#4aff9e',
    description: 'Plans, pawn structure, and positional play',
  },
  calculation: {
    title: 'Calculation',
    icon: '🔢',
    color: '#b84aff',
    description: 'Visualize and calculate forcing sequences',
  },
  openings: {
    title: 'Openings',
    icon: '🚪',
    color: '#ffca4a',
    description: 'Opening principles and key systems',
  },
  endgames: {
    title: 'Endgames',
    icon: '🏁',
    color: '#4afff0',
    description: 'King and pawn, rook, and basic endings',
  },
  mates: {
    title: 'Mates',
    icon: '👑',
    color: '#ff4a8a',
    description: 'Checkmate patterns and techniques',
  },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: '#4aff9e' },
  medium: { label: 'Medium', color: '#ffca4a' },
  hard: { label: 'Hard', color: '#ff6b4a' },
};

export const COURSE_NODES: CourseNode[] = [
  // Foundation row
  { id: 'n1', lessonId: 'f-board', x: 0, y: 0 },
  { id: 'n2', lessonId: 'f-pawn', x: 1, y: 0, requires: ['n1'] },
  { id: 'n3', lessonId: 'f-sliding', x: 2, y: 0, requires: ['n2'] },
  { id: 'n4', lessonId: 'f-knight-king', x: 3, y: 0, requires: ['n3'] },
  { id: 'n5', lessonId: 'f-capture', x: 4, y: 0, requires: ['n4'] },
  { id: 'n6', lessonId: 'f-check', x: 5, y: 0, requires: ['n5'] },
  { id: 'n7', lessonId: 'f-checkmate', x: 6, y: 0, requires: ['n6'] },
  { id: 'n8', lessonId: 'f-special', x: 7, y: 0, requires: ['n7'] },
  // Tactics row
  { id: 'n9', lessonId: 't-intro', x: 0, y: 1, requires: ['n8'] },
  { id: 'n10', lessonId: 't-fork', x: 1, y: 1, requires: ['n9'] },
  { id: 'n11', lessonId: 't-pin', x: 2, y: 1, requires: ['n10'] },
  { id: 'n12', lessonId: 't-skewer', x: 3, y: 1, requires: ['n11'] },
  { id: 'n13', lessonId: 't-discovered', x: 4, y: 1, requires: ['n12'] },
  { id: 'n14', lessonId: 't-backrank', x: 5, y: 1, requires: ['n13'] },
  // Strategy row
  { id: 'n15', lessonId: 's-center', x: 0, y: 2, requires: ['n14'] },
  { id: 'n16', lessonId: 's-development', x: 1, y: 2, requires: ['n15'] },
  { id: 'n17', lessonId: 's-king-safety', x: 2, y: 2, requires: ['n16'] },
  { id: 'n18', lessonId: 's-pawns', x: 3, y: 2, requires: ['n17'] },
  // Calculation row
  { id: 'n19', lessonId: 'c-visualize', x: 0, y: 3, requires: ['n18'] },
  { id: 'n20', lessonId: 'c-candidates', x: 1, y: 3, requires: ['n19'] },
  { id: 'n21', lessonId: 'c-forcing', x: 2, y: 3, requires: ['n20'] },
  // Openings row
  { id: 'n22', lessonId: 'o-principles', x: 0, y: 4, requires: ['n21'] },
  { id: 'n23', lessonId: 'o-italian', x: 1, y: 4, requires: ['n22'] },
  { id: 'n24', lessonId: 'o-london', x: 2, y: 4, requires: ['n23'] },
  // Endgames row
  { id: 'n25', lessonId: 'e-kp', x: 0, y: 5, requires: ['n24'] },
  { id: 'n26', lessonId: 'e-opposition', x: 1, y: 5, requires: ['n25'] },
  { id: 'n27', lessonId: 'e-rook', x: 2, y: 5, requires: ['n26'] },
  // Mates row
  { id: 'n28', lessonId: 'm-queen', x: 0, y: 6, requires: ['n27'] },
  { id: 'n29', lessonId: 'm-rook', x: 1, y: 6, requires: ['n28'] },
  { id: 'n30', lessonId: 'm-patterns', x: 2, y: 6, requires: ['n29'] },
];

export function isNodeUnlocked(_nodeId: string, _completedLessons: string[], _allLessons: { id: string }[]): boolean {
  // All lessons are freely accessible — players choose their own path
  return true;
}

export function isLessonAccessible(lessonId: string): boolean {
  return COURSE_NODES.some((n) => n.lessonId === lessonId);
}

export function getCategoryProgress(category: Category, completedLessons: string[], lessons: { id: string; category: Category }[]): number {
  const catLessons = lessons.filter((l) => l.category === category);
  if (!catLessons.length) return 0;
  const done = catLessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / catLessons.length) * 100);
}
