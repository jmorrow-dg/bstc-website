import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOWN_ISSUES, checkIssues, perksConsistent, perksCounts, robotsSummary } from './live-checks.mjs';

test('summarises robots groups and Claude agents', () => {
  const r = robotsSummary('User-agent: *\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUSER-AGENT: *\nDisallow: /api/\nSitemap: https://x/s.xml');
  assert.deepEqual(r, { wildcardGroups: 2, claudeSearchBot: false, claudeUser: false, sitemapLine: true });
});
test('reads perks counts and spots a stale surface', () => {
  const c = perksCounts({ perksText: 'Find a perk 145 Open now Public 62 Example member deals', homeText: '145 startup programmes are open', llmsText: '145 open startup programmes (x; 127 you apply for direct, 18 through a partner referral)' });
  assert.deepEqual(c, { perksPage: 145, home: 145, llms: 145, llmsDirect: 127, llmsPartner: 18, exampleDeals: 62 });
  assert.equal(perksConsistent(c), true);
  assert.equal(perksConsistent({ ...c, home: 66 }), false);
  assert.equal(perksConsistent({ ...c, perksPage: null }), false);
});
test('marks issues still live or fixed against named pages only', () => {
  const base = 'https://x';
  const rows = [{ url: 'https://x', visibleText: 'may have a ticket fee' }, { url: 'https://x/faq', visibleText: 'clean' }, { url: 'https://x/other', visibleText: 'ticket price' }];
  const issues = [{ id: 'a', owner: 'o', pages: ['/'], pattern: /ticket fee/ }, { id: 'b', owner: 'o', pages: ['/faq'], pattern: /ticket price/ }, { id: 'c', owner: 'o', pattern: /ticket price/ }];
  assert.deepEqual(checkIssues(rows, base, issues).map(i => [i.id, i.status, i.hits]), [['a', 'still live', ['/']], ['b', 'fixed', []], ['c', 'still live', ['/other']]]);
});
test('own-name check needs the hyphen, so the correct name is not a hit', () => {
  const { pattern } = KNOWN_ISSUES.find(i => i.id === 'start-up-in-own-name');
  assert.equal(pattern.test('Bali Startup & Tech Community'), false);
  assert.equal(pattern.test('Bali Start-Up & Tech Community'), true);
  assert.equal(pattern.test('Bali Start-ups and Tech Community'), true);
});
