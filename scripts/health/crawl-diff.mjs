// Per-URL changes between two crawl.json files written by crawl.mjs.
// Usage: node scripts/health/crawl-diff.mjs <old crawl.json> <new crawl.json> [output.md]
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FIELDS = ['status', 'title', 'description', 'canonical', 'noindex', 'h1Count', 'breadcrumbCount', 'dashCount', 'inboundCount', 'lastmod', 'jsonldTypes'];

const show = value => (Array.isArray(value) ? [...new Set(value)].sort().join(' ') : String(value ?? ''));

export function diffCrawls(before, after) {
  const map = rows => new Map(rows.map(r => [r.url, r]));
  const a = map(before.rows), b = map(after.rows);
  const added = [...b.keys()].filter(u => !a.has(u)).sort();
  const removed = [...a.keys()].filter(u => !b.has(u)).sort();
  const changed = [];
  for (const [url, row] of b) {
    const old = a.get(url);
    if (!old) continue;
    for (const field of FIELDS) {
      if (show(old[field]) !== show(row[field])) changed.push({ url, field, from: show(old[field]), to: show(row[field]) });
    }
    const lost = (old.inboundPages ?? []).filter(p => !(row.inboundPages ?? []).includes(p));
    const gained = (row.inboundPages ?? []).filter(p => !(old.inboundPages ?? []).includes(p));
    if (lost.length || gained.length) changed.push({ url, field: 'inboundPages', from: lost.join(' '), to: gained.join(' ') });
  }
  const metrics = Object.keys(after.metrics ?? {}).map(k => ({ metric: k, from: before.metrics?.[k] ?? 'n/a', to: after.metrics[k] }));
  return { added, removed, changed, metrics };
}

export function diffMarkdown(diff, before, after, base = '') {
  const path = url => url.replace(base, '') || '/';
  const cell = text => String(text).replaceAll('|', '\\|') || ' ';
  const lines = [`# Crawl diff`, '', `From ${before.startedAt} to ${after.startedAt}.`, '', '| Metric | Before | After |', '| --- | ---: | ---: |',
    ...diff.metrics.map(m => `| ${m.metric} | ${m.from} | ${m.to} |`), '',
    `URLs added: ${diff.added.map(path).join(', ') || 'none'}.`, '', `URLs removed: ${diff.removed.map(path).join(', ') || 'none'}.`, ''];
  if (!diff.changed.length) return lines.concat('No field changed on any URL.', '').join('\n');
  lines.push('| URL | Field | Before (lost inlinks) | After (gained inlinks) |', '| --- | --- | --- | --- |');
  for (const c of diff.changed) {
    const pages = v => c.field === 'inboundPages' ? v.split(' ').filter(Boolean).map(path).join(' ') : v;
    lines.push(`| ${path(c.url)} | ${c.field} | ${cell(pages(c.from))} | ${cell(pages(c.to))} |`);
  }
  return lines.concat('').join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [oldPath, newPath, out] = process.argv.slice(2);
  if (!oldPath || !newPath) { console.error('Usage: node scripts/health/crawl-diff.mjs <old crawl.json> <new crawl.json> [output.md]'); process.exit(2); }
  const before = JSON.parse(await readFile(oldPath, 'utf8'));
  const after = JSON.parse(await readFile(newPath, 'utf8'));
  const md = diffMarkdown(diffCrawls(before, after), before, after, after.base);
  if (out) await writeFile(out, md);
  console.log(md);
}
