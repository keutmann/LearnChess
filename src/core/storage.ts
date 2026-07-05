import type { UserProgress } from './types';

const STORAGE_KEY = 'learn-chess-progress-v1';

export const defaultProgress = (): UserProgress => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  completedLessons: [],
  lessonScores: {},
  puzzleStats: {},
  srs: [],
  achievements: [],
  gamesPlayed: 0,
  gamesWon: 0,
  miniGameScores: {},
  settings: {
    sound: true,
    coachName: 'Coach',
    boardOrientation: 'white',
  },
});

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return { ...defaultProgress(), ...parsed, settings: { ...defaultProgress().settings, ...parsed.settings } };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function exportProgress(): string {
  return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(defaultProgress());
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as UserProgress;
    saveProgress({ ...defaultProgress(), ...parsed });
    return true;
  } catch {
    return false;
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
