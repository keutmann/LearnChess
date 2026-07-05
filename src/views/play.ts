import type { Key } from '@lichess-org/chessground/types';
import { Chess } from 'chess.js';
import { OPPONENT_LEVELS } from '../data/meta';
import { getProgress, updateProgress } from '../core/state';
import { awardXp, checkAchievements, updateStreak } from '../core/xp';
import { renderLayout, coachBubble, showToast } from '../components/layout';
import { navigate } from '../core/router';
import { ChessBoard } from '../core/chess-board';
import { getEngine } from '../core/engine';

let board: ChessBoard | null = null;
let gameChess: Chess | null = null;
let engineBusy = false;
let gameOver = false;

export function renderPlay(params: Record<string, string>): void {
  if (params.game === '1' && params.opponent) {
    void startGame(params.opponent);
    return;
  }

  renderLayout(`
    <section class="page play-page">
      <div class="page-header">
        <h1>Play vs Engine</h1>
        <p>Challenge opponents of increasing strength — inspired by the Play Magnus concept.</p>
      </div>
      ${coachBubble('Pick your opponent. Start with Beginner and work your way up to Grandmaster!')}
      <div class="opponent-grid">
        ${OPPONENT_LEVELS.map((o) => `
          <button class="opponent-card" data-opponent="${o.id}">
            <span class="opp-age">Age ${o.age}</span>
            <h3>${o.name}</h3>
            <span class="opp-elo">~${o.elo} Elo</span>
            <p>${o.description}</p>
            <span class="opp-reward">+${o.xpReward} XP if you win</span>
          </button>
        `).join('')}
      </div>
    </section>
  `, '/play');

  document.querySelectorAll('[data-opponent]').forEach((el) => {
    el.addEventListener('click', () => {
      navigate(`/play?game=1&opponent=${(el as HTMLElement).dataset.opponent}`);
    });
  });
}

async function startGame(opponentId: string): Promise<void> {
  const opponent = OPPONENT_LEVELS.find((o) => o.id === opponentId)!;
  gameChess = new Chess();
  engineBusy = false;
  gameOver = false;
  board?.destroy();
  board = null;

  renderLayout(`
    <section class="page game-page">
      <div class="game-header">
        <button class="btn-back" data-back>← Resign</button>
        <div class="game-info">
          <h2>vs ${opponent.name}</h2>
          <span class="game-status" id="game-status">Loading engine…</span>
        </div>
      </div>
      <div class="board-wrap"><div class="chess-board" id="game-board"></div></div>
      <div class="game-actions">
        <button class="btn btn-secondary" id="new-game" disabled>New Game</button>
      </div>
    </section>
  `, '/play');

  document.querySelector('[data-back]')?.addEventListener('click', () => {
    if (confirm('Resign this game?')) navigate('/play');
  });
  document.getElementById('new-game')?.addEventListener('click', () => {
    navigate(`/play?game=1&opponent=${opponentId}`);
  });

  try {
    const engine = await getEngine();
    engine.newGame();
    engine.setSkillLevel(opponent.skill);

    const el = document.getElementById('game-board')!;
    board = new ChessBoard(el);
    board.mount({
      fen: gameChess.fen(),
      orientation: getProgress().settings.boardOrientation,
      movable: true,
      color: 'white',
      onMove: (from, to) => handlePlayerMove(from, to, opponent, engine),
    });

    setStatus('Your turn (White)');
    (document.getElementById('new-game') as HTMLButtonElement).disabled = false;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Engine failed to load';
    setStatus(`Error: ${msg}`);
    showToast('Could not load chess engine. Check that engine files are available.', 'error');
  }
}

function setStatus(text: string): void {
  const el = document.getElementById('game-status');
  if (el) el.textContent = text;
}

function handlePlayerMove(
  from: Key,
  to: Key,
  opponent: typeof OPPONENT_LEVELS[0],
  engine: Awaited<ReturnType<typeof getEngine>>
): boolean {
  if (!gameChess || !board || engineBusy || gameOver) return false;
  if (gameChess.turn() !== 'w') return false;

  if (!board.tryMove(from, to)) return false;

  // Sync game state from board's chess instance
  gameChess = new Chess(board.getChess().fen());

  if (handleGameEnd(opponent)) return true;

  void engineReply(engine, opponent);
  return true;
}

async function engineReply(
  engine: Awaited<ReturnType<typeof getEngine>>,
  opponent: typeof OPPONENT_LEVELS[0]
): Promise<void> {
  if (!gameChess || !board || gameChess.isGameOver() || gameOver) return;

  engineBusy = true;
  board.updateMovable(false);
  setStatus('Engine thinking…');

  try {
    engine.setPosition(gameChess.fen());
    const depth = Math.min(14, 4 + opponent.skill);
    const movetime = 400 + opponent.skill * 100;
    const best = await engine.getBestMove(depth, movetime);

    if (!best || !gameChess || gameOver) {
      setStatus('Your turn (White)');
      board.updateMovable(true, 'white');
      return;
    }

    const from = best.slice(0, 2) as Key;
    const to = best.slice(2, 4) as Key;
    const promo = best.length > 4 ? best[4] : 'q';

    if (board.tryMove(from, to, promo)) {
      gameChess = new Chess(board.getChess().fen());
    }

    if (!handleGameEnd(opponent)) {
      setStatus('Your turn (White)');
      board.updateMovable(true, 'white');
    }
  } catch {
    showToast('Engine error — your move stands.', 'error');
    setStatus('Your turn (White)');
    board.updateMovable(true, 'white');
  } finally {
    engineBusy = false;
  }
}

function handleGameEnd(opponent: typeof OPPONENT_LEVELS[0]): boolean {
  if (!gameChess || !board) return false;

  if (gameChess.isCheckmate()) {
    gameOver = true;
    const whiteWins = gameChess.turn() === 'b';
    updateProgress((p) => {
      p.gamesPlayed++;
      if (whiteWins) p.gamesWon++;
    });
    board.updateMovable(false);
    if (whiteWins) {
      awardXp(opponent.xpReward);
      updateStreak();
      checkAchievements();
      showToast(`You beat ${opponent.name}! +${opponent.xpReward} XP 🏆`, 'success');
      setStatus('Checkmate — You win!');
    } else {
      showToast('Checkmate — Engine wins. Try again!', 'error');
      setStatus('Checkmate — You lose.');
    }
    return true;
  }

  if (gameChess.isDraw() || gameChess.isStalemate() || gameChess.isThreefoldRepetition()) {
    gameOver = true;
    updateProgress((p) => p.gamesPlayed++);
    board.updateMovable(false);
    showToast('Draw game.', 'info');
    setStatus('Draw.');
    return true;
  }

  return false;
}
