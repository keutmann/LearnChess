import type { UserProgress } from '../types';
import { loadProgress, saveProgress } from './storage';

type Listener = () => void;

let progress = loadProgress();
const listeners = new Set<Listener>();

export function getProgress(): UserProgress {
  return progress;
}

export function updateProgress(mutator: (p: UserProgress) => void): void {
  mutator(progress);
  saveProgress(progress);
  listeners.forEach((fn) => fn());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshProgress(): void {
  progress = loadProgress();
  listeners.forEach((fn) => fn());
}
