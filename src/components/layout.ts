import { getProgress } from '../core/state';
import { xpProgressInLevel } from '../core/xp';
import { navigate } from '../core/router';

export function renderLayout(content: string, activeNav = ''): void {
  const p = getProgress();
  const xp = xpProgressInLevel(p.xp);

  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="app-shell">
      <header class="top-bar">
        <button class="brand" data-nav="/">
          <span class="brand-icon">♞</span>
          <span class="brand-text">Learn Chess</span>
        </button>
        <div class="top-stats">
          <div class="stat-pill streak" title="Daily streak">
            <span>🔥</span><span>${p.streak}</span>
          </div>
          <div class="stat-pill xp" title="Experience points">
            <span>⭐</span><span>Lv.${p.level}</span>
          </div>
        </div>
      </header>

      <div class="xp-bar-wrap">
        <div class="xp-bar" style="width:${xp.percent}%"></div>
        <span class="xp-label">${xp.current} / ${xp.needed} XP</span>
      </div>

      <main class="main-content">${content}</main>

      <nav class="bottom-nav">
        ${navItem('/', '🏠', 'Home', activeNav)}
        ${navItem('/courses', '🗺️', 'Courses', activeNav)}
        ${navItem('/puzzles', '⚡', 'Puzzles', activeNav)}
        ${navItem('/play', '♟️', 'Play', activeNav)}
        ${navItem('/minigames', '🎮', 'Games', activeNav)}
        ${navItem('/profile', '👤', 'Profile', activeNav)}
      </nav>
    </div>
  `;

  app.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => navigate((el as HTMLElement).dataset.nav!));
  });
}

function navItem(path: string, icon: string, label: string, active: string): string {
  const isActive = active === path ? ' active' : '';
  return `<button class="nav-item${isActive}" data-nav="${path}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></button>`;
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

export function coachBubble(message: string, name?: string): string {
  const coach = name ?? getProgress().settings.coachName;
  return `
    <div class="coach-bubble">
      <div class="coach-avatar">♚</div>
      <div class="coach-content">
        <span class="coach-name">${coach}</span>
        <p class="coach-message">${message}</p>
      </div>
    </div>
  `;
}

export function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
