import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { COLUMNS, ENGINES, parseCSV, summarise } from './citation-summary.mjs';
import { collectorHtml, engineUrl, importCollected, joinCheck, mergeIntoLog, namesBstc, slotKey, uniqueLinks } from './collector.mjs';

const questions = parseCSV(await readFile(new URL('../../docs/aeo/measure/prompt-map.csv', import.meta.url), 'utf8')).rows;
const crawl = { rows: [
  { url: 'https://www.balistartupandtech.com/faq', status: 200, sampledAt: '2026-11-16T01:00:00.000Z', internalOutlinks: ['https://www.balistartupandtech.com/join'] },
  { url: 'https://www.balistartupandtech.com/events', status: 200, sampledAt: '2026-11-16T01:00:01.000Z', internalOutlinks: ['https://www.balistartupandtech.com/blog'] },
] };

test('builds a question link for every engine and encodes the prompt', () => {
  const prompt = "I'm a remote founder moving to Bali. How do I meet other founders?";
  for (const engine of ENGINES) assert.match(engineUrl(engine, prompt), /^https:\/\//);
  assert.equal(engineUrl('Perplexity', prompt), `https://www.perplexity.ai/search/new?q=${encodeURIComponent(prompt)}`);
  assert.equal(engineUrl('Gemini', prompt), 'https://gemini.google.com/app');
  assert.match(engineUrl('Google AI Overview', 'a&b'), /q=a%26b&hl=en&gl=id$/);
});

test('recognises the community name and collects links once', () => {
  assert.equal(namesBstc('Try Bali Startup & Tech Community.'), true);
  assert.equal(namesBstc('Bali Start-Up and Tech meets weekly'), true);
  assert.equal(namesBstc('See balistartupandtech.com/events'), true);
  assert.equal(namesBstc('BSTC runs How I AI'), true);
  assert.equal(namesBstc('Startup Grind Bali and the Bali tech scene'), false);
  assert.deepEqual(uniqueLinks(['https://a.com/x', 'mailto:x@y.z'], 'see https://a.com/x and https://b.com/y.'), ['https://a.com/x', 'https://b.com/y']);
});

test('collector page carries 18 questions, 90 slots and a script that parses', () => {
  const html = collectorHtml('2026-11-16', questions);
  assert.equal((html.match(/<section>/g) ?? []).length, 18);
  assert.equal((html.match(/class="card pending"/g) ?? []).length, 90);
  assert.equal((html.match(/<option value="no_overview">/g) ?? []).length, 18);
  assert.match(html, /I&#39;m a remote founder moving to Bali/);
  assert.doesNotMatch(html, new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`));
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|<img/);
  assert.doesNotThrow(() => new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]));
  assert.throws(() => collectorHtml('16 Nov', questions));
});

test('reads the join link from the crawl, never from a request', () => {
  assert.deepEqual(joinCheck('/faq', crawl), { links_to_join: 'yes', join_checked_at: '2026-11-16T01:00:00.000Z' });
  assert.equal(joinCheck('/events', crawl).links_to_join, 'no');
  assert.equal(joinCheck('/not-crawled', crawl).links_to_join, 'unknown');
  assert.equal(joinCheck('/faq', null).links_to_join, 'unknown');
});

test('import fills only what was observed and passes the weekly summary', () => {
  const at = '2026-11-16T09:05:00+08:00';
  const exported = { run_date: '2026-11-16', locale: 'English, Indonesia', engines: { Perplexity: { model: 'Sonar', search_mode: '' } }, slots: {
    [slotKey('Q17', 'Perplexity')]: { status: 'complete', observed_at: at, text: 'Yes. BSTC is free to join.', links: ['https://example.com/a', 'https://balistartupandtech.com/faq/?utm_source=x', 'https://www.balistartupandtech.com/events'], named_bstc: 'yes', note: '' },
    [slotKey('Q17', 'Claude')]: { status: 'complete', observed_at: at, text: 'No community is named.', links: [], named_bstc: 'no', note: '' },
    [slotKey('Q17', 'Gemini')]: { status: 'unavailable', observed_at: at, note: 'sign-in required' },
    [slotKey('Q17', 'Google AI Overview')]: { status: 'no_overview', observed_at: at, note: 'no AI Overview shown' },
  } };
  const { rows, answers } = importCollected(exported, questions, crawl);
  assert.equal(rows.length, 90);
  const row = engine => rows.find(r => r.question_id === 'Q17' && r.engine === engine);
  assert.deepEqual({ ...row('Perplexity') }, { run_date: '2026-11-16', question_id: 'Q17', engine: 'Perplexity', status: 'complete', observed_at: at,
    notes: 'Other BSTC links: https://www.balistartupandtech.com/events', model: 'Sonar', search_mode: 'default search', locale: 'English, Indonesia', named_bstc: 'yes',
    linked_url: 'https://balistartupandtech.com/faq/?utm_source=x', cited_page: 'https://www.balistartupandtech.com/faq', links_to_join: 'yes', join_checked_at: '2026-11-16T01:00:00.000Z',
    answer_file: 'answers/2026-11-16/Q17-perplexity.md' });
  assert.equal(row('Claude').links_to_join, 'not_applicable');
  assert.equal(row('Claude').cited_page, '');
  assert.equal(row('ChatGPT with search').status, 'pending');
  assert.equal(answers.length, 2);
  assert.match(answers[0].content, /Prompt: Is BSTC free\?[\s\S]*Yes\. BSTC is free to join\.[\s\S]*- https:\/\/example\.com\/a/);
  const full = rows.map(r => Object.fromEntries(COLUMNS.map(c => [c, r[c] ?? ''])));
  const summary = summarise({ header: COLUMNS, rows: full }, '2026-11-16');
  assert.equal(summary.filter(r => r.status === 'complete').length, 2);
  // An unavailable slot with no reason is rejected rather than logged.
  exported.slots[slotKey('Q17', 'Gemini')].note = ' ';
  const bad = importCollected(exported, questions, crawl).rows.map(r => Object.fromEntries(COLUMNS.map(c => [c, r[c] ?? ''])));
  assert.throws(() => summarise({ header: COLUMNS, rows: bad }, '2026-11-16'), /Record why the answer is unavailable/);
});

test('merge replaces pending rows and keeps recorded ones', () => {
  const base = { run_date: '2026-11-16', question_id: 'Q01' };
  const existing = [{ ...base, engine: 'Claude', status: 'complete', notes: 'first run' }, { ...base, engine: 'Gemini', status: 'pending' }];
  const collected = [{ ...base, engine: 'Claude', status: 'unavailable' }, { ...base, engine: 'Gemini', status: 'complete' }];
  const { rows, kept } = mergeIntoLog(existing, collected);
  assert.deepEqual(rows.map(r => [r.engine, r.status, r.notes]), [['Claude', 'complete', 'first run'], ['Gemini', 'complete', undefined]]);
  assert.deepEqual(kept, ['Q01|Claude']);
});
