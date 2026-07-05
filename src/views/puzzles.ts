import type { Key } from '@lichess-org/chessground/types';
import { Chess } from 'chess.js';
import { PUZZLES } from '../data/puzzles';
import { getDuePuzzles, recordPuzzleResult } from '../core/srs';
import { awardXp, updateStreak } from '../core/xp';
import { renderLayout, coachBubble, showToast } from '../components/layout';
import { navigate } from '../core/router';
import { ChessBoard, moveMatches } from '../core/chess-board';
import type { Puzzle } from '../types';

let board: ChessBoard | null = null;
let currentPuzzle: Puzzle | null = null;
let moveIndex = 0;
let puzzleChess: Chess | null = null;

export function renderPuzzles(params: Record<string, string>): void {
  const mode = params.mode ?? 'daily';
  const difficulty = params.difficulty;

  if (mode === 'play' && params.id) {
    const puzzle = PUZZLES.find((p) => p.id === params.id);
    if (puzzle) { playPuzzle(puzzle); return; }
  }

  const dueIds = getDuePuzzles(PUZZLES.map((p) => p.id));
  const nextPuzzle = PUZZLES.find((p) => dueIds.includes(p.id)) ?? PUZZLES[0];
  const filtered = difficulty ? PUZZLES.filter((p) => p.difficulty === difficulty) : PUZZLES;

  renderLayout(`
    <section class="page puzzles-page">
      <div class="page-header">
        <h1>Tactics Puzzles</h1>
        <p>Train your tactical vision with spaced repetition. Puzzles you miss will return sooner.</p>
      </div>

      ${coachBubble('Find the best move! Look for checks, captures, and threats before you move.')}

      <div class="card highlight-card" data-puzzle="${nextPuzzle.id}">
        <div class="card-badge">Recommended</div>
        <h2>${nextPuzzle.description}</h2>
        <p>Rating ~${nextPuzzle.rating} · ${nextPuzzle.themes.join(', ')}</p>
        <button class="btn btn-primary">Solve Puzzle →</button>
      </div>

      <div class="filter-bar">
        <button class="filter-chip active" data-diff="">All</button>
        <button class="filter-chip" data-diff="easy">Easy</button>
        <button class="filter-chip" data-diff="medium">Medium</button>
        <button class="filter-chip" data-diff="hard">Hard</button>
      </div>

      <div class="puzzle-list">
        ${filtered.map((p) => `
          <button class="puzzle-item" data-puzzle="${p.id}">
            <span class="puzzle-rating">${p.rating}</span>
            <span class="puzzle-desc">${p.description}</span>
            <span class="puzzle-diff diff-${p.difficulty}">${p.difficulty}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `, '/puzzles');

  document.querySelectorAll('[data-puzzle]').forEach((el) => {
    el.addEventListener('click', () => {
      navigate(`/puzzles?mode=play&id=${(el as HTMLElement).dataset.puzzle}`);
    });
  });

  document.querySelectorAll('[data-diff]').forEach((el) => {
    el.addEventListener('click', () => {
      const d = (el as HTMLElement).dataset.diff;
      navigate(d ? `/puzzles?difficulty=${d}` : '/puzzles');
    });
  });
}

function playPuzzle(puzzle: Puzzle): void {
  currentPuzzle = puzzle;
  moveIndex = 0;
  puzzleChess = new Chess(puzzle.fen);

  const render = () => {
    board?.destroy();
    renderLayout(`
      <section class="page puzzle-play-page board-page">
        <div class="board-stage">
          <div class="board-stage__board">
            <div class="chess-board" id="puzzle-board"></div>
          </div>
          <div class="board-stage__side">
            <div class="lesson-header">
              <button class="btn-back" data-back>← Back</button>
              <h1>${puzzle.description}</h1>
            </div>
            ${coachBubble(moveIndex === 0 ? 'Find the best continuation. You play as ' + (puzzleChess!.turn() === 'w' ? 'White' : 'Black') + '.' : 'Keep going!')}
            <div class="puzzle-hint-row">
              <button class="btn btn-secondary" id="show-solution">Show Solution</button>
              <button class="btn btn-primary" id="next-puzzle">Next Puzzle →</button>
            </div>
            <p class="puzzle-meta">Rating ${puzzle.rating} · ${puzzle.themes.join(', ')}</p>
          </div>
        </div>
      </section>
    `, '/puzzles');

    document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/puzzles'));
    document.getElementById('show-solution')?.addEventListener('click', () => showSolution());
    document.getElementById('next-puzzle')?.addEventListener('click', () => {
      const next = pickNextPuzzle(puzzle.id);
      navigate(`/puzzles?mode=play&id=${next}`);
    });

    const el = document.getElementById('puzzle-board')!;
    board = new ChessBoard(el);
    const orientation = puzzle.orientation ?? (puzzleChess!.turn() === 'w' ? 'white' : 'black');

    board.mount({
      fen: puzzleChess!.fen(),
      orientation,
      movable: true,
      color: puzzleChess!.turn() === 'w' ? 'white' : 'black',
      onMove: (from, to) => handlePuzzleMove(from, to),
    });
  };

  render();
}

function pickNextPuzzle(currentId: string): string {
  // Prefer a due/new puzzle that isn't the current one, otherwise cycle to the next in order.
  const dueIds = getDuePuzzles(PUZZLES.map((p) => p.id)).filter((id) => id !== currentId);
  if (dueIds.length) return dueIds[0];

  const idx = PUZZLES.findIndex((p) => p.id === currentId);
  const next = PUZZLES[(idx + 1) % PUZZLES.length];
  return next.id;
}

function handlePuzzleMove(from: Key, to: Key): boolean {
  if (!currentPuzzle || !puzzleChess || !board) return false;

  const expected = currentPuzzle.solution[moveIndex];
  if (!moveMatches(puzzleChess, from, to, expected)) {
    recordPuzzleResult(currentPuzzle.id, false);
    showToast('Not the best move. Try again!', 'error');
    return false;
  }

  board.tryMove(from, to);
  puzzleChess = board.getChess();
  moveIndex++;

  if (moveIndex >= currentPuzzle.solution.length) {
    recordPuzzleResult(currentPuzzle.id, true);
    awardXp(25);
    updateStreak();
    showToast('Puzzle solved! +25 XP ✅', 'success');
    return true;
  }

  // Auto-play opponent reply from solution line
  setTimeout(() => {
    if (!currentPuzzle || !puzzleChess || !board) return;
    const reply = currentPuzzle.solution[moveIndex];
    if (!reply) return;
    try {
      const result = puzzleChess.move(reply);
      if (result) {
        board.setFen(puzzleChess.fen());
        moveIndex++;
        if (moveIndex < currentPuzzle.solution.length) {
          board.updateMovable(true, puzzleChess.turn() === 'w' ? 'white' : 'black');
        }
      }
    } catch { /* wait for player */ }
  }, 400);

  return true;
}

function showSolution(): void {
  if (!currentPuzzle || !puzzleChess || !board) return;
  recordPuzzleResult(currentPuzzle.id, false);
  const chess = new Chess(currentPuzzle.fen);
  for (const san of currentPuzzle.solution) {
    try { chess.move(san); } catch { break; }
  }
  puzzleChess = chess;
  board.setFen(chess.fen());
  showToast('Solution shown. This puzzle will return soon for practice.', 'info');
}
