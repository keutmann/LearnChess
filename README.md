# Learn Chess

A complete client-side chess learning app with interactive lessons, puzzles, and engine play. Runs entirely in the browser with progress saved to `localStorage` — perfect for hosting on GitHub Pages.

## Features

- **30 interactive lessons** across 7 categories: Foundation, Tactics, Strategy, Calculation, Openings, Endgames, Mates
- **Progressive difficulty** (Easy → Medium → Hard) with a visual course map
- **20 tactical puzzles** with spaced repetition (SM-2 inspired SRS)
- **Play vs Stockfish** at 6 skill levels (Beginner to Grandmaster)
- **5 mini-games**: Piece Memory, Mate in One, Capture Hunt, Square Control, Piece Quiz
- **XP, levels, streaks, and achievements**
- **Mobile-first responsive UI** for desktop and mobile browsers
- **Export/import progress** as JSON backup

## Tech Stack

| Library | Purpose |
|---------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [chess.js](https://github.com/jhlywa/chess.js) | Chess rules & move validation |
| [@lichess-org/chessground](https://github.com/lichess-org/chessground) | Board UI (used by lichess.org) |
| [stockfish](https://github.com/nmrugg/stockfish.js) | WASM chess engine (lite-single) |

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production / GitHub Pages

```bash
npm run build
```

Output is in `dist/`. Deploy to GitHub Pages:

1. Push the repo to GitHub
2. Go to Settings → Pages → Source: **GitHub Actions** or deploy `dist/` folder
3. The app uses hash routing (`#/`) so it works without server rewrites

Or use the included workflow:

```bash
# Build locally and preview
npm run preview
```

## Project Structure

```
src/
  core/          # Storage, router, XP, SRS, board, engine
  data/          # Lessons, puzzles, curriculum
  views/         # Page renderers (home, courses, lesson, puzzles, play, minigames, profile)
  components/    # Layout, coach bubble, toasts
  styles/        # Mobile-first CSS
public/
  engine/        # Stockfish WASM files
```

## Learning Techniques

- **Progressive disclosure** — lessons unlock in sequence on the course map
- **Learn by doing** — interactive board moves and quizzes in every lesson
- **Immediate feedback** — coach messages and toast notifications
- **Spaced repetition** — failed puzzles return sooner; solved puzzles space out
- **Gamification** — XP, levels, daily streaks, achievements
- **Active recall** — quizzes before advancing; mini-games test pattern recognition

## License

GPL-3.0 (Stockfish engine). App code: MIT.
