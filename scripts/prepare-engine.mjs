import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcJs = join(root, 'node_modules/stockfish/bin/stockfish-18-lite-single.js');
const srcWasm = join(root, 'node_modules/stockfish/bin/stockfish-18-lite-single.wasm');
const outDir = join(root, 'public/engine');
const outJs = join(outDir, 'stockfish.js');
const outWasm = join(outDir, 'stockfish.wasm');

if (!existsSync(srcJs) || !existsSync(srcWasm)) {
  console.error('Stockfish binaries not found. Run: npm install');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(srcJs, outJs);
copyFileSync(srcWasm, outWasm);
console.log('Copied stockfish lite-single engine to public/engine/');
