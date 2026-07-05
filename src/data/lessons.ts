import type { Lesson } from '../types';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const LESSONS: Lesson[] = [
  // ── FOUNDATION ──────────────────────────────────────────
  {
    id: 'f-board', category: 'foundation', difficulty: 'easy', order: 1,
    title: 'The Chess Board', description: 'Meet the 64 squares and how to read coordinates.',
    xpReward: 50,
    steps: [
      { type: 'text', coach: 'Welcome! Chess is played on a board of 64 squares — 8 rows and 8 columns.', content: 'The rows are called **ranks** (numbered 1–8) and the columns are **files** (lettered a–h). The bottom-left square from White\'s view is **a1**.' },
      { type: 'board', coach: 'Here is the starting position. White pieces sit on ranks 1–2, Black on ranks 7–8.', fen: START, orientation: 'white' },
      { type: 'quiz', coach: 'Quick check — which square is in the bottom-right corner for White?', quiz: { question: 'What is the bottom-right square (from White\'s view)?', options: [{ id: 'a', text: 'a1' }, { id: 'b', text: 'h1', correct: true }, { id: 'c', text: 'h8' }, { id: 'd', text: 'a8' }], explanation: 'Files go a→h left to right. Rank 1 is White\'s back rank, so the corner is h1.' } },
      { type: 'highlight', coach: 'The four center squares (d4, d5, e4, e5) are the most important area on the board.', fen: START, shapes: [{ orig: 'd4', brush: 'green' }, { orig: 'd5', brush: 'green' }, { orig: 'e4', brush: 'green' }, { orig: 'e5', brush: 'green' }] },
    ],
  },
  {
    id: 'f-pawn', category: 'foundation', difficulty: 'easy', order: 2,
    title: 'How the Pawn Moves', description: 'The pawn moves forward but captures diagonally.',
    xpReward: 50,
    steps: [
      { type: 'text', coach: 'Pawns are the foot soldiers of chess. They move **forward** one square at a time.', content: 'On their very first move, a pawn may advance **two squares**. Pawns capture **one square diagonally forward** — never straight ahead.' },
      { type: 'board', coach: 'From the starting position, White\'s e-pawn can move to e3 or e4.', fen: START, shapes: [{ orig: 'e2', dest: 'e3', brush: 'green' }, { orig: 'e2', dest: 'e4', brush: 'green' }] },
      { type: 'board', coach: 'This pawn on d4 can capture the bishop on e5.', fen: 'rnbqkbnr/pppp1ppp/8/4b3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1', shapes: [{ orig: 'd4', dest: 'e5', brush: 'red' }] },
      { type: 'quiz', coach: 'Can a pawn move backward?', quiz: { question: 'Can a pawn ever move backward?', options: [{ id: 'a', text: 'Yes, when capturing' }, { id: 'b', text: 'No, pawns only move forward', correct: true }, { id: 'c', text: 'Only on the first move' }], explanation: 'Pawns never move backward — they only advance toward the opponent\'s side.' } },
    ],
  },
  {
    id: 'f-sliding', category: 'foundation', difficulty: 'easy', order: 3,
    title: 'Rook, Bishop & Queen', description: 'The sliding pieces and their movement patterns.',
    xpReward: 60,
    steps: [
      { type: 'text', coach: 'The **Rook** moves any number of squares horizontally or vertically.', content: 'The **Bishop** moves any number of squares diagonally. Each bishop stays on one color for the entire game.' },
      { type: 'board', coach: 'The rook on d3 controls the entire d-file and the 3rd rank.', fen: 'rnbqkbnr/pppppppp/8/8/8/3R4/PPPPPPPP/RNBQKBNR b KQkq - 0 1', shapes: [{ orig: 'd3', dest: 'd8', brush: 'green' }, { orig: 'd3', dest: 'a3', brush: 'green' }] },
      { type: 'text', coach: 'The **Queen** combines rook and bishop — the most powerful piece!', content: 'She moves any number of squares in any straight line (horizontal, vertical, or diagonal). Use her wisely — she\'s worth about 9 pawns.' },
      { type: 'quiz', coach: 'Which piece can move diagonally?', quiz: { question: 'Which piece moves diagonally any number of squares?', options: [{ id: 'a', text: 'Rook' }, { id: 'b', text: 'Bishop', correct: true }, { id: 'c', text: 'Knight' }, { id: 'd', text: 'Pawn' }], explanation: 'Bishops move diagonally. The queen also moves diagonally, but the bishop is the dedicated diagonal piece.' } },
    ],
  },
  {
    id: 'f-knight-king', category: 'foundation', difficulty: 'easy', order: 4,
    title: 'Knight & King', description: 'The unique L-shaped knight and the royal king.',
    xpReward: 60,
    steps: [
      { type: 'text', coach: 'The **Knight** jumps in an L-shape: 2 squares in one direction, then 1 square perpendicular.', content: 'Knights are the only pieces that can jump over other pieces. They always land on the opposite color from where they started.' },
      { type: 'board', coach: 'From e4, the knight can reach all the green squares.', fen: 'rnbqkbnr/pppppppp/8/8/4N3/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1', shapes: [{ orig: 'e4', dest: 'c5', brush: 'green' }, { orig: 'e4', dest: 'd6', brush: 'green' }, { orig: 'e4', dest: 'f6', brush: 'green' }, { orig: 'e4', dest: 'g5', brush: 'green' }, { orig: 'e4', dest: 'g3', brush: 'green' }, { orig: 'e4', dest: 'f2', brush: 'green' }, { orig: 'e4', dest: 'd2', brush: 'green' }, { orig: 'e4', dest: 'c3', brush: 'green' }] },
      { type: 'text', coach: 'The **King** moves one square in any direction. Protect your king at all costs!', content: 'If your king is attacked (in "check"), you must escape. If there\'s no escape, it\'s checkmate and the game is over.' },
      { type: 'quiz', coach: 'Which piece can jump over others?', quiz: { question: 'Which piece can jump over other pieces?', options: [{ id: 'a', text: 'Queen' }, { id: 'b', text: 'Knight', correct: true }, { id: 'c', text: 'King' }], explanation: 'Only the knight can jump over pieces — all others must have a clear path.' } },
    ],
  },
  {
    id: 'f-capture', category: 'foundation', difficulty: 'easy', order: 5,
    title: 'Capturing Pieces', description: 'How to take opponent pieces and gain material.',
    xpReward: 60,
    steps: [
      { type: 'text', coach: 'To capture, move your piece to the square occupied by an opponent\'s piece.', content: 'The captured piece is removed from the board. **Material advantage** (having more pieces) is a huge factor in winning.' },
      { type: 'text', coach: 'Piece values (approximate): Pawn=1, Knight/Bishop=3, Rook=5, Queen=9.', content: 'When capturing, ask: "Am I winning the trade?" Trading a queen (9) for a pawn (1) is terrible!' },
      { type: 'board', coach: 'White can capture the knight on f6 with the pawn on e5.', fen: 'rnbqkb1r/pppp1ppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', shapes: [{ orig: 'e5', dest: 'f6', brush: 'red' }] },
      { type: 'move', coach: 'Your turn! Capture the knight on f6 with your e-pawn.', fen: 'rnbqkb1r/pppp1ppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', expectedMove: 'exf6', hints: ['Move the pawn on e5 diagonally to capture on f6'] },
    ],
  },
  {
    id: 'f-check', category: 'foundation', difficulty: 'easy', order: 6,
    title: 'Check & Escape', description: 'What check means and the three ways to escape.',
    xpReward: 70,
    steps: [
      { type: 'text', coach: '**Check** means your king is under attack. You MUST respond immediately.', content: 'Three ways to escape check:\n1. **Move** the king to a safe square\n2. **Block** the attack with another piece\n3. **Capture** the attacking piece' },
      { type: 'board', coach: 'The queen on e5 gives check to the white king on e1.', fen: 'rnb1kbnr/pppp1ppp/8/4q3/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', shapes: [{ orig: 'e5', dest: 'e1', brush: 'red' }] },
      { type: 'quiz', coach: 'How many ways can you escape check?', quiz: { question: 'How many ways are there to escape check?', options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '3', correct: true }, { id: 'd', text: '4' }], explanation: 'Move the king, block the attack, or capture the attacker — three options.' } },
    ],
  },
  {
    id: 'f-checkmate', category: 'foundation', difficulty: 'easy', order: 7,
    title: 'Checkmate', description: 'Delivering checkmate — the goal of every game.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: '**Checkmate** is check with no escape. The game ends immediately!', content: 'The goal of chess is to checkmate your opponent\'s king. You don\'t need to capture every piece — just trap the king.' },
      { type: 'board', coach: 'This is a classic back-rank mate. The rook delivers checkmate on e8.', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', shapes: [{ orig: 'e1', dest: 'e8', brush: 'red' }] },
      { type: 'quiz', coach: 'What ends a chess game?', quiz: { question: 'What is the primary way to win a chess game?', options: [{ id: 'a', text: 'Capture all pieces' }, { id: 'b', text: 'Checkmate the king', correct: true }, { id: 'c', text: 'Reach the other side' }], explanation: 'Checkmate — attacking the king with no escape — is the only way to win (besides resignation or time).' } },
    ],
  },
  {
    id: 'f-special', category: 'foundation', difficulty: 'easy', order: 8,
    title: 'Special Moves', description: 'Castling, en passant, and pawn promotion.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: '**Castling** moves your king two squares toward a rook, and the rook jumps to the other side.', content: 'Requirements: neither piece has moved, no pieces between them, king not in check, king doesn\'t pass through check.' },
      { type: 'text', coach: '**En passant**: if a pawn moves two squares and lands beside your pawn, you may capture it as if it moved one square.', content: 'This must be done immediately on the next move.' },
      { type: 'text', coach: '**Promotion**: when a pawn reaches the opposite back rank, it becomes any piece (usually a queen).', content: 'A pawn can become a queen, rook, bishop, or knight — most players choose queen!' },
      { type: 'quiz', coach: 'Test your knowledge of special moves.', quiz: { question: 'When a pawn reaches the 8th rank, what happens?', options: [{ id: 'a', text: 'It is removed' }, { id: 'b', text: 'It promotes to another piece', correct: true }, { id: 'c', text: 'It can move backward' }], explanation: 'Pawn promotion — the pawn transforms into any piece, almost always a queen.' } },
    ],
  },

  // ── TACTICS ──────────────────────────────────────────
  {
    id: 't-intro', category: 'tactics', difficulty: 'easy', order: 9,
    title: 'Introduction to Tactics', description: 'Short-term combinations that win material or mate.',
    xpReward: 70,
    steps: [
      { type: 'text', coach: 'Tactics are short-term opportunities — usually 1–3 moves that win material or deliver mate.', content: 'The best way to improve at chess is tactics training. Look for checks, captures, and threats on every move.' },
      { type: 'text', coach: 'Use the **CCT method**: Checks, Captures, Threats.', content: 'Before making a move, scan the board for all checks you can give, all captures available, and all threats you can make.' },
      { type: 'quiz', coach: 'What does CCT stand for?', quiz: { question: 'In the CCT method, what do you look for?', options: [{ id: 'a', text: 'Checks, Captures, Threats', correct: true }, { id: 'b', text: 'Center, Control, Tempo' }, { id: 'c', text: 'Castle, Calculate, Trade' }], explanation: 'CCT = Checks, Captures, Threats — a systematic scan before every move.' } },
    ],
  },
  {
    id: 't-fork', category: 'tactics', difficulty: 'easy', order: 10,
    title: 'The Fork', description: 'One piece attacks two or more enemy pieces at once.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'A **fork** attacks two or more pieces simultaneously. Knights are famous for forks!', content: 'When your opponent can only save one piece, you win the other. Always look for fork opportunities.' },
      { type: 'board', coach: 'The knight on e5 can fork the king and rook with Nxf7+!', fen: '6k1/5r2/8/4N3/8/8/8/6K1 w - - 0 1', shapes: [{ orig: 'e5', dest: 'f7', brush: 'red' }] },
      { type: 'move', coach: 'Find the fork! Capture on f7 with check — you win the rook.', fen: '6k1/5r2/8/4N3/8/8/8/6K1 w - - 0 1', expectedMove: 'Nxf7+', hints: ['Jump the knight from e5 to f7 — it checks the king and captures the rook'] },
    ],
  },
  {
    id: 't-pin', category: 'tactics', difficulty: 'medium', order: 11,
    title: 'The Pin', description: 'A piece cannot move without exposing a more valuable piece behind it.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'A **pin** immobilizes a piece because moving it would expose a more valuable piece behind it.', content: '**Absolute pin**: the piece behind is the king — it cannot legally move.\n**Relative pin**: the piece behind is valuable (queen, rook) — moving is costly.' },
      { type: 'board', coach: 'The bishop on b5 pins the knight on c6 to the king on e8.', fen: 'r1bqk2r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1', shapes: [{ orig: 'b5', dest: 'e8', brush: 'red' }] },
      { type: 'quiz', coach: 'What makes an absolute pin different?', quiz: { question: 'In an absolute pin, what piece is behind the pinned piece?', options: [{ id: 'a', text: 'The king', correct: true }, { id: 'b', text: 'The queen' }, { id: 'c', text: 'A rook' }], explanation: 'Absolute pin = pinned to the king. The piece cannot legally move at all.' } },
    ],
  },
  {
    id: 't-skewer', category: 'tactics', difficulty: 'medium', order: 12,
    title: 'The Skewer', description: 'Attack a valuable piece, forcing it to move and exposing one behind it.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'A **skewer** is like a reverse pin — you attack a valuable piece that must move, exposing a piece behind it.', content: 'Rooks and bishops on open files/diagonals create devastating skewers.' },
      { type: 'board', coach: 'The rook on e1 skewers the queen on e7, with the king on e8 behind.', fen: '4r1k1/4q3/8/8/8/8/8/4R1K1 w - - 0 1', shapes: [{ orig: 'e1', dest: 'e8', brush: 'red' }] },
      { type: 'quiz', coach: 'Pin vs skewer — what\'s the difference?', quiz: { question: 'In a skewer, which piece is attacked first?', options: [{ id: 'a', text: 'The less valuable piece' }, { id: 'b', text: 'The more valuable piece', correct: true }], explanation: 'Skewer attacks the valuable piece first (forcing it to move), then you capture what\'s behind.' } },
    ],
  },
  {
    id: 't-discovered', category: 'tactics', difficulty: 'medium', order: 13,
    title: 'Discovered Attack', description: 'Move one piece to unleash an attack from a piece behind it.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'A **discovered attack** happens when moving one piece uncovers an attack from a piece behind it.', content: 'Discovered **check** is especially powerful — the opponent must deal with check AND your moved piece\'s threat.' },
      { type: 'board', coach: 'Moving the knight reveals the bishop\'s attack on the queen.', fen: '4r1k1/3q4/8/4N3/3B4/8/8/4R1K1 w - - 0 1', shapes: [{ orig: 'd4', dest: 'g7', brush: 'red' }] },
      { type: 'quiz', coach: 'Why are discovered checks so strong?', quiz: { question: 'Why is a discovered check especially powerful?', options: [{ id: 'a', text: 'It gives you two threats at once', correct: true }, { id: 'b', text: 'It captures a piece' }, { id: 'c', text: 'It promotes a pawn' }], explanation: 'The opponent must respond to check while your other piece creates a second threat.' } },
    ],
  },
  {
    id: 't-backrank', category: 'tactics', difficulty: 'medium', order: 14,
    title: 'Back Rank Tactics', description: 'Exploit a trapped king on the back rank.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'A king trapped by its own pawns on the back rank is vulnerable to rook or queen mates.', content: 'Create a **back rank weakness** by removing defenders, or prevent it by giving your king an escape square (luft).' },
      { type: 'board', coach: 'Re8# — the rook delivers back-rank checkmate.', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', shapes: [{ orig: 'e1', dest: 'e8', brush: 'red' }] },
      { type: 'move', coach: 'Deliver back-rank checkmate with the rook!', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', expectedMove: 'Re8#', hints: ['Slide your rook from e1 to e8 — the king has no escape'] },
    ],
  },

  // ── STRATEGY ──────────────────────────────────────────
  {
    id: 's-center', category: 'strategy', difficulty: 'medium', order: 15,
    title: 'Center Control', description: 'Why the center matters and how to fight for it.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'Controlling the center gives your pieces maximum mobility and attacking chances.', content: 'Occupy with pawns (e4, d4), support with pieces, and restrict opponent\'s counterplay.' },
      { type: 'highlight', coach: 'These four squares form the heart of the board.', fen: START, shapes: [{ orig: 'd4', brush: 'green' }, { orig: 'e4', brush: 'green' }, { orig: 'd5', brush: 'green' }, { orig: 'e5', brush: 'green' }] },
      { type: 'quiz', coach: 'Why fight for the center?', quiz: { question: 'Why is center control important?', options: [{ id: 'a', text: 'Pieces reach more squares from the center', correct: true }, { id: 'b', text: 'The king is safer there' }, { id: 'c', text: 'Pawns move faster there' }], explanation: 'Centralized pieces control more squares and can quickly switch between flanks.' } },
    ],
  },
  {
    id: 's-development', category: 'strategy', difficulty: 'medium', order: 16,
    title: 'Development', description: 'Get your pieces into the game quickly and efficiently.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'Develop knights and bishops before moving the same piece twice or pushing too many pawns.', content: 'Castle early to connect your rooks and tuck your king to safety. Don\'t bring the queen out too early.' },
      { type: 'quiz', coach: 'Development priorities.', quiz: { question: 'What should you typically do in the opening?', options: [{ id: 'a', text: 'Push all pawns first' }, { id: 'b', text: 'Develop minor pieces and castle', correct: true }, { id: 'c', text: 'Bring the queen to h5 immediately' }], explanation: 'Develop knights and bishops, control center, castle — standard opening priorities.' } },
    ],
  },
  {
    id: 's-king-safety', category: 'strategy', difficulty: 'medium', order: 17,
    title: 'King Safety', description: 'Keep your king safe throughout the game.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'An exposed king is a target. Castle early and avoid moving pawns in front of your castled king.', content: 'In the endgame, activate your king — it becomes a fighting piece. But in the middlegame, safety first!' },
      { type: 'quiz', coach: 'When is the king a fighting piece?', quiz: { question: 'When does the king become active and strong?', options: [{ id: 'a', text: 'In the opening' }, { id: 'b', text: 'In the endgame', correct: true }, { id: 'c', text: 'Never' }], explanation: 'In endgames with few pieces, the king can safely march forward and support pawns.' } },
    ],
  },
  {
    id: 's-pawns', category: 'strategy', difficulty: 'medium', order: 18,
    title: 'Pawn Structure', description: 'Weak pawns, pawn chains, and passed pawns.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'Pawn structure lasts the entire game. Weaknesses like **isolated**, **doubled**, and **backward** pawns are targets.', content: 'A **passed pawn** (no enemy pawns blocking its path) is a powerful endgame asset. Protect and advance them!' },
      { type: 'quiz', coach: 'What is a passed pawn?', quiz: { question: 'What defines a passed pawn?', options: [{ id: 'a', text: 'A pawn on the 7th rank' }, { id: 'b', text: 'A pawn with no enemy pawns blocking its advance', correct: true }, { id: 'c', text: 'A pawn that has captured' }], explanation: 'Passed pawns have a clear path to promotion — very dangerous in endgames.' } },
    ],
  },

  // ── CALCULATION ──────────────────────────────────────────
  {
    id: 'c-visualize', category: 'calculation', difficulty: 'medium', order: 19,
    title: 'Visualization', description: 'See the board in your mind without moving pieces.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'Strong players calculate by visualizing positions 3–5 moves ahead without touching the board.', content: 'Practice: look at a position, close your eyes, play a move in your mind, and verify you can "see" the result.' },
      { type: 'board', coach: 'Can you visualize what happens after 1.Nf3? The knight lands on f3, controlling e5 and g5.', fen: START },
      { type: 'quiz', coach: 'Building visualization skill.', quiz: { question: 'What is the best way to improve calculation?', options: [{ id: 'a', text: 'Move pieces randomly' }, { id: 'b', text: 'Practice visualizing positions without moving pieces', correct: true }, { id: 'c', text: 'Only play blitz' }], explanation: 'Deliberate visualization practice builds the mental board you need for deep calculation.' } },
    ],
  },
  {
    id: 'c-candidates', category: 'calculation', difficulty: 'medium', order: 20,
    title: 'Candidate Moves', description: 'Find the best moves by listing candidates first.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'Don\'t calculate every move. Find 2–4 **candidate moves** and calculate each deeply.', content: 'Start with checks, captures, and threats (CCT). Then consider quiet improving moves.' },
      { type: 'quiz', coach: 'How many candidates?', quiz: { question: 'How many candidate moves should you typically consider?', options: [{ id: 'a', text: 'Every legal move' }, { id: 'b', text: '2–4 serious candidates', correct: true }, { id: 'c', text: 'Only one' }], explanation: 'Narrow down to 2–4 candidates, then calculate each to pick the best.' } },
    ],
  },
  {
    id: 'c-forcing', category: 'calculation', difficulty: 'hard', order: 21,
    title: 'Forcing Sequences', description: 'Calculate checks, captures, and threats in sequence.',
    xpReward: 100,
    steps: [
      { type: 'text', coach: 'Forcing moves limit your opponent\'s replies, making calculation easier.', content: 'A sequence of checks and captures often leads to a clear outcome. Calculate to the end of the forcing line.' },
      { type: 'board', coach: 'White plays 1.Qh5+ — a forcing check that leads to winning the e5 pawn.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1', shapes: [{ orig: 'd1', dest: 'h5', brush: 'red' }] },
      { type: 'quiz', coach: 'Why calculate forcing lines first?', quiz: { question: 'Why start with forcing moves when calculating?', options: [{ id: 'a', text: 'They limit opponent replies', correct: true }, { id: 'b', text: 'They are always the best' }, { id: 'c', text: 'They save time on the clock' }], explanation: 'Forcing moves reduce the opponent\'s options, making your calculation tree smaller and more accurate.' } },
    ],
  },

  // ── OPENINGS ──────────────────────────────────────────
  {
    id: 'o-principles', category: 'openings', difficulty: 'easy', order: 22,
    title: 'Opening Principles', description: 'The golden rules for the first 10 moves.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'Opening principles (in order of priority):', content: '1. **Control the center** (e4, d4)\n2. **Develop pieces** (knights before bishops)\n3. **Castle** to safety\n4. **Connect rooks**\n5. Don\'t move the same piece twice\n6. Don\'t bring the queen out early' },
      { type: 'quiz', coach: 'Opening priority check.', quiz: { question: 'What is the #1 opening priority?', options: [{ id: 'a', text: 'Attack with the queen' }, { id: 'b', text: 'Control the center', correct: true }, { id: 'c', text: 'Push the h-pawn' }], explanation: 'Center control gives your pieces space and flexibility — it\'s the foundation of good openings.' } },
    ],
  },
  {
    id: 'o-italian', category: 'openings', difficulty: 'medium', order: 23,
    title: 'The Italian Game', description: '1.e4 e5 2.Nf3 Nc6 3.Bc4 — classical and aggressive.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'The Italian Game: **1.e4 e5 2.Nf3 Nc6 3.Bc4**', content: 'White develops naturally, targets the weak f7 square, and prepares to castle. One of the oldest and most respected openings.' },
      { type: 'board', coach: 'The Italian Game position. Bishop eyes f7.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1', shapes: [{ orig: 'c4', dest: 'f7', brush: 'yellow' }] },
      { type: 'quiz', coach: 'Italian Game key square.', quiz: { question: 'Which square does the Italian bishop target?', options: [{ id: 'a', text: 'f7', correct: true }, { id: 'b', text: 'e8' }, { id: 'c', text: 'd5' }], explanation: 'f7 is only defended by the king — a classic attacking target in the Italian.' } },
    ],
  },
  {
    id: 'o-london', category: 'openings', difficulty: 'medium', order: 24,
    title: 'The London System', description: 'A solid, system-based opening for White.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'The London System: **1.d4 d5 2.Bf4** (or 1.d4, 2.Nf3, 3.Bf4)', content: 'A solid, hard-to-refute system. White builds a strong pawn triangle (d4, e3, c3) and develops harmoniously.' },
      { type: 'board', coach: 'Typical London setup for White.', fen: 'rnbqkbnr/pppp1ppp/8/4p3/3PP3/2N1BN2/PP3PPP/R1BQ1RK1 b kq - 0 1' },
      { type: 'quiz', coach: 'London System character.', quiz: { question: 'What type of opening is the London System?', options: [{ id: 'a', text: 'Sharp tactical gambit' }, { id: 'b', text: 'Solid system-based opening', correct: true }, { id: 'c', text: 'Endgame study' }], explanation: 'The London is a system — you play the same setup regardless of Black\'s moves.' } },
    ],
  },

  // ── ENDGAMES ──────────────────────────────────────────
  {
    id: 'e-kp', category: 'endgames', difficulty: 'medium', order: 25,
    title: 'King & Pawn Endgames', description: 'The most fundamental endgame: king and pawn vs king.',
    xpReward: 90,
    steps: [
      { type: 'text', coach: 'In king and pawn endgames, **king activity** is everything. Your king must escort the pawn.', content: 'Key rule: get your king in front of your pawn, not behind it. The king leads the way to promotion!' },
      { type: 'board', coach: 'White wins by escorting the pawn with the king.', fen: '8/8/8/3k4/3P4/3K4/8/8 w - - 0 1', shapes: [{ orig: 'd3', dest: 'd4', brush: 'green' }] },
      { type: 'quiz', coach: 'King placement in pawn endgames.', quiz: { question: 'Where should your king be relative to your passed pawn?', options: [{ id: 'a', text: 'In front of the pawn', correct: true }, { id: 'b', text: 'Behind the pawn' }, { id: 'c', text: 'On the other side of the board' }], explanation: 'The king must lead the pawn forward, clearing the path and protecting it.' } },
    ],
  },
  {
    id: 'e-opposition', category: 'endgames', difficulty: 'hard', order: 26,
    title: 'Opposition', description: 'A king technique for outmaneuvering the enemy king.',
    xpReward: 100,
    steps: [
      { type: 'text', coach: '**Opposition**: when kings face each other with one square between them, the side NOT to move has the advantage.', content: 'Use opposition to force the enemy king to give way, allowing your pawn to advance or your king to penetrate.' },
      { type: 'board', coach: 'White to move has opposition — Black must step aside.', fen: '8/8/4k3/8/4K3/8/8/8 w - - 0 1', shapes: [{ orig: 'e4', dest: 'e6', brush: 'green' }] },
      { type: 'quiz', coach: 'Who wants opposition?', quiz: { question: 'In opposition, which side benefits?', options: [{ id: 'a', text: 'The side NOT to move', correct: true }, { id: 'b', text: 'The side to move' }, { id: 'c', text: 'Neither' }], explanation: 'The side not to move "has" opposition — the other king must give way.' } },
    ],
  },
  {
    id: 'e-rook', category: 'endgames', difficulty: 'hard', order: 27,
    title: 'Rook Endgame Basics', description: 'Rook behind the passed pawn, cut off the king.',
    xpReward: 100,
    steps: [
      { type: 'text', coach: 'Two golden rules of rook endgames:', content: '1. **Rook behind the passed pawn** (yours or opponent\'s)\n2. **Cut off the enemy king** on a rank or file' },
      { type: 'quiz', coach: 'Rook placement rule.', quiz: { question: 'Where should your rook be relative to a passed pawn?', options: [{ id: 'a', text: 'Behind the pawn', correct: true }, { id: 'b', text: 'In front of the pawn' }, { id: 'c', text: 'On the other flank' }], explanation: 'Rook behind the pawn supports its advance and keeps maximum activity.' } },
    ],
  },

  // ── MATES ──────────────────────────────────────────
  {
    id: 'm-queen', category: 'mates', difficulty: 'easy', order: 28,
    title: 'Mate with Queen & King', description: 'The fundamental checkmate technique.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'Queen + King vs lone King: drive the enemy king to the edge, then deliver mate.', content: 'Use your queen to cut off squares. Your king helps restrict the enemy king. Be patient — don\'t stalemate!' },
      { type: 'board', coach: 'The queen restricts the king while your king approaches.', fen: '8/8/8/8/8/4k3/8/3QK3 w - - 0 1' },
      { type: 'quiz', coach: 'Queen mate danger.', quiz: { question: 'What must you avoid when mating with queen + king?', options: [{ id: 'a', text: 'Stalemate', correct: true }, { id: 'b', text: 'Castling' }, { id: 'c', text: 'En passant' }], explanation: 'If the enemy king has no legal moves and is NOT in check, it\'s stalemate — a draw!' } },
    ],
  },
  {
    id: 'm-rook', category: 'mates', difficulty: 'easy', order: 29,
    title: 'Mate with Rook & King', description: 'Box in the king and deliver mate on the edge.',
    xpReward: 80,
    steps: [
      { type: 'text', coach: 'Rook + King vs King: use your rook to **cut off ranks or files**, shrinking the box.', content: 'Your king approaches while the rook holds the edge. When the enemy king is on the back rank, deliver mate!' },
      { type: 'board', coach: 'Classic rook mate on the back rank.', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1', shapes: [{ orig: 'e1', dest: 'e8', brush: 'red' }] },
      { type: 'quiz', coach: 'Rook mate technique.', quiz: { question: 'How does the rook help deliver mate?', options: [{ id: 'a', text: 'By cutting off the king\'s escape squares', correct: true }, { id: 'b', text: 'By capturing pawns' }, { id: 'c', text: 'By promoting' }], explanation: 'The rook restricts the king to a shrinking box until mate on the edge.' } },
    ],
  },
  {
    id: 'm-patterns', category: 'mates', difficulty: 'medium', order: 30,
    title: 'Mate Patterns', description: 'Smothered mate, ladder mate, and Arabian mate.',
    xpReward: 100,
    steps: [
      { type: 'text', coach: 'Common mating patterns to recognize:', content: '**Back rank mate**: rook/queen on the 8th rank\n**Smothered mate**: knight mates a king trapped by its own pieces\n**Ladder mate**: two rooks on adjacent files\n**Arabian mate**: knight + rook on the corner' },
      { type: 'board', coach: 'Smothered mate — the knight on f7 delivers mate!', fen: 'rnb1kb1r/pppp1ppp/5n2/8/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1', shapes: [{ orig: 'f3', dest: 'g5', brush: 'yellow' }] },
      { type: 'quiz', coach: 'Name that mate!', quiz: { question: 'A knight mates a king surrounded by its own pieces. This is called...', options: [{ id: 'a', text: 'Smothered mate', correct: true }, { id: 'b', text: 'Back rank mate' }, { id: 'c', text: 'Ladder mate' }], explanation: 'Smothered mate — the king is smothered by its own pieces and cannot escape the knight.' } },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByCategory(category: string): Lesson[] {
  return LESSONS.filter((l) => l.category === category);
}
