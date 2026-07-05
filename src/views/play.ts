import type { Key } from '@lichess-org/chessground/types';
import { Chess } from 'chess.js';
import { OPPONENT_LEVELS } from '../data/meta';
import { getProgress, updateProgress } from '../core/state';
import { awardXp, checkAchievements, updateStreak } from '../core/xp';
import { renderLayout, coachBubble, showToast } from '../components/layout';
import { navigate } from '../core/router';
import { ChessBoard } from '../core/chess-board';
import { getEngine, resetEngine } from '../core/engine';

let board: ChessBoard | null = null;
let gameChess: Chess | null = null;
let engineBusy = false;
let gameOver = false;
let activeEngine: Awaited<ReturnType<typeof getEngine>> | null = null;
let activeOpponent: typeof OPPONENT_LEVELS[0] | null = null;
let awaitingEngineLoad = false;

export function renderPlay(params: Record<string, string>): void {
  if (params.game === '1' && params.opponent) {
    void startGame(params.opponent);
    return;
  }

  renderLayout(`
    <section class="page play-page">
      <div class="page-header">
        <h1>Play vs Engine</h1>
        <p>Challenge opponents of increasing strength — from beginner to grandmaster level.</p>
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
  activeEngine = null;
  activeOpponent = opponent;
  awaitingEngineLoad = false;
  board?.destroy();
  board = null;

  renderLayout(`
    <section class="page game-page board-page">
      <div class="board-stage">
        <div class="board-stage__board">
          <div class="chess-board" id="game-board"></div>
        </div>
        <div class="board-stage__side">
          <div class="game-header">
            <button class="btn-back" data-back>← Resign</button>
            <div class="game-info">
              <h2>vs ${opponent.name}</h2>
              <span class="game-status" id="game-status">Loading engine…</span>
            </div>
          </div>
          <div class="game-actions">
            <button class="btn btn-secondary" id="new-game" disabled>New Game</button>
            <button class="btn btn-primary" id="retry-engine" hidden>Retry Engine</button>
          </div>
        </div>
      </div>
    </section>
  `, '/play');

  document.querySelector('[data-back]')?.addEventListener('click', () => {
    if (confirm('Resign this game?')) navigate('/play');
  });
  document.getElementById('new-game')?.addEventListener('click', () => {
    navigate(`/play?game=1&opponent=${opponentId}`);
  });
  document.getElementById('retry-engine')?.addEventListener('click', () => {
    resetEngine();
    navigate(`/play?game=1&opponent=${opponentId}`);
  });

  // Mount the board immediately so it always shows, even while the engine
  // (a large WASM download) is still loading or if it fails to load.
  const el = document.getElementById('game-board');
  if (!el) return;
  board = new ChessBoard(el);
  board.mount({
    fen: gameChess.fen(),
    orientation: getProgress().settings.boardOrientation,
    movable: true,
    color: 'white',
    onMove: (from, to) => handlePlayerMove(from, to),
  });
  setStatus('Loading engine… (you can move as White)');

  // Load the engine in the background.
  try {
    const engine = await getEngine();
    engine.newGame();
    engine.setSkillLevel(opponent.skill);
    activeEngine = engine;

    const newGameBtn = document.getElementById('new-game') as HTMLButtonElement | null;
    if (newGameBtn) newGameBtn.disabled = false;

    if (gameOver) return;
    if (awaitingEngineLoad && gameChess && gameChess.turn() === 'b') {
      awaitingEngineLoad = false;
      void engineReply();
    } else {
      setStatus('Your turn (White)');
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Engine failed to load';
    setStatus(`Engine error: ${msg}`);
    const retry = document.getElementById('retry-engine');
    if (retry) retry.hidden = false;
    showToast('Could not load chess engine. Tap "Retry Engine".', 'error');
  }
}

function setStatus(text: string): void {
  const el = document.getElementById('game-status');
  if (el) el.textContent = text;
}

function handlePlayerMove(from: Key, to: Key): boolean {
  if (!gameChess || !board || engineBusy || gameOver) return false;
  if (gameChess.turn() !== 'w') return false;

  if (!board.tryMove(from, to)) return false;

  // Sync game state from board's chess instance
  gameChess = new Chess(board.getChess().fen());

  if (handleGameEnd()) return true;

  if (activeEngine) {
    void engineReply();
  } else {
    // Player moved before the engine finished loading — reply once it's ready.
    awaitingEngineLoad = true;
    board.updateMovable(false);
    setStatus('Waiting for engine to finish loading…');
  }
  return true;
}

async function engineReply(): Promise<void> {
  const engine = activeEngine;
  const opponent = activeOpponent;
  if (!engine || !opponent || !gameChess || !board || gameChess.isGameOver() || gameOver) return;

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

    if (!handleGameEnd()) {
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

function handleGameEnd(): boolean {
  if (!gameChess || !board || !activeOpponent) return false;
  const opponent = activeOpponent;

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
