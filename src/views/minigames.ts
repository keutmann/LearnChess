import type { Key } from '@lichess-org/chessground/types';
import { Chess } from 'chess.js';
import { MINI_GAMES } from '../data/meta';
import { PUZZLES } from '../data/puzzles';
import { getProgress, updateProgress } from '../core/state';
import { awardXp, updateStreak } from '../core/xp';
import { renderLayout, coachBubble, showToast } from '../components/layout';
import { navigate } from '../core/router';
import { ChessBoard } from '../core/chess-board';

let board: ChessBoard | null = null;

export function renderMiniGames(params: Record<string, string>): void {
  const gameId = params.id;

  if (gameId === 'piece-memory') return playPieceMemory();
  if (gameId === 'mate-in-one') return playMateInOne();
  if (gameId === 'capture-hunt') return playCaptureHunt();
  if (gameId === 'square-control') return playSquareControl();
  if (gameId === 'piece-quiz') return playPieceQuiz();

  renderLayout(`
    <section class="page minigames-page">
      <div class="page-header">
        <h1>Training Games</h1>
        <p>Fun mini-games that build pattern recognition and board vision.</p>
      </div>
      ${coachBubble('These games train the same skills as lessons — but in a playful way!')}
      <div class="minigame-grid">
        ${MINI_GAMES.map((g) => `
          <button class="minigame-card" data-game="${g.id}">
            <span class="mg-icon">${g.icon}</span>
            <h3>${g.title}</h3>
            <p>${g.description}</p>
            <span class="mg-reward">+${g.xpReward} XP</span>
          </button>
        `).join('')}
      </div>
    </section>
  `, '/minigames');

  document.querySelectorAll('[data-game]').forEach((el) => {
    el.addEventListener('click', () => navigate(`/minigames?id=${(el as HTMLElement).dataset.game}`));
  });
}

function playPieceMemory(): void {
  const fens = [
    'rnbqkbnr/pppppppp/8/8/4N3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1',
    '6k1/5r2/8/4N3/8/8/8/6K1 w - - 0 1',
  ];
  const fen = fens[Math.floor(Math.random() * fens.length)];
  const chess = new Chess(fen);
  const pieces = chess.board().flat().filter(Boolean);
  const pieceNames = pieces.map((p) => `${p!.color === 'w' ? 'White' : 'Black'} ${p!.type.toUpperCase()}`);

  let phase: 'show' | 'quiz' = 'show';

  const draw = () => {
    board?.destroy();
    renderLayout(`
      <section class="page minigame-play">
        <button class="btn-back" data-back>← Back</button>
        <h2>🧠 Piece Memory</h2>
        ${phase === 'show' ? `
          ${coachBubble('Study this position carefully. You have 5 seconds!')}
          <div class="board-wrap"><div class="chess-board" id="mg-board"></div></div>
        ` : `
          ${coachBubble(`How many pieces are on the board?`)}
          <div class="quiz-options vertical">
            ${[pieces.length - 2, pieces.length, pieces.length + 1, pieces.length + 3]
              .filter((v, i, a) => a.indexOf(v) === i)
              .sort((a, b) => a - b)
              .map((n) => `<button class="quiz-option" data-answer="${n}">${n} pieces</button>`).join('')}
          </div>
        `}
      </section>
    `, '/minigames');

    document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/minigames'));

    if (phase === 'show') {
      const el = document.getElementById('mg-board')!;
      board = new ChessBoard(el);
      board.mount({ fen, viewOnly: true });
      setTimeout(() => { phase = 'quiz'; draw(); }, 5000);
    } else {
      document.querySelectorAll('[data-answer]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const ans = parseInt((btn as HTMLElement).dataset.answer!);
          if (ans === pieces.length) {
            finishMiniGame('piece-memory', 30, 'Correct! Great memory.');
          } else {
            showToast(`Wrong — there were ${pieces.length} pieces (${pieceNames.slice(0, 3).join(', ')}…)`, 'error');
            navigate('/minigames');
          }
        });
      });
    }
  };

  draw();
}

function playMateInOne(): void {
  const mates = PUZZLES.filter((p) => p.themes.includes('mate') && p.difficulty === 'easy');
  const puzzle = mates[Math.floor(Math.random() * mates.length)];
  navigate(`/puzzles?mode=play&id=${puzzle.id}`);
}

function playCaptureHunt(): void {
  const fen = 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1';
  const chess = new Chess(fen);

  board?.destroy();
  renderLayout(`
    <section class="page minigame-play">
      <button class="btn-back" data-back>← Back</button>
      <h2>🎯 Capture Hunt</h2>
      ${coachBubble('Find the best capture on the board!')}
      <div class="board-wrap"><div class="chess-board" id="mg-board"></div></div>
    </section>
  `, '/minigames');

  document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/minigames'));

  const el = document.getElementById('mg-board')!;
  board = new ChessBoard(el);
  board.mount({
    fen,
    movable: true,
    color: 'white',
    onMove: (from, to) => {
      const target = chess.get(to as Key);
      if (target) {
        board!.tryMove(from, to);
        finishMiniGame('capture-hunt', 35, 'Nice capture!');
        return true;
      }
      showToast('That square is empty — find a capture!', 'error');
      return false;
    },
  });
}

function playSquareControl(): void {
  const questions = [
    { fen: '8/8/8/8/4R3/8/8/4K3 w - - 0 1', piece: 'rook on e4', answer: 14 },
    { fen: '8/8/8/8/4N3/8/8/4K3 w - - 0 1', piece: 'knight on e4', answer: 8 },
    { fen: '8/8/8/3B4/8/8/8/4K3 w - - 0 1', piece: 'bishop on d5', answer: 13 },
  ];
  const q = questions[Math.floor(Math.random() * questions.length)];

  renderLayout(`
    <section class="page minigame-play">
      <button class="btn-back" data-back>← Back</button>
      <h2>📐 Square Control</h2>
      ${coachBubble(`How many squares does the ${q.piece} attack?`)}
      <div class="board-wrap"><div class="chess-board" id="mg-board"></div></div>
      <div class="quiz-options">
        ${[q.answer - 2, q.answer, q.answer + 2, q.answer + 4].map((n) => `
          <button class="quiz-option" data-answer="${n}">${n} squares</button>
        `).join('')}
      </div>
    </section>
  `, '/minigames');

  document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/minigames'));

  const el = document.getElementById('mg-board')!;
  board = new ChessBoard(el);
  board.mount({ fen: q.fen, viewOnly: true });

  document.querySelectorAll('[data-answer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ans = parseInt((btn as HTMLElement).dataset.answer!);
      if (ans === q.answer) finishMiniGame('square-control', 30, 'Correct!');
      else { showToast(`Wrong — the answer was ${q.answer} squares.`, 'error'); navigate('/minigames'); }
    });
  });
}

function playPieceQuiz(): void {
  const pieces = [
    { name: 'Knight', symbol: '♞', value: 3 },
    { name: 'Bishop', symbol: '♝', value: 3 },
    { name: 'Rook', symbol: '♜', value: 5 },
    { name: 'Queen', symbol: '♛', value: 9 },
    { name: 'Pawn', symbol: '♟', value: 1 },
  ];
  const target = pieces[Math.floor(Math.random() * pieces.length)];
  const options = [...new Set([target.value, 1, 5, 9])].sort((a, b) => a - b);

  renderLayout(`
    <section class="page minigame-play">
      <button class="btn-back" data-back>← Back</button>
      <h2>❓ Piece Quiz</h2>
      ${coachBubble(`What is the value of the ${target.name} (${target.symbol})?`)}
      <div class="piece-display">${target.symbol}</div>
      <div class="quiz-options">
        ${options.map((v) => `<button class="quiz-option" data-answer="${v}">${v} points</button>`).join('')}
      </div>
    </section>
  `, '/minigames');

  document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/minigames'));

  document.querySelectorAll('[data-answer]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ans = parseInt((btn as HTMLElement).dataset.answer!);
      if (ans === target.value) finishMiniGame('piece-quiz', 20, 'Correct!');
      else { showToast(`Wrong — a ${target.name} is worth ${target.value} points.`, 'error'); navigate('/minigames'); }
    });
  });
}

function finishMiniGame(id: string, xp: number, msg: string): void {
  updateProgress((p) => {
    p.miniGameScores[id] = (p.miniGameScores[id] ?? 0) + 1;
  });
  awardXp(xp);
  updateStreak();
  showToast(`${msg} +${xp} XP`, 'success');
  setTimeout(() => navigate('/minigames'), 1200);
}
