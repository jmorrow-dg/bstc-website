// Fails when a blog post gives a member count without the date it was read (TR1, 11 Nov 2026).
// AI search quotes this site, and public copy never gives a member count without a dated
// source, so each count in content/blog carries a date in the same sentence, the way the rest
// of the site shows it: "2,700+ members (Meetup, 25 Oct 2026)", "2,700+ on Meetup (25 Oct 2026)"
// or "1,200+ on WhatsApp (28 Oct 2026)" (MEETUP_CHECKED and WHATSAPP_CHECKED in
// src/lib/constants.ts). Or drop the figure. Runs before every build (npm's prebuild) and needs
// no install:
//   node scripts/check-blog-counts.mjs [dir]     dir defaults to content/blog
//
// A member count is a figure of 1,000 or more (2,700 / 2,700+ / 2700+ / 2.7k+) followed by people
// (members, founders, builders...), by "on Meetup", "in its WhatsApp community" or "across the
// two", or after "a community of". It counts only on a line that mentions BSTC, a community,
// members or a chat, so a talent-pool figure ("150,000+ software engineers") is left alone.
// Money and years are never counts. One date per sentence covers every count in it.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const FIGURE = /(?<![\w$€£.,/-])(\d{1,3}(?:,\d{3})+|\d{4,}|\d+(?:\.\d+)?\s?[kK]\b)(\+?)/g;
const PEOPLE =
  /^\s+((?:[A-Za-z][\w'’-]*\s+){0,3}?)(?:members?|founders?|builders?|operators?|engineers?|developers?|investors?|VCs|people|nomads?|techies|creators?|entrepreneurs?|professionals?|attendees?|participants?)\b/i;
const PLATFORM =
  /^\s+(?:members?\s+)?(?:on|in|across)\s+(?:(?:its|the|our|their)\s+)?(?:Meetup|WhatsApp|Telegram|LinkedIn|Discord|Slack|Facebook|Instagram|community|group|chat|channel|two|both|platforms)\b/i;
const AFTER_GROUP =
  /\b(?:members?|membership|community|group|chat|network)\s*(?:of|has|with|at|is|:|reached|hit)?\s*(?:over|about|around|nearly|almost|more than)?\s*$/i;
const MONEY = /\b(?:dollars?|usd|idr|aud|sgd|eur|euros?|rupiah|rp)\b/i;
const CONTEXT = /\b(?:BSTC|community|communities|Meetup|WhatsApp|Telegram|members?|membership|join|group|chapter|chat)\b/i;
const MONTH = "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\\.?";
const DATE = new RegExp(`\\b\\d{1,2}\\s+${MONTH},?\\s+\\d{4}\\b|\\b${MONTH}\\s+\\d{1,2},?\\s+\\d{4}\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b`, "i");
const ABBREVIATION = /(?:^|\s|\()(?:e\.g|i\.e|vs|etc|approx|incl|no|st|mr|ms|dr)$/i;

// Sentences in one line: split after . ! or ? and a space, never inside brackets or after an
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
  const value = /k$/i.test(figure) ? parseFloat(figure) * 1000 : Number(figure.replace(/,/g, ""));
  if (!(value >= 1000)) return false;
  const tail = line.slice(at + figure.length + plus.length);
  const people = PEOPLE.exec(tail);
  if (people && !MONEY.test(people[1])) return true;
  return PLATFORM.test(tail) || AFTER_GROUP.test(line.slice(0, at));
}

// Each undated member count in a post's text: {line, figure, sentence}.
export function undatedCounts(text) {
  const found = [];
  text.split("\n").forEach((line, i) => {
    if (!CONTEXT.test(line)) return;
    const spans = sentences(line);
    for (const m of line.matchAll(FIGURE)) {
      const [, figure, plus] = m;
      if (!isCount(line, m.index, figure, plus)) continue;
      const [start, end] = spans.find(([s, e]) => m.index >= s && m.index < e) ?? [0, line.length];
      const sentence = line.slice(start, end).trim();
      if (!DATE.test(sentence)) found.push({ line: i + 1, figure: figure + plus, sentence });
    }
  });
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
        `"2,700+ members (Meetup, 25 Oct 2026)" (MEETUP_CHECKED in src/lib/constants.ts). Or drop the figure.\n\n` +
        problems.join("\n"),
    );
    process.exit(1);
  }
  console.log(`blog member counts: every count in ${files.length} posts carries its date`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv[2] || fileURLToPath(new URL("../content/blog/", import.meta.url)));
}
