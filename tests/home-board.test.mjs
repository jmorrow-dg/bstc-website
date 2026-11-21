// Run with: npm test
// Homepage upcoming board: the soonest four upcoming events, from content/events, rolling
// forward on the Bali calendar date. These pin "now" to two dates so a past night can never
// lead the board, and the board needs no edit when an edition passes.
// Uses Node's built-in TypeScript stripping to load the real event-status.ts and fixtures.ts,
// and reads frontmatter directly, so it needs no installed packages.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// fixtures.ts imports "./event-status" without an extension; resolve it to the .ts file.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith(".") && !path.extname(specifier) && context.parentURL?.endsWith(".ts")) {
      return next(`${specifier}.ts`, context);
    }
    return next(specifier, context);
  },
});

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { getEventState } = await import(pathToFileURL(path.join(root, "src/lib/event-status.ts")).href);
const { toFixture, fixtureLabel } = await import(pathToFileURL(path.join(root, "src/lib/fixtures.ts")).href);

// Top-level scalar keys only, which is all the board reads.
function frontmatter(text) {
  const block = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? "";
  const data = {};
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z][\w]*):\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].replace(/\s+#.*$/, "").trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[m[1]] = value;
  }
  return data;
}

const dir = path.join(root, "content/events");
const events = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ frontmatter: frontmatter(fs.readFileSync(path.join(dir, f), "utf8")) }));

// Same steps as src/app/page.tsx: getUpcomingEvents (content.ts), then toFixture, then four.
function board(now) {
  return events
    .filter((e) => getEventState(e.frontmatter, now) === "upcoming")
    .sort((a, b) => new Date(a.frontmatter.date).getTime() - new Date(b.frontmatter.date).getTime())
    .map(toFixture)
    .filter(Boolean)
    .slice(0, 4);
}

// 9am Bali time (UTC+8) on the given date.
const baliMorning = (date) => new Date(`${date}T09:00:00+08:00`);

test("21 Nov 2026: Edition 21 leads, then Editions 22 and 23, then dinner #40", () => {
  const rows = board(baliMorning("2026-11-21"));
  assert.deepEqual(
    rows.map((f) => f.slug),
    ["how-i-ai-edition-21", "how-i-ai-edition-22", "how-i-ai-edition-23", "networking-drinks-dinner-canggu-40"],
  );
  assert.equal(rows[0].longDate, "Wednesday 25 November");
  assert.equal(fixtureLabel(rows[0]), "How I AI, edition 21.");
  assert.equal(rows[3].longDate, "Thursday 10 December");
});

test("26 Nov 2026: Edition 21 has left and the board rolls forward to Edition 24", () => {
  const rows = board(baliMorning("2026-11-26"));
  assert.deepEqual(
    rows.map((f) => f.slug),
    ["how-i-ai-edition-22", "how-i-ai-edition-23", "networking-drinks-dinner-canggu-40", "how-i-ai-edition-24"],
  );
  assert.equal(rows[0].longDate, "Wednesday 2 December");
});

test("an edition stays on the board through its own Bali day and leaves the next day", () => {
  // 11:30pm Bali time on 25 Nov is still 25 Nov in Bali (3:30pm UTC).
  assert.equal(board(new Date("2026-11-25T23:30:00+08:00"))[0].slug, "how-i-ai-edition-21");
  // 12:30am Bali time on 26 Nov is still 25 Nov in UTC; Bali's date wins.
  assert.equal(board(new Date("2026-11-26T00:30:00+08:00"))[0].slug, "how-i-ai-edition-22");
});

test("the board is soonest first, at most four rows, and never shows a past date", () => {
  for (const day of ["2026-11-21", "2026-11-26", "2026-12-10", "2026-12-11"]) {
    const rows = board(baliMorning(day));
    assert.ok(rows.length > 0 && rows.length <= 4, `${day}: ${rows.length} rows`);
    const dates = rows.map((f) => f.isoStart.slice(0, 10));
    assert.deepEqual(dates, [...dates].sort(), `${day}: not soonest first`);
    for (const d of dates) assert.ok(d >= day, `${day}: shows ${d}`);
  }
});
