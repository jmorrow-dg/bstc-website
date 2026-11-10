import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BASELINE, crawl, inspect, isFutureLastmod, sitemapEntries, staticA11y, witaDate } from './crawl.mjs';

test('10 Nov 2026 baseline is the 100 URL crawl', () => {
  assert.deepEqual(BASELINE, {
    urls: 100,
    status200: 100,
    nonSelfCanonical: 0,
    parseErrorPages: 0,
    longTitles: 62,
    longDescriptions: 66,
    duplicateBreadcrumbPages: 49,
    dashPages: 50,
    weakInlinks: 18,
    futureLastmods: 16,
  });
});
test('extracts SEO, structured data and normalised outlinks', () => {
  const row = inspect(`<title>A &amp; B</title><meta content='A &quot;description&quot;' name='description'><meta name="robots" content="noindex"><link rel="canonical" href="https://example.com/"><body><h1>Heading</h1><script type="application/ld+json">{"@graph":[{"@type":"BreadcrumbList"},{"@type":["Article","Thing"]}]}</script><script>invisible \u2014</script><p>Visible &ndash; text</p><a href="/target?q=1#part">Target</a><a href="/target">Duplicate</a></body>`, 'https://example.com/');
  assert.equal(row.title, 'A & B');
  assert.equal(row.description, 'A "description"');
  assert.equal(row.noindex, true);
  assert.equal(row.h1Count, 1);
  assert.equal(row.dashCount, 1);
  assert.equal(row.breadcrumbCount, 1);
  assert.deepEqual(row.jsonldTypes, ['BreadcrumbList', 'Article', 'Thing']);
  assert.deepEqual(row.internalOutlinks, ['https://example.com/target']);
});
test('reports invalid JSON and honours X-Robots-Tag', () => {
  const row = inspect('<script type="application/ld+json">broken</script>', 'https://example.com/', { 'x-robots-tag': 'noindex' });
  assert.equal(row.jsonldParseErrors.length, 1);
  assert.equal(row.noindex, true);
});
test('crawls nested sitemaps, normalises root inlinks and retains network failures', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'bstc-health-test-'));
  const originalFetch = globalThis.fetch;
  const xml = body => ({ response: new Response(body), body });
  const sitemap = '<urlset><url><loc>https://example.com</loc></url><url><loc>https://example.com/article</loc></url><url><loc>https://example.com/broken</loc></url></urlset>';
  const responses = new Map([
    ['https://example.com/sitemap.xml', '<sitemapindex><sitemap><loc>https://example.com/pages.xml</loc></sitemap></sitemapindex>'],
    ['https://example.com/pages.xml', sitemap],
    ['https://example.com', '<title>Home</title><a href="/article">Article</a>'],
    ['https://example.com/article', '<title>Article</title><a href="/">Home</a><a href="/?src=footer">Home again</a>'],
  ]);
  globalThis.fetch = async url => {
    if (!responses.has(url)) throw new Error('Simulated network failure');
    const response = xml(responses.get(url)).response;
    Object.defineProperty(response, 'url', { value: url });
    return response;
  };
  try {
    await crawl('https://example.com', directory);
    const result = JSON.parse(await readFile(join(directory, 'crawl.json'), 'utf8'));
    assert.equal(result.rows.length, 3);
    assert.equal(result.rows.find(row => row.url === 'https://example.com').inboundCount, 1);
    assert.equal(result.rows.find(row => row.url.endsWith('/article')).inboundCount, 1);
    const failed = result.rows.find(row => row.url.endsWith('/broken'));
    assert.equal(failed.status, 0);
    assert.match(failed.error, /Simulated network failure/);
    assert.equal(result.metrics.status200, 2);
    assert.match(await readFile(join(directory, 'crawl.csv'), 'utf8'), /inboundCount/);
  } finally {
    globalThis.fetch = originalFetch;
    await rm(directory, { recursive: true, force: true });
  }
});
test('reads sitemap lastmod and flags dates after today in WITA', () => {
  const entries = sitemapEntries('<urlset><url><loc>https://example.com/a</loc><lastmod>2027-01-14</lastmod></url><url><loc>https://example.com/b</loc></url></urlset>');
  assert.deepEqual(entries, [{ loc: 'https://example.com/a', lastmod: '2027-01-14' }, { loc: 'https://example.com/b', lastmod: '' }]);
  const now = new Date('2026-11-05T17:00:00Z'); // 6 Nov, 1am WITA
  assert.equal(witaDate(now), '2026-11-06');
  assert.equal(isFutureLastmod('2026-11-06', now), false);
  assert.equal(isFutureLastmod('2026-11-07T00:00:00Z', now), true);
  assert.equal(isFutureLastmod('', now), false);
});
test('static accessibility checks count unnamed controls, missing alts, heading skips and hidden content', () => {
  const body = '<div style="opacity:0;transform:none"><h1>A</h1><h3>B</h3><h2>C</h2><a href="/x"></a><a href="/y" aria-label="Y"></a><a href="/z"><img src="a" alt="Zed"></a><a href="/w"><svg><title>W</title></svg></a><button><svg></svg></button><button>Go</button><img src="b"><img src="c" alt=""><p style="opacity:0.5">x</p></div>';
  assert.deepEqual(staticA11y(`<html lang="en"><body>${body}</body></html>`, body), { htmlLang: 'en', imgNoAlt: 1, unnamedLinks: 1, unnamedButtons: 1, headingSkips: 1, hiddenOnLoad: 1 });
  assert.equal(staticA11y('<html><body></body></html>').htmlLang, '');
});
