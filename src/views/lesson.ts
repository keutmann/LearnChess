import type { Key } from '@lichess-org/chessground/types';
import { getLesson } from '../data/lessons';
import { getProgress, updateProgress } from '../core/state';
import { awardXp, checkAchievements, updateStreak } from '../core/xp';
import { renderLayout, coachBubble, renderMarkdown, showToast } from '../components/layout';
import { navigate } from '../core/router';
import { ChessBoard, moveMatches } from '../core/chess-board';
import type { Lesson, LessonStep } from '../types';

let board: ChessBoard | null = null;

export function renderLesson(params: Record<string, string>): void {
  const lesson = getLesson(params.id ?? '');
  if (!lesson) {
    renderLayout('<p>Lesson not found.</p>', '/courses');
    return;
  }

  let stepIndex = 0;
  let hintIndex = 0;

  const advance = (isLast: boolean) => {
    if (isLast) completeLesson(lesson);
    else {
      stepIndex++;
      hintIndex = 0;
      draw();
    }
  };

  const draw = () => {
    board?.destroy();
    board = null;

    const step = lesson.steps[stepIndex];
    const isLast = stepIndex >= lesson.steps.length - 1;
    const progress = Math.round((stepIndex / lesson.steps.length) * 100);

    renderLayout(`
      <section class="page lesson-page">
        <div class="lesson-header">
          <button class="btn-back" data-back>← Back</button>
          <div class="lesson-meta">
            <h1>${lesson.title}</h1>
            <div class="lesson-progress"><div class="lesson-progress-bar" style="width:${progress}%"></div></div>
            <span class="step-counter">Step ${stepIndex + 1} of ${lesson.steps.length}</span>
          </div>
        </div>
        ${coachBubble(step.coach)}
        <div class="lesson-body" id="lesson-body">${renderStep(step)}</div>
        <div class="lesson-actions" id="lesson-actions">
          ${step.type === 'move' ? `<button class="btn btn-secondary" id="hint-btn">💡 Hint</button>` : ''}
          ${step.type !== 'move' && step.type !== 'quiz' ? `
            <button class="btn btn-primary" id="next-btn">${isLast ? 'Complete Lesson ✓' : 'Continue →'}</button>
          ` : ''}
        </div>
      </section>
    `, '/courses');

    document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/courses'));

    if (step.type === 'quiz') {
      bindQuiz(step, isLast, advance);
    } else if (step.type === 'move') {
      bindMove(step, isLast, advance);
    } else if (['board', 'highlight'].includes(step.type)) {
      mountBoard(step, false);
    }

    document.getElementById('next-btn')?.addEventListener('click', () => advance(isLast));

    document.getElementById('hint-btn')?.addEventListener('click', () => {
      if (step.hints && hintIndex < step.hints.length) {
        showToast(step.hints[hintIndex], 'info');
        hintIndex++;
      } else {
        showToast('No more hints available.', 'info');
      }
    });
  };

  draw();
}

function renderStep(step: LessonStep): string {
  if (step.type === 'text') {
    return `<div class="text-step">${renderMarkdown(step.content ?? '')}</div>`;
  }
  if (step.type === 'quiz') {
    return `
      <div class="quiz-step">
        <h3>${step.quiz!.question}</h3>
        <div class="quiz-options">
          ${step.quiz!.options.map((o) => `<button class="quiz-option" data-option="${o.id}">${o.text}</button>`).join('')}
        </div>
        <div class="quiz-feedback hidden" id="quiz-feedback"></div>
      </div>
    `;
  }
  return `<div class="board-wrap"><div class="chess-board" id="lesson-board"></div></div>`;
}

function mountBoard(step: LessonStep, movable: boolean): void {
  const el = document.getElementById('lesson-board');
  if (!el) return;

  board = new ChessBoard(el);
  board.mount({
    fen: step.fen,
    orientation: step.orientation ?? getProgress().settings.boardOrientation,
    movable,
    viewOnly: !movable,
    shapes: step.shapes?.map((s) => ({
      orig: s.orig as Key,
      dest: s.dest as Key | undefined,
      brush: s.brush ?? 'green',
    })),
    lastMove: step.lastMove as [Key, Key] | undefined,
  });
}

function bindQuiz(step: LessonStep, isLast: boolean, advance: (last: boolean) => void): void {
  const feedback = document.getElementById('quiz-feedback')!;
  document.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.option!;
      const option = step.quiz!.options.find((o) => o.id === id)!;
      const correct = !!option.correct;

      document.querySelectorAll('.quiz-option').forEach((b) => b.setAttribute('disabled', 'true'));
      btn.classList.add(correct ? 'correct' : 'wrong');
      step.quiz!.options.filter((o) => o.correct).forEach((o) => {
        document.querySelector(`[data-option="${o.id}"]`)?.classList.add('correct');
      });

      feedback.classList.remove('hidden');
      feedback.innerHTML = `
        <p class="${correct ? 'feedback-ok' : 'feedback-bad'}">${correct ? '✅ Correct!' : '❌ Not quite.'}</p>
        <p>${step.quiz!.explanation}</p>
        <button class="btn btn-primary" id="quiz-next">${isLast ? 'Complete Lesson ✓' : 'Continue →'}</button>
      `;
      document.getElementById('quiz-next')?.addEventListener('click', () => advance(isLast));
    });
  });
}

function bindMove(step: LessonStep, isLast: boolean, advance: (last: boolean) => void): void {
  const el = document.getElementById('lesson-board');
  if (!el) return;

  board = new ChessBoard(el);
  const expectedList = step.expectedMoves ?? (step.expectedMove ? [step.expectedMove] : []);

  board.mount({
    fen: step.fen,
    orientation: step.orientation ?? getProgress().settings.boardOrientation,
    movable: true,
    onMove: (from, to) => {
      const chess = board!.getChess();
      const matched = expectedList.some((exp) => moveMatches(chess, from, to, exp));
      if (!matched) {
        showToast('Try again — that\'s not the right move.', 'error');
        return false;
      }
      board!.tryMove(from, to);
      showToast('Correct move! ✅', 'success');
      setTimeout(() => advance(isLast), 700);
      return true;
    },
  });
}

function completeLesson(lesson: Lesson): void {
  const p = getProgress();
  if (!p.completedLessons.includes(lesson.id)) {
    updateProgress((prog) => prog.completedLessons.push(lesson.id));
    const result = awardXp(lesson.xpReward);
    updateStreak();
    const earned = checkAchievements();
    let msg = `Lesson complete! +${lesson.xpReward} XP`;
    if (result.leveledUp) msg += ` — Level ${result.newLevel}!`;
    showToast(msg, 'success');
    earned.forEach((id) => showToast(`Achievement unlocked: ${id}`, 'info'));
  } else {
    showToast('Lesson reviewed! Great practice.', 'info');
  }
  navigate('/courses');
}
