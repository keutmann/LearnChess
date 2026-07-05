/**
 * End-to-end Play vs AI test. Run with dev server up:
 *   node scripts/test-play.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://localhost:5173/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${BASE}#/play`, { waitUntil: 'domcontentloaded' });

await page.waitForSelector('[data-opponent]');
await page.click('[data-opponent="age-5"]');

await page.waitForSelector('#game-board');
await page.waitForSelector('.cg-wrap', { timeout: 10000 });

const statusEl = page.locator('#game-status');
await statusEl.waitFor({ timeout: 90000 });

const status = await statusEl.textContent();
const hasBoard = await page.locator('.cg-wrap').count() > 0;
const boardVisible = await page.locator('.cg-wrap').first().isVisible();

console.log('Status:', status);
console.log('Board mounted:', hasBoard, 'visible:', boardVisible);

if (!hasBoard || !boardVisible) {
  console.error('FAIL: chess board not visible');
  process.exit(1);
}

if (status?.includes('Engine error') || status?.includes('Loading engine')) {
  // Allow brief loading text only if it transitions
  await page.waitForFunction(() => {
    const el = document.getElementById('game-status');
    const text = el?.textContent || '';
    return text.includes('Your turn') || text.includes('Engine thinking');
  }, { timeout: 90000 });
}

const finalStatus = await statusEl.textContent();
console.log('Final status:', finalStatus);

if (!finalStatus?.includes('Your turn')) {
  console.error('FAIL: engine did not become ready');
  process.exit(1);
}

// Make a legal opening move e2-e4 if movable
const from = page.locator('.cg-wrap square[data-square=e2]');
const to = page.locator('.cg-wrap square[data-square=e4]');
if (await from.count()) {
  await from.click();
  await to.click();
  await page.waitForFunction(() => {
    const text = document.getElementById('game-status')?.textContent || '';
    return text.includes('Engine thinking') || text.includes('Your turn');
  }, { timeout: 30000 });
  console.log('After move status:', await statusEl.textContent());
}

console.log('PASS: Play vs AI flow works');
await browser.close();
