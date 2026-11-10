// Fails when a blog post gives a member count without the date it was read (TR1, 11 Nov 2026).
// AI search quotes this site, and public copy never gives a member count without a dated
// source, so each count in content/blog carries a date in the same sentence, the way the rest
// of the site shows it: "2,700+ members (Meetup, 25 Oct 2026)", "2,700+ on Meetup (25 Oct 2026)"
// or "1,200+ on WhatsApp (28 Oct 2026)" (MEETUP_CHECKED and WHATSAPP_CHECKED in
// src/lib/constants.ts); a month and year in brackets, "(Meetup, October 2026)", counts too. Or
// drop the figure. Runs before every build (npm's prebuild) and needs no install:
//   node scripts/check-blog-counts.mjs [dir]     dir defaults to content/blog
//
// A member count is a figure of 1,000 or more (2,700 / 2,700+ / 2,700-plus / 2700+ / 2.7k+ /
// 2.7 thousand) followed by people (members, founders, builders, others...), written
// "a 2,700-member" or "2,700 strong", followed by "on Meetup", "in its WhatsApp community" or
// "across the two", or after "a community of" with nothing else counted after it. It counts only
// in a paragraph that mentions BSTC, a community, members, a chat, joining, connecting with or
// "we're", so a talent-pool figure ("150,000+ software engineers") is left alone. Money and years
// are never counts. One date per sentence covers every count in it, and a sentence hard-wrapped
// over two lines is read as one. What it can't see is in SCOPE below, which every failure prints.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const FIGURE = /(?<![\w$€£.,/-])(\d{1,3}(?:,\d{3})+|\d{4,}|\d+(?:\.\d+)?\s?(?:[kK]|thousand)\b)(\+|-plus\b)?/g;
const PEOPLE =
  /^\s+((?:[A-Za-z][\w'’-]*\s+){0,3}?)(?:members?|founders?|builders?|operators?|engineers?|developers?|investors?|VCs|people|nomads?|techies|creators?|entrepreneurs?|professionals?|attendees?|participants?|others)\b/i;
// "a 2,700-member community", "2,700 strong", "a 2,700-strong community".
const SIZE = /^(?:-|\s+)(?:members?|strong)\b/i;
const PLATFORM =
  /^\s+(?:members?\s+)?(?:on|in|across)\s+(?:(?:its|the|our|their)\s+)?(?:Meetup|WhatsApp|Telegram|LinkedIn|Discord|Slack|Facebook|Instagram|community|group|chat|channel|two|both|platforms)\b/i;
const AFTER_GROUP =
  /\b(?:members?|membership|community|group|chat|network)\s*(?:of|has|with|at|is|:|reached|hit)?\s*(?:over|about|around|nearly|almost|more than)?\s*$/i;
// After "a community of" or "the chat hit", the figure is the member count only when nothing else is
// counted after it: "a community of 2,700+." or "2,700 and growing", never "hit 1,500 messages".
const BARE =
  /^\s*(?:[^\w\s]|$)|^\s+(?:and|or|but|in|on|across|at|from|by|for|after|before|since|within|last|this|who|which|that|with|now|today|so|as|alone)\b/i;
const MONEY = /\b(?:dollars?|usd|idr|aud|sgd|eur|euros?|rupiah|rp)\b/i;
const CONTEXT =
  /\b(?:BSTC|community|communities|Meetup|WhatsApp|Telegram|members?|membership|join|group|chapter|chat|connect(?:s|ed|ing)?\s+with|we['’]re|we\s+are)\b/i;
const MONTH =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?";
// 25 Oct 2026, Oct 25, 2026, 2026-10-25, or a month and year in brackets: (October 2026) or
// (Meetup, Oct 2026). A bare month and year elsewhere ("founded in October 2023") isn't the date a
// count was read.
const DATE = new RegExp(
  `\\b\\d{1,2}\\s+${MONTH},?\\s+\\d{4}\\b|\\b${MONTH}\\s+\\d{1,2},?\\s+\\d{4}\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\([^()]*\\b${MONTH}\\s+\\d{4}\\)`,
  "i",
);
const ABBREVIATION = /(?:^|\s|\()(?:e\.g|i\.e|vs|etc|approx|incl|no|st|mr|ms|dr)$/i;
// A line that starts its own block (a list item, heading, quote, table row, fence, rule, HTML or a
// front-matter key) never continues the line above, and nothing continues a heading, table row,
// fence, rule or HTML line.
const STARTS_BLOCK = /^\s*(?:[-*+]\s|\d+[.)]\s|#{1,6}\s|>|\||`{3}|~{3}|-{3}|<|[A-Za-z_][\w-]*:(?:\s|$))/;
const ENDS_BLOCK = /^\s*(?:#{1,6}\s|\||`{3}|~{3}|-{3,}\s*$|<)/;
// What the check can't see, printed with every failure so a pass isn't read as more than it is.
const SCOPE =
  `What this checks: a figure of 1,000 or more given as people (2,700+ members, founders, others), as a 2,700-member or\n` +
  `2,700-strong community, on a platform ("on Meetup", "in its WhatsApp community") or after "a community of", in a\n` +
  `paragraph that mentions BSTC, a community, members, a chat, joining, connecting with or "we're". It can't see counts\n` +
  `under 1,000, counts in words ("nearly three thousand") or a count in a paragraph that names none of those, so read\n` +
  `new copy for those yourself.`;

// A post's paragraphs, with a hard-wrapped paragraph's lines joined so a sentence split over two
// lines is read as one: [{text, starts: [[offset in text, line number]]}].
function paragraphs(text) {
  const out = [];
  let above = "";
  text.split("\n").forEach((line, i) => {
    const last = out.at(-1);
    if (last && above.trim() && line.trim() && !ENDS_BLOCK.test(above) && !STARTS_BLOCK.test(line)) {
      last.starts.push([last.text.length + 1, i + 1]);
      last.text += ` ${line}`;
    } else out.push({ text: line, starts: [[0, i + 1]] });
    above = line;
  });
  return out;
}

// Sentences in a paragraph: split after . ! or ? and a space, never inside brackets or after an
// abbreviation such as "e.g.". Returns [start, end) offsets.
function sentences(line) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "(" || c === "[") depth++;
    else if ((c === ")" || c === "]") && depth > 0) depth--;
    else if (depth === 0 && /[.!?]/.test(c) && (i + 1 === line.length || /\s/.test(line[i + 1]))) {
      if (c === "." && ABBREVIATION.test(line.slice(start, i))) continue;
      out.push([start, i + 1]);
      start = i + 1;
    }
  }
  if (start < line.length) out.push([start, line.length]);
  return out;
}

function isCount(line, at, figure, plus) {
  if (/^(?:19|20)\d{2}$/.test(figure) && !plus) return false; // a year
  const value = /(?:k|thousand)$/i.test(figure) ? parseFloat(figure) * 1000 : Number(figure.replace(/,/g, ""));
  if (!(value >= 1000)) return false;
  const tail = line.slice(at + figure.length + plus.length);
  const people = PEOPLE.exec(tail);
  if (people && !MONEY.test(people[1])) return true;
  return SIZE.test(tail) || PLATFORM.test(tail) || (AFTER_GROUP.test(line.slice(0, at)) && BARE.test(tail));
}

// Each undated member count in a post's text: {line, figure, sentence}.
export function undatedCounts(text) {
  const found = [];
  for (const { text: para, starts } of paragraphs(text)) {
    if (!CONTEXT.test(para)) continue;
    const spans = sentences(para);
    for (const m of para.matchAll(FIGURE)) {
      const [, figure, plus = ""] = m;
      if (!isCount(para, m.index, figure, plus)) continue;
      const [start, end] = spans.find(([s, e]) => m.index >= s && m.index < e) ?? [0, para.length];
      const sentence = para.slice(start, end).trim();
      const line = starts.findLast(([offset]) => offset <= m.index)[1];
      if (!DATE.test(sentence)) found.push({ line, figure: figure + plus, sentence });
    }
  }
  return found;
}

function main(dir) {
  const files = readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .sort();
  const problems = [];
  for (const f of files) {
    const path = join(dir, f);
    for (const p of undatedCounts(readFileSync(path, "utf8"))) {
      const where = relative(process.cwd(), path) || path;
      const shown = p.sentence.length > 160 ? `${p.sentence.slice(0, 157)}...` : p.sentence;
      problems.push(`${where}:${p.line}: ${p.figure} in "${shown}"`);
    }
  }
  if (problems.length) {
    console.error(
      `Member counts in the blog need the date they were read, in the same sentence, as the site shows them:\n` +
        `"2,700+ members (Meetup, 25 Oct 2026)" or "(Meetup, October 2026)" (MEETUP_CHECKED in src/lib/constants.ts).\n` +
        `Or drop the figure. If a flagged figure isn't a member count (a city's nomads, say),\n` +
        `give it its source and date in the same sentence too, or reword it.\n\n` +
        problems.join("\n") +
        `\n\n${SCOPE}`,
    );
    process.exit(1);
  }
  console.log(`blog member counts: every count in ${files.length} posts carries its date`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv[2] || fileURLToPath(new URL("../content/blog/", import.meta.url)));
}
