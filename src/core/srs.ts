import type { SrsEntry } from '../types';
import { getProgress, updateProgress } from './state';

const MS_PER_DAY = 86_400_000;

export function getSrsEntry(puzzleId: string): SrsEntry | undefined {
  return getProgress().srs.find((e) => e.puzzleId === puzzleId);
}

export function recordPuzzleResult(puzzleId: string, correct: boolean): SrsEntry {
  const now = Date.now();
  let entry = getSrsEntry(puzzleId);

  updateProgress((p) => {
    p.puzzleStats[puzzleId] ??= { solved: 0, failed: 0 };
    if (correct) p.puzzleStats[puzzleId].solved++;
    else p.puzzleStats[puzzleId].failed++;

    const idx = p.srs.findIndex((e) => e.puzzleId === puzzleId);
    const existing = idx >= 0 ? p.srs[idx] : null;

    if (!existing) {
      entry = {
        puzzleId,
        ease: 2.5,
        interval: correct ? 1 : 0,
        repetitions: correct ? 1 : 0,
        nextReview: correct ? now + MS_PER_DAY : now,
        lastReview: now,
      };
      p.srs.push(entry);
    } else if (correct) {
      existing.repetitions += 1;
      existing.ease = Math.min(3.0, existing.ease + 0.1);
      existing.interval =
        existing.repetitions === 1 ? 1 : existing.repetitions === 2 ? 3 : Math.round(existing.interval * existing.ease);
      existing.nextReview = now + existing.interval * MS_PER_DAY;
      existing.lastReview = now;
      entry = existing;
    } else {
      existing.repetitions = 0;
      existing.interval = 0;
      existing.ease = Math.max(1.3, existing.ease - 0.2);
      existing.nextReview = now + MS_PER_DAY / 2;
      existing.lastReview = now;
      entry = existing;
    }
  });

  return entry!;
}

export function getDuePuzzles(allIds: string[]): string[] {
  const now = Date.now();
  const srs = getProgress().srs;
  const due = srs.filter((e) => e.nextReview <= now).map((e) => e.puzzleId);
  const newOnes = allIds.filter((id) => !srs.some((e) => e.puzzleId === id));
  return [...due, ...newOnes];
}

export function getWeakestThemes(stats: Record<string, { solved: number; failed: number }>): string[] {
  return Object.entries(stats)
    .filter(([, v]) => v.failed > v.solved)
    .sort((a, b) => b[1].failed - a[1].failed)
    .slice(0, 3)
    .map(([id]) => id);
}
