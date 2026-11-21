import test from 'node:test';
import assert from 'node:assert/strict';
import { checkList } from './check-lists.mjs';

const crawl = { base: 'https://x', rows: [
  { url: 'https://x/a', title: 'A'.repeat(70) },
  { url: 'https://x/b', title: 'B'.repeat(65) },
  { url: 'https://x/c', title: 'Short' },
  { url: 'https://x/d', title: 'D'.repeat(61) },
  { url: 'https://x/e', title: 'E'.repeat(62) },
] };

test('matches current lines, checks option lengths and finds unlisted long pages', () => {
  const md = [
    '- `/a`', `  - Current (70): ${'A'.repeat(70)}`, `  - Option A (10): ${'a'.repeat(10)}`, `  - Option B (9): ${'b'.repeat(10)}`,
    '- `/b`', `  - Current (64): ${'B'.repeat(64)}`, `  - Proposed (61): ${'p'.repeat(61)}`,
    'Pages on one pattern: `/e` (lane 3).',
  ].join('\n');
  const r = checkList(md, crawl, 'title');
  assert.equal(r.matches, 1);
  assert.deepEqual(r.mismatched.map(m => m.url), ['/b']);
  assert.deepEqual(r.badOptions, [{ url: '/a', stated: 9, actual: 10 }, { url: '/b', stated: 61, actual: 61 }]);
  assert.deepEqual(r.missing, ['/d']);
});

test('counts characters, not bytes, and reads quoted options', () => {
  const md = ['- `/c`', '  - Current (5): Short', '- Option A (6): "Café é"'].join('\n');
  const r = checkList(md, crawl, 'title');
  assert.equal(r.matches, 1);
  assert.deepEqual(r.badOptions, []);
  assert.throws(() => checkList('', crawl, 'body'));
});
