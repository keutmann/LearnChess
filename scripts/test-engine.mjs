/**
 * Browser-based engine smoke test. Run with:
 *   node scripts/test-engine.mjs
 * Requires dev server at http://localhost:5173 (npm run dev).
 */
import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://localhost:5173/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: 'domcontentloaded' });

const logs = [];
page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));

const result = await page.evaluate(async (base) => {
  const js = new URL('engine/stockfish.js', base).href;
  const wasm = new URL('engine/stockfish.wasm', base).href;

  return new Promise((resolve) => {
    const lines = [];
    let worker;
    const timeout = setTimeout(() => {
      worker?.terminate();
      resolve({ ok: false, error: 'timeout', lines, js, wasm });
    }, 90000);

    try {
      worker = new Worker(`${js}#${wasm}`);
    } catch (err) {
      clearTimeout(timeout);
      resolve({ ok: false, error: String(err), lines, js, wasm });
      return;
    }

    worker.onerror = (e) => {
      clearTimeout(timeout);
      resolve({ ok: false, error: e.message || 'worker error', lines, js, wasm });
    };

    worker.onmessage = (e) => {
      const raw = typeof e.data === 'string' ? e.data : String(e.data);
      for (const part of raw.split('\n')) {
        const line = part.trim();
        if (!line) continue;
        lines.push(line);
        if (line === 'uciok' || line.startsWith('uciok ')) {
          worker.postMessage('position startpos');
          worker.postMessage('go depth 8 movetime 500');
        }
        if (line.startsWith('bestmove ')) {
          clearTimeout(timeout);
          worker.terminate();
          resolve({ ok: true, bestmove: line, lines, js, wasm });
        }
      }
    };

    worker.postMessage('uci');
  });
}, BASE);

await browser.close();

console.log('Engine URLs:', result.js, result.wasm);
if (result.ok) {
  console.log('PASS:', result.bestmove);
  console.log('UCI lines received:', result.lines.length);
  process.exit(0);
}

console.error('FAIL:', result.error);
console.error('Lines received:', result.lines.slice(0, 20).join('\n'));
for (const line of logs) console.error(line);
process.exit(1);
