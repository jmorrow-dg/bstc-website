#!/usr/bin/env node
// Usage: node scripts/aeo/check-jsonld.mjs --base http://localhost:3000 / /faq
// --sitemap checks all routes in the base URL's sitemap. Exit 1 means QA failed.
import { pathToFileURL } from 'node:url';

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '\u2013', mdash: '\u2014', rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c' };
export function decode(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, key) => {
    if (!key.startsWith('#')) return entities[key] ?? all;
    const value = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : all;
  });
}
export function visibleText(html) {
  return decode(html.replace(/<!--[^]*?-->/g, '').replace(/<(script|style|template)\b[^>]*>[^]*?<\/\1\s*>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function* nodes(value) {
  if (!value || typeof value !== 'object') return;
  if (!Array.isArray(value)) yield value;
  for (const child of Object.values(value)) yield* nodes(child);
}
export function inspect(html) {
  const errors = [];
  let blocks = 0, breadcrumbs = 0, answers = 0;
  const visible = visibleText(html);
  for (const match of html.matchAll(/<script\b([^>]*)>([^]*?)<\/script\s*>/gi)) {
    if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
    blocks++;
    let data;
    try { data = JSON.parse(match[2]); } catch (error) { errors.push(`JSON parse: ${error.message}`); continue; }
    for (const node of nodes(data)) {
      const types = [].concat(node['@type'] ?? []);
      if (types.some(type => ['AggregateRating', 'Review'].includes(type))) errors.push('Forbidden Review/AggregateRating');
      if (types.includes('BreadcrumbList')) {
        breadcrumbs++;
        for (const item of node.itemListElement ?? []) if (!item.item) errors.push('Breadcrumb item URL missing');
      }
      if (types.includes('FAQPage')) {
        for (const question of [].concat(node.mainEntity ?? [])) {
          for (const answer of [].concat(question.acceptedAnswer ?? [])) {
            answers++;
            const text = typeof answer.text === 'string' ? visibleText(answer.text) : '';
            if (!text || !visible.includes(text)) errors.push(`FAQ answer absent: ${question.name}`);
          }
        }
      }
    }
  }
  if (breadcrumbs > 1) errors.push(`${breadcrumbs} BreadcrumbLists`);
  return { blocks, breadcrumbs, answers, errors };
}
async function main() {
  const args = process.argv.slice(2);
  let base = 'http://localhost:3000', sitemap = false;
  const routes = [];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--base' || arg === '--base-url') { base = args.shift(); if (!base) throw new Error('Missing base URL'); }
    else if (arg === '--sitemap') sitemap = true;
    else if (arg === '--help') { console.log('Usage: node scripts/aeo/check-jsonld.mjs [--base URL] [--sitemap] [/route ...]'); return; }
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else routes.push(arg);
  }
  if (sitemap) {
    const response = await fetch(new URL('/sitemap.xml', base), { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Sitemap HTTP ${response.status}`);
    const xml = await response.text();
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) routes.push(new URL(decode(match[1])).pathname);
    if (!routes.length) throw new Error('Sitemap has no routes');
  }
  if (!routes.length) routes.push('/', '/events', '/blog', '/faq', '/community', '/how-i-build-with-ai', '/leadership');
  const rows = [];
  let failed = 0;
  for (const route of [...new Set(routes)]) {
    try {
      const response = await fetch(new URL(route, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      const result = inspect(await response.text());
      if (response.status !== 200) result.errors.unshift(`HTTP ${response.status}`);
      if (!result.blocks) result.errors.push('No JSON-LD blocks');
      if (result.errors.length) failed++;
      rows.push({ route, status: response.status, blocks: result.blocks, breadcrumbs: result.breadcrumbs, answers: result.answers, result: result.errors.length ? 'FAIL' : 'PASS' });
      for (const error of result.errors) console.error(`${route}: ${error}`);
    } catch (error) { failed++; rows.push({ route, result: 'FAIL' }); console.error(`${route}: ${error.message}`); }
  }
  console.table(rows);
  console.log(`${new Date().toISOString()}: ${rows.length} routes; ${failed} failed`);
  if (failed) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
