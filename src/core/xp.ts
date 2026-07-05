const XP_PER_LEVEL = 500;

export function xpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number): { current: number; needed: number; percent: number } {
  const level = levelFromXp(xp);
  const base = (level - 1) * XP_PER_LEVEL;
  const current = xp - base;
  const needed = XP_PER_LEVEL;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}

import { getProgress, updateProgress } from './state';

export function awardXp(amount: number): { leveledUp: boolean; newLevel: number; total: number } {
  const before = getProgress();
  const oldLevel = before.level;
  updateProgress((p) => {
    p.xp += amount;
    p.level = levelFromXp(p.xp);
  });
  const after = getProgress();
  return {
    leveledUp: after.level > oldLevel,
    newLevel: after.level,
    total: after.xp,
  };
}

export function updateStreak(): void {
  const today = new Date().toISOString().slice(0, 10);
  updateProgress((p) => {
    if (p.lastActiveDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    p.streak = p.lastActiveDate === yStr ? p.streak + 1 : 1;
    p.lastActiveDate = today;
  });
}

export const ACHIEVEMENTS = [
  { id: 'first-lesson', title: 'First Steps', desc: 'Complete your first lesson', icon: '🎯' },
  { id: 'streak-3', title: 'On Fire', desc: '3-day learning streak', icon: '🔥' },
  { id: 'streak-7', title: 'Dedicated', desc: '7-day learning streak', icon: '⭐' },
  { id: 'tactics-5', title: 'Tactician', desc: 'Solve 5 puzzles', icon: '⚡' },
  { id: 'foundation-done', title: 'Foundation', desc: 'Complete all foundation lessons', icon: '🏛️' },
  { id: 'first-win', title: 'Victory', desc: 'Beat the engine', icon: '🏆' },
  { id: 'level-5', title: 'Rising Star', desc: 'Reach level 5', icon: '🌟' },
  { id: 'level-10', title: 'Expert Path', desc: 'Reach level 10', icon: '👑' },
] as const;

export function checkAchievements(): string[] {
  const p = getProgress();
  const earned: string[] = [];
  const tryAward = (id: string, condition: boolean) => {
    if (condition && !p.achievements.includes(id)) {
      earned.push(id);
      updateProgress((prog) => prog.achievements.push(id));
    }
  };

  tryAward('first-lesson', p.completedLessons.length >= 1);
  tryAward('streak-3', p.streak >= 3);
  tryAward('streak-7', p.streak >= 7);
  tryAward('tactics-5', Object.values(p.puzzleStats).reduce((s, v) => s + v.solved, 0) >= 5);
  tryAward('first-win', p.gamesWon >= 1);
  tryAward('level-5', p.level >= 5);
  tryAward('level-10', p.level >= 10);

  return earned;
}
