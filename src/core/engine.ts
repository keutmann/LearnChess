type EngineCallback = (line: string) => void;

function resolveEngineUrls(): { js: string; wasm: string } {
  const base = import.meta.env.BASE_URL || '/';
  const js = new URL(`${base}engine/stockfish.js`, window.location.href).href;
  const wasm = new URL(`${base}engine/stockfish.wasm`, window.location.href).href;
  return { js, wasm };
}

function firstWord(line: string): string {
  const space = line.indexOf(' ');
  return space === -1 ? line : line.slice(0, space);
}

function normalizeEngineData(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data == null) return '';
  return String(data);
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private searching = false;
  private onMessage: EngineCallback | null = null;
  private resolveReady: (() => void) | null = null;
  private rejectReady: ((err: Error) => void) | null = null;
  private readyPromise: Promise<void>;
  private initTimeout: ReturnType<typeof setTimeout> | null = null;
  private ready = false;

  constructor() {
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
  }

  async init(): Promise<void> {
    if (this.worker && this.ready) return;
    if (this.worker) return this.readyPromise;

    const { js, wasm } = resolveEngineUrls();

    try {
      // Official stockfish.js pattern: worker URL is js#wasm (wasm path in hash).
      this.worker = new Worker(`${js}#${wasm}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start engine worker');
      this.rejectReady?.(error);
      this.rejectReady = null;
      throw error;
    }

    this.initTimeout = setTimeout(() => {
      const error = new Error('Engine timed out while loading (WASM download may be slow)');
      this.rejectReady?.(error);
      this.rejectReady = null;
      this.worker?.terminate();
      this.worker = null;
    }, 60000);

    this.worker.onerror = (e) => {
      if (this.initTimeout) clearTimeout(this.initTimeout);
      const error = new Error(e.message || 'Engine worker error');
      if (!this.ready) {
        this.rejectReady?.(error);
        this.rejectReady = null;
      }
    };

    this.worker.onmessage = (e: MessageEvent) => {
      this.dispatchLines(normalizeEngineData(e.data));
    };

    this.send('uci');
    await this.readyPromise;
    this.send('isready');
  }

  private dispatchLines(raw: string): void {
    if (!raw) return;

    if (raw.includes('\n')) {
      for (const part of raw.split('\n')) {
        this.dispatchLine(part);
      }
      return;
    }

    this.dispatchLine(raw);
  }

  private dispatchLine(raw: string): void {
    const line = raw.trim();
    if (!line) return;

    this.onMessage?.(line);

    if (!this.ready && firstWord(line) === 'uciok') {
      this.ready = true;
      if (this.initTimeout) clearTimeout(this.initTimeout);
      this.resolveReady?.();
      this.resolveReady = null;
      this.rejectReady = null;
    }

    if (firstWord(line) === 'bestmove') {
      this.searching = false;
    }
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
        if (firstWord(line) === 'bestmove') {
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
    if (this.initTimeout) clearTimeout(this.initTimeout);
    this.send('quit');
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }
}

let sharedEngine: StockfishEngine | null = null;
let engineInitPromise: Promise<StockfishEngine> | null = null;

export async function getEngine(): Promise<StockfishEngine> {
  if (!engineInitPromise) {
    engineInitPromise = (async () => {
      const engine = new StockfishEngine();
      await engine.init();
      sharedEngine = engine;
      return engine;
    })().catch((err) => {
      engineInitPromise = null;
      sharedEngine?.destroy();
      sharedEngine = null;
      throw err;
    });
  }
  return engineInitPromise;
}

export function resetEngine(): void {
  sharedEngine?.destroy();
  sharedEngine = null;
  engineInitPromise = null;
}
