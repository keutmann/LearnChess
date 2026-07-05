import { getProgress } from '../core/state';
import { LESSONS } from '../data/lessons';
import { CATEGORY_META, getCategoryProgress } from '../data/curriculum';
import { renderLayout, coachBubble } from '../components/layout';
import { navigate } from '../core/router';
import type { Category } from '../types';

export function renderHome(): void {
  const p = getProgress();
  const solved = Object.values(p.puzzleStats).reduce((s, v) => s + v.solved, 0);
  const categories = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][];

  const continueLesson = findNextLesson();

  renderLayout(`
    <section class="page home-page">
      ${coachBubble(
        p.streak > 0
          ? `Great to see you! You're on a ${p.streak}-day streak. Keep it going!`
          : 'Welcome back! Ready to sharpen your chess skills today?'
      )}

      ${continueLesson ? `
        <div class="card highlight-card" data-action="continue">
          <div class="card-badge">Continue Learning</div>
          <h2>${continueLesson.title}</h2>
          <p>${continueLesson.description}</p>
          <button class="btn btn-primary">Resume Lesson →</button>
        </div>
      ` : ''}

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">${p.completedLessons.length}</span>
          <span class="stat-label">Lessons Done</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${solved}</span>
          <span class="stat-label">Puzzles Solved</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${p.gamesWon}/${p.gamesPlayed}</span>
          <span class="stat-label">Games Won</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${p.achievements.length}</span>
          <span class="stat-label">Achievements</span>
        </div>
      </div>

      <h2 class="section-title">Your Curriculum</h2>
      <div class="category-grid">
        ${categories.map(([key, meta]) => {
          const prog = getCategoryProgress(key, p.completedLessons, LESSONS);
          return `
            <button class="category-card" data-category="${key}" style="--cat-color:${meta.color}">
              <span class="cat-icon">${meta.icon}</span>
              <span class="cat-title">${meta.title}</span>
              <div class="progress-track"><div class="progress-fill" style="width:${prog}%"></div></div>
              <span class="cat-progress">${prog}%</span>
            </button>
          `;
        }).join('')}
      </div>

      <h2 class="section-title">Quick Training</h2>
      <div class="quick-actions">
        <button class="action-card" data-nav="/puzzles">
          <span>⚡</span><span>Daily Puzzle</span>
        </button>
        <button class="action-card" data-nav="/play">
          <span>♟️</span><span>Play vs Engine</span>
        </button>
        <button class="action-card" data-nav="/minigames">
          <span>🎮</span><span>Mini-Games</span>
        </button>
      </div>
    </section>
  `, '/');

  const cont = document.querySelector('[data-action="continue"]');
  cont?.addEventListener('click', () => {
    if (continueLesson) navigate(`/lesson?id=${continueLesson.id}`);
  });

  document.querySelectorAll('[data-category]').forEach((el) => {
    el.addEventListener('click', () => navigate(`/courses?cat=${(el as HTMLElement).dataset.category}`));
  });

  document.querySelectorAll('.quick-actions [data-nav]').forEach((el) => {
    el.addEventListener('click', () => navigate((el as HTMLElement).dataset.nav!));
  });
}

function findNextLesson() {
  const completed = getProgress().completedLessons;
  return LESSONS.find((l) => !completed.includes(l.id));
}
