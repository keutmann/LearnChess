import { Chessground } from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import type { Config } from '@lichess-org/chessground/config';
import { Chess } from 'chess.js';
import type { Key } from '@lichess-org/chessground/types';

import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.brown.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';

export interface BoardOptions {
  fen?: string;
  orientation?: 'white' | 'black';
  movable?: boolean;
  color?: 'white' | 'black';
  onMove?: (from: Key, to: Key) => boolean;
  shapes?: Config['drawable']['shapes'];
  lastMove?: [Key, Key];
  viewOnly?: boolean;
  highlightLastMove?: boolean;
}

export class ChessBoard {
  private api: Api | null = null;
  private chess = new Chess();
  private container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private onMoveHandler: BoardOptions['onMove'] | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  mount(options: BoardOptions = {}): void {
    const fen = options.fen ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    try {
      this.chess.load(fen);
    } catch {
      this.chess = new Chess();
    }

    this.onMoveHandler = options.onMove ?? null;
    const color = options.color ?? (this.chess.turn() === 'w' ? 'white' : 'black');
    const dests = options.movable && !options.viewOnly ? this.computeDests() : new Map<Key, Key[]>();

    this.api?.destroy();
    this.api = Chessground(this.container, {
      fen: this.chess.fen(),
      orientation: options.orientation ?? 'white',
      viewOnly: options.viewOnly ?? false,
      movable: {
        free: false,
        color: options.movable && !options.viewOnly ? color : undefined,
        dests,
        showDests: true,
      },
      premovable: { enabled: false },
      highlight: { lastMove: options.highlightLastMove ?? true, check: true },
      animation: { enabled: true, duration: 200 },
      drawable: { enabled: true, visible: true, shapes: options.shapes ?? [] },
      lastMove: options.lastMove,
      events: {
        move: (orig, dest) => this.handleMove(orig, dest),
      },
    });

    this.setupResize();
  }

  private handleMove(orig: Key, dest: Key): void {
    if (!this.onMoveHandler) return;

    const accepted = this.onMoveHandler(orig, dest);
    if (!accepted) {
      // Revert illegal / rejected move
      this.api?.set({
        fen: this.chess.fen(),
        lastMove: undefined,
        movable: { dests: this.computeDests() },
      });
    }
  }

  private setupResize(): void {
    this.resizeObserver?.disconnect();
    const updateSize = () => {
      const width = this.container.clientWidth;
      if (width > 0) this.container.style.height = `${width}px`;
    };
    updateSize();
    this.resizeObserver = new ResizeObserver(updateSize);
    this.resizeObserver.observe(this.container);
  }

  private computeDests(): Map<Key, Key[]> {
    const dests = new Map<Key, Key[]>();
    for (const move of this.chess.moves({ verbose: true })) {
      const from = move.from as Key;
      const to = move.to as Key;
      if (!dests.has(from)) dests.set(from, []);
      dests.get(from)!.push(to);
    }
    return dests;
  }

  tryMove(from: Key, to: Key, promotion = 'q'): boolean {
    try {
      const moves = this.chess.moves({ verbose: true }).filter((m) => m.from === from && m.to === to);
      const needsPromo = moves.some((m) => m.promotion);
      const move = this.chess.move({ from, to, promotion: needsPromo ? promotion : undefined });
      if (!move) return false;

      const turn = this.chess.turn() === 'w' ? 'white' : 'black';
      this.api?.set({
        fen: this.chess.fen(),
        lastMove: [from, to],
        turnColor: turn,
        check: this.chess.inCheck(),
        movable: {
          color: turn,
          dests: this.computeDests(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  getChess(): Chess {
    return this.chess;
  }

  setFen(fen: string): void {
    try {
      this.chess.load(fen);
    } catch {
      return;
    }
    const turn = this.chess.turn() === 'w' ? 'white' : 'black';
    this.api?.set({
      fen: this.chess.fen(),
      turnColor: turn,
      check: this.chess.inCheck(),
      movable: { color: turn, dests: this.computeDests() },
    });
  }

  updateMovable(movable: boolean, color?: 'white' | 'black'): void {
    const c = color ?? (this.chess.turn() === 'w' ? 'white' : 'black');
    this.api?.set({
      movable: {
        color: movable ? c : undefined,
        dests: movable ? this.computeDests() : new Map(),
      },
    });
  }

  setStatus(text: string): void {
    const el = document.getElementById('game-status');
    if (el) el.textContent = text;
  }

  destroy(): void {
    this.resizeObserver?.disconnect();
    this.api?.destroy();
    this.api = null;
  }
}

export function moveMatches(chess: Chess, from: Key, to: Key, expected: string): boolean {
  const moves = chess.moves({ verbose: true }).filter((m) => m.from === from && m.to === to);
  if (!moves.length) return false;

  const normalized = expected.replace(/[+#]$/, '');
  return moves.some((m) => {
    const san = m.san.replace(/[+#]$/, '');
    const uci = `${m.from}${m.to}${m.promotion ?? ''}`;
    return (
      expected === m.san ||
      normalized === san ||
      expected === uci ||
      expected === `${m.from}${m.to}`
    );
  });
}
