import type { Puzzle } from '../types';

export const PUZZLES: Puzzle[] = [
  // Easy — mates & basic tactics
  { id: 'p01', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1', solution: ['g7'], themes: ['mate', 'scholar'], difficulty: 'easy', rating: 600, description: 'Scholar\'s mate threat — find the mate in 1', orientation: 'black' },
  { id: 'p02', fen: '6k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1', solution: ['Rxf8#'], themes: ['mate', 'backrank'], difficulty: 'easy', rating: 700, description: 'Back rank checkmate' },
  { id: 'p03', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1', solution: ['Nf6'], themes: ['defense'], difficulty: 'easy', rating: 650, description: 'Defend against the threat on f7', orientation: 'black' },
  { id: 'p04', fen: '8/8/8/8/4N3/8/8/4k2K w - - 0 1', solution: ['Nc3', 'Kd2', 'Nb1'], themes: ['fork'], difficulty: 'easy', rating: 750, description: 'Set up a knight fork (simplified)' },
  { id: 'p05', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', solution: ['Bxf7+'], themes: ['sacrifice', 'tactics'], difficulty: 'easy', rating: 800, description: 'Sacrifice on f7 to expose the king' },

  // Medium — pins, forks, skewers
  { id: 'p06', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', solution: ['Bxf7+', 'Kxf7', 'Ng5+'], themes: ['sacrifice', 'fork'], difficulty: 'medium', rating: 1000, description: 'Classic bishop sacrifice on f7' },
  { id: 'p07', fen: 'r2qkb1r/ppp2ppp/2n1n3/3p4/3P4/2N1PN2/PPP3PP/R1BQKB1R w KQkq - 0 1', solution: ['Nxe5'], themes: ['fork', 'center'], difficulty: 'medium', rating: 950, description: 'Win a pawn in the center with a fork threat' },
  { id: 'p08', fen: '6k1/5r2/8/4N3/8/8/8/6K1 w - - 0 1', solution: ['Nxf7+'], themes: ['fork'], difficulty: 'medium', rating: 900, description: 'Knight fork — win the rook' },
  { id: 'p09', fen: '4r1k1/4q3/8/8/8/8/8/4R1K1 w - - 0 1', solution: ['Re8+', 'Qxe8', 'Rxe8#'], themes: ['skewer', 'mate'], difficulty: 'medium', rating: 1100, description: 'Skewer the queen to deliver mate' },
  { id: 'p10', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', solution: ['Ng5', 'd5', 'exd5'], themes: ['attack', 'opening'], difficulty: 'medium', rating: 1050, description: 'Attack the weak f7 square' },

  // Hard — multi-move combinations
  { id: 'p11', fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p2Q/2B1P3/3P1N2/PPP2PPP/RNB1K2R w KQ - 0 1', solution: ['Bxf7+', 'Rxf7', 'Qxf7+', 'Kh8', 'Qxf7'], themes: ['sacrifice', 'combination'], difficulty: 'hard', rating: 1400, description: 'Queen and bishop combination' },
  { id: 'p12', fen: 'r2q1rk1/ppp2ppp/2n1n3/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 1', solution: ['d5', 'Nxc3', 'bxc3', 'Bxc3+'], themes: ['pawn-break', 'tactics'], difficulty: 'hard', rating: 1350, description: 'Pawn break opens tactical lines' },
  { id: 'p13', fen: '8/1r3pk1/5p2/8/8/5P2/5KPP/8 w - - 0 1', solution: ['h4', 'Rb2+', 'Ke3', 'Rxg2'], themes: ['endgame', 'rook'], difficulty: 'hard', rating: 1300, description: 'Rook endgame — activate your king' },
  { id: 'p14', fen: '4r1k1/5ppp/8/8/8/5N2/5PPP/5RK1 w - - 0 1', solution: ['Nh4', 'Re7', 'Nf5'], themes: ['maneuver'], difficulty: 'hard', rating: 1250, description: 'Knight maneuver to a strong outpost' },
  { id: 'p15', fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1', solution: ['Nxe5', 'Nxe5', 'd4'], themes: ['opening', 'center'], difficulty: 'hard', rating: 1200, description: 'Win material in the center' },

  // More puzzles for variety
  { id: 'p16', fen: '8/8/8/4k3/8/8/3P4/3K4 w - - 0 1', solution: ['Ke2', 'Kd6', 'Kd3'], themes: ['endgame', 'opposition'], difficulty: 'medium', rating: 1000, description: 'Use opposition to promote the pawn' },
  { id: 'p17', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: ['Re8#'], themes: ['mate', 'backrank'], difficulty: 'easy', rating: 650, description: 'Simple back rank mate' },
  { id: 'p18', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4PP2/5N2/PPPP2PP/RNBQKB1R b KQkq f3 0 1', solution: ['d5'], themes: ['opening', 'center'], difficulty: 'medium', rating: 900, description: 'Strike back in the center', orientation: 'black' },
  { id: 'p19', fen: '8/8/8/8/1K6/8/8/k7 w - - 0 1', solution: ['Kc3', 'Ka2', 'Kb2'], themes: ['endgame'], difficulty: 'easy', rating: 700, description: 'Corner the lone king' },
  { id: 'p20', fen: '5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', solution: ['Re8'], themes: ['mate', 'backrank'], difficulty: 'easy', rating: 750, description: 'Exploit the back rank weakness' },
];

export function getPuzzle(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}

export function getPuzzlesByDifficulty(difficulty: string): Puzzle[] {
  return PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getPuzzlesByTheme(theme: string): Puzzle[] {
  return PUZZLES.filter((p) => p.themes.includes(theme));
}
