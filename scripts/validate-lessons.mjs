import { Chess } from 'chess.js';
import { LESSONS } from './src/data/lessons.ts';

let errors = 0;

for (const lesson of LESSONS) {
  for (let i = 0; i < lesson.steps.length; i++) {
    const step = lesson.steps[i];
    if (step.fen) {
      try {
        const c = new Chess(step.fen);
        if (step.type === 'move' && step.expectedMove) {
          const moves = c.moves({ verbose: true });
          const found = moves.find(
            (m) => m.san === step.expectedMove || `${m.from}${m.to}` === step.expectedMove
          );
          if (!found) {
            console.error(`FAIL ${lesson.id} step ${i + 1}: expected "${step.expectedMove}" not legal. Legal: ${moves.map((m) => m.san).join(', ')}`);
            errors++;
          }
        }
      } catch (e) {
        console.error(`FAIL ${lesson.id} step ${i + 1}: invalid FEN "${step.fen}"`, e);
        errors++;
      }
    }
  }
}

console.log(errors === 0 ? 'All lessons OK' : `${errors} errors found`);
process.exit(errors > 0 ? 1 : 0);
