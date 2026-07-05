type EngineCallback = (line: string) => void;

function resolveEngineUrls(): { js: string; wasm: string } {
  const js = new URL('engine/stockfish.js', window.location.href).href;
  const wasm = new URL('engine/stockfish.wasm', window.location.href).href;
  return { js, wasm };
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private searching = false;
  private onMessage: EngineCallback | null = null;
  private resolveReady: (() => void) | null = null;
  private rejectReady: ((err: Error) => void) | null = null;
  private readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
  }

  async init(): Promise<void> {
    if (this.worker) return this.readyPromise;

    const { js, wasm } = resolveEngineUrls();

    try {
      this.worker = new Worker(`${js}#${wasm},worker`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start engine worker');
      this.rejectReady?.(error);
      throw error;
    }

    const timeout = setTimeout(() => {
      this.rejectReady?.(new Error('Engine timed out while loading'));
    }, 30000);

    this.worker.onerror = (e) => {
      clearTimeout(timeout);
      const error = new Error(e.message || 'Engine worker error');
      this.rejectReady?.(error);
    };

    this.worker.onmessage = (e: MessageEvent<string>) => {
      const line = typeof e.data === 'string' ? e.data : String(e.data);
      this.onMessage?.(line);
      if (line === 'uciok') {
        clearTimeout(timeout);
        this.resolveReady?.();
      }
      if (line.startsWith('bestmove')) {
        this.searching = false;
      }
    };

    this.send('uci');
    await this.readyPromise;
    this.send('isready');
  }

  send(cmd: string): void {
    this.worker?.postMessage(cmd);
  }

  setSkillLevel(skill: number): void {
    this.send('setoption name UCI_LimitStrength value true');
    const elo = Math.max(400, Math.min(2800, 600 + skill * 120));
    this.send(`setoption name UCI_Elo value ${elo}`);
    this.send(`setoption name Skill Level value ${Math.min(20, Math.max(0, Math.round(skill / 50)))}`);
  }

  setPosition(fen: string): void {
    this.send(`position fen ${fen}`);
  }

  async getBestMove(depth = 12, movetime = 1000): Promise<string | null> {
    await this.readyPromise;
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.send('stop');
        resolve(null);
      }, movetime + 5000);

      const handler = (line: string) => {
        if (line.startsWith('bestmove')) {
          clearTimeout(timeout);
          const parts = line.split(' ');
          this.onMessage = prev;
          resolve(parts[1] === '(none)' ? null : parts[1]);
        }
      };
      const prev = this.onMessage;
      this.onMessage = handler;
      this.searching = true;
      this.send(`go depth ${depth} movetime ${movetime}`);
    });
  }

  stop(): void {
    if (this.searching) this.send('stop');
  }

  newGame(): void {
    this.send('ucinewgame');
  }

  destroy(): void {
    this.send('quit');
    this.worker?.terminate();
    this.worker = null;
  }
}

let sharedEngine: StockfishEngine | null = null;
let engineInitPromise: Promise<StockfishEngine> | null = null;

export async function getEngine(): Promise<StockfishEngine> {
  if (!engineInitPromise) {
    engineInitPromise = (async () => {
      if (!sharedEngine) sharedEngine = new StockfishEngine();
      await sharedEngine.init();
      return sharedEngine;
    })();
  }
  return engineInitPromise;
}

export function resetEngine(): void {
  sharedEngine?.destroy();
  sharedEngine = null;
  engineInitPromise = null;
}
