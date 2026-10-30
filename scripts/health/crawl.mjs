import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function decode(text = '') {
  return text.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt|nbsp|ndash|mdash);/gi, (match, code, name) => {
    if (code) {
      const n = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '\u2013', mdash: '\u2014' }[name.toLowerCase()];
  });
}
export function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3] ?? m[4])]));
}
export function visibleText(html) {
  return decode(html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
export function inspect(html, url, headers = {}) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
  const title = visibleText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = metas.find(m => m.name?.toLowerCase() === 'description')?.content ?? '';
  const types = [], parseErrors = [];
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (value['@type']) types.push(...[value['@type']].flat());
    Object.values(value).forEach(v => { if (Array.isArray(v)) v.forEach(walk); else if (typeof v === 'object') walk(v); });
  }
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attrs(m[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try { walk(JSON.parse(m[2])); } catch (error) { parseErrors.push(error.message); }
  }
  const origin = new URL(url).origin;
  const outlinks = new Set();
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attrs(m[0]).href;
    if (!href) continue;
    try { const target = new URL(href, url); if (target.origin === origin) { target.hash = ''; target.search = ''; outlinks.add(target.href); } } catch { /* Invalid href is not an internal URL. */ }
  }
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const text = visibleText(body);
  return { title, titleLength: [...title].length, description, descriptionLength: [...description].length,
    canonical: links.find(l => l.rel?.toLowerCase().split(/\s+/).includes('canonical'))?.href ?? '',
    noindex: /\bnoindex\b/i.test([headers['x-robots-tag'] ?? '', ...metas.filter(m => /^(robots|googlebot)$/i.test(m.name ?? '')).map(m => m.content)].join(' ')),
    h1Count: [...body.matchAll(/<h1\b/gi)].length, jsonldTypes: types, jsonldParseErrors: parseErrors,
    breadcrumbCount: types.filter(t => t === 'BreadcrumbList').length,
    dashCount: [...text.matchAll(/[\u2013\u2014]/g)].length, internalOutlinks: [...outlinks].sort(),
    visibleText: text };
}
export function csv(rows, columns) {
  const cell = value => '"' + String(Array.isArray(value) ? JSON.stringify(value) : value ?? '').replaceAll('"', '""') + '"';
  return [columns, ...rows.map(r => columns.map(c => r[c]))].map(r => r.map(cell).join(',')).join('\n') + '\n';
}
async function get(url) {
  let last;
  for (let i = 0; i < 3; i++) {
    try { const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'user-agent': 'BSTC-Site-Health/1.0' } });
      if (response.status >= 500 && i < 2) { await response.body?.cancel(); continue; }
      return { response, body: await response.text() };
    } catch (error) { last = error; }
  }
  throw last;
}
export async function crawl(base, output) {
  await mkdir(output, { recursive: true });
  const startedAt = new Date().toISOString(), seen = new Set(), urls = new Set();
  async function sitemap(url) {
    if (seen.has(url)) return;
    seen.add(url);
    const { response, body } = await get(url);
    if (!response.ok) throw new Error(`Sitemap ${url}: ${response.status}`);
    await writeFile(resolve(output, `sitemap-${seen.size}.xml`), body);
    const locations = [...body.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map(m => decode(m[1].trim()));
    if (/<sitemapindex\b/i.test(body)) { for (const location of locations) await sitemap(location); }
    else locations.forEach(location => urls.add(location));
  }
  await sitemap(new URL('/sitemap.xml', base).href);
  const rows = [];
  const queue = [...urls];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const sampledAt = new Date().toISOString();
      try {
        const { response, body } = await get(url);
        rows.push({ url, sampledAt, status: response.status, finalUrl: response.url, redirected: response.redirected, ...inspect(body, response.url, Object.fromEntries(response.headers)) });
      } catch (error) { rows.push({ url, sampledAt, status: 0, error: error.message, internalOutlinks: [] }); }
    }
  }));
  rows.sort((a, b) => a.url.localeCompare(b.url));
  for (const row of rows) row.inboundPages = rows.filter(source => new URL(source.url).href !== new URL(row.url).href && source.internalOutlinks.includes(new URL(row.url).href)).map(source => source.url);
  rows.forEach(r => { r.inboundCount = r.inboundPages.length; });
  const count = fn => rows.filter(fn).length;
  const metrics = { urls: rows.length, status200: count(r => r.status === 200), nonSelfCanonical: count(r => r.canonical !== r.url),
    parseErrorPages: count(r => r.jsonldParseErrors?.length), longTitles: count(r => r.titleLength > 60), longDescriptions: count(r => r.descriptionLength > 155),
    duplicateBreadcrumbPages: count(r => r.breadcrumbCount > 1), dashPages: count(r => r.dashCount > 0), weakInlinks: count(r => r.inboundCount <= 1) };
  const baseline = { urls: 85, status200: 85, nonSelfCanonical: 0, parseErrorPages: 0, longTitles: 51, longDescriptions: 49, duplicateBreadcrumbPages: 49, dashPages: 50, weakInlinks: 17 };
  await writeFile(resolve(output, 'crawl.json'), JSON.stringify({ startedAt, finishedAt: new Date().toISOString(), base, metrics, rows }, null, 2));
  await writeFile(resolve(output, 'crawl.csv'), csv(rows, ['url','sampledAt','status','finalUrl','redirected','title','titleLength','description','descriptionLength','canonical','noindex','h1Count','jsonldTypes','jsonldParseErrors','breadcrumbCount','dashCount','internalOutlinks','inboundCount','error']));
  await writeFile(resolve(output, 'summary.md'), `# Sitemap health\n\nStarted: ${startedAt}\n\n| Metric | Baseline | Observed | Delta |\n| --- | ---: | ---: | ---: |\n` + Object.entries(metrics).map(([k,v]) => `| ${k} | ${baseline[k]} | ${v} | ${v-baseline[k]} |`).join('\n') + '\n\nInlinks count distinct other sitemap pages, with query strings and fragments removed. Visible-text checks use server HTML excluding script, style and template elements; CSS-hidden text can remain. Network errors have status 0 and are not passes.\n');
  console.log(JSON.stringify({ output, metrics }, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await crawl(process.argv[2] ?? 'https://www.balistartupandtech.com', resolve(process.argv[3] ?? `${homedir()}/orca/evidence/bstc/health-${new Date().toISOString().slice(0, 10)}`));
}
