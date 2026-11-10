// Tests for scripts/check-blog-counts.mjs (TR1, 11 Nov 2026). No dependencies:
//   node --test scripts/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { undatedCounts } from "./check-blog-counts.mjs";

const script = fileURLToPath(new URL("./check-blog-counts.mjs", import.meta.url));
const found = (text) => undatedCounts(text).map((f) => f.figure);

test('fails on an undated "2,700+ members" line', () => {
  assert.deepEqual(found("2,700+ members"), ["2,700+"]);
  assert.deepEqual(found("The BSTC community has 2,700+ members across Southeast Asia."), ["2,700+"]);
  assert.deepEqual(found("*Join the community to connect with 2,500+ builders across Southeast Asia.*"), ["2,500+"]);
});

test("passes on the dated Meetup form the site already uses", () => {
  for (const line of [
    "BSTC has 2,700+ members on Meetup (25 Oct 2026) and a Telegram member chat.",
    "*Join the BSTC community to connect with 2,700+ founders and builders (Meetup, 25 Oct 2026).*",
    "BSTC's Meetup group has 2,700+ members (25 Oct 2026).",
    "2,700+ members on Meetup, rated 4.7 from 155 ratings ([Meetup](https://www.meetup.com/x/), checked 25 Oct 2026).",
    "Meetup (2,700+ on 25 October 2026) and WhatsApp (1,200+ on 28 Oct 2026).",
  ]) {
    assert.deepEqual(found(line), [], line);
  }
});

test("each sentence needs its own date: one in the next sentence doesn't count", () => {
  assert.deepEqual(found("BSTC has 2,700+ members. On 25 Oct 2026 it was the only group with events listed."), ["2,700+"]);
  assert.deepEqual(found("BSTC has 2,700+ members (e.g. on Meetup, 25 Oct 2026)."), [], "an abbreviation doesn't end the sentence");
});

test("counts on a platform, in a chat or across both are member counts too", () => {
  assert.deepEqual(found("BSTC has 1,200+ in its WhatsApp community."), ["1,200+"]);
  assert.deepEqual(found("The BSTC community reaches 3,900+ across the two."), ["3,900+"]);
  assert.deepEqual(found("BSTC is a community of 2,700+."), ["2,700+"]);
  assert.deepEqual(found("BSTC has 2.7k+ members."), ["2.7k+"]);
  assert.deepEqual(found('excerpt: "2,700+ founders, engineers, and VCs. Here is what BSTC is."'), ["2,700+"]);
});

test("money, years, event sizes and figures with no community in the line are left alone", () => {
  for (const line of [
    "| **BANSEA** | Business Angel Network | 100,000 to 500,000 dollars across members |",
    "Founders running $20-50K/month operations with 1-3 people and 70%+ margins.",
    "In 2026 founders are moving to Bali, and the community grows every month.",
    "Our monthly Networking Night brings 60 to 80 founders into one room.",
    "We surveyed 50+ founders in the BSTC community.",
    "- Pool size: estimated 150,000+ software engineers, growing fast.",
    "The 200K context window means you can paste entire codebases.",
    "A founder in our community runs a newsletter that has grown to 15,000 subscribers.",
  ]) {
    assert.deepEqual(found(line), [], line);
  }
});

test("finds the line number of each undated count", () => {
  const text = ["---", 'title: "What is BSTC"', "---", "", "BSTC has 2,700+ members.", "", "BSTC has 2,700+ members (Meetup, 25 Oct 2026)."].join("\n");
  assert.deepEqual(undatedCounts(text).map((f) => [f.line, f.figure]), [[5, "2,700+"]]);
});

test("every post in content/blog passes", () => {
  const run = spawnSync(process.execPath, [script], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stdout + run.stderr);
});

test("the command fails with the file and line, and passes once the count is dated", () => {
  const dir = mkdtempSync(join(tmpdir(), "blog-counts-"));
  try {
    writeFileSync(join(dir, "post.md"), "Intro.\n\nThe BSTC community has 2,700+ members.\n");
    const bad = spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /post\.md:3: 2,700\+/);
    writeFileSync(join(dir, "post.md"), "Intro.\n\nThe BSTC community has 2,700+ members on Meetup (25 Oct 2026).\n");
    const good = spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
    assert.equal(good.status, 0, good.stdout + good.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
