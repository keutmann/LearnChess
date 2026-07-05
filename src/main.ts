import './styles/main.css';
import { initRouter, registerRoute } from './core/router';
import { updateStreak } from './core/xp';
import { renderHome } from './views/home';
import { renderCourses } from './views/courses';
import { renderLesson } from './views/lesson';
import { renderPuzzles } from './views/puzzles';
import { renderPlay } from './views/play';
import { renderMiniGames } from './views/minigames';
import { renderProfile } from './views/profile';

function parseQuery(): Record<string, string> {
  const hash = window.location.hash.slice(1);
  const [, query] = hash.split('?');
  const params: Record<string, string> = {};
  if (query) new URLSearchParams(query).forEach((v, k) => (params[k] = v));
  return params;
}

registerRoute('/', () => { updateStreak(); renderHome(); });
registerRoute('/courses', () => renderCourses(parseQuery()));
registerRoute('/lesson', () => renderLesson(parseQuery()));
registerRoute('/puzzles', () => renderPuzzles(parseQuery()));
registerRoute('/play', () => renderPlay(parseQuery()));
registerRoute('/minigames', () => renderMiniGames(parseQuery()));
registerRoute('/profile', () => renderProfile());
registerRoute('/404', () => {
  document.getElementById('app')!.innerHTML = '<p>Page not found. <a href="#/">Go home</a></p>';
});

initRouter();
