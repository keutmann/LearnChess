import { getProgress } from '../core/state';
import { LESSONS } from '../data/lessons';
import { COURSE_NODES, CATEGORY_META, DIFFICULTY_META } from '../data/curriculum';
import { renderLayout } from '../components/layout';
import { navigate } from '../core/router';
import type { Category, Difficulty } from '../types';

export function renderCourses(params: Record<string, string>): void {
  const p = getProgress();
  const filterCat = params.cat as Category | undefined;
  const filterDiff = params.diff as Difficulty | undefined;

  const nodesHtml = COURSE_NODES.map((node) => {
    const lesson = LESSONS.find((l) => l.id === node.lessonId)!;
    const completed = p.completedLessons.includes(lesson.id);
    const hidden = filterCat && lesson.category !== filterCat;
    const cat = CATEGORY_META[lesson.category];
    const diff = DIFFICULTY_META[lesson.difficulty];

    return `
      <button
        class="course-node unlocked ${completed ? 'completed' : ''} ${hidden ? 'hidden' : ''}"
        data-lesson="${lesson.id}"
        style="--node-color:${cat.color}; left:${node.x * 110 + 16}px; top:${node.y * 100 + 16}px"
        title="${lesson.title}"
      >
        <span class="node-icon">${completed ? '✓' : cat.icon}</span>
        <span class="node-label">${lesson.title}</span>
        <span class="node-diff" style="color:${diff.color}">${diff.label}</span>
      </button>
    `;
  }).join('');

  const categories = Object.entries(CATEGORY_META).map(([key, meta]) => {
    const active = filterCat === key ? 'active' : '';
    return `<button class="filter-chip ${active}" data-filter="${key}">${meta.icon} ${meta.title}</button>`;
  }).join('');

  const browseLessons = LESSONS
    .filter((l) => (!filterCat || l.category === filterCat) && (!filterDiff || l.difficulty === filterDiff))
    .sort((a, b) => a.order - b.order);

  renderLayout(`
    <section class="page courses-page">
      <div class="page-header">
        <h1>Course Map</h1>
        <p>All lessons are open — pick any topic or difficulty. The map shows a suggested learning path.</p>
      </div>

      <div class="filter-bar">
        <button class="filter-chip ${!filterCat ? 'active' : ''}" data-filter="">All Topics</button>
        ${categories}
      </div>

      <div class="filter-bar">
        <button class="filter-chip ${!filterDiff ? 'active' : ''}" data-diff="">All Levels</button>
        <button class="filter-chip ${filterDiff === 'easy' ? 'active' : ''}" data-diff="easy">Easy</button>
        <button class="filter-chip ${filterDiff === 'medium' ? 'active' : ''}" data-diff="medium">Medium</button>
        <button class="filter-chip ${filterDiff === 'hard' ? 'active' : ''}" data-diff="hard">Hard</button>
      </div>

      <h2 class="section-title">Browse Lessons</h2>
      <div class="lesson-browse-list">
        ${browseLessons.map((l) => {
          const cat = CATEGORY_META[l.category];
          const diff = DIFFICULTY_META[l.difficulty];
          const done = p.completedLessons.includes(l.id);
          return `
            <button class="lesson-browse-item" data-lesson="${l.id}">
              <span class="browse-icon">${done ? '✓' : cat.icon}</span>
              <span class="browse-info">
                <span class="browse-title">${l.title}</span>
                <span class="browse-desc">${l.description}</span>
              </span>
              <span class="browse-diff diff-${l.difficulty}">${diff.label}</span>
            </button>
          `;
        }).join('')}
      </div>

      <h2 class="section-title">Suggested Path</h2>
      <div class="course-map">
        <svg class="course-lines" viewBox="0 0 900 720" preserveAspectRatio="xMinYMin meet">
          ${renderConnections()}
        </svg>
        <div class="course-map-inner">
          ${nodesHtml}
        </div>
      </div>
    </section>
  `, '/courses');

  document.querySelectorAll('[data-filter]').forEach((el) => {
    el.addEventListener('click', () => {
      const cat = (el as HTMLElement).dataset.filter;
      const diff = filterDiff ?? '';
      if (cat) navigate(`/courses?cat=${cat}${diff ? `&diff=${diff}` : ''}`);
      else navigate(diff ? `/courses?diff=${diff}` : '/courses');
    });
  });

  document.querySelectorAll('[data-diff]').forEach((el) => {
    el.addEventListener('click', () => {
      const diff = (el as HTMLElement).dataset.diff;
      const cat = filterCat ?? '';
      if (diff) navigate(`/courses?diff=${diff}${cat ? `&cat=${cat}` : ''}`);
      else navigate(cat ? `/courses?cat=${cat}` : '/courses');
    });
  });

  document.querySelectorAll('[data-lesson]').forEach((el) => {
    el.addEventListener('click', () => {
      navigate(`/lesson?id=${(el as HTMLElement).dataset.lesson}`);
    });
  });
}

function renderConnections(): string {
  return COURSE_NODES.filter((n) => n.requires?.length)
    .flatMap((node) =>
      (node.requires ?? []).map((reqId) => {
        const from = COURSE_NODES.find((n) => n.id === reqId)!;
        const x1 = from.x * 110 + 56;
        const y1 = from.y * 100 + 56;
        const x2 = node.x * 110 + 56;
        const y2 = node.y * 100 + 56;
        return `<line class="course-line active" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
      })
    )
    .join('');
}
