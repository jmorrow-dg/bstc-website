// Run with: npm test
// How I AI card images on /events (15 Nov 2026): each upcoming edition's card shows its own
// image (edition number, day and venue), so the list tells the nights apart. These check the
// image exists, carries the night's own date and edition, and has alt text that says the same.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content/events");
const events = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data);
const withCard = events.filter((e) => e.cardImage);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayOf = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

test("upcoming How I AI editions have card images", () => {
  assert.ok(withCard.length >= 18, `only ${withCard.length}`);
});

test("each card image exists, matches its night's edition and date, and has matching alt text", () => {
  for (const e of withCard) {
    const n = Number(e.title.match(/Edition (\d+)/)?.[1]);
    assert.ok(n, e.slug);
    assert.equal(e.cardImage, `/images/events/how-i-ai/e${n}-${e.date}-card.webp`, `${e.slug}: an image of another night's date`);
    const file = path.join(root, "public", e.cardImage);
    assert.ok(fs.existsSync(file), `${e.slug}: ${e.cardImage} is missing`);
    assert.ok(fs.statSync(file).size < 120_000, `${e.slug}: card image over 120 KB`);
    assert.equal(e.cardImageAlt, `How I AI Edition ${n}, ${dayOf(e.date)}, 6pm at Seoul Soul Project, Canggu`, e.slug);
    assert.equal(e.time, "18:00", e.slug);
    assert.doesNotMatch(e.cardImageAlt, /[–—]/, e.slug);
  }
});

test("the series artwork stays the cover everywhere else", () => {
  for (const e of withCard) assert.equal(e.coverImage, "/images/events/how-i-ai-season-2.jpg", e.slug);
});
