// Checks a titles or metas list in the evidence folder against a crawl.json from crawl.mjs:
// every "Current (n): text" line must match the live value and its length, every option or
// proposal must state its true length and fit the limit, and every page over the limit today
// must have an entry or be named in the list's text.
// Usage: node scripts/health/check-lists.mjs <list.md> <crawl.json> title|description
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const LIMITS = { title: 60, description: 155 };
const length = text => [...text].length;

export function checkList(markdown, crawl, field) {
  const limit = LIMITS[field];
  if (!limit) throw new Error('Field must be title or description');
  const path = url => url.replace(crawl.base, '') || '/';
  const live = new Map(crawl.rows.map(r => [path(r.url), r[field] ?? '']));
  const result = { matches: 0, mismatched: [], badOptions: [], missing: [] };
  const listed = new Set();
  let url = null;
  for (const line of markdown.split('\n')) {
    const entry = line.match(/^- `([^`]+)`/);
    if (entry) { url = entry[1]; continue; }
    const current = line.match(/^\s+- Current \((\d+)\): (.*)$/);
    if (current && url) {
      listed.add(url);
      const value = live.get(url);
      if (value === current[2] && length(value) === Number(current[1])) result.matches++;
      else result.mismatched.push({ url, listed: current[2], live: value ?? null });
      continue;
    }
    const option = line.match(/^\s*- (?:Option [A-Z]|Proposed) \((\d+)\): "?(.*?)"?$/);
    if (option) {
      const stated = Number(option[1]), actual = length(option[2]);
      if (stated !== actual || actual > limit) result.badOptions.push({ url, stated, actual });
    }
  }
  result.missing = [...live].filter(([p, v]) => length(v) > limit && !listed.has(p) && !markdown.includes(p)).map(([p]) => p);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [list, crawlPath, field] = process.argv.slice(2);
  if (!list || !crawlPath || !LIMITS[field]) { console.error('Usage: node scripts/health/check-lists.mjs <list.md> <crawl.json> title|description'); process.exit(2); }
  const result = checkList(await readFile(list, 'utf8'), JSON.parse(await readFile(crawlPath, 'utf8')), field);
  console.log(JSON.stringify(result, null, 2));
  if (result.mismatched.length || result.badOptions.length || result.missing.length) process.exitCode = 1;
}
