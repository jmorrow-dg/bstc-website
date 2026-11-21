import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ENGINES = ['ChatGPT with search', 'Perplexity', 'Gemini', 'Claude', 'Google AI Overview'];
export const COLUMNS = ['run_date', 'question_id', 'engine', 'status', 'observed_at', 'model', 'search_mode', 'locale', 'named_bstc', 'linked_url', 'cited_page', 'links_to_join', 'join_checked_at', 'answer_file', 'notes'];

// Quoted commas, quotes and newlines are supported. Malformed rows fail closed.
export function parseCSV(input) {
  const text = input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const rows = []; let row = [], cell = '', quoted = false, closed = false;
  const field = () => { row.push(cell); cell = ''; closed = false; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === ',') field();
    else if (c === '\n') { field(); rows.push(row); row = []; }
    else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === '"' || closed) throw new Error('Malformed CSV quoting');
    else cell += c;
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (cell || row.length || closed) { field(); rows.push(row); }
  const header = rows.shift();
  if (!header?.length || new Set(header).size !== header.length) throw new Error('Missing or duplicate CSV headers');
  return { header, rows: rows.map((values, i) => {
    if (values.length !== header.length) throw new Error(`CSV record ${i + 2}: expected ${header.length} fields, got ${values.length}`);
    return Object.fromEntries(header.map((name, j) => [name, values[j]]));
  }) };
}
export function serialise(rows, columns = COLUMNS) {
  const escape = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  return [columns, ...rows.map(row => columns.map(key => row[key]))].map(row => row.map(escape).join(',')).join('\n') + '\n';
}
export function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
function timestamp(value) { return /T.*(?:Z|[+-]\d\d:\d\d)$/.test(value) && !Number.isNaN(Date.parse(value)); }
function url(value) { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } }
export function summarise(log, runDate) {
  if (!validDate(runDate)) throw new Error('Use a valid run date: YYYY-MM-DD');
  for (const column of COLUMNS) if (!log.header.includes(column)) throw new Error(`Missing header: ${column}`);
  const seen = new Set();
  for (const row of log.rows) {
    const key = `${row.run_date}/${row.question_id}/${row.engine}`;
    if (seen.has(key)) throw new Error(`Duplicate observation: ${key}`);
    seen.add(key);
    if (!validDate(row.run_date) || !/^Q(0[1-9]|1[0-8])$/.test(row.question_id) || !ENGINES.includes(row.engine)) throw new Error(`Invalid date, question or engine: ${key}`);
    if (!['pending', 'complete', 'unavailable', 'no_overview'].includes(row.status)) throw new Error(`Invalid status: ${key}`);
    if (row.status === 'no_overview' && row.engine !== 'Google AI Overview') throw new Error(`no_overview only applies to Google: ${key}`);
    if (row.status !== 'pending' && !timestamp(row.observed_at)) throw new Error(`Missing timestamp with timezone: ${key}`);
    if (row.status !== 'complete') {
      if (['named_bstc','linked_url','cited_page','links_to_join','join_checked_at'].some(k => row[k])) throw new Error(`Unobserved outcomes must remain blank: ${key}`);
      if (row.status !== 'pending' && !row.notes.trim()) throw new Error(`Record why the answer is unavailable: ${key}`);
      continue;
    }
    if (!['yes', 'no'].includes(row.named_bstc)) throw new Error(`named_bstc must be yes or no: ${key}`);
    if (!row.answer_file || !row.search_mode || !row.locale || !row.model) throw new Error(`Missing answer evidence or environment: ${key}`);
    if ([row.linked_url, row.cited_page].some(v => v && !url(v))) throw new Error(`Invalid HTTP URL: ${key}`);
    if (!['yes', 'no', 'unknown', 'not_applicable'].includes(row.links_to_join)) throw new Error(`Invalid join observation: ${key}`);
    if (row.cited_page && row.links_to_join === 'not_applicable') throw new Error(`Cited page requires join check or unknown: ${key}`);
    if (!row.cited_page && row.links_to_join !== 'not_applicable') throw new Error(`No cited page: use not_applicable for join check: ${key}`);
    if (['yes', 'no'].includes(row.links_to_join) && !timestamp(row.join_checked_at)) throw new Error(`Missing join-check timestamp: ${key}`);
  }
  const selected = log.rows.filter(row => row.run_date === runDate);
  const output = [];
  for (let i = 1; i <= 18; i++) for (const engine of ENGINES) {
    const question_id = `Q${String(i).padStart(2, '0')}`;
    output.push(selected.find(row => row.question_id === question_id && row.engine === engine) ?? { run_date: runDate, question_id, engine, status: 'missing' });
  }
  return output;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [file, date] = process.argv.slice(2);
    if (!file || !date) throw new Error('Usage: node scripts/measure/citation-summary.mjs LOG.csv YYYY-MM-DD');
    const rows = summarise(parseCSV(await readFile(file, 'utf8')), date);
    process.stdout.write(serialise(rows));
    const complete = rows.filter(r => r.status === 'complete');
    console.error(`${date}: ${complete.length}/90 answers recorded; ${rows.filter(r => r.status === 'missing' || r.status === 'pending').length} missing or pending.`);
    console.error(`Discovery Q01 to Q15: ${complete.filter(r => Number(r.question_id.slice(1)) <= 15).length}/75. Brand accuracy Q16 to Q18: ${complete.filter(r => Number(r.question_id.slice(1)) >= 16).length}/15.`);
    console.error('no scoreboard figure yet');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
