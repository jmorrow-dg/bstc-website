// Run with: npm test
// Home page credibility (28 Nov 2026): "Members you'll meet" cards, the
// self-expiring growth line and the How I AI line in the hero.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function load(rel) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bstc-home-test-"));
  const out = ts.transpileModule(fs.readFileSync(path.join(root, rel), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const file = path.join(tmp, "m.cjs");
  fs.writeFileSync(file, out);
  return require(file);
}

const { MEET_MEMBERS, MEET_SOURCE, MEET_CHECKED } = load("src/data/meet-members.ts");
const { parseGrowth, freshGrowth, growthDate, baliToday, GROWTH_FRESH_DAYS } = load("src/lib/rb-growth.ts");
const homeSource = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");

test("members you'll meet: 6 to 9 cards with a local picture and a profile slug", () => {
  assert.ok(MEET_MEMBERS.length >= 6 && MEET_MEMBERS.length <= 9);
  const slugs = new Set();
  for (const m of MEET_MEMBERS) {
    assert.match(m.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(m.slug), `duplicate ${m.slug}`);
    slugs.add(m.slug);
    assert.ok(m.name && m.company && m.line, `${m.slug} needs name, company and line`);
    const pic = path.join(root, "public/images/members", `${m.slug}.webp`);
    assert.ok(fs.existsSync(pic), `missing ${pic}`);
    assert.ok(fs.statSync(pic).size < 60_000, `${m.slug}.webp should be an optimised crop`);
    const head = fs.readFileSync(pic).subarray(0, 12).toString("latin1");
    assert.ok(head.startsWith("RIFF") && head.endsWith("WEBP"), `${m.slug} is not a WebP`);
  }
});

test("members you'll meet: names the source, links to Remote Builders profiles, never hotlinks pictures", () => {
  assert.equal(MEET_SOURCE, "Members with a public profile on Remote Builders, the global community from the BSTC team.");
  assert.match(MEET_CHECKED, /^\d{1,2} [A-Z][a-z]{2} 2026$/);
  assert.ok(homeSource.includes("https://remotebuilders.io/directory/${m.slug}/"));
  assert.ok(homeSource.includes("/images/members/${m.slug}.webp"));
  assert.ok(!/remotebuilders\.io\/assets/.test(homeSource));
});

test("growth line parses RB's Facts line and ignores anything else", () => {
  const line = "- 304 new members signed up in the 30 days before (as of 2026-11-28)";
  assert.deepEqual(parseGrowth(`## Facts\n\n${line}\n- 146 startup perks`), { count: 304, asOf: "2026-11-28" });
  assert.deepEqual(parseGrowth("- 1,204 new members signed up in the 30 days before (as of 2026-12-05)"), { count: 1204, asOf: "2026-12-05" });
  assert.equal(parseGrowth("- 0 new members signed up in the 30 days before (as of 2026-11-28)"), null);
  assert.equal(parseGrowth("304 members"), null);
  assert.equal(parseGrowth(undefined), null);
});

test("growth line shows for 14 days from its own date, then disappears", () => {
  assert.equal(GROWTH_FRESH_DAYS, 14);
  const g = { count: 304, asOf: "2026-11-28" };
  assert.deepEqual(freshGrowth(g, new Date("2026-11-28T03:00:00Z")), g);
  assert.deepEqual(freshGrowth(g, new Date("2026-12-12T12:00:00Z")), g); // day 14
  assert.equal(freshGrowth(g, new Date("2026-12-12T16:30:00Z")), null); // 13 Dec in Bali: day 15
  assert.equal(freshGrowth(g, new Date("2027-02-01T00:00:00Z")), null);
  assert.equal(freshGrowth({ count: 5, asOf: "2026-12-30" }, new Date("2026-11-28T00:00:00Z")), null); // dated in the future
  assert.equal(freshGrowth(null), null);
  assert.equal(baliToday(new Date("2026-11-28T16:30:00Z")), "2026-11-29");
  assert.equal(growthDate("2026-11-28"), "28 Nov 2026");
});

test("home hero says How I AI runs every Wednesday and what happens there", () => {
  assert.match(homeSource, /How I AI runs every Wednesday/);
  assert.match(homeSource, /AI tools, workflows and revenue behind[\s\S]{0,40}what they ship/);
});

test("home has no hedging badges or filler", () => {
  const home = fs.readFileSync(path.join(root, "src/data/home.ts"), "utf8");
  for (const text of [homeSource, home]) {
    assert.ok(!/coming soon|we're just getting started|new fixtures are on the way/i.test(text));
  }
});
