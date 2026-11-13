import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOWN_ISSUES, SOFT_404_PROBES, checkIssues, offerCounts, perksConsistent, perksCounts, robotsSummary, soft404 } from './live-checks.mjs';

test('summarises robots groups and Claude agents', () => {
  const r = robotsSummary('User-agent: *\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUSER-AGENT: *\nDisallow: /api/\nSitemap: https://x/s.xml');
  assert.deepEqual(r, { wildcardGroups: 2, claudeSearchBot: false, claudeUser: false, sitemapLine: true });
});
test('reads perks counts and spots a stale surface', () => {
  const offers = '6 offers have agreed terms and are not claimable on this page yet. 1 is agreed and waiting on activation. 1 offer has been received, with terms still being confirmed. 61 example listings are still being negotiated. 1 example is not currently available.';
  const llmsOffers = '6 offers have agreed terms (5 confirmed), and claiming is not open. 1 offer is agreed and waiting on activation. 1 offer has been received. 61 example listings are still being negotiated, each labelled Example, and 1 example is not currently available.';
  const c = perksCounts({ perksText: 'Find a perk 145 Open now Public', homeText: '145 startup programmes are open', llmsText: `145 open startup programmes (x; 127 you apply for direct, 18 through a partner referral). ${llmsOffers}`, perksDescription: offers });
  const expected = { agreedTerms: 6, activationPending: 1, received: 1, examples: 61, exampleNotAvailable: 1 };
  assert.deepEqual(c, { perksPage: 145, home: 145, llms: 145, llmsDirect: 127, llmsPartner: 18, offersPage: expected, offersLlms: expected });
  assert.equal(perksConsistent(c), true);
  assert.equal(perksConsistent({ ...c, home: 66 }), false);
  assert.equal(perksConsistent({ ...c, perksPage: null }), false);
  assert.equal(perksConsistent({ ...c, offersLlms: { ...expected, examples: 60 } }), false);
  assert.equal(perksConsistent({ ...c, offersPage: offerCounts('') }), false);
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
test('a made-up slug that answers 200 is a soft 404', () => {
  assert.equal(soft404(404), 'real 404');
  assert.equal(soft404(410), 'real 410');
  assert.equal(soft404(200), 'soft 404 (200)');
  assert.equal(soft404(308), 'soft 404 (308)');
  assert.deepEqual(SOFT_404_PROBES.map(p => p.split('/')[1]), ['events', 'how-i-build-with-ai']);
});
