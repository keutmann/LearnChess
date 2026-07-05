import { getProgress, updateProgress, refreshProgress } from '../core/state';
import { ACHIEVEMENTS, xpProgressInLevel } from '../core/xp';
import { exportProgress, importProgress, resetProgress } from '../core/storage';
import { renderLayout, showToast } from '../components/layout';
import { navigate } from '../core/router';

export function renderProfile(): void {
  const p = getProgress();
  const xp = xpProgressInLevel(p.xp);
  const solved = Object.values(p.puzzleStats).reduce((s, v) => s + v.solved, 0);

  renderLayout(`
    <section class="page profile-page">
      <div class="page-header">
        <h1>Your Profile</h1>
        <p>Track progress, manage settings, and backup your data.</p>
      </div>

      <div class="profile-hero">
        <div class="profile-avatar">♚</div>
        <div class="profile-level">
          <span class="level-num">Level ${p.level}</span>
          <div class="xp-bar-wrap large">
            <div class="xp-bar" style="width:${xp.percent}%"></div>
            <span class="xp-label">${xp.current} / ${xp.needed} XP</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><span class="stat-value">${p.xp}</span><span class="stat-label">Total XP</span></div>
        <div class="stat-card"><span class="stat-value">${p.streak}</span><span class="stat-label">Day Streak</span></div>
        <div class="stat-card"><span class="stat-value">${p.completedLessons.length}</span><span class="stat-label">Lessons</span></div>
        <div class="stat-card"><span class="stat-value">${solved}</span><span class="stat-label">Puzzles</span></div>
      </div>

      <h2 class="section-title">Achievements</h2>
      <div class="achievement-grid">
        ${ACHIEVEMENTS.map((a) => {
          const earned = p.achievements.includes(a.id);
          return `
            <div class="achievement-card ${earned ? 'earned' : 'locked'}">
              <span class="ach-icon">${a.icon}</span>
              <span class="ach-title">${a.title}</span>
              <span class="ach-desc">${a.desc}</span>
            </div>
          `;
        }).join('')}
      </div>

      <h2 class="section-title">Settings</h2>
      <div class="settings-card">
        <label class="setting-row">
          <span>Coach Name</span>
          <input type="text" id="coach-name" value="${p.settings.coachName}" maxlength="20" />
        </label>
        <label class="setting-row">
          <span>Board Orientation</span>
          <select id="board-orient">
            <option value="white" ${p.settings.boardOrientation === 'white' ? 'selected' : ''}>White</option>
            <option value="black" ${p.settings.boardOrientation === 'black' ? 'selected' : ''}>Black</option>
          </select>
        </label>
        <button class="btn btn-primary" id="save-settings">Save Settings</button>
      </div>

      <h2 class="section-title">Data</h2>
      <div class="settings-card">
        <p class="data-note">All progress is stored locally in your browser. Export to backup, import to restore.</p>
        <div class="data-actions">
          <button class="btn btn-secondary" id="export-data">Export Progress</button>
          <button class="btn btn-secondary" id="import-data">Import Progress</button>
          <button class="btn btn-danger" id="reset-data">Reset All Progress</button>
        </div>
        <input type="file" id="import-file" accept=".json" hidden />
      </div>
    </section>
  `, '/profile');

  document.getElementById('save-settings')?.addEventListener('click', () => {
    const name = (document.getElementById('coach-name') as HTMLInputElement).value.trim() || 'Coach';
    const orient = (document.getElementById('board-orient') as HTMLSelectElement).value as 'white' | 'black';
    updateProgress((prog) => {
      prog.settings.coachName = name;
      prog.settings.boardOrientation = orient;
    });
    showToast('Settings saved.', 'success');
  });

  document.getElementById('export-data')?.addEventListener('click', () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learn-chess-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported.', 'success');
  });

  document.getElementById('import-data')?.addEventListener('click', () => {
    document.getElementById('import-file')?.click();
  });

  document.getElementById('import-file')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    if (importProgress(text)) {
      refreshProgress();
      showToast('Progress imported!', 'success');
      renderProfile();
    } else {
      showToast('Invalid progress file.', 'error');
    }
  });

  document.getElementById('reset-data')?.addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      resetProgress();
      refreshProgress();
      showToast('Progress reset.', 'info');
      navigate('/');
    }
  });
}
