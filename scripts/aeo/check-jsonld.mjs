#!/usr/bin/env node
// Usage: node scripts/aeo/check-jsonld.mjs --base http://localhost:3000 / /faq
// --sitemap checks all routes in the base URL's sitemap. Exit 1 means QA failed.
// Event nodes are counted by field (endDate, isAccessibleForFree, organizer, contributor, offers).
// --strict-events also fails an Event that is not free, has no contributor or has a priced offer.
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
  const events = [];
  const squashed = visibleText(html).replace(/\s+/g, '');
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
      if (types.includes('Event')) {
        const offers = [].concat(node.offers ?? []);
        events.push({
          endDate: Boolean(node.endDate),
          free: node.isAccessibleForFree === true,
          organizer: Boolean(node.organizer?.name),
          contributor: Boolean(node.contributor),
          offers: offers.length > 0,
          priceZero: offers.length > 0 && offers.every(offer => String(offer.price) === '0'),
          currencies: offers.map(offer => offer.priceCurrency).filter(Boolean),
        });
      }
      if (types.includes('FAQPage')) {
        for (const question of [].concat(node.mainEntity ?? [])) {
          for (const answer of [].concat(question.acceptedAnswer ?? [])) {
            answers++;
            const text = typeof answer.text === 'string' ? visibleText(answer.text) : '';
            // Tags become spaces in visibleText, so a link inside brackets gains spaces. Compare without whitespace.
            if (!text || !squashed.includes(text.replace(/\s+/g, ''))) errors.push(`FAQ answer absent: ${question.name}`);
          }
        }
      }
    }
  }
  if (breadcrumbs > 1) errors.push(`${breadcrumbs} BreadcrumbLists`);
  return { blocks, breadcrumbs, answers, events, errors };
}
async function main() {
  const args = process.argv.slice(2);
  let base = 'http://localhost:3000', sitemap = false, strictEvents = false;
  const routes = [];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--base' || arg === '--base-url') { base = args.shift(); if (!base) throw new Error('Missing base URL'); }
    else if (arg === '--sitemap') sitemap = true;
    else if (arg === '--strict-events') strictEvents = true;
    else if (arg === '--help') { console.log('Usage: node scripts/aeo/check-jsonld.mjs [--base URL] [--sitemap] [--strict-events] [/route ...]'); return; }
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
  const eventTotals = { nodes: 0, routes: 0, endDate: 0, free: 0, organizer: 0, contributor: 0, offers: 0, priceZero: 0 };
  const currencies = {};
  let failed = 0;
  for (const route of [...new Set(routes)]) {
    try {
      const response = await fetch(new URL(route, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      const result = inspect(await response.text());
      if (response.status !== 200) result.errors.unshift(`HTTP ${response.status}`);
      if (!result.blocks) result.errors.push('No JSON-LD blocks');
      if (result.events.length) eventTotals.routes++;
      for (const event of result.events) {
        eventTotals.nodes++;
        for (const key of ['endDate', 'free', 'organizer', 'contributor', 'offers', 'priceZero']) if (event[key]) eventTotals[key]++;
        for (const currency of event.currencies) currencies[currency] = (currencies[currency] ?? 0) + 1;
        if (strictEvents && !event.free) result.errors.push('Event is not isAccessibleForFree');
        if (strictEvents && !event.contributor) result.errors.push('Event has no contributor');
        if (strictEvents && event.offers && !event.priceZero) result.errors.push('Event offer price is not 0');
      }
      if (result.errors.length) failed++;
      rows.push({ route, status: response.status, blocks: result.blocks, breadcrumbs: result.breadcrumbs, answers: result.answers, events: result.events.length, result: result.errors.length ? 'FAIL' : 'PASS' });
      for (const error of result.errors) console.error(`${route}: ${error}`);
    } catch (error) { failed++; rows.push({ route, result: 'FAIL' }); console.error(`${route}: ${error.message}`); }
  }
  console.table(rows);
  if (eventTotals.nodes) {
    const t = eventTotals;
    console.log(`Events: ${t.nodes} nodes on ${t.routes} routes; endDate ${t.endDate}, isAccessibleForFree ${t.free}, organizer ${t.organizer}, contributor ${t.contributor}, offers ${t.offers} (price 0: ${t.priceZero}; currency ${JSON.stringify(currencies)})`);
  }
  console.log(`${new Date().toISOString()}: ${rows.length} routes; ${failed} failed`);
  if (failed) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
