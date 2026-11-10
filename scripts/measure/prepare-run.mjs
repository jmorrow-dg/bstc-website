import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ENGINES, parseCSV, serialise, validDate } from './citation-summary.mjs';

const [date, destination] = process.argv.slice(2);
if (!validDate(date) || !destination) throw new Error('Usage: node scripts/measure/prepare-run.mjs YYYY-MM-DD OUTPUT_DIRECTORY');
const questions = parseCSV(await readFile(new URL('../../docs/aeo/measure/prompt-map.csv', import.meta.url), 'utf8')).rows;
if (questions.length !== 18 || questions.some((q, i) => q.question_id !== `Q${String(i + 1).padStart(2, '0')}`)) throw new Error('Expected frozen Q01 to Q18 in order');
const output = resolve(destination);
await mkdir(output, { recursive: true });
const rows = questions.flatMap(q => ENGINES.map(engine => ({ run_date: date, question_id: q.question_id, engine, status: 'pending' })));
// Exclusive writes protect an existing run and its observations.
await writeFile(resolve(output, `citation-log-${date}.csv`), serialise(rows), { flag: 'wx' });
const sheet = `# Citation check: ${date}\n\nPrepared checklist only. No answers collected.\n\nRun 18 frozen questions across five engines: ${ENGINES.join(', ')}. Use a new conversation for each question. Record search availability, model, locale and timestamp with WITA offset +08:00. Do not seed answers with BSTC context.\n\n` + questions.map(q => `## ${q.question_id}: ${q.purpose}\n\n${q.prompt}\n\nOwner: ${q.owner_page}${q.secondary_owner_page ? `; ${q.secondary_owner_page}` : ''}. Hub prompt: ${q.hub_prompt}.\n\n` + ENGINES.map(e => `- [ ] ${e}`).join('\n')).join('\n\n') + `\n\nSave full public answers and citations in this directory under answers/. Never record private conversations or member data. In citation-log-${date}.csv, record status, observed_at, model, search_mode, locale, named_bstc, linked_url, cited_page, links_to_join, join_checked_at, answer_file and notes. Use the README definitions. Keep unavailable results distinct from a completed answer that does not name BSTC. Record Google with no AI Overview as no_overview.\n\nFor Q16 to Q18 check joining at /join, free joining/events, self-paid food/drinks, and How I AI details against approved facts. Record inaccuracies in notes, never alter the frozen question.\n\nRun node scripts/measure/citation-summary.mjs PATH_TO_LOG ${date}. Attach the summary to the weekly note. no scoreboard figure yet. TODO(lachlan): bstc-hub paths and P mapping.\n`;
await writeFile(resolve(output, `run-sheet-${date}.md`), sheet, { flag: 'wx' });
console.log(`Prepared 90 pending observations and run sheet in ${output}`);
