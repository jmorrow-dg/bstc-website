// Monday citation check, collected by a person in a normal browser.
// The engines block automated clients, so this builds one offline page per run:
// each question links straight into each engine, and each answer is recorded by one paste.
//   node scripts/measure/prepare-run.mjs YYYY-MM-DD OUTPUT_DIRECTORY      (writes collector-DATE.html too)
//   node scripts/measure/collector.mjs import collected-DATE.json OUTPUT_DIRECTORY [crawl.json]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { COLUMNS, ENGINES, parseCSV, serialise, summarise, validDate } from './citation-summary.mjs';

const SITE_HOST = 'balistartupandtech.com';
// Environment recorded on every row of an engine unless the collector edits it on the page.
export const ENGINE_DEFAULTS = {
  'ChatGPT with search': { model: 'not shown', search_mode: 'search requested by link' },
  Perplexity: { model: 'not shown', search_mode: 'default search' },
  Gemini: { model: 'not shown', search_mode: 'default' },
  Claude: { model: 'not shown', search_mode: 'web search on' },
  'Google AI Overview': { model: 'not shown', search_mode: 'Google Search, AI Overview' },
};
// Gemini has no documented question link, so its link opens the app and the question is pasted.
export function engineUrl(engine, prompt) {
  const q = encodeURIComponent(prompt);
  return {
    'ChatGPT with search': `https://chatgpt.com/?q=${q}&hints=search`,
    Perplexity: `https://www.perplexity.ai/search/new?q=${q}`,
    Gemini: 'https://gemini.google.com/app',
    Claude: `https://claude.ai/new?q=${q}`,
    'Google AI Overview': `https://www.google.com/search?q=${q}&hl=en&gl=id`,
  }[engine];
}
export const slotKey = (questionId, engine) => `${questionId}|${engine}`;

// The three functions below run in Node and, through toString(), inside the collector page.
export function namesBstc(text) {
  return /Bali\s+Start-?ups?\s*(?:&|and)\s*Tech|\bBSTC\b|balistartupandtech\.com/i.test(text);
}
export function urlsIn(text) {
  return (text.match(/https?:\/\/[^\s<>"'\])]+/g) || []).map(function (u) { return u.replace(/[.,;:!?]+$/, ''); });
}
export function uniqueLinks(anchors, text) {
  var seen = {}, out = [];
  anchors.concat(urlsIn(text)).forEach(function (u) { if (/^https?:\/\//.test(u) && !seen[u]) { seen[u] = true; out.push(u); } });
  return out;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// Browser code. Kept in ES5 style so it runs in any browser the collector opens it in.
function pageScript() {
  var KEY = 'bstc-citations-' + RUN.run_date;
  var state = { locale: '', engines: {}, slots: {} };
  try { state = JSON.parse(localStorage.getItem(KEY)) || state; } catch (e) { /* Storage can be blocked; the page still works until it is closed. */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* See above. */ } }
  function now() {
    var d = new Date(), o = -d.getTimezoneOffset(), p = function (n) { return String(Math.floor(Math.abs(n))).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + (o < 0 ? '-' : '+') + p(o / 60) + ':' + p(o % 60);
  }
  function slot(key) { return state.slots[key] || (state.slots[key] = { status: 'pending', text: '', anchors: [], links: [], named_bstc: '', note: '', observed_at: '' }); }
  function progress() {
    var done = Object.keys(state.slots).filter(function (k) { return state.slots[k].status !== 'pending'; }).length;
    document.getElementById('progress').textContent = done + ' of ' + RUN.total + ' recorded';
  }
  function paint(card) {
    var s = slot(card.dataset.key);
    card.querySelector('textarea').value = s.text;
    card.querySelector('.status').value = s.status;
    card.querySelector('.note').value = s.note;
    card.querySelectorAll('.named').forEach(function (r) { r.checked = r.value === s.named_bstc; });
    var site = s.links.filter(function (u) { return u.indexOf('balistartupandtech.com') !== -1; }).length;
    card.querySelector('.meta').textContent = s.status === 'pending' ? '' : (s.observed_at + ', ' + s.links.length + ' links, ' + site + ' to BSTC');
    card.className = 'card ' + s.status;
    progress();
  }
  function record(card, text, anchors) {
    var s = slot(card.dataset.key);
    s.text = text; s.anchors = anchors; s.links = uniqueLinks(anchors, text);
    if (text.trim()) { s.status = 'complete'; s.named_bstc = namesBstc(text + ' ' + s.links.join(' ')) ? 'yes' : 'no'; if (!s.observed_at) s.observed_at = now(); }
    else { s.status = 'pending'; s.named_bstc = ''; s.observed_at = ''; }
    save(); paint(card);
  }
  document.querySelectorAll('.card').forEach(function (card) {
    var area = card.querySelector('textarea');
    area.addEventListener('paste', function (event) {
      event.preventDefault();
      var html = event.clipboardData.getData('text/html'), text = event.clipboardData.getData('text/plain');
      // DOMParser builds an inert document: nothing in the pasted answer runs or loads.
      var anchors = html ? Array.prototype.map.call(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('a[href]'), function (a) { return a.getAttribute('href'); }) : [];
      record(card, text, anchors);
    });
    area.addEventListener('input', function () { record(card, area.value, slot(card.dataset.key).anchors); });
    card.querySelector('.status').addEventListener('change', function (event) {
      var s = slot(card.dataset.key); s.status = event.target.value;
      // Complete needs a pasted answer, and no_overview explains itself.
      if (s.status === 'complete' && !s.text.trim()) s.status = 'pending';
      if (s.status === 'no_overview' && !s.note.trim()) s.note = 'no AI Overview shown';
      if (s.status !== 'pending' && !s.observed_at) s.observed_at = now();
      if (s.status !== 'complete') s.named_bstc = '';
      save(); paint(card);
    });
    card.querySelector('.note').addEventListener('input', function (event) { slot(card.dataset.key).note = event.target.value; save(); });
    card.querySelectorAll('.named').forEach(function (r) { r.addEventListener('change', function () { slot(card.dataset.key).named_bstc = r.value; save(); }); });
    paint(card);
  });
  document.querySelectorAll('.copy').forEach(function (button) {
    button.addEventListener('click', function () { navigator.clipboard.writeText(button.dataset.prompt).then(function () { button.textContent = 'Copied'; }); });
  });
  document.querySelectorAll('.setting').forEach(function (input) {
    var engine = input.dataset.engine, field = input.dataset.field;
    var stored = engine ? (state.engines[engine] || {})[field] : state[field];
    if (stored) input.value = stored;
    input.addEventListener('input', function () {
      if (engine) { state.engines[engine] = state.engines[engine] || {}; state.engines[engine][field] = input.value; } else state[field] = input.value;
      save();
    });
  });
  document.getElementById('export').addEventListener('click', function () {
    // The import rejects a run with no locale or an unexplained gap, so stop here instead.
    var locale = document.querySelector('.setting[data-field=locale]');
    var unexplained = Object.keys(state.slots).filter(function (k) { var s = state.slots[k]; return (s.status === 'unavailable' || s.status === 'no_overview') && !s.note.trim(); });
    if (!locale.value.trim() || unexplained.length) {
      document.getElementById('progress').textContent = !locale.value.trim() ? 'Fill in "Locale used" before exporting' : unexplained.length + (unexplained.length === 1 ? ' unavailable box needs' : ' unavailable boxes need') + ' a note before exporting';
      (locale.value.trim() ? document.querySelector('.card[data-key="' + unexplained[0] + '"] .note') : locale).focus();
      return;
    }
    var out = { run_date: RUN.run_date, exported_at: now(), locale: document.querySelector('.setting[data-field=locale]').value, engines: {}, slots: state.slots };
    document.querySelectorAll('.setting[data-engine]').forEach(function (input) {
      out.engines[input.dataset.engine] = out.engines[input.dataset.engine] || {}; out.engines[input.dataset.engine][input.dataset.field] = input.value;
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
    a.download = 'collected-' + RUN.run_date + '.json';
    document.body.appendChild(a); a.click(); a.remove();
  });
  window.__collectorState = function () { return state; };
}
export function collectorHtml(date, questions) {
  if (!validDate(date)) throw new Error('Use a valid run date: YYYY-MM-DD');
  const cards = q => ENGINES.map(engine => `
      <div class="card pending" data-key="${escapeHtml(slotKey(q.question_id, engine))}">
        <div class="head"><a href="${escapeHtml(engineUrl(engine, q.prompt))}" target="_blank" rel="noopener noreferrer">${escapeHtml(engine)}</a>
          <select class="status" aria-label="${escapeHtml(engine)} status for ${q.question_id}"><option value="pending">pending</option><option value="complete">complete</option><option value="unavailable">unavailable</option>${engine === 'Google AI Overview' ? '<option value="no_overview">no_overview</option>' : ''}</select></div>
        <textarea rows="4" aria-label="${escapeHtml(engine)} answer for ${q.question_id}" placeholder="Paste the whole answer here"></textarea>
        <div class="row">Names BSTC: <label><input type="radio" class="named" name="named-${escapeHtml(slotKey(q.question_id, engine))}" value="yes"> yes</label> <label><input type="radio" class="named" name="named-${escapeHtml(slotKey(q.question_id, engine))}" value="no"> no</label>
          <input class="note" aria-label="Note for ${escapeHtml(engine)}, ${q.question_id}" placeholder="Note (needed if unavailable or no_overview)"></div>
        <div class="meta"></div>
      </div>`).join('');
  const settings = ENGINES.map(engine => `<tr><th scope="row">${escapeHtml(engine)}</th>${['model', 'search_mode'].map(field => `<td><input class="setting" data-engine="${escapeHtml(engine)}" data-field="${field}" aria-label="${escapeHtml(engine)} ${field}" value="${escapeHtml(ENGINE_DEFAULTS[engine][field])}"></td>`).join('')}</tr>`).join('');
  const run = { run_date: date, total: questions.length * ENGINES.length };
  return `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Citation check ${date}</title>
<style>
body{font:15px/1.45 system-ui,sans-serif;margin:0 auto;max-width:1500px;padding:16px;color:#1a1a1a;background:#fff}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #ccc;padding:8px 0;z-index:1;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
h1{font-size:18px;margin:0}h2{font-size:16px;margin:28px 0 8px}
button,select,input,textarea{font:inherit}button{padding:4px 10px;cursor:pointer}
table{border-collapse:collapse;margin:8px 0}th,td{text-align:left;padding:2px 8px 2px 0}td input{width:260px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px}
.card{border:2px solid #bbb;border-radius:6px;padding:8px}.card.complete{border-color:#1f7a3a}.card.unavailable,.card.no_overview{border-color:#a15c00}
.card.unavailable .note:placeholder-shown,.card.no_overview .note:placeholder-shown{outline:2px solid #b00020}
.head{display:flex;justify-content:space-between;gap:8px;margin-bottom:4px}textarea{width:100%;box-sizing:border-box}
.row{font-size:13px;margin-top:4px}.note{width:100%;box-sizing:border-box;margin-top:4px}.meta{font-size:12px;color:#444;min-height:16px}
</style></head><body>
<header><h1>Citation check ${date}</h1><span id="progress"></span><button id="export" type="button">Export collected-${date}.json</button></header>
<p>Open each link in a new tab, wait for the answer, copy the whole answer, then paste it into the box under that engine. Use a new chat for every question. If an engine can't be reached, set its status to unavailable and say why. For Google, paste only the AI Overview; if none appears, choose no_overview.</p>
<table><tr><th scope="row">Locale used</th><td colspan="2"><input class="setting" data-field="locale" aria-label="Locale used" placeholder="For example: English, Indonesia"></td></tr>
<tr><td></td><th scope="col">Model shown</th><th scope="col">Search mode</th></tr>${settings}</table>
${questions.map(q => `<section><h2>${q.question_id}: ${escapeHtml(q.prompt)} <button type="button" class="copy" data-prompt="${escapeHtml(q.prompt)}">Copy question</button></h2>
    <div class="grid">${cards(q)}
    </div></section>`).join('\n')}
<script>
var RUN = ${JSON.stringify(run)};
${namesBstc.toString()}
${urlsIn.toString()}
${uniqueLinks.toString()}
(${pageScript.toString()})();
</script>
</body></html>
`;
}

const pathOf = url => { try { const u = new URL(url); return u.hostname.replace(/^www\./, '') === SITE_HOST ? (u.pathname.replace(/\/$/, '') || '/') : null; } catch { return null; } };
// Looks the cited page up in a crawl.json from scripts/health/crawl.mjs. No request is made.
export function joinCheck(citedPath, crawl) {
  const row = crawl?.rows?.find(r => pathOf(r.url) === citedPath);
  if (!row || row.status !== 200) return { links_to_join: 'unknown', join_checked_at: '' };
  const yes = (row.internalOutlinks ?? []).some(link => pathOf(link) === '/join');
  return { links_to_join: yes ? 'yes' : 'no', join_checked_at: row.sampledAt };
}
// Turns the collector page's export into log rows and one evidence file per answer.
export function importCollected(exported, questions, crawl) {
  if (!validDate(exported?.run_date)) throw new Error('Export has no valid run_date');
  const rows = [], answers = [];
  for (const q of questions) for (const engine of ENGINES) {
    const s = exported.slots?.[slotKey(q.question_id, engine)];
    const row = { run_date: exported.run_date, question_id: q.question_id, engine, status: s?.status ?? 'pending' };
    if (row.status === 'pending') { rows.push(row); continue; }
    row.observed_at = s.observed_at; row.notes = (s.note ?? '').trim();
    if (row.status !== 'complete') { rows.push(row); continue; }
    const env = { ...ENGINE_DEFAULTS[engine], ...Object.fromEntries(Object.entries(exported.engines?.[engine] ?? {}).filter(([, v]) => v?.trim())) };
    const siteLinks = (s.links ?? []).filter(link => pathOf(link));
    const citedPath = siteLinks.length ? pathOf(siteLinks[0]) : null;
    const file = `answers/${exported.run_date}/${q.question_id}-${engine.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    Object.assign(row, { model: env.model, search_mode: env.search_mode, locale: (exported.locale ?? '').trim(), named_bstc: s.named_bstc,
      linked_url: siteLinks[0] ?? '', cited_page: citedPath ? `https://www.${SITE_HOST}${citedPath === '/' ? '' : citedPath}` : '',
      ...(citedPath ? joinCheck(citedPath, crawl) : { links_to_join: 'not_applicable', join_checked_at: '' }), answer_file: file });
    if (siteLinks.length > 1) row.notes = [row.notes, `Other BSTC links: ${siteLinks.slice(1).join(' ')}`].filter(Boolean).join(' ');
    answers.push({ key: slotKey(q.question_id, engine), file, content: `# ${q.question_id}, ${engine}, ${exported.run_date}\n\nPrompt: ${q.prompt}\n\nObserved: ${s.observed_at}. Model: ${env.model}. Search mode: ${env.search_mode}. Locale: ${row.locale}.\n\n## Answer\n\n${s.text.trim()}\n\n## Links in the answer\n\n${(s.links ?? []).map(link => `- ${link}`).join('\n') || 'None.'}\n` });
    rows.push(row);
  }
  return { rows, answers };
}
// Collected rows replace pending rows only, so a log that already holds observations is never overwritten.
export function mergeIntoLog(existingRows, collectedRows) {
  const kept = [];
  const merged = collectedRows.map(row => {
    const old = existingRows.find(r => r.run_date === row.run_date && r.question_id === row.question_id && r.engine === row.engine);
    if (old && old.status !== 'pending') { kept.push(slotKey(row.question_id, row.engine)); return old; }
    return row;
  });
  return { rows: merged, kept };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [command, file, destination, crawlPath] = process.argv.slice(2);
    if (command !== 'import' || !file || !destination) throw new Error('Usage: node scripts/measure/collector.mjs import collected-DATE.json OUTPUT_DIRECTORY [crawl.json]');
    const questions = parseCSV(await readFile(new URL('../../docs/aeo/measure/prompt-map.csv', import.meta.url), 'utf8')).rows;
    const exported = JSON.parse(await readFile(file, 'utf8'));
    const crawl = crawlPath ? JSON.parse(await readFile(crawlPath, 'utf8')) : null;
    const { rows, answers } = importCollected(exported, questions, crawl);
    const logPath = resolve(destination, `citation-log-${exported.run_date}.csv`);
    const existing = await readFile(logPath, 'utf8').then(text => parseCSV(text).rows, () => []);
    const merged = mergeIntoLog(existing, rows);
    const full = merged.rows.map(row => Object.fromEntries(COLUMNS.map(column => [column, row[column] ?? ''])));
    summarise({ header: COLUMNS, rows: full }, exported.run_date); // Throws on any row the weekly summary would reject.
    for (const answer of answers.filter(a => !merged.kept.includes(a.key))) {
      await mkdir(resolve(destination, answer.file, '..'), { recursive: true });
      await writeFile(resolve(destination, answer.file), answer.content);
    }
    await writeFile(logPath, serialise(full));
    const count = status => full.filter(r => r.status === status).length;
    console.log(`${exported.run_date}: ${count('complete')} complete, ${count('unavailable')} unavailable, ${count('no_overview')} no_overview, ${count('pending')} pending. ${merged.kept.length} rows already recorded were kept.`);
    console.log(`Log: ${logPath}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
