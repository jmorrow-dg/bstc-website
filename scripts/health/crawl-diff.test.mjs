import test from 'node:test';
import assert from 'node:assert/strict';
import { diffCrawls, diffMarkdown } from './crawl-diff.mjs';

const row = (url, extra = {}) => ({ url, status: 200, title: 'T', description: 'D', canonical: url, noindex: false, h1Count: 1, breadcrumbCount: 1, dashCount: 0, inboundCount: 1, inboundPages: ['https://x'], lastmod: '', jsonldTypes: ['WebPage'], ...extra });

test('reports added, removed and changed fields, ignoring JSON-LD order and repeats', () => {
  const before = { startedAt: 'a', metrics: { urls: 2 }, rows: [row('https://x/a'), row('https://x/gone')] };
  const after = { startedAt: 'b', metrics: { urls: 2 }, rows: [row('https://x/a', { title: 'New', jsonldTypes: ['WebPage', 'WebPage'], inboundCount: 1, inboundPages: ['https://x/blog'] }), row('https://x/new')] };
  const d = diffCrawls(before, after);
  assert.deepEqual(d.added, ['https://x/new']);
  assert.deepEqual(d.removed, ['https://x/gone']);
  assert.deepEqual(d.changed, [
    { url: 'https://x/a', field: 'title', from: 'T', to: 'New' },
    { url: 'https://x/a', field: 'inboundPages', from: 'https://x', to: 'https://x/blog' },
  ]);
  const md = diffMarkdown(d, before, after, 'https://x');
  assert.match(md, /\| \/a \| inboundPages \| \/ \| \/blog \|/);
  assert.match(md, /URLs added: \/new\./);
});

test('says so when nothing changed', () => {
  const crawl = { startedAt: 'a', metrics: { urls: 1 }, rows: [row('https://x/a')] };
  const d = diffCrawls(crawl, crawl);
  assert.deepEqual(d.changed, []);
  assert.match(diffMarkdown(d, crawl, crawl, 'https://x'), /No field changed on any URL\./);
});
